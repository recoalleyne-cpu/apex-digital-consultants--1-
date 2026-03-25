import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  PORTFOLIO_SEED_ITEMS,
  ensureCoreContentReady,
  fetchPortfolioItems,
} from '../server/api-shared/contentRepository';
import { getSqlClient, isNeonConfigured } from '../server/api-shared/neonDb';

export const config = {
  runtime: 'nodejs'
};

type PortfolioMediaRow = {
  id: number;
  title?: string | null;
  file_url?: string | null;
  alt_text?: string | null;
  category?: string | null;
  placement?: string | null;
  created_at?: string | null;
};

type PortfolioRow = {
  id: number;
  slug: string;
  title: string;
  client_name?: string | null;
  short_description?: string | null;
  category?: string | null;
  services_provided?: string | null;
  thumbnail_url?: string | null;
  case_study_slug?: string | null;
  featured?: boolean;
  published?: boolean;
  display_order?: number;
  created_at?: string | null;
  updated_at?: string | null;
};

const normalizeMatchKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const buildFallbackPortfolioRows = (): PortfolioRow[] => {
  return PORTFOLIO_SEED_ITEMS.map((item, index) => ({
    id: -(index + 1),
    slug: item.slug,
    title: item.title,
    client_name: item.client_name,
    short_description: item.short_description,
    category: item.category,
    services_provided: item.services_provided,
    thumbnail_url: item.thumbnail_url,
    case_study_slug: item.case_study_slug,
    featured: item.featured,
    published: item.published,
    display_order: item.display_order,
    created_at: null,
    updated_at: null
  }));
};

const mergePortfolioItems = (portfolioRows: PortfolioRow[], mediaRows: PortfolioMediaRow[]) => {
  const usedMediaIds = new Set<number>();

  return portfolioRows.map((row) => {
    const candidates = new Set<string>(
      [row.title, row.client_name || '', row.slug]
        .map((value) => normalizeMatchKey(value))
        .filter(Boolean)
    );

    const matchedMedia = mediaRows.find((media) => {
      if (typeof media.id === 'number' && usedMediaIds.has(media.id)) return false;

      const mediaTitle =
        typeof media.title === 'string' ? normalizeMatchKey(media.title) : '';
      const mediaAltText =
        typeof media.alt_text === 'string' ? normalizeMatchKey(media.alt_text) : '';

      return candidates.has(mediaTitle) || candidates.has(mediaAltText);
    });

    if (matchedMedia && typeof matchedMedia.id === 'number') {
      usedMediaIds.add(matchedMedia.id);
    }

    return {
      id: matchedMedia?.id ?? row.id,
      title: row.title,
      client_name: row.client_name || row.title,
      file_url: matchedMedia?.file_url || row.thumbnail_url || '[Add Image]',
      alt_text: matchedMedia?.alt_text || row.client_name || row.title,
      category: matchedMedia?.category || 'portfolio',
      placement: matchedMedia?.placement || 'portfolio-grid',
      description: row.short_description || '',
      project_type: row.category || 'Website Design & Development',
      services_provided: row.services_provided || '',
      tech_stack: row.services_provided || '',
      features: row.services_provided || '',
      project_url: row.case_study_slug ? `/case-studies/${row.case_study_slug}` : '/case-studies',
      is_featured: Boolean(row.featured),
      display_order: row.display_order || 0,
      created_at: matchedMedia?.created_at || row.created_at || null
    };
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('Method not allowed');
    }

    if (!isNeonConfigured()) {
      const fallbackRows = buildFallbackPortfolioRows();
      return res.status(200).json({
        success: true,
        items: mergePortfolioItems(fallbackRows, []),
        data_mode: 'seed-fallback',
        warning: 'DATABASE_URL / POSTGRES_URL is missing. Serving approved fallback portfolio items.'
      });
    }

    const sql = getSqlClient();
    await ensureCoreContentReady(sql);

    let mediaRows: PortfolioMediaRow[] = [];
    let warning: string | null = null;

    try {
      const rows = await sql`
        SELECT
          id,
          title,
          file_url,
          alt_text,
          category,
          placement,
          created_at
        FROM media
        WHERE LOWER(COALESCE(category, '')) = 'portfolio'
           OR LOWER(COALESCE(placement, '')) = 'portfolio-grid'
        ORDER BY created_at DESC
      `;

      mediaRows = Array.isArray(rows) ? (rows as PortfolioMediaRow[]) : [];
    } catch (error) {
      warning =
        error instanceof Error
          ? `Portfolio media query fallback: ${error.message}`
          : 'Portfolio media query fallback: unknown error';
      console.error(warning);
    }

    const rows = await fetchPortfolioItems(sql, {
      includeDrafts: false,
      featuredOnly: false,
      limit: 60
    });
    const portfolioRows = Array.isArray(rows) ? (rows as PortfolioRow[]) : [];
    const mergedItems = mergePortfolioItems(portfolioRows, mediaRows);

    return res.status(200).json({
      success: true,
      items: mergedItems,
      data_mode: warning ? 'seed-plus-media-warning' : 'neon-plus-media',
      warning
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown portfolio fetch error';
    const fallbackRows = buildFallbackPortfolioRows();
    return res.status(200).json({
      success: true,
      items: mergePortfolioItems(fallbackRows, []),
      data_mode: 'runtime-fallback',
      warning: `Portfolio query failed (${message}). Serving approved fallback portfolio items.`
    });
  }
}
