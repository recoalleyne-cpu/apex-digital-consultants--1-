import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isNeonConfigured } from '../server/api-shared/neonDb';

export const config = {
  runtime: 'nodejs'
};

export default function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const dbConfigured = isNeonConfigured();

    const smtpConfigured = Boolean(
      (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) ||
        false
    );

    return res.status(200).json({
      success: true,
      dbConfigured,
      smtpConfigured
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Status check failed' });
  }
}
