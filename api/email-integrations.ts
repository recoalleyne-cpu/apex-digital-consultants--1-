import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { requireAdminAccess } from '../server/api-shared/adminAuth';
import { getSqlClient, isNeonConfigured } from '../server/api-shared/neonDb';

export const config = {
  runtime: 'nodejs'
};

const EMAIL_SETTINGS_KEY = 'email_marketing_integrations_v1';

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

const parseBoolean = (value: unknown, fallback = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
    if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  }
  return fallback;
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
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

    let payload: Record<string, unknown>;
    try {
      const body =
        typeof req.body === 'string'
          ? JSON.parse(req.body || '{}')
          : req.body || {};
      payload = toObject(body) ?? {};
    } catch {
      return res.status(400).send('Invalid JSON payload');
    }

    let nextProviders: Record<EmailProviderId, EmailProviderConfig>;

    const fullProvidersPayload = toObject(payload.providers);
    if (fullProvidersPayload) {
      nextProviders = normalizeProvidersPayload(fullProvidersPayload);
    } else {
      const providerId = parseProviderId(payload.providerId);
      if (!providerId) {
        return res
          .status(400)
          .send('Expected providers object or providerId with config payload');
      }

      const current = await loadSavedProviders(sql);
      nextProviders = {
        ...current.providers,
        [providerId]: normalizeProviderConfig(payload.config)
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
