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

export const withAdminAuthHeaders = (headers?: HeadersInit) => {
  const nextHeaders = new Headers(headers || {});
  const token = getAdminAccessToken();

  if (token) {
    nextHeaders.set(AUTHORIZATION_HEADER_NAME, `Bearer ${token}`);
  } else {
    nextHeaders.delete(AUTHORIZATION_HEADER_NAME);
  }

  return nextHeaders;
};

export const adminFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  return fetch(input, {
    ...init,
    headers: withAdminAuthHeaders(init?.headers)
  });
};

type AdminLoginResponse = {
  success?: boolean;
  message?: string;
  item?: {
    token?: string;
  };
};

export const loginAdmin = async (email: string, password: string) => {
  const response = await fetch('/api/admin-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const payload = (await response.json().catch(() => null)) as AdminLoginResponse | null;
  if (!response.ok) {
    throw new Error(payload?.message || 'Invalid admin credentials.');
  }

  const token = normalizeToken(payload?.item?.token);
  if (!token) {
    throw new Error('Admin login succeeded but session token was missing.');
  }

  setAdminAccessToken(token);
};

export const verifyAdminSession = async () => {
  const token = getAdminAccessToken();
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
