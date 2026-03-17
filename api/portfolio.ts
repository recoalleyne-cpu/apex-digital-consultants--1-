import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'nodejs'
};

type PortfolioSeedItem = {
  project_title: string;
  client_name: string;
  short_description: string;
  project_type: string;
  services_provided: string;
  thumbnail_url: string;
  project_url: string;
  is_featured: boolean;
  display_order: number;
  media_match_keys?: string[];
};

const DEFAULT_THUMBNAIL = '[Add Image]';
const DEFAULT_CATEGORY = 'Website Design & Development';
const DEFAULT_SERVICES =
  'Website Design, Website Development, Responsive Web Design, Content Structuring, Brand Presentation';

// Keep this seed local to the API route so Vercel serverless execution
// cannot fail from cross-directory module resolution at runtime.
const PORTFOLIO_SEED_ITEMS: PortfolioSeedItem[] = [
  {
    project_title: 'The Science Plug',
    client_name: 'The Science Plug',
    short_description:
      "A polished and informative website designed to strengthen the brand's online presence and present its content in a clear, professional way.",
    project_type: DEFAULT_CATEGORY,
    services_provided: DEFAULT_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL,
    project_url: '/case-studies/the-science-plug-website-development',
    is_featured: true,
    display_order: 1
  },
  {
    project_title: 'Jriver Transport & Logistics (Barbados)',
    client_name: 'Jriver Transport & Logistics (Barbados)',
    short_description:
      'A professional business website developed to improve credibility, communicate services clearly, and support a stronger digital presence.',
    project_type: DEFAULT_CATEGORY,
    services_provided: DEFAULT_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL,
    project_url: '/case-studies/jriver-transport-logistics-barbados-website-development',
    is_featured: false,
    display_order: 2,
    media_match_keys: ['jriver transport logistics barbados', 'jriver transport and logistics barbados']
  },
  {
    project_title: 'Highlighted Beauty By Shan',
    client_name: 'Highlighted Beauty By Shan',
    short_description:
      'An elegant beauty brand website created to elevate the brand image and provide a clean, polished online customer experience.',
    project_type: DEFAULT_CATEGORY,
    services_provided: DEFAULT_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL,
    project_url: '/case-studies/highlighted-beauty-by-shan-website-development',
    is_featured: true,
    display_order: 3
  },
  {
    project_title: 'Finish Line Cleaning Services',
    client_name: 'Finish Line Cleaning Services',
    short_description:
      "A clean and professional service-based website built to present offerings clearly and strengthen the company's online image.",
    project_type: DEFAULT_CATEGORY,
    services_provided: DEFAULT_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL,
    project_url: '/case-studies/finish-line-cleaning-services-website-development',
    is_featured: false,
    display_order: 4
  },
  {
    project_title: 'Hitz 106.7 FM — Initial Build',
    client_name: 'Hitz 106.7 FM',
    short_description:
      'The original website build created to establish an early digital presence for the station and support its public-facing brand online.',
    project_type: 'Initial Website Build',
    services_provided:
      'Website Design, Front-End Development, Responsive Layout, Brand Presentation, Initial Website Build',
    thumbnail_url: DEFAULT_THUMBNAIL,
    project_url: '/case-studies/hitz-1067-fm-initial-website-build',
    is_featured: true,
    display_order: 5,
    media_match_keys: ['hitz 106.7 fm', 'hitz 1067 fm', 'hitz 106.7 fm initial build']
  },
  {
    project_title: 'Be Blessed Skin Care & Beauty',
    client_name: 'Be Blessed Skin Care & Beauty',
    short_description:
      'A beauty-focused website built to support product visibility, strengthen branding, and create a polished digital shopping experience.',
    project_type: 'E-commerce Website',
    services_provided:
      'Website Design, Website Development, Responsive Web Design, Product Presentation, E-commerce Setup',
    thumbnail_url: DEFAULT_THUMBNAIL,
    project_url: '/case-studies/be-blessed-skin-care-beauty-ecommerce-website-development',
    is_featured: true,
    display_order: 6
  },
  {
    project_title: 'Rhea Renee',
    client_name: 'Rhea Renee',
    short_description:
      'A stylish, brand-forward website designed to elevate presentation and create a more refined online presence.',
    project_type: DEFAULT_CATEGORY,
    services_provided: DEFAULT_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL,
    project_url: '/case-studies/rhea-renee-website-development',
    is_featured: false,
    display_order: 7
  },
  {
    project_title: 'Mobile & Marine Services',
    client_name: 'Mobile & Marine Services',
    short_description:
      "A professional service website developed to clarify offerings, improve visibility, and strengthen the brand's digital footprint.",
    project_type: DEFAULT_CATEGORY,
    services_provided: DEFAULT_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL,
    project_url: '/case-studies/mobile-and-marine-services-website-development',
    is_featured: false,
    display_order: 8,
    media_match_keys: ['mobile & marine services', 'mobile and marine services']
  },
  {
    project_title: 'Rachel Thomas – Executive Coach',
    client_name: 'Rachel Thomas – Executive Coach',
    short_description:
      'A professional personal-brand website created to present coaching services with clarity, authority, and trust.',
    project_type: 'Personal Brand Website',
    services_provided:
      'Website Design, Website Development, Responsive Web Design, Personal Brand Positioning, Content Structuring',
    thumbnail_url: DEFAULT_THUMBNAIL,
    project_url: '/case-studies/rachel-thomas-executive-coach-website-development',
    is_featured: false,
    display_order: 9,
    media_match_keys: ['rachel thomas executive coach', 'rachel thomas - executive coach']
  },
  {
    project_title: 'Ask For Jess',
    client_name: 'Ask For Jess',
    short_description:
      'A service-focused website developed to clearly present offerings and create a polished, inviting online business presence.',
    project_type: DEFAULT_CATEGORY,
    services_provided:
      'Website Design, Website Development, Responsive Web Design, Service Presentation, Content Structuring',
    thumbnail_url: DEFAULT_THUMBNAIL,
    project_url: '/case-studies/ask-for-jess-website-development',
    is_featured: true,
    display_order: 10
  },
  {
    project_title: 'Sani Services Limited',
    client_name: 'Sani Services Limited',
    short_description:
      'A professional corporate-style website built to improve visibility, credibility, and access to business information online.',
    project_type: 'Corporate Website',
    services_provided: DEFAULT_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL,
    project_url: '/case-studies/sani-services-limited-website-development',
    is_featured: false,
    display_order: 11
  },
  {
    project_title: 'Sergio’s Auto Follow',
    client_name: 'Sergio’s Auto Follow',
    short_description:
      'A business website created to strengthen branding, improve trust, and provide a clearer presentation of services online.',
    project_type: DEFAULT_CATEGORY,
    services_provided: DEFAULT_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL,
    project_url: '/case-studies/sergios-auto-follow-website-development',
    is_featured: false,
    display_order: 12,
    media_match_keys: ['sergios auto follow', "sergio's auto follow"]
  },
  {
    project_title: 'Island Zest',
    client_name: 'Island Zest',
    short_description:
      'A vibrant and engaging web presence designed to better reflect the brand and create a more polished visitor experience.',
    project_type: DEFAULT_CATEGORY,
    services_provided: DEFAULT_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL,
    project_url: '/case-studies/island-zest-website-development',
    is_featured: true,
    display_order: 13
  }
];

const normalizeMatchKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

type PortfolioMediaRow = {
  id: number;
  title?: string | null;
  file_url?: string | null;
  alt_text?: string | null;
  category?: string | null;
  placement?: string | null;
  created_at?: string | null;
};

const mergePortfolioItems = (mediaRows: PortfolioMediaRow[]) => {
  const usedMediaIds = new Set<number>();

  const findMediaForSeedItem = (
    seedTitle: string,
    seedClientName: string,
    matchKeys: string[] = []
  ) => {
    const normalizedCandidates = new Set<string>([
      normalizeMatchKey(seedTitle),
      normalizeMatchKey(seedClientName),
      ...matchKeys.map((key) => normalizeMatchKey(key))
    ]);

    return mediaRows.find((row) => {
      if (typeof row.id === 'number' && usedMediaIds.has(row.id)) return false;

      const rowTitle = typeof row.title === 'string' ? normalizeMatchKey(row.title) : '';
      const rowAltText =
        typeof row.alt_text === 'string' ? normalizeMatchKey(row.alt_text) : '';

      return normalizedCandidates.has(rowTitle) || normalizedCandidates.has(rowAltText);
    });
  };

  return PORTFOLIO_SEED_ITEMS.map((seedItem) => {
    const matchedMedia = findMediaForSeedItem(
      seedItem.project_title,
      seedItem.client_name,
      seedItem.media_match_keys || []
    );

    if (matchedMedia && typeof matchedMedia.id === 'number') {
      usedMediaIds.add(matchedMedia.id);
    }

    return {
      id: matchedMedia?.id ?? -seedItem.display_order,
      title: seedItem.project_title,
      client_name: seedItem.client_name,
      file_url: matchedMedia?.file_url || seedItem.thumbnail_url,
      alt_text: matchedMedia?.alt_text || seedItem.client_name,
      category: matchedMedia?.category || 'portfolio',
      placement: matchedMedia?.placement || 'portfolio-grid',
      description: seedItem.short_description,
      project_type: seedItem.project_type,
      services_provided: seedItem.services_provided,
      tech_stack: seedItem.project_type,
      features: seedItem.services_provided,
      project_url: seedItem.project_url,
      is_featured: seedItem.is_featured,
      display_order: seedItem.display_order,
      created_at: matchedMedia?.created_at || null
    };
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('Method not allowed');
    }

    const postgresUrl = process.env.POSTGRES_URL;
    let mediaRows: PortfolioMediaRow[] = [];
    let warning: string | null = null;

    if (postgresUrl) {
      try {
        const sql = neon(postgresUrl);
        const rows = await sql`
          SELECT
            id,
            title,
            file_url,
            alt_text,
            category,
            placement,
            created_at
          FROM media
          WHERE LOWER(COALESCE(category, '')) = 'portfolio'
             OR LOWER(COALESCE(placement, '')) = 'portfolio-grid'
          ORDER BY created_at DESC
        `;

        mediaRows = Array.isArray(rows) ? (rows as PortfolioMediaRow[]) : [];
      } catch (error) {
        warning =
          error instanceof Error
            ? `Portfolio media query fallback: ${error.message}`
            : 'Portfolio media query fallback: unknown error';
        console.error(warning);
      }
    } else {
      warning = 'Portfolio media query skipped: Missing POSTGRES_URL environment variable';
      console.error(warning);
    }

    const mergedItems = mergePortfolioItems(mediaRows);

    return res.status(200).json({
      success: true,
      items: mergedItems,
      data_mode: warning ? 'seed-fallback' : 'seed-plus-media',
      warning
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown portfolio fetch error';

    return res.status(500).send(`Portfolio fetch failed: ${message}`);
  }
}
