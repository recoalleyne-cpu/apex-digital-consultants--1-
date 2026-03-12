import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'nodejs'
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

    const placement =
      typeof req.query.placement === 'string' && req.query.placement.trim() !== ''
        ? req.query.placement.trim()
        : null;
    const category =
      typeof req.query.category === 'string' && req.query.category.trim() !== ''
        ? req.query.category.trim()
        : null;

    const sql = neon(postgresUrl);

    let rows;

    if (placement) {
      rows = await sql`
        SELECT id, title, file_url, alt_text, category, placement, description, tech_stack, features, created_at
        FROM media
        WHERE placement = ${placement}
        ORDER BY created_at DESC
      `;
    } else if (category) {
      rows = await sql`
        SELECT id, title, file_url, alt_text, category, placement, description, tech_stack, features, created_at
        FROM media
        WHERE category = ${category}
        ORDER BY created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT id, title, file_url, alt_text, category, placement, description, tech_stack, features, created_at
        FROM media
        ORDER BY created_at DESC
      `;
    }

    return res.status(200).json({
      success: true,
      items: rows
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown fetch error';

    return res.status(500).send(`Media fetch failed: ${message}`);
  }
}
