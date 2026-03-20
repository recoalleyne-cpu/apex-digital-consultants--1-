import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'nodejs'
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

const toObject = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
};

const splitName = (value: string | null) => {
  if (!value) return { firstName: null as string | null, lastName: null as string | null };
  const parts = value.split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: null as string | null, lastName: null as string | null };
  if (parts.length === 1) return { firstName: parts[0], lastName: null };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
};

const ensureLeadSubmissionsTable = async (sql: ReturnType<typeof neon>) => {
  await sql`
    CREATE TABLE IF NOT EXISTS lead_submissions (
      id SERIAL PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      email TEXT NOT NULL,
      phone TEXT,
      company_name TEXT,
      service_interest TEXT,
      project_details TEXT,
      budget_range TEXT,
      status TEXT DEFAULT 'new',
      source TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS lead_submissions_created_idx
    ON lead_submissions (created_at DESC)
  `;
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
    }

    const postgresUrl = process.env.POSTGRES_URL;
    if (!postgresUrl) {
      return res.status(500).send('Missing POSTGRES_URL environment variable');
    }

    const payload = getRequestPayload(req);
    if (!payload) {
      return res.status(400).send('Invalid JSON payload');
    }

    const email = clip(parseText(payload.email), 320);
    if (!email || !EMAIL_PATTERN.test(email)) {
      return res.status(400).send('A valid email is required.');
    }

    const combinedName = clip(parseText(payload.name), 200);
    const { firstName: splitFirstName, lastName: splitLastName } = splitName(combinedName);

    const firstName =
      clip(parseText(payload.firstName) || parseText(payload.first_name), 120) ||
      splitFirstName;
    const lastName =
      clip(parseText(payload.lastName) || parseText(payload.last_name), 120) || splitLastName;

    const phone = clip(parseText(payload.phone), 60);
    const companyName = clip(parseText(payload.companyName) || parseText(payload.company_name), 160);
    const serviceInterest = clip(
      parseText(payload.service) || parseText(payload.service_interest),
      200
    );
    const projectDetails = clip(
      parseText(payload.projectDetails) ||
        parseText(payload.project_details) ||
        parseText(payload.message),
      6000
    );
    const budgetRange = clip(parseText(payload.budget) || parseText(payload.budget_range), 120);
    const source = clip(parseText(payload.source), 120) || 'website';

    const sql = neon(postgresUrl);
    await ensureLeadSubmissionsTable(sql);

    const inserted = await sql`
      INSERT INTO lead_submissions (
        first_name,
        last_name,
        email,
        phone,
        company_name,
        service_interest,
        project_details,
        budget_range,
        source
      )
      VALUES (
        ${firstName},
        ${lastName},
        ${email},
        ${phone},
        ${companyName},
        ${serviceInterest},
        ${projectDetails},
        ${budgetRange},
        ${source}
      )
      RETURNING id
    `;

    return res.status(201).json({
      success: true,
      id: inserted[0]?.id || null
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown lead submission error';
    return res.status(500).send(`Lead submission failed: ${message}`);
  }
}

