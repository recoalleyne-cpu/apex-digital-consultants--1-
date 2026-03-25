import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { requireAdminAccess } from '../server/api-shared/adminAuth';
import { getSqlClient, isNeonConfigured } from '../server/api-shared/neonDb';

export const config = {
  runtime: 'nodejs'
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const parseLimit = (value: unknown, fallback = 9) => {
  if (typeof value !== 'string') return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return clamp(parsed, 1, 24);
};

const parseBoolean = (value: unknown, fallback = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
    return true;
  }
  if (normalized === 'false' || normalized === '0' || normalized === 'no') {
    return false;
  }
  return fallback;
};

const parseText = (value: unknown) => {
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

const parseDate = (value: unknown): Date | null => {
  if (value instanceof Date && Number.isFinite(value.getTime())) {
    return value;
  }
  if (typeof value !== 'string' && typeof value !== 'number') return null;

  const raw = String(value).trim();
  if (!raw) return null;

  if (/^\d+$/.test(raw)) {
    const numeric = Number.parseInt(raw, 10);
    if (Number.isFinite(numeric)) {
      const date = new Date(numeric > 1_000_000_000_000 ? numeric : numeric * 1000);
      return Number.isFinite(date.getTime()) ? date : null;
    }
  }

  const date = new Date(raw);
  return Number.isFinite(date.getTime()) ? date : null;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const ensureBlogPostsTable = async (sql: ReturnType<typeof neon>) => {
  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      body_content TEXT NOT NULL,
      featured_image_url TEXT,
      category TEXT,
      author_name TEXT,
      publish_date TIMESTAMP,
      is_published BOOLEAN DEFAULT FALSE,
      seo_title TEXT,
      seo_description TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS blog_posts_slug_idx
    ON blog_posts (slug)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS blog_posts_publish_idx
    ON blog_posts (is_published, publish_date DESC)
  `;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
    }

    if (!isNeonConfigured()) {
      if (req.method === 'POST') {
        return res.status(500).send('Missing DATABASE_URL (or POSTGRES_URL) environment variable');
      }

      const slug = parseText(req.query.slug);
      if (slug) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }

      return res.status(200).json({
        success: true,
        items: [],
        data_mode: 'empty-fallback',
        warning: 'DATABASE_URL / POSTGRES_URL is missing. Returning empty blog list.'
      });
    }

    const sql = getSqlClient();
    await ensureBlogPostsTable(sql);

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

      const title = parseText(payload.title);
      const bodyContent = parseText(payload.body_content);
      const rawSlug = parseText(payload.slug);
      const slug = rawSlug ? slugify(rawSlug) : title ? slugify(title) : null;

      if (!title || !bodyContent || !slug) {
        return res.status(400).send('Title, body_content, and a valid slug are required');
      }

      const excerpt = parseText(payload.excerpt);
      const featuredImageUrl = parseText(payload.featured_image_url);
      const category = parseText(payload.category);
      const authorName = parseText(payload.author_name);
      const seoTitle = parseText(payload.seo_title);
      const seoDescription = parseText(payload.seo_description);
      const publishDate = parseDate(payload.publish_date);
      const isPublished = parseBoolean(payload.is_published, false);

      try {
        const inserted = await sql`
          INSERT INTO blog_posts (
            title,
            slug,
            excerpt,
            body_content,
            featured_image_url,
            category,
            author_name,
            publish_date,
            is_published,
            seo_title,
            seo_description
          )
          VALUES (
            ${title},
            ${slug},
            ${excerpt},
            ${bodyContent},
            ${featuredImageUrl},
            ${category},
            ${authorName},
            ${publishDate},
            ${isPublished},
            ${seoTitle},
            ${seoDescription}
          )
          RETURNING
            id,
            title,
            slug,
            excerpt,
            body_content,
            featured_image_url,
            category,
            author_name,
            publish_date,
            is_published,
            seo_title,
            seo_description,
            created_at,
            updated_at
        `;

        return res.status(201).json({
          success: true,
          item: inserted[0]
        });
      } catch (error) {
        const dbCode = (error as { code?: string } | null)?.code;
        if (dbCode === '23505') {
          return res.status(409).send('Slug already exists. Please choose a unique slug.');
        }
        throw error;
      }
    }

    if (req.method === 'GET') {
      const slug = parseText(req.query.slug);
      const category = parseText(req.query.category);
      const includeDrafts = parseBoolean(req.query.include_drafts, false);
      const limit = parseLimit(req.query.limit, 9);

      if (includeDrafts && !(await requireAdminAccess(req, res))) {
        return;
      }

      if (slug) {
        const rows = includeDrafts
          ? await sql`
              SELECT
                id,
                title,
                slug,
                excerpt,
                body_content,
                featured_image_url,
                category,
                author_name,
                publish_date,
                is_published,
                seo_title,
                seo_description,
                created_at,
                updated_at
              FROM blog_posts
              WHERE slug = ${slug}
              LIMIT 1
            `
          : await sql`
              SELECT
                id,
                title,
                slug,
                excerpt,
                body_content,
                featured_image_url,
                category,
                author_name,
                publish_date,
                is_published,
                seo_title,
                seo_description,
                created_at,
                updated_at
              FROM blog_posts
              WHERE slug = ${slug}
                AND is_published = TRUE
                AND (publish_date IS NULL OR publish_date <= NOW())
              LIMIT 1
            `;

        const rowList = Array.isArray(rows) ? rows : [];

        if (!rowList.length) {
          return res.status(404).json({
            success: false,
            message: 'Blog post not found'
          });
        }

        return res.status(200).json({
          success: true,
          item: rowList[0]
        });
      }

      let rows;

      if (includeDrafts && category) {
        rows = await sql`
          SELECT
            id,
            title,
            slug,
            excerpt,
            featured_image_url,
            category,
            author_name,
            publish_date,
            is_published,
            created_at
          FROM blog_posts
          WHERE category = ${category}
          ORDER BY COALESCE(publish_date, created_at) DESC
          LIMIT ${limit}
        `;
      } else if (includeDrafts) {
        rows = await sql`
          SELECT
            id,
            title,
            slug,
            excerpt,
            featured_image_url,
            category,
            author_name,
            publish_date,
            is_published,
            created_at
          FROM blog_posts
          ORDER BY COALESCE(publish_date, created_at) DESC
          LIMIT ${limit}
        `;
      } else if (category) {
        rows = await sql`
          SELECT
            id,
            title,
            slug,
            excerpt,
            featured_image_url,
            category,
            author_name,
            publish_date,
            is_published,
            created_at
          FROM blog_posts
          WHERE category = ${category}
            AND is_published = TRUE
            AND (publish_date IS NULL OR publish_date <= NOW())
          ORDER BY COALESCE(publish_date, created_at) DESC
          LIMIT ${limit}
        `;
      } else {
        rows = await sql`
          SELECT
            id,
            title,
            slug,
            excerpt,
            featured_image_url,
            category,
            author_name,
            publish_date,
            is_published,
            created_at
          FROM blog_posts
          WHERE is_published = TRUE
            AND (publish_date IS NULL OR publish_date <= NOW())
          ORDER BY COALESCE(publish_date, created_at) DESC
          LIMIT ${limit}
        `;
      }

      return res.status(200).json({
        success: true,
        items: rows
      });
    }

    return res.status(405).send('Method not allowed');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown blog fetch error';

    if (req.method === 'GET') {
      const slug = parseText(req.query.slug);
      if (slug) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }

      return res.status(200).json({
        success: true,
        items: [],
        data_mode: 'runtime-fallback',
        warning: `Blog query failed (${message}). Returning empty blog list.`
      });
    }

    return res.status(500).send(`Blog fetch failed: ${message}`);
  }
}
