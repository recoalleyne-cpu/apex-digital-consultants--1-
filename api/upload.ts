import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge'
};

export default async function handler(req: Request) {
  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const postgresUrl = process.env.POSTGRES_URL;
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (!postgresUrl) {
      return new Response('Missing POSTGRES_URL environment variable', { status: 500 });
    }

    if (!blobToken) {
      return new Response('Missing BLOB_READ_WRITE_TOKEN environment variable', { status: 500 });
    }

    const formData = await req.formData();

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
      return new Response('No file uploaded', { status: 400 });
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

    return Response.json({
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

    return new Response(`Upload failed: ${message}`, { status: 500 });
  }
}