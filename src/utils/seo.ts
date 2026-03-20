export type SeoConfig = {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  robots?: string;
  keywords?: string[] | string;
  type?: 'website' | 'article';
};

const JSON_LD_PREFIX = 'apex-seo-jsonld-';
const SITE_URL_FALLBACK =
  (import.meta.env.VITE_SITE_URL || '').trim().replace(/\/$/, '') ||
  'https://apexdigitalconsultants.com';
export const SITE_NAME = 'Apex Digital Consultants';
export const DEFAULT_IMAGE =
  'https://qrklffj021lqoknd.public.blob.vercel-storage.com/Founder%20Image-bi5nUPhP7R5uZ3PSII3Nd3SCTVZFBa.jpeg';
export const DEFAULT_SEO_DESCRIPTION =
  'Apex Digital Consultants delivers website development and web design services for businesses in Barbados and across the Caribbean.';

const ensureMetaTag = (selector: string, key: 'name' | 'property', value: string) => {
  let tag = document.querySelector<HTMLMetaElement>(selector);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(key, value);
    document.head.appendChild(tag);
  }

  return tag;
};

const setMetaContent = (
  selector: string,
  key: 'name' | 'property',
  value: string,
  content: string
) => {
  const tag = ensureMetaTag(selector, key, value);
  tag.setAttribute('content', content);
};

const ensureCanonicalLink = () => {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  return link;
};

export const resolveSiteUrl = () => {
  if (typeof window === 'undefined') return SITE_URL_FALLBACK;
  return window.location.origin || SITE_URL_FALLBACK;
};

export const toAbsoluteUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const normalizedPath = value.startsWith('/') ? value : `/${value}`;
  return `${resolveSiteUrl()}${normalizedPath}`;
};

export const applySeo = ({
  title,
  description,
  image,
  canonical,
  robots,
  keywords,
  type = 'website'
}: SeoConfig) => {
  const resolvedImage = image || DEFAULT_IMAGE;
  const resolvedRobots = robots || 'index, follow';
  const keywordsString = Array.isArray(keywords)
    ? keywords.map((keyword) => keyword.trim()).filter(Boolean).join(', ')
    : (keywords || '').trim();

  document.title = title;

  setMetaContent('meta[name="description"]', 'name', 'description', description);
  setMetaContent('meta[name="robots"]', 'name', 'robots', resolvedRobots);
  if (keywordsString) {
    setMetaContent('meta[name="keywords"]', 'name', 'keywords', keywordsString);
  }
  setMetaContent('meta[property="og:locale"]', 'property', 'og:locale', 'en_BB');
  setMetaContent('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);
  setMetaContent('meta[property="og:type"]', 'property', 'og:type', type);
  setMetaContent('meta[property="og:title"]', 'property', 'og:title', title);
  setMetaContent(
    'meta[property="og:description"]',
    'property',
    'og:description',
    description
  );
  setMetaContent('meta[property="og:image"]', 'property', 'og:image', resolvedImage);
  setMetaContent('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaContent('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMetaContent(
    'meta[name="twitter:description"]',
    'name',
    'twitter:description',
    description
  );
  setMetaContent('meta[name="twitter:image"]', 'name', 'twitter:image', resolvedImage);
  setMetaContent('meta[name="twitter:site"]', 'name', 'twitter:site', '@apexdigitalconsultants');

  if (canonical) {
    const canonicalLink = ensureCanonicalLink();
    canonicalLink.setAttribute('href', canonical);
    setMetaContent('meta[property="og:url"]', 'property', 'og:url', canonical);
  }
};

type JsonLdPayload = Record<string, unknown> | Array<Record<string, unknown>>;

export const upsertJsonLd = (id: string, payload: JsonLdPayload) => {
  const scriptId = `${JSON_LD_PREFIX}${id}`;
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(payload);
};

export const removeJsonLd = (id: string) => {
  const script = document.getElementById(`${JSON_LD_PREFIX}${id}`);
  script?.remove();
};

export const clearManagedJsonLd = () => {
  const scripts = document.querySelectorAll<HTMLScriptElement>(
    `script[type="application/ld+json"][id^="${JSON_LD_PREFIX}"]`
  );
  scripts.forEach((script) => script.remove());
};
