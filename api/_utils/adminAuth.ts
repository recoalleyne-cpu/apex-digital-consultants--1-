import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAdminSessionToken } from './adminSession';

const AUTHORIZATION_HEADER = 'authorization';
const BEARER_PREFIX = 'bearer ';

const normalizeHeaderValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0]?.trim() || '';
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  return '';
};

const getProvidedToken = (req: VercelRequest) => {
  const authorization = normalizeHeaderValue(req.headers[AUTHORIZATION_HEADER]);
  if (!authorization) return '';

  const normalized = authorization.toLowerCase();
  if (!normalized.startsWith(BEARER_PREFIX)) {
    return authorization;
  }

  return authorization.slice(BEARER_PREFIX.length).trim();
};

const getSessionSecret = () => {
  const fromDedicatedSecret = (process.env.ADMIN_SESSION_SECRET || '').trim();
  if (fromDedicatedSecret) return fromDedicatedSecret;

  const fromLegacyToken = (process.env.ADMIN_ACCESS_TOKEN || '').trim();
  if (fromLegacyToken) return fromLegacyToken;

  return (process.env.ADMIN_LOGIN_PASSWORD || '').trim();
};

export const requireAdminAccess = (req: VercelRequest, res: VercelResponse) => {
  const sessionSecret = getSessionSecret();

  if (!sessionSecret) {
    res.status(500).json({
      success: false,
      message:
        'Missing admin session secret. Set ADMIN_SESSION_SECRET (or ADMIN_ACCESS_TOKEN).'
    });
    return false;
  }

  const providedToken = getProvidedToken(req);
  if (!providedToken) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized admin request.'
    });
    return false;
  }

  const sessionPayload = verifyAdminSessionToken(providedToken, sessionSecret);
  if (!sessionPayload) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized admin request.'
    });
    return false;
  }

  return true;
};
