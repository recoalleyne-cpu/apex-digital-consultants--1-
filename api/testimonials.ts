import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'nodejs'
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const parseLimit = (value: unknown) => {
  if (typeof value !== 'string') return 6;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return 6;
  return clamp(parsed, 1, 20);
};

const parseFeaturedFlag = (value: unknown) => {
  if (typeof value !== 'string') return true;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'all' || normalized === 'false' || normalized === '0') {
    return false;
  }
  return true;
};

const normalizeText = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const toObject = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
};

const pickFirstText = (...values: unknown[]) => {
  for (const value of values) {
    const normalized = normalizeText(value);
    if (normalized) return normalized;
  }
  return null;
};

const parseBoolean = (value: unknown, fallback: boolean) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
      return true;
    }
    if (normalized === 'false' || normalized === '0' || normalized === 'no') {
      return false;
    }
  }
  return fallback;
};

const parseRating = (value: unknown, fallback = 5) => {
  const raw =
    typeof value === 'number'
      ? value
      : Number.parseFloat(String(value ?? ''));
  return Number.isFinite(raw) ? clamp(Math.round(raw), 1, 5) : fallback;
};

const parseDate = (value: unknown): Date | null => {
  if (value instanceof Date && Number.isFinite(value.getTime())) {
    return value;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const milliseconds = value > 1_000_000_000_000 ? value : value * 1000;
    const date = new Date(milliseconds);
    return Number.isFinite(date.getTime()) ? date : null;
  }

  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^\d+$/.test(trimmed)) {
    const numeric = Number.parseInt(trimmed, 10);
    if (Number.isFinite(numeric)) {
      const milliseconds = numeric > 1_000_000_000_000 ? numeric : numeric * 1000;
      const date = new Date(milliseconds);
      return Number.isFinite(date.getTime()) ? date : null;
    }
  }

  const date = new Date(trimmed);
  return Number.isFinite(date.getTime()) ? date : null;
};

type GoogleImportItem = {
  externalId: string;
  name: string;
  quote: string;
  rating: number;
  imageUrl: string | null;
  company: string | null;
  role: string | null;
  externalUrl: string | null;
  publishedAt: Date | null;
  featured: boolean;
};

const normalizeGoogleImportItem = (
  value: unknown,
  defaultFeatured: boolean
): GoogleImportItem | null => {
  const item = toObject(value);
  if (!item) return null;

  const author = toObject(item.authorAttribution);
  const textObject = toObject(item.text);
  const originalTextObject = toObject(item.originalText);

  const externalId = pickFirstText(
    item.review_id,
    item.reviewId,
    item.external_id,
    item.externalId,
    item.id,
    item.name
  );

  const name = pickFirstText(
    item.reviewer_name,
    item.reviewerName,
    item.author_name,
    item.authorName,
    author?.displayName
  );

  const quote = pickFirstText(
    item.quote,
    item.comment,
    item.review_text,
    item.reviewText,
    item.text,
    textObject?.text,
    item.originalText,
    originalTextObject?.text
  );

  if (!externalId || !name || !quote) return null;

  return {
    externalId,
    name,
    quote,
    rating: parseRating(item.rating, 5),
    imageUrl: pickFirstText(
      item.image_url,
      item.imageUrl,
      item.reviewer_avatar_url,
      item.reviewerAvatarUrl,
      item.profile_photo_url,
      item.profilePhotoUrl,
      author?.photoUri
    ),
    company: pickFirstText(item.company, item.business),
    role: pickFirstText(item.role, item.title),
    externalUrl: pickFirstText(
      item.external_url,
      item.externalUrl,
      item.review_url,
      item.reviewUrl,
      item.url,
      author?.uri
    ),
    publishedAt: parseDate(
      item.published_at ??
        item.publishedAt ??
        item.publishTime ??
        item.time ??
        item.createTime ??
        item.updateTime
    ),
    featured: parseBoolean(item.featured, defaultFeatured)
  };
};

const ensureTestimonialsTable = async (sql: ReturnType<typeof neon>) => {
  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT,
      role TEXT,
      quote TEXT NOT NULL,
      rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
      image_url TEXT,
      featured BOOLEAN DEFAULT TRUE,
      source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'google')),
      external_id TEXT,
      external_url TEXT,
      published_at TIMESTAMP,
      last_synced_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE testimonials
    ADD COLUMN IF NOT EXISTS external_id TEXT
  `;

  await sql`
    ALTER TABLE testimonials
    ADD COLUMN IF NOT EXISTS external_url TEXT
  `;

  await sql`
    ALTER TABLE testimonials
    ADD COLUMN IF NOT EXISTS published_at TIMESTAMP
  `;

  await sql`
    ALTER TABLE testimonials
    ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP
  `;

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS testimonials_source_external_id_idx
    ON testimonials (source, external_id)
  `;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const postgresUrl = process.env.POSTGRES_URL;

    if (!postgresUrl) {
      return res.status(500).send('Missing POSTGRES_URL environment variable');
    }

    const sql = neon(postgresUrl);
    await ensureTestimonialsTable(sql);

    if (req.method === 'GET') {
      const featuredOnly = parseFeaturedFlag(req.query.featured);
      const limit = parseLimit(req.query.limit);

      const rows = featuredOnly
        ? await sql`
            SELECT id, name, company, role, quote, rating, image_url, featured, source, external_id, external_url, published_at, last_synced_at, created_at
            FROM testimonials
            WHERE featured = TRUE
            ORDER BY COALESCE(published_at, created_at) DESC
            LIMIT ${limit}
          `
        : await sql`
            SELECT id, name, company, role, quote, rating, image_url, featured, source, external_id, external_url, published_at, last_synced_at, created_at
            FROM testimonials
            ORDER BY COALESCE(published_at, created_at) DESC
            LIMIT ${limit}
          `;

      return res.status(200).json({
        success: true,
        items: rows
      });
    }

    if (req.method === 'POST') {
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

      const importMode =
        typeof payload.import_mode === 'string'
          ? payload.import_mode.trim().toLowerCase()
          : typeof payload.importMode === 'string'
            ? payload.importMode.trim().toLowerCase()
            : null;

      if (importMode === 'google') {
        const rawItems = Array.isArray(payload.items) ? payload.items : [];
        if (!rawItems.length) {
          return res.status(400).send('Google import requires a non-empty items array');
        }

        if (rawItems.length > 50) {
          return res.status(400).send('Google import supports up to 50 items per request');
        }

        const defaultFeatured = parseBoolean(payload.featured, true);
        let synced = 0;
        let skipped = 0;

        for (const rawItem of rawItems) {
          const item = normalizeGoogleImportItem(rawItem, defaultFeatured);
          if (!item) {
            skipped += 1;
            continue;
          }

          await sql`
            INSERT INTO testimonials (
              name, company, role, quote, rating, image_url, featured, source, external_id, external_url, published_at, last_synced_at
            )
            VALUES (
              ${item.name},
              ${item.company},
              ${item.role},
              ${item.quote},
              ${item.rating},
              ${item.imageUrl},
              ${item.featured},
              'google',
              ${item.externalId},
              ${item.externalUrl},
              ${item.publishedAt},
              NOW()
            )
            ON CONFLICT (source, external_id)
            DO UPDATE SET
              name = EXCLUDED.name,
              company = EXCLUDED.company,
              role = EXCLUDED.role,
              quote = EXCLUDED.quote,
              rating = EXCLUDED.rating,
              image_url = EXCLUDED.image_url,
              featured = EXCLUDED.featured,
              external_url = EXCLUDED.external_url,
              published_at = EXCLUDED.published_at,
              last_synced_at = NOW()
          `;

          synced += 1;
        }

        return res.status(200).json({
          success: true,
          mode: 'google-import',
          received: rawItems.length,
          synced,
          skipped
        });
      }

      const name = normalizeText(payload.name);
      const quote = normalizeText(payload.quote);

      if (!name || !quote) {
        return res.status(400).send('Name and quote are required');
      }

      const company = normalizeText(payload.company);
      const role = normalizeText(payload.role);
      const imageUrl = normalizeText(payload.image_url);

      const sourceInput =
        typeof payload.source === 'string' ? payload.source.trim().toLowerCase() : 'manual';
      const source = sourceInput === 'google' ? 'google' : 'manual';

      const rating = parseRating(payload.rating, 5);

      const featured =
        typeof payload.featured === 'boolean'
          ? payload.featured
          : true;

      const inserted = await sql`
        INSERT INTO testimonials (name, company, role, quote, rating, image_url, featured, source, last_synced_at)
        VALUES (${name}, ${company}, ${role}, ${quote}, ${rating}, ${imageUrl}, ${featured}, ${source}, NOW())
        RETURNING id, name, company, role, quote, rating, image_url, featured, source, external_id, external_url, published_at, last_synced_at, created_at
      `;

      return res.status(201).json({
        success: true,
        item: inserted[0]
      });
    }

    return res.status(405).send('Method not allowed');
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown testimonials error';

    return res.status(500).send(`Testimonials request failed: ${message}`);
  }
}
