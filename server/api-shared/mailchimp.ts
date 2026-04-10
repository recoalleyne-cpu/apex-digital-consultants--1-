import { createHash } from 'node:crypto';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAILCHIMP_TIMEOUT_MS = 8000;
const MAILCHIMP_AUDIENCE_ID_PATTERN = /^[a-z0-9]+$/i;
const MAILCHIMP_SERVER_PREFIX_PATTERN = /^[a-z0-9]+$/i;

type MailchimpConfig = {
  apiKey: string;
  audienceId: string;
  serverPrefix: string;
  apiKeySuffix: string | null;
  configuredServerPrefix: string | null;
  serverPrefixMatchesApiKeySuffix: boolean | null;
};

type MailchimpDiagnostics = {
  hasApiKey: boolean;
  hasAudienceId: boolean;
  hasServerPrefix: boolean;
  apiKeySuffix: string | null;
  apiKeySuffixLooksValid: boolean;
  rawServerPrefix: string | null;
  configuredServerPrefix: string | null;
  configuredServerPrefixLooksValid: boolean;
  effectiveServerPrefix: string | null;
  serverPrefixMatchesApiKeySuffix: boolean | null;
  audienceIdPreview: string | null;
  audienceIdLooksValid: boolean;
};

export type MailchimpSubscriptionInput = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  source?: string | null;
  tags?: Array<string | null | undefined>;
};

export type MailchimpFailureCode =
  | 'not_configured'
  | 'invalid_email'
  | 'config_mismatch'
  | 'api_key_invalid'
  | 'audience_not_found'
  | 'request_invalid'
  | 'network_error'
  | 'unknown';

export type MailchimpSubscriptionResult = {
  ok: boolean;
  status: 'subscribed' | 'already_subscribed' | 'not_configured' | 'invalid_email' | 'failed';
  message: string;
  code?: MailchimpFailureCode;
  httpStatus?: number;
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
  const trimmed = value.trim().replace(/^['"]|['"]$/g, '');
  return trimmed.length ? trimmed : null;
};

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const stripPrefixedAssignment = (value: string | null, prefixes: string[]) => {
  if (!value) return null;
  const lower = value.toLowerCase();

  for (const prefix of prefixes) {
    const normalizedPrefix = `${prefix.toLowerCase()}=`;
    if (lower.startsWith(normalizedPrefix)) {
      const withoutPrefix = value.slice(normalizedPrefix.length).trim();
      return withoutPrefix || null;
    }
  }

  return value;
};

const firstToken = (value: string | null) => {
  if (!value) return null;
  const token = value.split(/[\s,;]+/).find(Boolean);
  return token?.trim() || null;
};

const normalizeApiKey = (value: string | null) =>
  firstToken(stripPrefixedAssignment(value, ['MAILCHIMP_API_KEY', 'EMAIL_MAILCHIMP_API_KEY', 'MAILCHIMP_KEY']));

const normalizeAudienceId = (value: string | null) =>
  firstToken(
    stripPrefixedAssignment(value, [
      'MAILCHIMP_AUDIENCE_ID',
      'MAILCHIMP_LIST_ID',
      'EMAIL_MAILCHIMP_AUDIENCE_ID',
      'EMAIL_MAILCHIMP_LIST_ID'
    ])
  );

const normalizeServerPrefix = (value: string | null) => {
  let normalized = trimToNull(value);
  if (!normalized) return null;

  normalized = normalized.toLowerCase();

  if (normalized.includes('=') || normalized.includes('://') || normalized.includes('/') || normalized.includes('.')) {
    return null;
  }

  if (!MAILCHIMP_SERVER_PREFIX_PATTERN.test(normalized)) {
    return null;
  }

  return normalized;
};

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

const maskAudienceId = (value: string | null) => {
  if (!value) return null;
  if (value.length <= 6) return value;
  return `${value.slice(0, 3)}...${value.slice(-3)}`;
};

const resolveMailchimpConfig = (): {
  config: MailchimpConfig | null;
  diagnostics: MailchimpDiagnostics;
} => {
  const rawApiKey = readFirstServerEnv([
    'MAILCHIMP_API_KEY',
    'EMAIL_MAILCHIMP_API_KEY',
    'MAILCHIMP_KEY'
  ]);
  const rawAudienceId = readFirstServerEnv([
    'MAILCHIMP_AUDIENCE_ID',
    'MAILCHIMP_LIST_ID',
    'EMAIL_MAILCHIMP_AUDIENCE_ID',
    'EMAIL_MAILCHIMP_LIST_ID'
  ]);
  const rawServerPrefix = readFirstServerEnv([
    'MAILCHIMP_SERVER_PREFIX',
    'MAILCHIMP_DATA_CENTER',
    'MAILCHIMP_DC',
    'EMAIL_MAILCHIMP_SERVER_PREFIX'
  ]);

  const apiKey = normalizeApiKey(trimToNull(rawApiKey));
  const audienceId = normalizeAudienceId(trimToNull(rawAudienceId));
  const rawServerPrefixValue = trimToNull(rawServerPrefix);
  const configuredServerPrefix = normalizeServerPrefix(rawServerPrefixValue);
  const apiKeySuffix = apiKey ? inferServerPrefixFromApiKey(apiKey) || null : null;
  const apiKeySuffixLooksValid = Boolean(apiKeySuffix && MAILCHIMP_SERVER_PREFIX_PATTERN.test(apiKeySuffix));
  const serverPrefix = apiKeySuffix || configuredServerPrefix || '';
  const serverPrefixMatchesApiKeySuffix =
    apiKeySuffix && configuredServerPrefix ? apiKeySuffix === configuredServerPrefix : null;

  const diagnostics: MailchimpDiagnostics = {
    hasApiKey: Boolean(apiKey),
    hasAudienceId: Boolean(audienceId),
    hasServerPrefix: Boolean(serverPrefix),
    apiKeySuffix,
    apiKeySuffixLooksValid,
    rawServerPrefix: rawServerPrefixValue,
    configuredServerPrefix,
    configuredServerPrefixLooksValid: Boolean(
      configuredServerPrefix && MAILCHIMP_SERVER_PREFIX_PATTERN.test(configuredServerPrefix)
    ),
    effectiveServerPrefix: serverPrefix || null,
    serverPrefixMatchesApiKeySuffix,
    audienceIdPreview: maskAudienceId(audienceId),
    audienceIdLooksValid: Boolean(audienceId && MAILCHIMP_AUDIENCE_ID_PATTERN.test(audienceId))
  };

  if (
    configuredServerPrefix &&
    apiKeySuffix &&
    configuredServerPrefix !== apiKeySuffix
  ) {
    console.warn('[Mailchimp] Server prefix mismatch detected. Using API key suffix as source of truth.', {
      configuredServerPrefix,
      apiKeySuffix
    });
  }

  if (rawServerPrefixValue && !configuredServerPrefix) {
    console.warn('[Mailchimp] MAILCHIMP_SERVER_PREFIX value is malformed and will be ignored.', {
      providedValue: rawServerPrefixValue
    });
  }

  if (
    !apiKey ||
    !audienceId ||
    !serverPrefix ||
    !MAILCHIMP_AUDIENCE_ID_PATTERN.test(audienceId) ||
    !MAILCHIMP_SERVER_PREFIX_PATTERN.test(serverPrefix)
  ) {
    return {
      config: null,
      diagnostics
    };
  }

  return {
    config: {
      apiKey,
      audienceId,
      serverPrefix,
      apiKeySuffix,
      configuredServerPrefix,
      serverPrefixMatchesApiKeySuffix
    },
    diagnostics
  };
};

const classifyMailchimpFailure = (
  httpStatus: number | null,
  title: string | null,
  detail: string | null,
  diagnostics: MailchimpDiagnostics
): MailchimpFailureCode => {
  if (diagnostics.serverPrefixMatchesApiKeySuffix === false) {
    return 'config_mismatch';
  }

  const combined = `${title || ''} ${detail || ''}`.toLowerCase();

  if (httpStatus === 401 || (combined.includes('api key') && combined.includes('invalid'))) {
    return 'api_key_invalid';
  }

  if (httpStatus === 404 && (combined.includes('list') || combined.includes('resource'))) {
    return 'audience_not_found';
  }

  if (httpStatus === 400) {
    return 'request_invalid';
  }

  return 'unknown';
};

const isAlreadySubscribedError = (title: string | null, detail: string | null) => {
  const combined = `${title || ''} ${detail || ''}`.toLowerCase();
  return (
    combined.includes('member exists') ||
    combined.includes('already a list member') ||
    combined.includes('already subscribed')
  );
};

const extractMailchimpError = async (response: Response) => {
  let rawBody = '';
  try {
    rawBody = await response.text();
  } catch {
    return {
      title: null as string | null,
      detail: `Mailchimp request failed with status ${response.status}.`,
      status: response.status
    };
  }

  if (!rawBody) {
    return {
      title: null as string | null,
      detail: `Mailchimp request failed with status ${response.status}.`,
      status: response.status
    };
  }

  try {
    const parsed = JSON.parse(rawBody) as {
      title?: unknown;
      detail?: unknown;
      message?: unknown;
      status?: unknown;
    };
    const title = trimToNull(parsed.title);
    const detail = trimToNull(parsed.detail) || trimToNull(parsed.message);
    const status = typeof parsed.status === 'number' ? parsed.status : response.status;

    return {
      title,
      detail: detail || rawBody,
      status
    };
  } catch {
    return {
      title: null as string | null,
      detail: rawBody,
      status: response.status
    };
  }
};

const logMailchimpFailure = (
  reason: string,
  diagnostics: MailchimpDiagnostics,
  metadata: {
    httpStatus?: number | null;
    title?: string | null;
    detail?: string | null;
    code?: MailchimpFailureCode;
    endpointHost?: string | null;
  }
) => {
  console.error('[Mailchimp] Subscription failure', {
    reason,
    code: metadata.code || null,
    httpStatus: metadata.httpStatus ?? null,
    title: metadata.title ?? null,
    detail: metadata.detail ?? null,
    endpointHost: metadata.endpointHost ?? null,
    diagnostics
  });
};

export const getMailchimpConfigError = () => {
  const { config, diagnostics } = resolveMailchimpConfig();
  if (config) return null;
  return `Missing Mailchimp configuration. Set MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID (or MAILCHIMP_LIST_ID), and MAILCHIMP_SERVER_PREFIX. Diagnostics: ${JSON.stringify({
    hasApiKey: diagnostics.hasApiKey,
    hasAudienceId: diagnostics.hasAudienceId,
    hasServerPrefix: diagnostics.hasServerPrefix,
    apiKeySuffix: diagnostics.apiKeySuffix,
    apiKeySuffixLooksValid: diagnostics.apiKeySuffixLooksValid,
    rawServerPrefix: diagnostics.rawServerPrefix,
    configuredServerPrefix: diagnostics.configuredServerPrefix,
    configuredServerPrefixLooksValid: diagnostics.configuredServerPrefixLooksValid,
    effectiveServerPrefix: diagnostics.effectiveServerPrefix,
    audienceIdPreview: diagnostics.audienceIdPreview,
    audienceIdLooksValid: diagnostics.audienceIdLooksValid,
    serverPrefixMatchesApiKeySuffix: diagnostics.serverPrefixMatchesApiKeySuffix
  })}`;
};

const assertMailchimpConfig = () => {
  const { config, diagnostics } = resolveMailchimpConfig();
  return { config, diagnostics };
};

export const subscribeToMailchimp = async (
  payload: MailchimpSubscriptionInput
): Promise<MailchimpSubscriptionResult> => {
  const { config, diagnostics } = assertMailchimpConfig();
  if (!config) {
    logMailchimpFailure('not_configured', diagnostics, { code: 'not_configured' });
    return {
      ok: false,
      status: 'not_configured',
      message: 'Mailchimp is not configured.',
      code: 'not_configured'
    };
  }

  const normalizedEmail = normalizeEmail(payload.email || '');
  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return {
      ok: false,
      status: 'invalid_email',
      message: 'A valid email address is required.',
      code: 'invalid_email'
    };
  }

  const mergeFields: Record<string, string> = {};
  const firstName = sanitizeMergeField(payload.firstName);
  const lastName = sanitizeMergeField(payload.lastName);
  if (firstName) mergeFields.FNAME = firstName;
  if (lastName) mergeFields.LNAME = lastName;

  const tags = buildUniqueTags([payload.source, ...(payload.tags || [])]);
  const memberHash = buildMemberHash(normalizedEmail);
  const endpointHost = `${config.serverPrefix}.api.mailchimp.com`;
  const endpoint = `https://${endpointHost}/3.0/lists/${encodeURIComponent(config.audienceId)}/members/${memberHash}`;
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

    const parsedError = await extractMailchimpError(response);

    if (isAlreadySubscribedError(parsedError.title, parsedError.detail)) {
      return {
        ok: true,
        status: 'already_subscribed',
        message: 'Email is already subscribed.'
      };
    }

    const code = classifyMailchimpFailure(
      parsedError.status,
      parsedError.title,
      parsedError.detail,
      diagnostics
    );
    logMailchimpFailure('mailchimp_non_ok_response', diagnostics, {
      httpStatus: parsedError.status,
      title: parsedError.title,
      detail: parsedError.detail,
      code,
      endpointHost
    });

    return {
      ok: false,
      status: 'failed',
      message: parsedError.detail || `Mailchimp request failed with status ${response.status}.`,
      code,
      httpStatus: parsedError.status
    };
  } catch (error) {
    const isAbort = error instanceof Error && error.name === 'AbortError';
    const message = isAbort
      ? `Mailchimp request timed out after ${MAILCHIMP_TIMEOUT_MS}ms.`
      : error instanceof Error
        ? error.message
        : 'Unable to reach Mailchimp.';
    const code: MailchimpFailureCode = 'network_error';

    logMailchimpFailure('mailchimp_network_error', diagnostics, {
      detail: message,
      code,
      endpointHost
    });

    return {
      ok: false,
      status: 'failed',
      message,
      code
    };
  } finally {
    clearTimeout(timeoutId);
  }
};
