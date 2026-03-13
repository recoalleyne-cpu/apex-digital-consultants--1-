import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

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
    if (req.method !== 'GET') {
      return res.status(405).send('Method not allowed');
    }

    const postgresUrl = process.env.POSTGRES_URL;

    if (!postgresUrl) {
      return res.status(500).send('Missing POSTGRES_URL environment variable');
    }

    const sql = neon(postgresUrl);
    await ensureBlogPostsTable(sql);

    const slug = parseText(req.query.slug);
    const category = parseText(req.query.category);
    const includeDrafts = parseBoolean(req.query.include_drafts, false);
    const limit = parseLimit(req.query.limit, 9);

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

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }

      return res.status(200).json({
        success: true,
        item: rows[0]
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown blog fetch error';
    return res.status(500).send(`Blog fetch failed: ${message}`);
  }
}
