import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getFirebaseAdminConfigError, verifyFirebaseIdToken } from './firebaseAdmin';

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

const getAllowedAdminEmails = () => {
  const fromList = (process.env.ADMIN_ALLOWED_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (fromList.length > 0) {
    return new Set(fromList);
  }

  const fallback = (process.env.ADMIN_LOGIN_EMAIL || '').trim().toLowerCase();
  return fallback ? new Set([fallback]) : null;
};

export const requireAdminAccess = async (req: VercelRequest, res: VercelResponse) => {
  const firebaseConfigError = getFirebaseAdminConfigError();
  if (firebaseConfigError) {
    res.status(500).json({
      success: false,
      message: firebaseConfigError
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

  const decodedToken = await verifyFirebaseIdToken(providedToken);
  if (!decodedToken) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized admin request.'
    });
    return false;
  }

  const allowedEmails = getAllowedAdminEmails();
  if (allowedEmails) {
    const userEmail = (decodedToken.email || '').trim().toLowerCase();
    if (!userEmail || !allowedEmails.has(userEmail)) {
      res.status(403).json({
        success: false,
        message: 'Authenticated user is not allowed for admin access.'
      });
      return false;
    }
  }

  return true;
};
