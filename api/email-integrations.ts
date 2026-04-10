import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { requireAdminAccess } from '../server/api-shared/adminAuth.js';
import { getSqlClient, isNeonConfigured } from '../server/api-shared/neonDb.js';
import {
  getMailchimpConfigError,
  subscribeToMailchimp
} from '../server/api-shared/mailchimp.js';

export const config = {
  runtime: 'nodejs'
};

const EMAIL_SETTINGS_KEY = 'email_marketing_integrations_v1';
const NEWSLETTER_SUBSCRIBE_INTENTS = new Set([
  'newsletter-subscribe',
  'newsletter_subscribe',
  'newsletter-signup',
  'newsletter_signup'
]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FORM_COMPLETION_MS = 1200;
const MAX_FORM_COMPLETION_MS = 1000 * 60 * 60 * 24;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const MAX_RATE_LIMIT_KEYS = 2000;

const EMAIL_PROVIDER_IDS = [
  'mailchimp',
  'brevo',
  'convertkit',
  'klaviyo',
  'activecampaign'
] as const;

type EmailProviderId = (typeof EMAIL_PROVIDER_IDS)[number];

type EmailProviderConfig = {
  enabled: boolean;
  apiKey: string;
  accountId: string;
  listId: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitEntries = new Map<string, RateLimitEntry>();

const toObject = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
};

const parseText = (value: unknown) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const parseOptionalText = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const parseBoolean = (value: unknown, fallback = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
    if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  }
  return fallback;
};

const clip = (value: string | null, maxLength: number) => {
  if (!value) return null;
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength).trim();
};

const parseTimestampMs = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number.parseInt(trimmed, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const readFirstTimestamp = (payload: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const parsed = parseTimestampMs(payload[key]);
    if (parsed !== null) return parsed;
  }
  return null;
};

const normalizeHeaderValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0] || '';
  if (typeof value === 'string') return value;
  return '';
};

const getClientIp = (req: VercelRequest) => {
  const forwarded = normalizeHeaderValue(req.headers['x-forwarded-for']);
  const realIp = normalizeHeaderValue(req.headers['x-real-ip']);
  const cfIp = normalizeHeaderValue(req.headers['cf-connecting-ip']);
  const candidates = [forwarded.split(',')[0], realIp, cfIp];

  for (const candidate of candidates) {
    const normalized = candidate.trim().toLowerCase();
    if (!normalized || normalized === 'unknown') continue;
    return normalized;
  }

  return null;
};

const pruneRateLimitEntries = (now: number) => {
  for (const [key, entry] of rateLimitEntries) {
    if (entry.resetAt <= now) {
      rateLimitEntries.delete(key);
    }
  }

  if (rateLimitEntries.size <= MAX_RATE_LIMIT_KEYS) return;

  const sortedKeys = [...rateLimitEntries.entries()]
    .sort((a, b) => a[1].resetAt - b[1].resetAt)
    .map(([key]) => key);

  const overflow = rateLimitEntries.size - MAX_RATE_LIMIT_KEYS;
  for (let index = 0; index < overflow; index++) {
    const key = sortedKeys[index];
    if (key) rateLimitEntries.delete(key);
  }
};

const consumeRateLimitToken = (key: string, now: number) => {
  pruneRateLimitEntries(now);

  const current = rateLimitEntries.get(key);
  if (!current || current.resetAt <= now) {
    rateLimitEntries.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS
    });
    return {
      allowed: true as const,
      retryAfterSeconds: 0
    };
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false as const,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    };
  }

  current.count += 1;
  rateLimitEntries.set(key, current);
  return {
    allowed: true as const,
    retryAfterSeconds: 0
  };
};

const hasSpamHoneypotValue = (payload: Record<string, unknown>) => {
  const honeypotKeys = [
    'honeypot',
    'honeypot_field',
    'company_website',
    'website',
    'middle_name',
    'middleName'
  ];

  return honeypotKeys.some((key) => Boolean(parseOptionalText(payload[key])));
};

const buildSafeNewsletterSuccessMessage = () =>
  'If this email can receive updates, your subscription request has been accepted.';

const buildNewsletterUnavailableMessage = () =>
  'Newsletter service is temporarily unavailable. Please try again shortly.';

const isNewsletterSubscribeIntent = (payload: Record<string, unknown>) => {
  const intent = parseText(payload.intent).toLowerCase();
  if (NEWSLETTER_SUBSCRIBE_INTENTS.has(intent)) return true;

  const action = parseText(payload.action).toLowerCase();
  if (NEWSLETTER_SUBSCRIBE_INTENTS.has(action)) return true;

  return false;
};

const buildDefaultProviders = (): Record<EmailProviderId, EmailProviderConfig> => {
  return EMAIL_PROVIDER_IDS.reduce((allProviders, providerId) => {
    allProviders[providerId] = {
      enabled: false,
      apiKey: '',
      accountId: '',
      listId: ''
    };
    return allProviders;
  }, {} as Record<EmailProviderId, EmailProviderConfig>);
};

const normalizeProviderConfig = (value: unknown): EmailProviderConfig => {
  const config = toObject(value);
  return {
    enabled: parseBoolean(config?.enabled, false),
    apiKey: parseText(config?.apiKey),
    accountId: parseText(config?.accountId),
    listId: parseText(config?.listId)
  };
};

const normalizeProvidersPayload = (value: unknown): Record<EmailProviderId, EmailProviderConfig> => {
  const root = toObject(value);
  const providersSource = toObject(root?.providers) ?? root;
  const normalized = buildDefaultProviders();

  EMAIL_PROVIDER_IDS.forEach((providerId) => {
    normalized[providerId] = normalizeProviderConfig(providersSource?.[providerId]);
  });

  return normalized;
};

const parseProviderId = (value: unknown): EmailProviderId | null => {
  if (typeof value !== 'string') return null;
  if ((EMAIL_PROVIDER_IDS as readonly string[]).includes(value)) {
    return value as EmailProviderId;
  }
  return null;
};

const asRowArray = <T>(value: unknown): T[] => {
  if (!Array.isArray(value)) return [];
  return value as T[];
};

const ensureIntegrationSettingsTable = async (sql: ReturnType<typeof neon>) => {
  await sql`
    CREATE TABLE IF NOT EXISTS integration_settings (
      id SERIAL PRIMARY KEY,
      setting_key TEXT UNIQUE NOT NULL,
      setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS integration_settings_setting_key_idx
    ON integration_settings (setting_key)
  `;
};

const loadSavedProviders = async (sql: ReturnType<typeof neon>) => {
  const rows = asRowArray<{ setting_value?: unknown; updated_at?: Date | null }>(await sql`
    SELECT
      setting_value,
      updated_at
    FROM integration_settings
    WHERE setting_key = ${EMAIL_SETTINGS_KEY}
    LIMIT 1
  `);

  if (!rows.length) {
    return {
      providers: buildDefaultProviders(),
      updatedAt: null as Date | null
    };
  }

  const row = rows[0];

  return {
    providers: normalizeProvidersPayload(row.setting_value ?? {}),
    updatedAt: row.updated_at ?? null
  };
};

const saveProviders = async (
  sql: ReturnType<typeof neon>,
  providers: Record<EmailProviderId, EmailProviderConfig>
) => {
  const rows = asRowArray<{ setting_value?: unknown; updated_at?: Date | null }>(await sql`
    INSERT INTO integration_settings (
      setting_key,
      setting_value
    )
    VALUES (
      ${EMAIL_SETTINGS_KEY},
      ${JSON.stringify({ providers })}
    )
    ON CONFLICT (setting_key)
    DO UPDATE SET
      setting_value = EXCLUDED.setting_value,
      updated_at = NOW()
    RETURNING
      setting_value,
      updated_at
  `);

  const row = rows[0];

  return {
    providers: normalizeProvidersPayload(row?.setting_value ?? {}),
    updatedAt: row?.updated_at ?? null
  };
};

const parseRequestPayload = (req: VercelRequest): Record<string, unknown> | null => {
  if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body || '{}');
      return toObject(parsed) ?? {};
    } catch {
      return null;
    }
  }

  if (typeof req.body === 'object') {
    return toObject(req.body) ?? {};
  }

  return {};
};

const handleNewsletterSubscribe = async (
  req: VercelRequest,
  res: VercelResponse,
  payload: Record<string, unknown>
) => {
  if (hasSpamHoneypotValue(payload)) {
    return res.status(200).json({
      success: true,
      ignored: true,
      message: buildSafeNewsletterSuccessMessage()
    });
  }

  const submittedDurationMs = readFirstTimestamp(payload, [
    'form_fill_duration_ms',
    'formFillDurationMs',
    'elapsed_ms',
    'elapsedMs'
  ]);
  const startedAt = readFirstTimestamp(payload, [
    'form_started_at',
    'formStartedAt',
    'started_at',
    'startedAt'
  ]);
  const submittedAt = readFirstTimestamp(payload, ['submitted_at', 'submittedAt']);
  const fallbackDurationMs =
    startedAt !== null && submittedAt !== null ? submittedAt - startedAt : null;
  const completionMs = submittedDurationMs !== null ? submittedDurationMs : fallbackDurationMs;

  if (completionMs === null) {
    return res.status(400).json({
      success: false,
      message: 'Missing form timing metadata. Please refresh and try again.'
    });
  }

  if (completionMs < MIN_FORM_COMPLETION_MS) {
    return res.status(400).json({
      success: false,
      message: 'Please wait a moment before submitting.'
    });
  }

  if (completionMs > MAX_FORM_COMPLETION_MS) {
    return res.status(400).json({
      success: false,
      message: 'Form session expired. Please submit again.'
    });
  }

  const email = clip(parseOptionalText(payload.email), 320)?.toLowerCase() || null;
  if (!email || !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Enter a valid email address to subscribe.'
    });
  }

  const source = clip(parseOptionalText(payload.source), 120) || 'newsletter-signup';
  const now = Date.now();
  const clientIp = getClientIp(req);
  const rateLimitKey = `${source}:${clientIp || email}`;
  const rateLimitDecision = consumeRateLimitToken(rateLimitKey, now);
  if (!rateLimitDecision.allowed) {
    res.setHeader('Retry-After', String(rateLimitDecision.retryAfterSeconds));
    return res.status(429).json({
      success: false,
      message: 'Too many attempts. Please try again in a few minutes.'
    });
  }

  const firstName =
    clip(parseOptionalText(payload.firstName) || parseOptionalText(payload.first_name), 120) || null;
  const lastName =
    clip(parseOptionalText(payload.lastName) || parseOptionalText(payload.last_name), 120) || null;
  const pagePath = clip(
    parseOptionalText(payload.pagePath) || parseOptionalText(payload.page_path),
    200
  );

  const subscription = await subscribeToMailchimp({
    email,
    firstName,
    lastName,
    source,
    tags: [source, pagePath ? `page:${pagePath}` : null, 'newsletter']
  });

  if (subscription.status === 'not_configured') {
    const configError = getMailchimpConfigError();
    console.error('Newsletter subscribe config error:', configError);
    return res.status(503).json({
      success: false,
      message: buildNewsletterUnavailableMessage()
    });
  }

  if (!subscription.ok) {
    console.error('Newsletter subscribe failure:', {
      code: subscription.code || 'unknown',
      upstreamStatus: subscription.httpStatus ?? null,
      detail: subscription.message
    });

    if (subscription.code === 'invalid_email') {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid email address to subscribe.'
      });
    }

    if (subscription.code === 'request_invalid') {
      return res.status(422).json({
        success: false,
        message: 'Unable to process that subscription request. Please review your details and try again.'
      });
    }

    return res.status(503).json({
      success: false,
      message: buildNewsletterUnavailableMessage()
    });
  }

  return res.status(200).json({
    success: true,
    status: subscription.status,
    message: buildSafeNewsletterSuccessMessage()
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
    }

    const payload = req.method === 'POST' ? parseRequestPayload(req) : {};
    if (req.method === 'POST' && payload === null) {
      return res.status(400).send('Invalid JSON payload');
    }

    if (req.method === 'POST' && payload && isNewsletterSubscribeIntent(payload)) {
      return handleNewsletterSubscribe(req, res, payload);
    }

    if (!(await requireAdminAccess(req, res))) {
      return;
    }

    if (!isNeonConfigured()) {
      return res.status(500).send('Missing DATABASE_URL (or POSTGRES_URL) environment variable');
    }

    const sql = getSqlClient();
    await ensureIntegrationSettingsTable(sql);

    if (req.method === 'GET') {
      const saved = await loadSavedProviders(sql);
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({
        success: true,
        item: {
          providers: saved.providers,
          updated_at: saved.updatedAt
        }
      });
    }
    const settingsPayload = payload ?? {};

    let nextProviders: Record<EmailProviderId, EmailProviderConfig>;

    const fullProvidersPayload = toObject(settingsPayload.providers);
    if (fullProvidersPayload) {
      nextProviders = normalizeProvidersPayload(fullProvidersPayload);
    } else {
      const providerId = parseProviderId(settingsPayload.providerId);
      if (!providerId) {
        return res
          .status(400)
          .send('Expected providers object or providerId with config payload');
      }

      const current = await loadSavedProviders(sql);
      nextProviders = {
        ...current.providers,
        [providerId]: normalizeProviderConfig(settingsPayload.config)
      };
    }

    const saved = await saveProviders(sql, nextProviders);

    return res.status(200).json({
      success: true,
      item: {
        providers: saved.providers,
        updated_at: saved.updatedAt
      }
    });
  } catch (error) {
    console.error('Email integrations API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Email integrations request failed.'
    });
  }
}
