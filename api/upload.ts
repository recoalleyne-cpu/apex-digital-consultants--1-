import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'nodejs'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
    }

    const postgresUrl = process.env.POSTGRES_URL;
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (!postgresUrl) {
      return res.status(500).send('Missing POSTGRES_URL environment variable');
    }

    if (!blobToken) {
      return res.status(500).send('Missing BLOB_READ_WRITE_TOKEN environment variable');
    }

    const formData = await (req as any).formData?.();

    if (!formData) {
      return res.status(500).send('Multipart form parsing is not available in this runtime');
    }

    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string | null)?.trim() || 'Untitled';
    const category = (formData.get('category') as string | null)?.trim() || 'uncategorized';
    const description = (formData.get('description') as string | null)?.trim() || null;
    const techStack = (formData.get('tech_stack') as string | null)?.trim() || null;
    const features = (formData.get('features') as string | null)?.trim() || null;
    const placementRaw = formData.get('placement');
    const placement =
      typeof placementRaw === 'string' && placementRaw.trim() !== ''
        ? placementRaw.trim()
        : null;

    if (!file) {
      return res.status(400).send('No file uploaded');
    }

    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
      token: blobToken
    });

    const sql = neon(postgresUrl);

    await sql`
      INSERT INTO media (title, file_url, alt_text, category, placement, description, tech_stack, features)
      VALUES (${title}, ${blob.url}, ${title}, ${category}, ${placement}, ${description}, ${techStack}, ${features})
    `;

    return res.status(200).json({
      success: true,
      url: blob.url,
      title,
      category,
      placement,
      description,
      tech_stack: techStack,
      features
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown upload error';

    return res.status(500).send(`Upload failed: ${message}`);
  }
}