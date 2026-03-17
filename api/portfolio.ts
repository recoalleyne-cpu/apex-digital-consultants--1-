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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const postgresUrl = process.env.POSTGRES_URL;

    if (!postgresUrl) {
      return res.status(500).send('Missing POSTGRES_URL environment variable');
    }

    const sql = neon(postgresUrl);

    const rows = await sql`
      SELECT
        id,
        title,
        file_url,
        alt_text,
        category,
        placement,
        description,
        tech_stack,
        features,
        created_at
      FROM media
      WHERE LOWER(COALESCE(category, '')) = 'portfolio'
         OR LOWER(COALESCE(placement, '')) = 'portfolio-grid'
      ORDER BY created_at DESC
    `;

    type PortfolioMediaRow = (typeof rows)[number];

    const mediaRows = Array.isArray(rows) ? (rows as PortfolioMediaRow[]) : [];
    const usedMediaIds = new Set<number>();

    const findMediaForSeedItem = (seedTitle: string, seedClientName: string, matchKeys: string[] = []) => {
      const normalizedCandidates = new Set<string>([
        normalizeMatchKey(seedTitle),
        normalizeMatchKey(seedClientName),
        ...matchKeys.map((key) => normalizeMatchKey(key))
      ]);

      return mediaRows.find((row) => {
        if (usedMediaIds.has(row.id)) return false;

        const rowTitle = typeof row.title === 'string' ? normalizeMatchKey(row.title) : '';
        const rowAltText = typeof row.alt_text === 'string' ? normalizeMatchKey(row.alt_text) : '';

        return normalizedCandidates.has(rowTitle) || normalizedCandidates.has(rowAltText);
      });
    };

    const mergedItems = PORTFOLIO_SEED_ITEMS.map((seedItem) => {
      const matchedMedia = findMediaForSeedItem(
        seedItem.project_title,
        seedItem.client_name,
        seedItem.media_match_keys || []
      );

      if (matchedMedia) {
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

    return res.status(200).json({
      success: true,
      items: mergedItems
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown portfolio fetch error';

    return res.status(500).send(`Portfolio fetch failed: ${message}`);
  }
}
