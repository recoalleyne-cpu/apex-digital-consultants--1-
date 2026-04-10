import { createHash } from 'node:crypto';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAILCHIMP_TIMEOUT_MS = 8000;

type MailchimpConfig = {
  apiKey: string;
  audienceId: string;
  serverPrefix: string;
};

export type MailchimpSubscriptionInput = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  source?: string | null;
  tags?: Array<string | null | undefined>;
};

export type MailchimpSubscriptionResult = {
  ok: boolean;
  status: 'subscribed' | 'already_subscribed' | 'not_configured' | 'invalid_email' | 'failed';
  message: string;
};

const readServerEnv = (key: string) => (process.env[key] || '').trim();

const readFirstServerEnv = (keys: readonly string[]) => {
  for (const key of keys) {
    const value = readServerEnv(key);
    if (value) {
      return value;
    }
  }
  return '';
};

const trimToNull = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const inferServerPrefixFromApiKey = (apiKey: string) => {
  const match = apiKey.match(/-([a-z0-9]+)$/i);
  return match?.[1]?.trim().toLowerCase() || '';
};

const sanitizeMergeField = (value: string | null | undefined, maxLength = 80) => {
  if (!value) return null;
  const sanitized = value.replace(/\s+/g, ' ').trim();
  if (!sanitized) return null;
  return sanitized.slice(0, maxLength);
};

const sanitizeTag = (value: string | null | undefined) => {
  if (!value) return null;
  const cleaned = value
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100);

  return cleaned || null;
};

const buildUniqueTags = (values: Array<string | null | undefined>) => {
  const tags: string[] = [];
  const seen = new Set<string>();

  values.forEach((value) => {
    const normalized = sanitizeTag(value);
    if (!normalized) return;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    tags.push(normalized);
  });

  return tags;
};

const buildMemberHash = (email: string) => createHash('md5').update(email).digest('hex');

const getMailchimpConfig = (): MailchimpConfig | null => {
  const apiKey = readFirstServerEnv([
    'MAILCHIMP_API_KEY',
    'EMAIL_MAILCHIMP_API_KEY',
    'MAILCHIMP_KEY',
    'VITE_EMAIL_MAILCHIMP_API_KEY'
  ]);
  const audienceId = readFirstServerEnv([
    'MAILCHIMP_AUDIENCE_ID',
    'MAILCHIMP_LIST_ID',
    'EMAIL_MAILCHIMP_AUDIENCE_ID',
    'EMAIL_MAILCHIMP_LIST_ID',
    'VITE_EMAIL_MAILCHIMP_AUDIENCE_ID'
  ]);
  const configuredServerPrefix = readFirstServerEnv([
    'MAILCHIMP_SERVER_PREFIX',
    'MAILCHIMP_DATA_CENTER',
    'MAILCHIMP_DC',
    'EMAIL_MAILCHIMP_SERVER_PREFIX',
    'VITE_EMAIL_MAILCHIMP_SERVER_PREFIX'
  ]).toLowerCase();
  const inferredServerPrefix = inferServerPrefixFromApiKey(apiKey);
  const serverPrefix = configuredServerPrefix || inferredServerPrefix;

  if (!apiKey || !audienceId || !serverPrefix) {
    return null;
  }

  return {
    apiKey,
    audienceId,
    serverPrefix
  };
};

export const getMailchimpConfigError = () => {
  const config = getMailchimpConfig();
  if (config) return null;
  return 'Missing Mailchimp configuration. Set MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID (or MAILCHIMP_LIST_ID), and MAILCHIMP_SERVER_PREFIX.';
};

const extractMailchimpErrorMessage = async (response: Response) => {
  let rawBody = '';
  try {
    rawBody = await response.text();
  } catch {
    return `Mailchimp request failed with status ${response.status}.`;
  }

  if (!rawBody) {
    return `Mailchimp request failed with status ${response.status}.`;
  }

  try {
    const parsed = JSON.parse(rawBody) as {
      title?: unknown;
      detail?: unknown;
      message?: unknown;
    };

    const detail = trimToNull(parsed.detail);
    if (detail) return detail;

    const message = trimToNull(parsed.message);
    if (message) return message;

    const title = trimToNull(parsed.title);
    if (title) return title;
  } catch {
    // Fallback to plain-text response.
  }

  return rawBody;
};

export const subscribeToMailchimp = async (
  payload: MailchimpSubscriptionInput
): Promise<MailchimpSubscriptionResult> => {
  const config = getMailchimpConfig();
  if (!config) {
    return {
      ok: false,
      status: 'not_configured',
      message: 'Mailchimp is not configured.'
    };
  }

  const normalizedEmail = normalizeEmail(payload.email || '');
  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return {
      ok: false,
      status: 'invalid_email',
      message: 'A valid email address is required.'
    };
  }

  const mergeFields: Record<string, string> = {};
  const firstName = sanitizeMergeField(payload.firstName);
  const lastName = sanitizeMergeField(payload.lastName);
  if (firstName) mergeFields.FNAME = firstName;
  if (lastName) mergeFields.LNAME = lastName;

  const tags = buildUniqueTags([payload.source, ...(payload.tags || [])]);
  const memberHash = buildMemberHash(normalizedEmail);
  const endpoint = `https://${config.serverPrefix}.api.mailchimp.com/3.0/lists/${encodeURIComponent(config.audienceId)}/members/${memberHash}`;
  const authHeader = `Basic ${Buffer.from(`apex:${config.apiKey}`).toString('base64')}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), MAILCHIMP_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: normalizedEmail,
        status_if_new: 'subscribed',
        ...(Object.keys(mergeFields).length ? { merge_fields: mergeFields } : {}),
        ...(tags.length ? { tags } : {})
      }),
      signal: controller.signal
    });

    if (response.ok) {
      return {
        ok: true,
        status: 'subscribed',
        message: 'Subscription accepted.'
      };
    }

    const errorMessage = await extractMailchimpErrorMessage(response);
    const normalizedMessage = errorMessage.toLowerCase();
    if (normalizedMessage.includes('member exists')) {
      return {
        ok: true,
        status: 'already_subscribed',
        message: 'Email is already subscribed.'
      };
    }

    return {
      ok: false,
      status: 'failed',
      message: errorMessage
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to reach Mailchimp.';
    return {
      ok: false,
      status: 'failed',
      message
    };
  } finally {
    clearTimeout(timeoutId);
  }
};
