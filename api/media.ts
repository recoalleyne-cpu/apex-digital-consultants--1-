import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'nodejs'
};

export default async function handler(req: Request) {
  try {
    const postgresUrl = process.env.POSTGRES_URL;

    if (!postgresUrl) {
      return new Response('Missing POSTGRES_URL environment variable', { status: 500 });
    }

    const url = new URL(req.url);
    const placement = url.searchParams.get('placement')?.trim() || null;
    const category = url.searchParams.get('category')?.trim() || null;

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

    return Response.json({
      success: true,
      items: rows
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown fetch error';

    return new Response(`Media fetch failed: ${message}`, { status: 500 });
  }
}