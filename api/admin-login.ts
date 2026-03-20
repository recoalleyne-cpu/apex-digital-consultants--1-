import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  ADMIN_SESSION_DURATION_SECONDS,
  createAdminSessionToken
} from './_utils/adminSession';

export const config = {
  runtime: 'nodejs'
};

const parseText = (value: unknown) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const toObject = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
};

const getRequestPayload = (req: VercelRequest) => {
  if (typeof req.body === 'string') {
    try {
      return toObject(JSON.parse(req.body || '{}')) ?? {};
    } catch {
      return null;
    }
  }

  return toObject(req.body) ?? {};
};

const getSessionSecret = () => {
  const fromDedicatedSecret = (process.env.ADMIN_SESSION_SECRET || '').trim();
  if (fromDedicatedSecret) return fromDedicatedSecret;

  const fromLegacyToken = (process.env.ADMIN_ACCESS_TOKEN || '').trim();
  if (fromLegacyToken) return fromLegacyToken;

  return (process.env.ADMIN_LOGIN_PASSWORD || '').trim();
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
    }

    const payload = getRequestPayload(req);
    if (!payload) {
      return res.status(400).send('Invalid JSON payload');
    }

    const configuredEmail = (process.env.ADMIN_LOGIN_EMAIL || '').trim().toLowerCase();
    const configuredPassword = (process.env.ADMIN_LOGIN_PASSWORD || '').trim();
    const sessionSecret = getSessionSecret();

    if (!configuredEmail || !configuredPassword || !sessionSecret) {
      return res.status(500).json({
        success: false,
        message:
          'Missing admin login configuration. Set ADMIN_LOGIN_EMAIL, ADMIN_LOGIN_PASSWORD, and ADMIN_SESSION_SECRET.'
      });
    }

    const providedEmail = parseText(payload.email).toLowerCase();
    const providedPassword = parseText(payload.password);

    if (!providedEmail || !providedPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    if (providedEmail !== configuredEmail || providedPassword !== configuredPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = createAdminSessionToken(configuredEmail, sessionSecret);

    return res.status(200).json({
      success: true,
      item: {
        token,
        email: configuredEmail,
        expires_in_seconds: ADMIN_SESSION_DURATION_SECONDS
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to process admin login.'
    });
  }
}
