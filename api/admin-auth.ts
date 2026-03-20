import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdminAccess } from './_utils/adminAuth';

export const config = {
  runtime: 'nodejs'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  if (!requireAdminAccess(req, res)) {
    return;
  }

  return res.status(200).json({
    success: true
  });
}

