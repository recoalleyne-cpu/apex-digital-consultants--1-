import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { INITIAL_CASE_STUDIES } from '../src/constants/caseStudiesSeed';

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
  return clamp(parsed, 1, 30);
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

const parseDelimitedField = (value: unknown) => {
  if (Array.isArray(value)) {
    const tokens = value
      .map((entry) => parseText(entry))
      .filter((entry): entry is string => Boolean(entry));
    return tokens.length ? tokens.join(', ') : null;
  }

  const raw = parseText(value);
  if (!raw) return null;

  const tokens = raw
    .split(/\r?\n|,/g)
    .map((entry) => entry.trim())
    .filter(Boolean);

  return tokens.length ? tokens.join(', ') : null;
};

type CaseStudiesQueryOptions = {
  slug: string | null;
  includeDrafts: boolean;
  featuredOnly: boolean;
  limit: number;
};

const FALLBACK_CASE_STUDIES = INITIAL_CASE_STUDIES.map((item, index) => ({
  id: index + 1,
  title: item.title,
  slug: item.slug,
  client_name: item.client_name,
  summary: item.summary,
  challenge: item.challenge,
  solution: item.solution,
  results: item.results,
  services_provided: parseDelimitedField(item.services_provided),
  featured_image_url: parseText(item.featured_image_url),
  gallery_images: parseDelimitedField(item.gallery_images),
  tech_stack: parseDelimitedField(item.tech_stack),
  cta_text: parseText(item.cta_text),
  cta_link: parseText(item.cta_link),
  is_featured: parseBoolean(item.is_featured, false),
  is_published: parseBoolean(item.is_published, true),
  created_at: null,
  updated_at: null
}));

const queryFallbackCaseStudies = ({
  slug,
  includeDrafts,
  featuredOnly,
  limit
}: CaseStudiesQueryOptions) => {
  const source = includeDrafts
    ? FALLBACK_CASE_STUDIES
    : FALLBACK_CASE_STUDIES.filter((item) => item.is_published);

  if (slug) {
    const normalizedSlug = slug.trim().toLowerCase();
    return (
      source.find((item) => item.slug.toLowerCase() === normalizedSlug) || null
    );
  }

  const filtered = featuredOnly
    ? source.filter((item) => item.is_featured)
    : source;

  return filtered.slice(0, limit);
};

const respondWithFallbackCaseStudies = (
  res: VercelResponse,
  query: CaseStudiesQueryOptions,
  reason: string
) => {
  console.warn(
    `[api/case-studies] Serving approved fallback case studies. Reason: ${reason}`
  );

  const fallback = queryFallbackCaseStudies(query);

  if (query.slug) {
    if (!fallback) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found'
      });
    }

    return res.status(200).json({
      success: true,
      item: fallback
    });
  }

  return res.status(200).json({
    success: true,
    items: fallback
  });
};

const ensureCaseStudiesTable = async (sql: ReturnType<typeof neon>) => {
  await sql`
    CREATE TABLE IF NOT EXISTS case_studies (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      client_name TEXT,
      summary TEXT,
      challenge TEXT,
      solution TEXT,
      results TEXT,
      services_provided TEXT,
      featured_image_url TEXT,
      gallery_images TEXT,
      tech_stack TEXT,
      cta_text TEXT,
      cta_link TEXT,
      is_featured BOOLEAN DEFAULT FALSE,
      is_published BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE case_studies
    ADD COLUMN IF NOT EXISTS services_provided TEXT
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS case_studies_slug_idx
    ON case_studies (slug)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS case_studies_publish_idx
    ON case_studies (is_published, is_featured, updated_at DESC)
  `;
};

const ensureInitialCaseStudies = async (sql: ReturnType<typeof neon>) => {
  const countRows = await sql`
    SELECT COUNT(*)::int AS total
    FROM case_studies
  `;

  const rawTotal = countRows[0]?.total;
  const total =
    typeof rawTotal === 'number'
      ? rawTotal
      : Number.parseInt(String(rawTotal ?? '0'), 10);

  if (Number.isFinite(total) && total > 0) {
    return;
  }

  for (const item of INITIAL_CASE_STUDIES) {
    await sql`
      INSERT INTO case_studies (
        title,
        slug,
        client_name,
        summary,
        challenge,
        solution,
        results,
        services_provided,
        featured_image_url,
        gallery_images,
        tech_stack,
        cta_text,
        cta_link,
        is_featured,
        is_published
      )
      VALUES (
        ${item.title},
        ${item.slug},
        ${item.client_name},
        ${item.summary},
        ${item.challenge},
        ${item.solution},
        ${item.results},
        ${item.services_provided},
        ${item.featured_image_url},
        ${item.gallery_images},
        ${item.tech_stack},
        ${item.cta_text},
        ${item.cta_link},
        ${item.is_featured},
        ${item.is_published}
      )
      ON CONFLICT (slug) DO NOTHING
    `;
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
    }

    const slug = parseText(req.query.slug);
    const includeDrafts = parseBoolean(req.query.include_drafts, false);
    const featuredOnly = parseBoolean(req.query.featured, false);
    const limit = parseLimit(req.query.limit, 12);
    const queryOptions: CaseStudiesQueryOptions = {
      slug,
      includeDrafts,
      featuredOnly,
      limit
    };

    const postgresUrl = process.env.POSTGRES_URL;

    if (!postgresUrl) {
      if (req.method === 'POST') {
        return res.status(500).send('Missing POSTGRES_URL environment variable');
      }

      return respondWithFallbackCaseStudies(
        res,
        queryOptions,
        'POSTGRES_URL environment variable is missing'
      );
    }

    const sql = neon(postgresUrl);

    if (req.method === 'POST') {
      await ensureCaseStudiesTable(sql);

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
      const summary = parseText(payload.summary);
      const rawSlug = parseText(payload.slug);
      const slug = rawSlug ? slugify(rawSlug) : title ? slugify(title) : null;

      if (!title || !slug) {
        return res.status(400).send('Title and a valid slug are required');
      }

      const clientName = parseText(payload.client_name);
      const challenge = parseText(payload.challenge);
      const solution = parseText(payload.solution);
      const results = parseText(payload.results);
      const servicesProvided = parseDelimitedField(payload.services_provided);
      const featuredImageUrl = parseText(payload.featured_image_url);
      const galleryImages = parseDelimitedField(payload.gallery_images);
      const techStack = parseDelimitedField(payload.tech_stack);
      const ctaText = parseText(payload.cta_text);
      const ctaLink = parseText(payload.cta_link);
      const isFeatured = parseBoolean(payload.is_featured, false);
      const isPublished = parseBoolean(payload.is_published, true);

      try {
        const inserted = await sql`
          INSERT INTO case_studies (
            title,
            slug,
            client_name,
            summary,
            challenge,
            solution,
            results,
            services_provided,
            featured_image_url,
            gallery_images,
            tech_stack,
            cta_text,
            cta_link,
            is_featured,
            is_published
          )
          VALUES (
            ${title},
            ${slug},
            ${clientName},
            ${summary},
            ${challenge},
            ${solution},
            ${results},
            ${servicesProvided},
            ${featuredImageUrl},
            ${galleryImages},
            ${techStack},
            ${ctaText},
            ${ctaLink},
            ${isFeatured},
            ${isPublished}
          )
          RETURNING
            id,
            title,
            slug,
            client_name,
            summary,
            challenge,
            solution,
            results,
            services_provided,
            featured_image_url,
            gallery_images,
            tech_stack,
            cta_text,
            cta_link,
            is_featured,
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

    try {
      await ensureCaseStudiesTable(sql);
      await ensureInitialCaseStudies(sql);

      if (slug) {
        const rows = includeDrafts
          ? await sql`
              SELECT
                id,
                title,
                slug,
                client_name,
                summary,
                challenge,
                solution,
                results,
                services_provided,
                featured_image_url,
                gallery_images,
                tech_stack,
                cta_text,
                cta_link,
                is_featured,
                is_published,
                created_at,
                updated_at
              FROM case_studies
              WHERE slug = ${slug}
              LIMIT 1
            `
          : await sql`
              SELECT
                id,
                title,
                slug,
                client_name,
                summary,
                challenge,
                solution,
                results,
                services_provided,
                featured_image_url,
                gallery_images,
                tech_stack,
                cta_text,
                cta_link,
                is_featured,
                is_published,
                created_at,
                updated_at
              FROM case_studies
              WHERE slug = ${slug}
                AND is_published = TRUE
              LIMIT 1
            `;

        if (!rows.length) {
          return res.status(404).json({
            success: false,
            message: 'Case study not found'
          });
        }

        return res.status(200).json({
          success: true,
          item: rows[0]
        });
      }

      let rows;

      if (includeDrafts && featuredOnly) {
        rows = await sql`
          SELECT
            id,
            title,
            slug,
            client_name,
            summary,
            services_provided,
            featured_image_url,
            tech_stack,
            cta_text,
            cta_link,
            is_featured,
            is_published,
            created_at,
            updated_at
          FROM case_studies
          WHERE is_featured = TRUE
          ORDER BY updated_at DESC
          LIMIT ${limit}
        `;
      } else if (includeDrafts) {
        rows = await sql`
          SELECT
            id,
            title,
            slug,
            client_name,
            summary,
            services_provided,
            featured_image_url,
            tech_stack,
            cta_text,
            cta_link,
            is_featured,
            is_published,
            created_at,
            updated_at
          FROM case_studies
          ORDER BY is_featured DESC, updated_at DESC
          LIMIT ${limit}
        `;
      } else if (featuredOnly) {
        rows = await sql`
          SELECT
            id,
            title,
            slug,
            client_name,
            summary,
            services_provided,
            featured_image_url,
            tech_stack,
            cta_text,
            cta_link,
            is_featured,
            is_published,
            created_at,
            updated_at
          FROM case_studies
          WHERE is_featured = TRUE
            AND is_published = TRUE
          ORDER BY updated_at DESC
          LIMIT ${limit}
        `;
      } else {
        rows = await sql`
          SELECT
            id,
            title,
            slug,
            client_name,
            summary,
            services_provided,
            featured_image_url,
            tech_stack,
            cta_text,
            cta_link,
            is_featured,
            is_published,
            created_at,
            updated_at
          FROM case_studies
          WHERE is_published = TRUE
          ORDER BY is_featured DESC, updated_at DESC
          LIMIT ${limit}
        `;
      }

      return res.status(200).json({
        success: true,
        items: rows
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown case studies database error';

      console.error(
        '[api/case-studies] Database read failed, returning approved fallback case studies.',
        {
          message,
          slug,
          includeDrafts,
          featuredOnly,
          limit
        }
      );

      return respondWithFallbackCaseStudies(res, queryOptions, message);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown case studies fetch error';
    console.error(`[api/case-studies] Unhandled error: ${message}`);
    return res.status(500).send(`Case studies fetch failed: ${message}`);
  }
}
