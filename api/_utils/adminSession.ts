import crypto from 'node:crypto';

type AdminSessionPayload = {
  email: string;
  iat: number;
  exp: number;
};

export const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 12;

const toBase64Url = (value: string) =>
  Buffer.from(value, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const fromBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4);
  return Buffer.from(padded, 'base64').toString('utf8');
};

const sign = (value: string, secret: string) =>
  crypto
    .createHmac('sha256', secret)
    .update(value)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const timingSafeEqual = (a: string, b: string) => {
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
};

export const createAdminSessionToken = (
  email: string,
  secret: string,
  now = Date.now()
) => {
  const issuedAt = Math.floor(now / 1000);
  const payload: AdminSessionPayload = {
    email,
    iat: issuedAt,
    exp: issuedAt + ADMIN_SESSION_DURATION_SECONDS
  };

  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = toBase64Url(JSON.stringify(payload));
  const signature = sign(`${header}.${body}`, secret);
  return `${header}.${body}.${signature}`;
};

export const verifyAdminSessionToken = (
  token: string,
  secret: string,
  now = Date.now()
) => {
  const segments = token.split('.');
  if (segments.length !== 3) return null;

  const [header, body, signature] = segments;
  const expectedSignature = sign(`${header}.${body}`, secret);

  if (!timingSafeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(body)) as Partial<AdminSessionPayload>;
    const currentTimestamp = Math.floor(now / 1000);

    if (!payload || typeof payload.email !== 'string') return null;
    if (typeof payload.exp !== 'number' || payload.exp <= currentTimestamp) return null;

    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
};
