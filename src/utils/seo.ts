export type SeoConfig = {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  robots?: string;
  type?: 'website' | 'article';
};

const SITE_NAME = 'Apex Digital Consultants';
const DEFAULT_IMAGE =
  'https://qrklffj021lqoknd.public.blob.vercel-storage.com/Founder%20Image-bi5nUPhP7R5uZ3PSII3Nd3SCTVZFBa.jpeg';

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

export const applySeo = ({
  title,
  description,
  image,
  canonical,
  robots,
  type = 'website'
}: SeoConfig) => {
  const resolvedImage = image || DEFAULT_IMAGE;

  document.title = title;

  setMetaContent('meta[name="description"]', 'name', 'description', description);
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

  if (robots) {
    setMetaContent('meta[name="robots"]', 'name', 'robots', robots);
  }

  if (canonical) {
    const canonicalLink = ensureCanonicalLink();
    canonicalLink.setAttribute('href', canonical);
    setMetaContent('meta[property="og:url"]', 'property', 'og:url', canonical);
  }
};
