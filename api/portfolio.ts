import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'nodejs'
};

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

    return res.status(200).json({
      success: true,
      items: rows
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown portfolio fetch error';

    return res.status(500).send(`Portfolio fetch failed: ${message}`);
  }
}