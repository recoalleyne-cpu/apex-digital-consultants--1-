import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdminAccess } from '../server/api-shared/adminAuth';

export const config = {
  runtime: 'nodejs'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  if (!(await requireAdminAccess(req, res))) {
    return;
  }

  return res.status(200).json({
    success: true
  });
}
