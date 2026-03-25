import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { requireAdminAccess } from '../server/api-shared/adminAuth';
import { getSqlClient, isNeonConfigured } from '../server/api-shared/neonDb';

export const config = {
  runtime: 'nodejs'
};

const getOptionalTextField = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const getRequiredTextWithFallback = (value: unknown, fallback: string) => {
  return getOptionalTextField(value) || fallback;
};

const getRequestBody = (req: VercelRequest): Record<string, unknown> | null => {
  if (!req.body) return null;

  if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body) as unknown;
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }

  if (typeof req.body === 'object') {
    return req.body as Record<string, unknown>;
  }

  return null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
    }

    if (!isNeonConfigured()) {
      if (req.method === 'POST') {
        return res.status(500).send('Missing DATABASE_URL (or POSTGRES_URL) environment variable');
      }

      return res.status(200).json({
        success: true,
        items: [],
        data_mode: 'empty-fallback',
        warning: 'DATABASE_URL / POSTGRES_URL is missing. Returning empty media list.'
      });
    }

    const sql = getSqlClient();

    if (req.method === 'POST') {
      if (!(await requireAdminAccess(req, res))) {
        return;
      }

      const body = getRequestBody(req);
      if (!body) {
        return res.status(400).send('Invalid request body');
      }

      const fileUrl = getOptionalTextField(body.file_url);
      if (!fileUrl) {
        return res.status(400).send('Missing file_url');
      }

      const title = getRequiredTextWithFallback(body.title, 'Untitled');
      const category = getRequiredTextWithFallback(body.category, 'uncategorized');
      const placement = getOptionalTextField(body.placement);
      const isLogosCategory = category.trim().toLowerCase() === 'logos';
      const isLogosPlacement = placement?.trim().toLowerCase() === 'logos-page';
      const resolvedPlacement = isLogosPlacement
        ? 'logos-page'
        : placement || (isLogosCategory ? 'logos-page' : null);
      const description = getOptionalTextField(body.description);
      const techStack = getOptionalTextField(body.tech_stack);
      const features = getOptionalTextField(body.features);

      await sql`
        INSERT INTO media (title, file_url, alt_text, category, placement, description, tech_stack, features)
        VALUES (${title}, ${fileUrl}, ${title}, ${category}, ${resolvedPlacement}, ${description}, ${techStack}, ${features})
      `;

      return res.status(200).json({
        success: true,
        item: {
          title,
          file_url: fileUrl,
          category,
          placement: resolvedPlacement,
          description,
          tech_stack: techStack,
          features
        }
      });
    }

    const placement =
      typeof req.query.placement === 'string' && req.query.placement.trim() !== ''
        ? req.query.placement.trim()
        : null;
    const category =
      typeof req.query.category === 'string' && req.query.category.trim() !== ''
        ? req.query.category.trim()
        : null;

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
    const message = error instanceof Error ? error.message : 'Unknown fetch error';

    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        items: [],
        data_mode: 'runtime-fallback',
        warning: `Media query failed (${message}). Returning empty media list.`
      });
    }

    return res.status(500).send(`Media fetch failed: ${message}`);
  }
}
