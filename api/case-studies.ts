import type { VercelRequest, VercelResponse } from '@vercel/node';
import { INITIAL_CASE_STUDIES } from '../server/api-shared/caseStudiesSeed';
import { requireAdminAccess } from '../server/api-shared/adminAuth';
import {
  createCaseStudy,
  ensureCoreContentReady,
  fetchCaseStudies,
  fetchCaseStudyBySlug
} from '../server/api-shared/contentRepository';
import { getSqlClient, isNeonConfigured } from '../server/api-shared/neonDb';

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

const parseBoolean = (value: unknown, fallback = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  return fallback;
};

const parseLimit = (value: unknown, fallback = 12) => {
  if (typeof value !== 'string') return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return clamp(parsed, 1, 30);
};

const parseDelimitedField = (value: unknown) => {
  if (Array.isArray(value)) {
    const entries = value
      .map((entry) => parseText(entry))
      .filter((entry): entry is string => Boolean(entry));
    return entries.length ? entries.join(', ') : null;
  }

  const raw = parseText(value);
  if (!raw) return null;
  const entries = raw
    .split(/\r?\n|,/g)
    .map((entry) => entry.trim())
    .filter(Boolean);

  return entries.length ? entries.join(', ') : null;
};

const toObject = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
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
  services_provided: item.services_provided,
  featured_image_url: item.featured_image_url,
  gallery_images: item.gallery_images,
  tech_stack: item.tech_stack,
  cta_text: item.cta_text,
  cta_link: item.cta_link,
  is_featured: item.is_featured,
  is_published: item.is_published,
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
    return source.find((item) => item.slug.toLowerCase() === normalizedSlug) || null;
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

    if (!isNeonConfigured()) {
      if (req.method === 'POST') {
        return res
          .status(500)
          .send('Missing DATABASE_URL (or POSTGRES_URL) environment variable');
      }

      return respondWithFallbackCaseStudies(
        res,
        queryOptions,
        'DATABASE_URL / POSTGRES_URL environment variable is missing'
      );
    }

    const sql = getSqlClient();
    await ensureCoreContentReady(sql);

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
      const rawSlug = parseText(payload.slug);
      const normalizedSlug = rawSlug ? slugify(rawSlug) : title ? slugify(title) : null;

      if (!title || !normalizedSlug) {
        return res.status(400).send('Title and a valid slug are required');
      }

      try {
        const inserted = await createCaseStudy(sql, {
          title,
          slug: normalizedSlug,
          client_name: parseText(payload.client_name),
          summary: parseText(payload.summary),
          challenge: parseText(payload.challenge),
          solution: parseText(payload.solution),
          results: parseText(payload.results),
          services_provided: parseDelimitedField(payload.services_provided),
          featured_image_url: parseText(payload.featured_image_url),
          gallery_images: parseDelimitedField(payload.gallery_images),
          tech_stack: parseDelimitedField(payload.tech_stack),
          cta_text: parseText(payload.cta_text),
          cta_link: parseText(payload.cta_link),
          is_featured: parseBoolean(payload.is_featured, false),
          is_published: parseBoolean(payload.is_published, true)
        });

        return res.status(201).json({
          success: true,
          item: inserted
        });
      } catch (error) {
        const dbCode = (error as { code?: string } | null)?.code;
        if (dbCode === '23505') {
          return res.status(409).send('Slug already exists. Please choose a unique slug.');
        }
        throw error;
      }
    }

    if (includeDrafts && !(await requireAdminAccess(req, res))) {
      return;
    }

    if (slug) {
      const item = await fetchCaseStudyBySlug(sql, slug, includeDrafts);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Case study not found'
        });
      }

      return res.status(200).json({
        success: true,
        item
      });
    }

    const items = await fetchCaseStudies(sql, {
      includeDrafts,
      featuredOnly,
      limit
    });

    return res.status(200).json({
      success: true,
      items
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown case studies request error';
    console.error('[api/case-studies] Error:', message);

    if (req.method === 'GET') {
      const fallbackOptions: CaseStudiesQueryOptions = {
        slug: parseText(req.query.slug),
        includeDrafts: parseBoolean(req.query.include_drafts, false),
        featuredOnly: parseBoolean(req.query.featured, false),
        limit: parseLimit(req.query.limit, 12)
      };
      return respondWithFallbackCaseStudies(res, fallbackOptions, message);
    }

    return res.status(500).send(`Case studies request failed: ${message}`);
  }
}
