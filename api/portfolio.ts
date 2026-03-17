import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { PORTFOLIO_SEED_ITEMS } from '../src/constants/portfolioSeed';

export const config = {
  runtime: 'nodejs'
};

const normalizeMatchKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

type PortfolioMediaRow = {
  id: number;
  title?: string | null;
  file_url?: string | null;
  alt_text?: string | null;
  category?: string | null;
  placement?: string | null;
  created_at?: string | null;
};

const mergePortfolioItems = (mediaRows: PortfolioMediaRow[]) => {
  const usedMediaIds = new Set<number>();

  const findMediaForSeedItem = (
    seedTitle: string,
    seedClientName: string,
    matchKeys: string[] = []
  ) => {
    const normalizedCandidates = new Set<string>([
      normalizeMatchKey(seedTitle),
      normalizeMatchKey(seedClientName),
      ...matchKeys.map((key) => normalizeMatchKey(key))
    ]);

    return mediaRows.find((row) => {
      if (typeof row.id === 'number' && usedMediaIds.has(row.id)) return false;

      const rowTitle = typeof row.title === 'string' ? normalizeMatchKey(row.title) : '';
      const rowAltText =
        typeof row.alt_text === 'string' ? normalizeMatchKey(row.alt_text) : '';

      return normalizedCandidates.has(rowTitle) || normalizedCandidates.has(rowAltText);
    });
  };

  return PORTFOLIO_SEED_ITEMS.map((seedItem) => {
    const matchedMedia = findMediaForSeedItem(
      seedItem.project_title,
      seedItem.client_name,
      seedItem.media_match_keys || []
    );

    if (matchedMedia && typeof matchedMedia.id === 'number') {
      usedMediaIds.add(matchedMedia.id);
    }

    return {
      id: matchedMedia?.id ?? -seedItem.display_order,
      title: seedItem.project_title,
      client_name: seedItem.client_name,
      file_url: matchedMedia?.file_url || seedItem.thumbnail_url,
      alt_text: matchedMedia?.alt_text || seedItem.client_name,
      category: matchedMedia?.category || 'portfolio',
      placement: matchedMedia?.placement || 'portfolio-grid',
      description: seedItem.short_description,
      project_type: seedItem.project_type,
      services_provided: seedItem.services_provided,
      tech_stack: seedItem.project_type,
      features: seedItem.services_provided,
      project_url: seedItem.project_url,
      is_featured: seedItem.is_featured,
      display_order: seedItem.display_order,
      created_at: matchedMedia?.created_at || null
    };
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('Method not allowed');
    }

    const postgresUrl = process.env.POSTGRES_URL;
    let mediaRows: PortfolioMediaRow[] = [];
    let warning: string | null = null;

    if (postgresUrl) {
      try {
        const sql = neon(postgresUrl);
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
    } else {
      warning = 'Portfolio media query skipped: Missing POSTGRES_URL environment variable';
      console.error(warning);
    }

    const mergedItems = mergePortfolioItems(mediaRows);

    return res.status(200).json({
      success: true,
      items: mergedItems,
      data_mode: warning ? 'seed-fallback' : 'seed-plus-media',
      warning
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown portfolio fetch error';

    return res.status(500).send(`Portfolio fetch failed: ${message}`);
  }
}
