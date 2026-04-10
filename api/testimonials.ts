import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { requireAdminAccess } from '../server/api-shared/adminAuth.js';
import { getSqlClient, isNeonConfigured } from '../server/api-shared/neonDb.js';

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

const parseMaxReviews = (value: unknown, fallback = 10) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return clamp(Math.floor(value), 1, 20);
  }

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value.trim(), 10);
    if (Number.isFinite(parsed)) {
      return clamp(parsed, 1, 20);
    }
  }

  return clamp(fallback, 1, 20);
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

const SYSTEM_GOOGLE_REVIEW_SEED_ITEMS = [
  {
    review_id: 'google-review-anna-evelyn-2022-09-29',
    reviewer_name: 'Anna Evelyn',
    review_text:
      'Always was super friendly and professional!\nMade my dreams into a reality for my new website!\nI recommend them 10/10.',
    rating: 5,
    company: 'Google Review',
    featured: true,
    published_at: '2022-09-29T00:00:00Z'
  }
];

let hasSeededSystemGoogleReview = false;

const buildFallbackTestimonials = (featuredOnly: boolean, limit: number) => {
  const rows = SYSTEM_GOOGLE_REVIEW_SEED_ITEMS.map((item, index) => ({
    id: -(index + 1),
    name: item.reviewer_name,
    company: item.company,
    role: null,
    quote: item.review_text,
    rating: item.rating,
    image_url: null,
    featured: item.featured,
    source: 'google',
    external_id: item.review_id,
    external_url: null,
    published_at: item.published_at,
    last_synced_at: null,
    created_at: item.published_at
  }));

  const filtered = featuredOnly ? rows.filter((row) => row.featured) : rows;
  return filtered.slice(0, limit);
};

const normalizeGoogleImportItem = (
  value: unknown,
  defaultFeatured: boolean,
  defaultCompany?: string | null
): GoogleImportItem | null => {
  const item = toObject(value);
  if (!item) return null;

  const author = toObject(item.authorAttribution);
  const textObject = toObject(item.text);
  const originalTextObject = toObject(item.originalText);

  const name = pickFirstText(
    item.reviewer_name,
    item.reviewerName,
    item.author_name,
    item.authorName,
    author?.displayName
  );

  const timeFingerprint = pickFirstText(
    typeof item.time === 'number' ? String(item.time) : item.time,
    item.publishTime,
    item.published_at,
    item.publishedAt
  );

  const externalId = pickFirstText(
    item.review_id,
    item.reviewId,
    item.external_id,
    item.externalId,
    item.id,
    item.name,
    name && timeFingerprint ? `${name}-${timeFingerprint}` : null
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
    company: pickFirstText(item.company, item.business, defaultCompany),
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

const syncGoogleImportItems = async (
  sql: ReturnType<typeof neon>,
  rawItems: unknown[],
  defaultFeatured: boolean,
  defaultCompany: string | null = null
) => {
  let synced = 0;
  let skipped = 0;

  for (const rawItem of rawItems) {
    const item = normalizeGoogleImportItem(rawItem, defaultFeatured, defaultCompany);
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

  return { synced, skipped };
};

const ensureSystemGoogleReviewSeed = async (sql: ReturnType<typeof neon>) => {
  if (hasSeededSystemGoogleReview) return;
  await syncGoogleImportItems(sql, SYSTEM_GOOGLE_REVIEW_SEED_ITEMS, true);
  hasSeededSystemGoogleReview = true;
};

const fetchGooglePlaceReviews = async (placeId: string, maxReviews: number) => {
  const apiKey =
    normalizeText(process.env.GOOGLE_MAPS_API_KEY) ||
    normalizeText(process.env.GOOGLE_PLACES_API_KEY);

  if (!apiKey) {
    throw new Error('Missing GOOGLE_MAPS_API_KEY or GOOGLE_PLACES_API_KEY environment variable');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`,
      {
        method: 'GET',
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'id,displayName,reviews'
        },
        signal: controller.signal
      }
    );

    const text = await response.text();
    let payload: Record<string, unknown> | null = null;
    try {
      payload = JSON.parse(text) as Record<string, unknown>;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const apiError = payload ? toObject(payload.error) : null;
      const message =
        pickFirstText(apiError?.message, text) ||
        `Google Places request failed (${response.status})`;
      throw new Error(message);
    }

    const displayNameObject = payload ? toObject(payload.displayName) : null;
    const businessName = pickFirstText(displayNameObject?.text, payload?.displayName);
    const reviews = payload && Array.isArray(payload.reviews) ? payload.reviews : [];

    return {
      businessName,
      items: reviews.slice(0, maxReviews)
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Google Places request timed out');
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
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
    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
    }

    const featuredOnly = parseFeaturedFlag(req.query.featured);
    const limit = parseLimit(req.query.limit);

    if (!isNeonConfigured()) {
      if (req.method === 'POST') {
        return res.status(500).send('Missing DATABASE_URL (or POSTGRES_URL) environment variable');
      }

      return res.status(200).json({
        success: true,
        items: buildFallbackTestimonials(featuredOnly, limit),
        data_mode: 'seed-fallback',
        warning: 'DATABASE_URL / POSTGRES_URL is missing. Serving fallback testimonials.'
      });
    }

    const sql = getSqlClient();
    await ensureTestimonialsTable(sql);
    await ensureSystemGoogleReviewSeed(sql);

    if (req.method === 'GET') {
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
      if (!(await requireAdminAccess(req, res))) {
        return;
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

        const defaultFeatured = parseBoolean(payload.featured, false);
        const { synced, skipped } = await syncGoogleImportItems(
          sql,
          rawItems,
          defaultFeatured
        );

        return res.status(200).json({
          success: true,
          mode: 'google-import',
          received: rawItems.length,
          synced,
          skipped
        });
      }

      if (importMode === 'google-place-sync') {
        const placeId = pickFirstText(payload.place_id, payload.placeId);
        if (!placeId) {
          return res.status(400).send('Google Place sync requires place_id');
        }

        const maxReviews = parseMaxReviews(
          payload.max_reviews ?? payload.maxReviews,
          10
        );
        const defaultFeatured = parseBoolean(payload.featured, false);

        const fetched = await fetchGooglePlaceReviews(placeId, maxReviews);
        const { synced, skipped } = await syncGoogleImportItems(
          sql,
          fetched.items,
          defaultFeatured,
          fetched.businessName
        );

        return res.status(200).json({
          success: true,
          mode: 'google-place-sync',
          place_id: placeId,
          business_name: fetched.businessName,
          received: fetched.items.length,
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

    if (req.method === 'GET') {
      const featuredOnly = parseFeaturedFlag(req.query.featured);
      const limit = parseLimit(req.query.limit);
      return res.status(200).json({
        success: true,
        items: buildFallbackTestimonials(featuredOnly, limit),
        data_mode: 'runtime-fallback',
        warning: `Testimonials query failed (${message}). Serving fallback testimonials.`
      });
    }

    return res.status(500).send(`Testimonials request failed: ${message}`);
  }
}
