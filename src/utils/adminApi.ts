import {
  getCurrentUserIdToken,
  sendPasswordResetLink,
  signInWithEmailPassword,
  signOutCurrentUser
} from '../lib/auth';
import { isFirebaseConfigured } from '../lib/firebase';

const ADMIN_ACCESS_TOKEN_STORAGE_KEY = 'apex_admin_session_token_v1';
const AUTHORIZATION_HEADER_NAME = 'authorization';

const isBrowser = () => typeof window !== 'undefined';

const normalizeToken = (value: unknown) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

export const getAdminAccessToken = () => {
  if (!isBrowser()) return '';
  return normalizeToken(window.localStorage.getItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY));
};

export const setAdminAccessToken = (token: string) => {
  if (!isBrowser()) return;
  const normalizedToken = normalizeToken(token);
  if (!normalizedToken) {
    window.localStorage.removeItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY, normalizedToken);
};

export const clearAdminAccessToken = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY);
};

const resolveAdminToken = async () => {
  try {
    const firebaseToken = await getCurrentUserIdToken();
    if (firebaseToken) {
      setAdminAccessToken(firebaseToken);
      return firebaseToken;
    }
  } catch {
    // Ignore token refresh errors and fallback to locally stored token.
  }

  return getAdminAccessToken();
};

export const withAdminAuthHeaders = (headers?: HeadersInit, tokenOverride?: string) => {
  const nextHeaders = new Headers(headers || {});
  const token = tokenOverride || getAdminAccessToken();

  if (token) {
    nextHeaders.set(AUTHORIZATION_HEADER_NAME, `Bearer ${token}`);
  } else {
    nextHeaders.delete(AUTHORIZATION_HEADER_NAME);
  }

  return nextHeaders;
};

export const adminFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const token = await resolveAdminToken();

  return fetch(input, {
    ...init,
    headers: withAdminAuthHeaders(init?.headers, token || undefined)
  });
};

export const getAdminAuthHeaders = async (headers?: HeadersInit) => {
  const token = await resolveAdminToken();
  return withAdminAuthHeaders(headers, token || undefined);
};

export const loginAdmin = async (email: string, password: string) => {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not configured. Set all VITE_FIREBASE_* env variables to enable admin login.'
    );
  }

  const credential = await signInWithEmailPassword(email, password);
  const token = normalizeToken(await credential.user.getIdToken());
  if (!token) {
    throw new Error('Firebase login succeeded but no ID token was returned.');
  }

  setAdminAccessToken(token);
};

export const requestAdminPasswordReset = async (email: string) => {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not configured. Set all VITE_FIREBASE_* env variables to enable admin login.'
    );
  }

  const normalizedEmail = email.trim();
  if (!normalizedEmail) {
    throw new Error('Enter your admin email to continue.');
  }

  const continueUrl = isBrowser() ? `${window.location.origin}/admin/login` : undefined;

  await sendPasswordResetLink(
    normalizedEmail,
    continueUrl
      ? {
          url: continueUrl,
          handleCodeInApp: false
        }
      : undefined
  );
};

export const logoutAdmin = async () => {
  clearAdminAccessToken();
  try {
    await signOutCurrentUser();
  } catch {
    // Keep logout resilient even if Firebase session signout fails.
  }
};

export const verifyAdminSession = async () => {
  const token = await resolveAdminToken();
  if (!token) return false;

  try {
    const response = await adminFetch('/api/admin-auth', {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      clearAdminAccessToken();
      return false;
    }

    return true;
  } catch {
    clearAdminAccessToken();
    return false;
  }
};
