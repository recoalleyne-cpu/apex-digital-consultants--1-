import type { VercelRequest, VercelResponse } from '@vercel/node';
import { INITIAL_CASE_STUDIES } from '../src/constants/caseStudiesSeed';

export const config = {
  runtime: 'nodejs'
};

const STATIC_PATHS = [
  '/',
  '/about',
  '/services',
  '/services/web-development',
  '/services/marketing-management',
  '/services/google-advertising',
  '/services/graphic-design',
  '/services/photography-videography',
  '/services/business-digitization',
  '/services/web-design',
  '/services/logos',
  '/services/websites',
  '/website-development-barbados',
  '/website-development-caribbean',
  '/web-design-barbados',
  '/ecommerce-website-development-barbados',
  '/seo-friendly-websites-barbados',
  '/digital-solutions',
  '/portfolio',
  '/case-studies',
  '/pricing',
  '/contact',
  '/faqs',
  '/blog',
  '/terms',
  '/privacy'
];

const SERVICE_FUNNEL_PATHS = [
  '/services/web-development',
  '/services/marketing-management',
  '/services/google-advertising',
  '/services/graphic-design',
  '/services/photography-videography',
  '/services/business-digitization'
];

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

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toSitemapUrlset = (origin: string, paths: string[]) => {
  const uniquePaths = Array.from(new Set(paths));
  const urlNodes = uniquePaths
    .map((path) => {
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      return `  <url><loc>${escapeXml(`${origin}${normalizedPath}`)}</loc></url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlNodes}\n</urlset>`;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  const origin = resolveOrigin(req);
  const caseStudyPaths = INITIAL_CASE_STUDIES.map((item) => `/case-studies/${item.slug}`);

  const xml = toSitemapUrlset(origin, [
    ...STATIC_PATHS,
    ...SERVICE_FUNNEL_PATHS,
    ...caseStudyPaths
  ]);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=3600');
  return res.status(200).send(xml);
}

