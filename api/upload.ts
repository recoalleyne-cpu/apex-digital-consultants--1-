import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { requireAdminAccess } from '../server/api-shared/adminAuth';

export const config = {
  runtime: 'nodejs'
};

const getRequestBody = (req: VercelRequest): HandleUploadBody | null => {
  if (!req.body) return null;

  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as HandleUploadBody;
    } catch {
      return null;
    }
  }

  if (typeof req.body === 'object') {
    return req.body as HandleUploadBody;
  }

  return null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
    }

    if (!(await requireAdminAccess(req, res))) {
      return;
    }

    const body = getRequestBody(req);
    if (!body || typeof body !== 'object' || !('type' in body)) {
      return res.status(400).send('Invalid upload request body');
    }

    const jsonResponse = await handleUpload({
      request: req,
      body,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        return {
          tokenPayload: clientPayload,
          addRandomSuffix: true,
          maximumSizeInBytes: 25 * 1024 * 1024,
          allowedContentTypes: ['image/*']
        };
      },
      onUploadCompleted: async () => {}
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown upload error';
    return res.status(500).send(`Upload failed: ${message}`);
  }
}
