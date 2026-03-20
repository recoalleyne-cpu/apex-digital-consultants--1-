import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { requireAdminAccess } from './_utils/adminAuth';

export const config = {
  runtime: 'nodejs'
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const parseText = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const parseLimit = (value: unknown, fallback = 12) => {
  if (typeof value !== 'string') return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return clamp(parsed, 1, 36);
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

const toObject = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const ensureLandingPagesTable = async (sql: ReturnType<typeof neon>) => {
  await sql`
    CREATE TABLE IF NOT EXISTS landing_pages (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      hero_heading TEXT,
      hero_subheading TEXT,
      body_content TEXT NOT NULL,
      featured_image_url TEXT,
      cta_text TEXT,
      cta_link TEXT,
      seo_title TEXT,
      seo_description TEXT,
      region TEXT,
      service_category TEXT,
      is_published BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS landing_pages_slug_idx
    ON landing_pages (slug)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS landing_pages_publish_idx
    ON landing_pages (is_published, updated_at DESC)
  `;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
    }

    const postgresUrl = process.env.POSTGRES_URL;

    if (!postgresUrl) {
      return res.status(500).send('Missing POSTGRES_URL environment variable');
    }

    const sql = neon(postgresUrl);
    await ensureLandingPagesTable(sql);

    if (req.method === 'POST') {
      if (!requireAdminAccess(req, res)) {
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

      const heroHeading = parseText(payload.hero_heading);
      const heroSubheading = parseText(payload.hero_subheading);
      const featuredImageUrl = parseText(payload.featured_image_url);
      const ctaText = parseText(payload.cta_text);
      const ctaLink = parseText(payload.cta_link);
      const seoTitle = parseText(payload.seo_title);
      const seoDescription = parseText(payload.seo_description);
      const region = parseText(payload.region);
      const serviceCategory = parseText(payload.service_category);
      const isPublished = parseBoolean(payload.is_published, true);

      try {
        const inserted = await sql`
          INSERT INTO landing_pages (
            title,
            slug,
            hero_heading,
            hero_subheading,
            body_content,
            featured_image_url,
            cta_text,
            cta_link,
            seo_title,
            seo_description,
            region,
            service_category,
            is_published
          )
          VALUES (
            ${title},
            ${slug},
            ${heroHeading},
            ${heroSubheading},
            ${bodyContent},
            ${featuredImageUrl},
            ${ctaText},
            ${ctaLink},
            ${seoTitle},
            ${seoDescription},
            ${region},
            ${serviceCategory},
            ${isPublished}
          )
          RETURNING
            id,
            title,
            slug,
            hero_heading,
            hero_subheading,
            body_content,
            featured_image_url,
            cta_text,
            cta_link,
            seo_title,
            seo_description,
            region,
            service_category,
            is_published,
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

    const slug = parseText(req.query.slug);
    const region = parseText(req.query.region);
    const serviceCategory = parseText(req.query.service_category);
    const includeDrafts = parseBoolean(req.query.include_drafts, false);
    const limit = parseLimit(req.query.limit, 12);

    if (includeDrafts && !requireAdminAccess(req, res)) {
      return;
    }

    if (slug) {
      const rows = includeDrafts
        ? await sql`
            SELECT
              id,
              title,
              slug,
              hero_heading,
              hero_subheading,
              body_content,
              featured_image_url,
              cta_text,
              cta_link,
              seo_title,
              seo_description,
              region,
              service_category,
              is_published,
              created_at,
              updated_at
            FROM landing_pages
            WHERE slug = ${slug}
            LIMIT 1
          `
        : await sql`
            SELECT
              id,
              title,
              slug,
              hero_heading,
              hero_subheading,
              body_content,
              featured_image_url,
              cta_text,
              cta_link,
              seo_title,
              seo_description,
              region,
              service_category,
              is_published,
              created_at,
              updated_at
            FROM landing_pages
            WHERE slug = ${slug}
              AND is_published = TRUE
            LIMIT 1
          `;

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: 'Landing page not found'
        });
      }

      return res.status(200).json({
        success: true,
        item: rows[0]
      });
    }

    let rows;

    if (includeDrafts && region && serviceCategory) {
      rows = await sql`
        SELECT
          id,
          title,
          slug,
          hero_heading,
          hero_subheading,
          featured_image_url,
          cta_text,
          cta_link,
          seo_title,
          seo_description,
          region,
          service_category,
          is_published,
          created_at,
          updated_at
        FROM landing_pages
        WHERE region = ${region}
          AND service_category = ${serviceCategory}
        ORDER BY updated_at DESC
        LIMIT ${limit}
      `;
    } else if (includeDrafts && region) {
      rows = await sql`
        SELECT
          id,
          title,
          slug,
          hero_heading,
          hero_subheading,
          featured_image_url,
          cta_text,
          cta_link,
          seo_title,
          seo_description,
          region,
          service_category,
          is_published,
          created_at,
          updated_at
        FROM landing_pages
        WHERE region = ${region}
        ORDER BY updated_at DESC
        LIMIT ${limit}
      `;
    } else if (includeDrafts && serviceCategory) {
      rows = await sql`
        SELECT
          id,
          title,
          slug,
          hero_heading,
          hero_subheading,
          featured_image_url,
          cta_text,
          cta_link,
          seo_title,
          seo_description,
          region,
          service_category,
          is_published,
          created_at,
          updated_at
        FROM landing_pages
        WHERE service_category = ${serviceCategory}
        ORDER BY updated_at DESC
        LIMIT ${limit}
      `;
    } else if (includeDrafts) {
      rows = await sql`
        SELECT
          id,
          title,
          slug,
          hero_heading,
          hero_subheading,
          featured_image_url,
          cta_text,
          cta_link,
          seo_title,
          seo_description,
          region,
          service_category,
          is_published,
          created_at,
          updated_at
        FROM landing_pages
        ORDER BY updated_at DESC
        LIMIT ${limit}
      `;
    } else if (region && serviceCategory) {
      rows = await sql`
        SELECT
          id,
          title,
          slug,
          hero_heading,
          hero_subheading,
          featured_image_url,
          cta_text,
          cta_link,
          seo_title,
          seo_description,
          region,
          service_category,
          is_published,
          created_at,
          updated_at
        FROM landing_pages
        WHERE is_published = TRUE
          AND region = ${region}
          AND service_category = ${serviceCategory}
        ORDER BY updated_at DESC
        LIMIT ${limit}
      `;
    } else if (region) {
      rows = await sql`
        SELECT
          id,
          title,
          slug,
          hero_heading,
          hero_subheading,
          featured_image_url,
          cta_text,
          cta_link,
          seo_title,
          seo_description,
          region,
          service_category,
          is_published,
          created_at,
          updated_at
        FROM landing_pages
        WHERE is_published = TRUE
          AND region = ${region}
        ORDER BY updated_at DESC
        LIMIT ${limit}
      `;
    } else if (serviceCategory) {
      rows = await sql`
        SELECT
          id,
          title,
          slug,
          hero_heading,
          hero_subheading,
          featured_image_url,
          cta_text,
          cta_link,
          seo_title,
          seo_description,
          region,
          service_category,
          is_published,
          created_at,
          updated_at
        FROM landing_pages
        WHERE is_published = TRUE
          AND service_category = ${serviceCategory}
        ORDER BY updated_at DESC
        LIMIT ${limit}
      `;
    } else {
      rows = await sql`
        SELECT
          id,
          title,
          slug,
          hero_heading,
          hero_subheading,
          featured_image_url,
          cta_text,
          cta_link,
          seo_title,
          seo_description,
          region,
          service_category,
          is_published,
          created_at,
          updated_at
        FROM landing_pages
        WHERE is_published = TRUE
        ORDER BY updated_at DESC
        LIMIT ${limit}
      `;
    }

    return res.status(200).json({
      success: true,
      items: rows
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown landing page fetch error';
    return res.status(500).send(`Landing pages fetch failed: ${message}`);
  }
}
