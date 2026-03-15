import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge'
};

const getOptionalTextField = (formData: FormData, key: string) => {
  const value = formData.get(key);
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const getRequiredTextWithFallback = (formData: FormData, key: string, fallback: string) => {
  return getOptionalTextField(formData, key) || fallback;
};

export default async function handler(request: Request) {
  try {
    if (request.method !== 'POST') {
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

    const formData = await request.formData();
    const fileValue = formData.get('file');

    if (!(fileValue instanceof Blob)) {
      return new Response('No file uploaded', { status: 400 });
    }

    const title = getRequiredTextWithFallback(formData, 'title', 'Untitled');
    const category = getRequiredTextWithFallback(formData, 'category', 'uncategorized');
    const description = getOptionalTextField(formData, 'description');
    const techStack = getOptionalTextField(formData, 'tech_stack');
    const features = getOptionalTextField(formData, 'features');
    const placement = getOptionalTextField(formData, 'placement');
    const fileName = (fileValue as File).name?.trim() || `upload-${Date.now()}.bin`;

    const blob = await put(fileName, fileValue, {
      access: 'public',
      addRandomSuffix: true,
      token: blobToken
    });

    const sql = neon(postgresUrl);

    await sql`
      INSERT INTO media (title, file_url, alt_text, category, placement, description, tech_stack, features)
      VALUES (${title}, ${blob.url}, ${title}, ${category}, ${placement}, ${description}, ${techStack}, ${features})
    `;

    return Response.json(
      {
        success: true,
        url: blob.url,
        title,
        category,
        placement,
        description,
        tech_stack: techStack,
        features
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown upload error';
    return new Response(`Upload failed: ${message}`, { status: 500 });
  }
}
