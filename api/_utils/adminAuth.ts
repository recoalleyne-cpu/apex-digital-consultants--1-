import type { VercelRequest, VercelResponse } from '@vercel/node';

const ADMIN_TOKEN_HEADER = 'x-admin-token';
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
  const directToken = normalizeHeaderValue(req.headers[ADMIN_TOKEN_HEADER]);
  if (directToken) return directToken;

  const authorization = normalizeHeaderValue(req.headers[AUTHORIZATION_HEADER]);
  if (!authorization) return '';

  const normalized = authorization.toLowerCase();
  if (!normalized.startsWith(BEARER_PREFIX)) {
    return authorization;
  }

  return authorization.slice(BEARER_PREFIX.length).trim();
};

const getConfiguredToken = () => {
  const token = process.env.ADMIN_ACCESS_TOKEN;
  if (typeof token !== 'string') return '';
  return token.trim();
};

export const requireAdminAccess = (req: VercelRequest, res: VercelResponse) => {
  const configuredToken = getConfiguredToken();

  if (!configuredToken) {
    res.status(500).json({
      success: false,
      message: 'Missing ADMIN_ACCESS_TOKEN environment variable.'
    });
    return false;
  }

  const providedToken = getProvidedToken(req);
  if (!providedToken || providedToken !== configuredToken) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized admin request.'
    });
    return false;
  }

  return true;
};

