import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getMailchimpConfigError,
  subscribeToMailchimp
} from '../server/api-shared/mailchimp.js';

export const config = {
  runtime: 'nodejs'
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FORM_COMPLETION_MS = 1200;
const MAX_FORM_COMPLETION_MS = 1000 * 60 * 60 * 24;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const MAX_RATE_LIMIT_KEYS = 2000;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitEntries = new Map<string, RateLimitEntry>();

const toObject = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
};

const parseText = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
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

  return honeypotKeys.some((key) => Boolean(parseText(payload[key])));
};

const getRequestPayload = (req: VercelRequest) => {
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

const buildSafeSuccessMessage = () =>
  'If this email can receive updates, your subscription request has been accepted.';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed.' });
    }

    const payload = getRequestPayload(req);
    if (!payload) {
      return res.status(400).json({ success: false, message: 'Invalid JSON payload.' });
    }

    if (hasSpamHoneypotValue(payload)) {
      return res.status(200).json({
        success: true,
        ignored: true,
        message: buildSafeSuccessMessage()
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

    const email = clip(parseText(payload.email), 320)?.toLowerCase() || null;
    if (!email || !EMAIL_PATTERN.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid email address to subscribe.'
      });
    }

    const source = clip(parseText(payload.source), 120) || 'newsletter-signup';
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
      clip(parseText(payload.firstName) || parseText(payload.first_name), 120) || null;
    const lastName =
      clip(parseText(payload.lastName) || parseText(payload.last_name), 120) || null;
    const pagePath = clip(parseText(payload.pagePath) || parseText(payload.page_path), 200);

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
        message: 'Newsletter service is temporarily unavailable. Please try again shortly.'
      });
    }

    if (!subscription.ok) {
      console.error('Newsletter subscribe error:', subscription.message);
      return res.status(502).json({
        success: false,
        message: 'Unable to process your subscription right now. Please try again shortly.'
      });
    }

    return res.status(200).json({
      success: true,
      status: subscription.status,
      message: buildSafeSuccessMessage()
    });
  } catch (error) {
    console.error('Newsletter subscribe API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Newsletter signup request failed.'
    });
  }
}
