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
      created_at TIMESTAMP DEFAULT NOW()
    )
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
            SELECT id, name, company, role, quote, rating, image_url, featured, source, created_at
            FROM testimonials
            WHERE featured = TRUE
            ORDER BY created_at DESC
            LIMIT ${limit}
          `
        : await sql`
            SELECT id, name, company, role, quote, rating, image_url, featured, source, created_at
            FROM testimonials
            ORDER BY created_at DESC
            LIMIT ${limit}
          `;

      return res.status(200).json({
        success: true,
        items: rows
      });
    }

    if (req.method === 'POST') {
      const payload =
        typeof req.body === 'string'
          ? JSON.parse(req.body || '{}')
          : req.body || {};

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

      const rawRating =
        typeof payload.rating === 'number'
          ? payload.rating
          : Number.parseInt(String(payload.rating ?? ''), 10);
      const rating = Number.isFinite(rawRating) ? clamp(rawRating, 1, 5) : 5;

      const featured =
        typeof payload.featured === 'boolean'
          ? payload.featured
          : true;

      const inserted = await sql`
        INSERT INTO testimonials (name, company, role, quote, rating, image_url, featured, source)
        VALUES (${name}, ${company}, ${role}, ${quote}, ${rating}, ${imageUrl}, ${featured}, ${source})
        RETURNING id, name, company, role, quote, rating, image_url, featured, source, created_at
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

