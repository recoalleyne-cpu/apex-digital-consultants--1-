const ADMIN_ACCESS_TOKEN_STORAGE_KEY = 'apex_admin_access_token_v1';
const ADMIN_HEADER_NAME = 'x-admin-token';

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
    nextHeaders.set(ADMIN_HEADER_NAME, token);
  } else {
    nextHeaders.delete(ADMIN_HEADER_NAME);
  }

  return nextHeaders;
};

export const adminFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  return fetch(input, {
    ...init,
    headers: withAdminAuthHeaders(init?.headers)
  });
};

