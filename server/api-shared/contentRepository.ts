import { neon } from '@neondatabase/serverless';
import { INITIAL_CASE_STUDIES } from './caseStudiesSeed.js';

type SqlClient = ReturnType<typeof neon>;

export type CaseStudiesQueryOptions = {
  includeDrafts: boolean;
  featuredOnly: boolean;
  limit: number;
};

export type CaseStudyCreateInput = {
  title: string;
  slug: string;
  client_name: string | null;
  summary: string | null;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  services_provided: string | null;
  featured_image_url: string | null;
  gallery_images: string | null;
  tech_stack: string | null;
  cta_text: string | null;
  cta_link: string | null;
  is_featured: boolean;
  is_published: boolean;
};

export type PortfolioSeedItem = {
  slug: string;
  title: string;
  client_name: string;
  short_description: string;
  category: string;
  services_provided: string;
  thumbnail_url: string;
  case_study_slug: string;
  featured: boolean;
  published: boolean;
  display_order: number;
};

type PortfolioQueryOptions = {
  includeDrafts: boolean;
  featuredOnly: boolean;
  limit: number;
};

export type LeadCreateInput = {
  name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  source: string | null;
};

const DEFAULT_PORTFOLIO_CATEGORY = 'Website Design & Development';
const DEFAULT_PORTFOLIO_SERVICES =
  'Website Design, Website Development, Responsive Web Design, Content Structuring, Brand Presentation';
const DEFAULT_THUMBNAIL_URL = '[Add Image]';

export const PORTFOLIO_SEED_ITEMS: PortfolioSeedItem[] = [
  {
    slug: 'the-science-plug',
    title: 'The Science Plug',
    client_name: 'The Science Plug',
    short_description:
      "A polished and informative website designed to strengthen the brand's online presence and present its content in a clear, professional way.",
    category: DEFAULT_PORTFOLIO_CATEGORY,
    services_provided: DEFAULT_PORTFOLIO_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL_URL,
    case_study_slug: 'the-science-plug-website-development',
    featured: true,
    published: true,
    display_order: 1
  },
  {
    slug: 'jriver-transport-logistics-barbados',
    title: 'Jriver Transport & Logistics (Barbados)',
    client_name: 'Jriver Transport & Logistics (Barbados)',
    short_description:
      'A professional business website developed to improve credibility, communicate services clearly, and support a stronger digital presence.',
    category: DEFAULT_PORTFOLIO_CATEGORY,
    services_provided: DEFAULT_PORTFOLIO_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL_URL,
    case_study_slug: 'jriver-transport-logistics-barbados-website-development',
    featured: false,
    published: true,
    display_order: 2
  },
  {
    slug: 'highlighted-beauty-by-shan',
    title: 'Highlighted Beauty By Shan',
    client_name: 'Highlighted Beauty By Shan',
    short_description:
      'An elegant beauty brand website created to elevate the brand image and provide a clean, polished online customer experience.',
    category: DEFAULT_PORTFOLIO_CATEGORY,
    services_provided: DEFAULT_PORTFOLIO_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL_URL,
    case_study_slug: 'highlighted-beauty-by-shan-website-development',
    featured: true,
    published: true,
    display_order: 3
  },
  {
    slug: 'finish-line-cleaning-services',
    title: 'Finish Line Cleaning Services',
    client_name: 'Finish Line Cleaning Services',
    short_description:
      "A clean and professional service-based website built to present offerings clearly and strengthen the company's online image.",
    category: DEFAULT_PORTFOLIO_CATEGORY,
    services_provided: DEFAULT_PORTFOLIO_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL_URL,
    case_study_slug: 'finish-line-cleaning-services-website-development',
    featured: false,
    published: true,
    display_order: 4
  },
  {
    slug: 'hitz-1067-fm-initial-build',
    title: 'Hitz 106.7 FM — Initial Build',
    client_name: 'Hitz 106.7 FM',
    short_description:
      'The original website build created to establish an early digital presence for the station and support its public-facing brand online.',
    category: 'Initial Website Build',
    services_provided:
      'Website Design, Front-End Development, Responsive Layout, Brand Presentation, Initial Website Build',
    thumbnail_url: DEFAULT_THUMBNAIL_URL,
    case_study_slug: 'hitz-1067-fm-initial-website-build',
    featured: true,
    published: true,
    display_order: 5
  },
  {
    slug: 'be-blessed-skin-care-beauty',
    title: 'Be Blessed Skin Care & Beauty',
    client_name: 'Be Blessed Skin Care & Beauty',
    short_description:
      'A beauty-focused website built to support product visibility, strengthen branding, and create a polished digital shopping experience.',
    category: 'E-commerce Website',
    services_provided:
      'Website Design, Website Development, Responsive Web Design, Product Presentation, E-commerce Setup',
    thumbnail_url: DEFAULT_THUMBNAIL_URL,
    case_study_slug: 'be-blessed-skin-care-beauty-ecommerce-website-development',
    featured: true,
    published: true,
    display_order: 6
  },
  {
    slug: 'rhea-renee',
    title: 'Rhea Renee',
    client_name: 'Rhea Renee',
    short_description:
      'A stylish, brand-forward website designed to elevate presentation and create a more refined online presence.',
    category: DEFAULT_PORTFOLIO_CATEGORY,
    services_provided: DEFAULT_PORTFOLIO_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL_URL,
    case_study_slug: 'rhea-renee-website-development',
    featured: false,
    published: true,
    display_order: 7
  },
  {
    slug: 'mobile-and-marine-services',
    title: 'Mobile & Marine Services',
    client_name: 'Mobile & Marine Services',
    short_description:
      "A professional service website developed to clarify offerings, improve visibility, and strengthen the brand's digital footprint.",
    category: DEFAULT_PORTFOLIO_CATEGORY,
    services_provided: DEFAULT_PORTFOLIO_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL_URL,
    case_study_slug: 'mobile-and-marine-services-website-development',
    featured: false,
    published: true,
    display_order: 8
  },
  {
    slug: 'rachel-thomas-executive-coach',
    title: 'Rachel Thomas – Executive Coach',
    client_name: 'Rachel Thomas – Executive Coach',
    short_description:
      'A professional personal-brand website created to present coaching services with clarity, authority, and trust.',
    category: 'Personal Brand Website',
    services_provided:
      'Website Design, Website Development, Responsive Web Design, Personal Brand Positioning, Content Structuring',
    thumbnail_url: DEFAULT_THUMBNAIL_URL,
    case_study_slug: 'rachel-thomas-executive-coach-website-development',
    featured: false,
    published: true,
    display_order: 9
  },
  {
    slug: 'ask-for-jess',
    title: 'Ask For Jess',
    client_name: 'Ask For Jess',
    short_description:
      'A service-focused website developed to clearly present offerings and create a polished, inviting online business presence.',
    category: DEFAULT_PORTFOLIO_CATEGORY,
    services_provided:
      'Website Design, Website Development, Responsive Web Design, Service Presentation, Content Structuring',
    thumbnail_url: DEFAULT_THUMBNAIL_URL,
    case_study_slug: 'ask-for-jess-website-development',
    featured: true,
    published: true,
    display_order: 10
  },
  {
    slug: 'sani-services-limited',
    title: 'Sani Services Limited',
    client_name: 'Sani Services Limited',
    short_description:
      'A professional corporate-style website built to improve visibility, credibility, and access to business information online.',
    category: 'Corporate Website',
    services_provided: DEFAULT_PORTFOLIO_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL_URL,
    case_study_slug: 'sani-services-limited-website-development',
    featured: false,
    published: true,
    display_order: 11
  },
  {
    slug: 'sergios-auto-follow',
    title: 'Sergio’s Auto Follow',
    client_name: 'Sergio’s Auto Follow',
    short_description:
      'A business website created to strengthen branding, improve trust, and provide a clearer presentation of services online.',
    category: DEFAULT_PORTFOLIO_CATEGORY,
    services_provided: DEFAULT_PORTFOLIO_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL_URL,
    case_study_slug: 'sergios-auto-follow-website-development',
    featured: false,
    published: true,
    display_order: 12
  },
  {
    slug: 'island-zest',
    title: 'Island Zest',
    client_name: 'Island Zest',
    short_description:
      'A vibrant and engaging web presence designed to better reflect the brand and create a more polished visitor experience.',
    category: DEFAULT_PORTFOLIO_CATEGORY,
    services_provided: DEFAULT_PORTFOLIO_SERVICES,
    thumbnail_url: DEFAULT_THUMBNAIL_URL,
    case_study_slug: 'island-zest-website-development',
    featured: true,
    published: true,
    display_order: 13
  }
];

const parseBoolean = (value: unknown, fallback = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
    if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  }
  return fallback;
};

let coreContentReadyPromise: Promise<void> | null = null;
let schemaReadyPromise: Promise<void> | null = null;

const parseText = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

export const ensureHybridContentSchema = async (sql: SqlClient) => {
  await sql`
    CREATE TABLE IF NOT EXISTS case_studies (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      client_name TEXT,
      summary TEXT,
      project_summary TEXT,
      challenge TEXT,
      solution TEXT,
      results TEXT,
      services_provided TEXT,
      featured_image_url TEXT,
      gallery_images TEXT,
      gallery_image_urls TEXT,
      tech_stack TEXT,
      cta_text TEXT,
      cta_link TEXT,
      cta_label TEXT,
      cta_url TEXT,
      is_featured BOOLEAN DEFAULT FALSE,
      is_published BOOLEAN DEFAULT TRUE,
      featured BOOLEAN DEFAULT FALSE,
      published BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS project_summary TEXT`;
  await sql`ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS gallery_image_urls TEXT`;
  await sql`ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS cta_label TEXT`;
  await sql`ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS cta_url TEXT`;
  await sql`ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE`;

  await sql`
    UPDATE case_studies
    SET
      project_summary = COALESCE(project_summary, summary),
      gallery_image_urls = COALESCE(gallery_image_urls, gallery_images),
      cta_label = COALESCE(cta_label, cta_text),
      cta_url = COALESCE(cta_url, cta_link),
      featured = COALESCE(featured, is_featured, FALSE),
      published = COALESCE(published, is_published, TRUE)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS case_studies_slug_idx
    ON case_studies (slug)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS case_studies_publish_idx
    ON case_studies (published, featured, updated_at DESC)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_items (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      client_name TEXT,
      short_description TEXT,
      category TEXT,
      services_provided TEXT,
      thumbnail_url TEXT,
      case_study_slug TEXT,
      featured BOOLEAN DEFAULT FALSE,
      published BOOLEAN DEFAULT TRUE,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS portfolio_items_publish_idx
    ON portfolio_items (published, featured, display_order ASC)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS portfolio_items_case_study_slug_idx
    ON portfolio_items (case_study_slug)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      message TEXT,
      source TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS leads_created_at_idx
    ON leads (created_at DESC)
  `;
};

export const ensureHybridContentSchemaReady = async (sql: SqlClient) => {
  if (!schemaReadyPromise) {
    schemaReadyPromise = ensureHybridContentSchema(sql);
  }

  try {
    await schemaReadyPromise;
  } catch (error) {
    schemaReadyPromise = null;
    throw error;
  }
};

export const seedCoreContentTables = async (sql: SqlClient) => {
  const caseStudyCountRows = await sql`SELECT COUNT(*)::int AS total FROM case_studies`;
  const caseStudyTotal = Number(caseStudyCountRows[0]?.total || 0);

  if (caseStudyTotal === 0) {
    for (const item of INITIAL_CASE_STUDIES) {
      await sql`
        INSERT INTO case_studies (
          title,
          slug,
          client_name,
          summary,
          project_summary,
          challenge,
          solution,
          results,
          services_provided,
          featured_image_url,
          gallery_images,
          gallery_image_urls,
          tech_stack,
          cta_text,
          cta_link,
          cta_label,
          cta_url,
          is_featured,
          is_published,
          featured,
          published
        )
        VALUES (
          ${item.title},
          ${item.slug},
          ${item.client_name},
          ${item.summary},
          ${item.summary},
          ${item.challenge},
          ${item.solution},
          ${item.results},
          ${item.services_provided},
          ${item.featured_image_url},
          ${item.gallery_images},
          ${item.gallery_images},
          ${item.tech_stack},
          ${item.cta_text},
          ${item.cta_link},
          ${item.cta_text},
          ${item.cta_link},
          ${item.is_featured},
          ${item.is_published},
          ${item.is_featured},
          ${item.is_published}
        )
        ON CONFLICT (slug) DO NOTHING
      `;
    }
  }

  const portfolioCountRows = await sql`SELECT COUNT(*)::int AS total FROM portfolio_items`;
  const portfolioTotal = Number(portfolioCountRows[0]?.total || 0);

  if (portfolioTotal === 0) {
    for (const item of PORTFOLIO_SEED_ITEMS) {
      await sql`
        INSERT INTO portfolio_items (
          slug,
          title,
          client_name,
          short_description,
          category,
          services_provided,
          thumbnail_url,
          case_study_slug,
          featured,
          published,
          display_order
        )
        VALUES (
          ${item.slug},
          ${item.title},
          ${item.client_name},
          ${item.short_description},
          ${item.category},
          ${item.services_provided},
          ${item.thumbnail_url},
          ${item.case_study_slug},
          ${item.featured},
          ${item.published},
          ${item.display_order}
        )
        ON CONFLICT (slug) DO NOTHING
      `;
    }
  }
};

export const ensureCoreContentReady = async (sql: SqlClient) => {
  if (!coreContentReadyPromise) {
    coreContentReadyPromise = (async () => {
      await ensureHybridContentSchemaReady(sql);
      await seedCoreContentTables(sql);
    })();
  }

  try {
    await coreContentReadyPromise;
  } catch (error) {
    coreContentReadyPromise = null;
    throw error;
  }
};

export const fetchCaseStudyBySlug = async (
  sql: SqlClient,
  slug: string,
  includeDrafts: boolean
) => {
  const rows = includeDrafts
    ? await sql`
        SELECT
          id,
          title,
          slug,
          client_name,
          COALESCE(project_summary, summary) AS summary,
          challenge,
          solution,
          results,
          services_provided,
          featured_image_url,
          COALESCE(gallery_image_urls, gallery_images) AS gallery_images,
          tech_stack,
          COALESCE(cta_label, cta_text) AS cta_text,
          COALESCE(cta_url, cta_link) AS cta_link,
          COALESCE(featured, is_featured, FALSE) AS is_featured,
          COALESCE(published, is_published, TRUE) AS is_published,
          created_at,
          updated_at
        FROM case_studies
        WHERE slug = ${slug}
        LIMIT 1
      `
    : await sql`
        SELECT
          id,
          title,
          slug,
          client_name,
          COALESCE(project_summary, summary) AS summary,
          challenge,
          solution,
          results,
          services_provided,
          featured_image_url,
          COALESCE(gallery_image_urls, gallery_images) AS gallery_images,
          tech_stack,
          COALESCE(cta_label, cta_text) AS cta_text,
          COALESCE(cta_url, cta_link) AS cta_link,
          COALESCE(featured, is_featured, FALSE) AS is_featured,
          COALESCE(published, is_published, TRUE) AS is_published,
          created_at,
          updated_at
        FROM case_studies
        WHERE slug = ${slug}
          AND COALESCE(published, is_published, TRUE) = TRUE
        LIMIT 1
      `;

  return rows[0] || null;
};

export const fetchCaseStudies = async (
  sql: SqlClient,
  options: CaseStudiesQueryOptions
) => {
  if (options.includeDrafts && options.featuredOnly) {
    return sql`
      SELECT
        id,
        title,
        slug,
        client_name,
        COALESCE(project_summary, summary) AS summary,
        services_provided,
        featured_image_url,
        tech_stack,
        COALESCE(cta_label, cta_text) AS cta_text,
        COALESCE(cta_url, cta_link) AS cta_link,
        COALESCE(featured, is_featured, FALSE) AS is_featured,
        COALESCE(published, is_published, TRUE) AS is_published,
        created_at,
        updated_at
      FROM case_studies
      WHERE COALESCE(featured, is_featured, FALSE) = TRUE
      ORDER BY updated_at DESC
      LIMIT ${options.limit}
    `;
  }

  if (options.includeDrafts) {
    return sql`
      SELECT
        id,
        title,
        slug,
        client_name,
        COALESCE(project_summary, summary) AS summary,
        services_provided,
        featured_image_url,
        tech_stack,
        COALESCE(cta_label, cta_text) AS cta_text,
        COALESCE(cta_url, cta_link) AS cta_link,
        COALESCE(featured, is_featured, FALSE) AS is_featured,
        COALESCE(published, is_published, TRUE) AS is_published,
        created_at,
        updated_at
      FROM case_studies
      ORDER BY COALESCE(featured, is_featured, FALSE) DESC, updated_at DESC
      LIMIT ${options.limit}
    `;
  }

  if (options.featuredOnly) {
    return sql`
      SELECT
        id,
        title,
        slug,
        client_name,
        COALESCE(project_summary, summary) AS summary,
        services_provided,
        featured_image_url,
        tech_stack,
        COALESCE(cta_label, cta_text) AS cta_text,
        COALESCE(cta_url, cta_link) AS cta_link,
        COALESCE(featured, is_featured, FALSE) AS is_featured,
        COALESCE(published, is_published, TRUE) AS is_published,
        created_at,
        updated_at
      FROM case_studies
      WHERE COALESCE(published, is_published, TRUE) = TRUE
        AND COALESCE(featured, is_featured, FALSE) = TRUE
      ORDER BY updated_at DESC
      LIMIT ${options.limit}
    `;
  }

  return sql`
    SELECT
      id,
      title,
      slug,
      client_name,
      COALESCE(project_summary, summary) AS summary,
      services_provided,
      featured_image_url,
      tech_stack,
      COALESCE(cta_label, cta_text) AS cta_text,
      COALESCE(cta_url, cta_link) AS cta_link,
      COALESCE(featured, is_featured, FALSE) AS is_featured,
      COALESCE(published, is_published, TRUE) AS is_published,
      created_at,
      updated_at
    FROM case_studies
    WHERE COALESCE(published, is_published, TRUE) = TRUE
    ORDER BY COALESCE(featured, is_featured, FALSE) DESC, updated_at DESC
    LIMIT ${options.limit}
  `;
};

export const createCaseStudy = async (sql: SqlClient, payload: CaseStudyCreateInput) => {
  const inserted = await sql`
    INSERT INTO case_studies (
      title,
      slug,
      client_name,
      summary,
      project_summary,
      challenge,
      solution,
      results,
      services_provided,
      featured_image_url,
      gallery_images,
      gallery_image_urls,
      tech_stack,
      cta_text,
      cta_link,
      cta_label,
      cta_url,
      is_featured,
      is_published,
      featured,
      published,
      updated_at
    )
    VALUES (
      ${payload.title},
      ${payload.slug},
      ${payload.client_name},
      ${payload.summary},
      ${payload.summary},
      ${payload.challenge},
      ${payload.solution},
      ${payload.results},
      ${payload.services_provided},
      ${payload.featured_image_url},
      ${payload.gallery_images},
      ${payload.gallery_images},
      ${payload.tech_stack},
      ${payload.cta_text},
      ${payload.cta_link},
      ${payload.cta_text},
      ${payload.cta_link},
      ${payload.is_featured},
      ${payload.is_published},
      ${payload.is_featured},
      ${payload.is_published},
      NOW()
    )
    RETURNING
      id,
      title,
      slug,
      client_name,
      COALESCE(project_summary, summary) AS summary,
      challenge,
      solution,
      results,
      services_provided,
      featured_image_url,
      COALESCE(gallery_image_urls, gallery_images) AS gallery_images,
      tech_stack,
      COALESCE(cta_label, cta_text) AS cta_text,
      COALESCE(cta_url, cta_link) AS cta_link,
      COALESCE(featured, is_featured, FALSE) AS is_featured,
      COALESCE(published, is_published, TRUE) AS is_published,
      created_at,
      updated_at
  `;

  return inserted[0];
};

export const fetchPortfolioItems = async (
  sql: SqlClient,
  options: PortfolioQueryOptions
) => {
  if (options.includeDrafts && options.featuredOnly) {
    return sql`
      SELECT
        id,
        slug,
        title,
        client_name,
        short_description,
        category,
        services_provided,
        thumbnail_url,
        case_study_slug,
        featured,
        published,
        display_order,
        created_at,
        updated_at
      FROM portfolio_items
      WHERE featured = TRUE
      ORDER BY display_order ASC, updated_at DESC
      LIMIT ${options.limit}
    `;
  }

  if (options.includeDrafts) {
    return sql`
      SELECT
        id,
        slug,
        title,
        client_name,
        short_description,
        category,
        services_provided,
        thumbnail_url,
        case_study_slug,
        featured,
        published,
        display_order,
        created_at,
        updated_at
      FROM portfolio_items
      ORDER BY featured DESC, display_order ASC, updated_at DESC
      LIMIT ${options.limit}
    `;
  }

  if (options.featuredOnly) {
    return sql`
      SELECT
        id,
        slug,
        title,
        client_name,
        short_description,
        category,
        services_provided,
        thumbnail_url,
        case_study_slug,
        featured,
        published,
        display_order,
        created_at,
        updated_at
      FROM portfolio_items
      WHERE published = TRUE
        AND featured = TRUE
      ORDER BY display_order ASC, updated_at DESC
      LIMIT ${options.limit}
    `;
  }

  return sql`
    SELECT
      id,
      slug,
      title,
      client_name,
      short_description,
      category,
      services_provided,
      thumbnail_url,
      case_study_slug,
      featured,
      published,
      display_order,
      created_at,
      updated_at
    FROM portfolio_items
    WHERE published = TRUE
    ORDER BY featured DESC, display_order ASC, updated_at DESC
    LIMIT ${options.limit}
  `;
};

export const fetchPortfolioItemBySlug = async (
  sql: SqlClient,
  slug: string,
  includeDrafts: boolean
) => {
  const rows = includeDrafts
    ? await sql`
        SELECT
          id,
          slug,
          title,
          client_name,
          short_description,
          category,
          services_provided,
          thumbnail_url,
          case_study_slug,
          featured,
          published,
          display_order,
          created_at,
          updated_at
        FROM portfolio_items
        WHERE slug = ${slug}
        LIMIT 1
      `
    : await sql`
        SELECT
          id,
          slug,
          title,
          client_name,
          short_description,
          category,
          services_provided,
          thumbnail_url,
          case_study_slug,
          featured,
          published,
          display_order,
          created_at,
          updated_at
        FROM portfolio_items
        WHERE slug = ${slug}
          AND published = TRUE
        LIMIT 1
      `;

  return rows[0] || null;
};

export const createLead = async (sql: SqlClient, payload: LeadCreateInput) => {
  const inserted = await sql`
    INSERT INTO leads (
      name,
      email,
      phone,
      company,
      message,
      source
    )
    VALUES (
      ${parseText(payload.name)},
      ${payload.email},
      ${parseText(payload.phone)},
      ${parseText(payload.company)},
      ${parseText(payload.message)},
      ${parseText(payload.source)}
    )
    RETURNING id
  `;

  return Number(inserted[0]?.id || 0);
};

export const toCaseStudyCreateInput = (raw: Record<string, unknown>): CaseStudyCreateInput => ({
  title: parseText(raw.title) || '',
  slug: parseText(raw.slug) || '',
  client_name: parseText(raw.client_name),
  summary: parseText(raw.summary),
  challenge: parseText(raw.challenge),
  solution: parseText(raw.solution),
  results: parseText(raw.results),
  services_provided: parseText(raw.services_provided),
  featured_image_url: parseText(raw.featured_image_url),
  gallery_images: parseText(raw.gallery_images),
  tech_stack: parseText(raw.tech_stack),
  cta_text: parseText(raw.cta_text),
  cta_link: parseText(raw.cta_link),
  is_featured: parseBoolean(raw.is_featured, false),
  is_published: parseBoolean(raw.is_published, true)
});
