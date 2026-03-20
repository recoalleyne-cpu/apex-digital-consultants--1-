import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs'
};

const normalizeHeaderValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0]?.trim() || '';
  }
  if (typeof value === 'string') {
    return value.trim();
  }
  return '';
};

const resolveOrigin = (req: VercelRequest) => {
  const host =
    normalizeHeaderValue(req.headers['x-forwarded-host']) ||
    normalizeHeaderValue(req.headers.host) ||
    'apexdigitalconsultants.com';

  const protocol =
    normalizeHeaderValue(req.headers['x-forwarded-proto']) || 'https';

  return `${protocol}://${host}`;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  const origin = resolveOrigin(req);

  const body = [
    'User-agent: *',
    'Disallow: /admin',
    'Allow: /',
    '',
    `Sitemap: ${origin}/sitemap.xml`
  ].join('\n');

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=3600');
  return res.status(200).send(body);
}

