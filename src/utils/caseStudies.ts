import { INITIAL_CASE_STUDIES } from '../constants/caseStudiesSeed';

export type CaseStudyRecord = {
  id: number;
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
  created_at: string | null;
  updated_at: string | null;
};

type CaseStudiesFallbackOptions = {
  featuredOnly?: boolean;
  includeDrafts?: boolean;
  limit?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const toRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
};

const parseText = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const parseBoolean = (value: unknown, fallback: boolean) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
      return true;
    }
    if (normalized === 'false' || normalized === '0' || normalized === 'no') {
      return false;
    }
  }
  return fallback;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const readFirstText = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const parsed = parseText(record[key]);
    if (parsed) return parsed;
  }
  return null;
};

const readFirstBoolean = (
  record: Record<string, unknown>,
  keys: string[],
  fallback: boolean
) => {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) {
      return parseBoolean(record[key], fallback);
    }
  }
  return fallback;
};

const parseDelimitedField = (value: unknown) => {
  if (Array.isArray(value)) {
    const tokens = value
      .map((entry) => parseText(entry))
      .filter((entry): entry is string => Boolean(entry));
    return tokens.length ? tokens.join(', ') : null;
  }

  const raw = parseText(value);
  if (!raw) return null;

  const tokens = raw
    .split(/\r?\n|,/g)
    .map((entry) => entry.trim())
    .filter(Boolean);

  return tokens.length ? tokens.join(', ') : null;
};

export const normalizeCaseStudy = (
  value: unknown,
  index = 0
): CaseStudyRecord | null => {
  const record = toRecord(value);
  if (!record) return null;

  const title =
    readFirstText(record, ['title', 'caseStudyTitle']) ||
    `Case Study ${index + 1}`;
  const slug =
    readFirstText(record, ['slug']) ||
    slugify(title) ||
    `case-study-${index + 1}`;
  const clientName = readFirstText(record, ['client_name', 'clientName']) || title;
  const summary = readFirstText(record, ['summary', 'projectSummary']);
  const challenge = readFirstText(record, ['challenge']);
  const solution = readFirstText(record, ['solution']);
  const results = readFirstText(record, ['results']);
  const servicesProvided = parseDelimitedField(
    record.services_provided ?? record.servicesProvided
  );
  const featuredImageUrl = readFirstText(record, [
    'featured_image_url',
    'featuredImageUrl'
  ]);
  const galleryImages = parseDelimitedField(
    record.gallery_images ?? record.galleryImageUrls
  );
  const techStack = parseDelimitedField(record.tech_stack ?? record.techStack);
  const ctaText = readFirstText(record, ['cta_text', 'ctaLabel']);
  const ctaLink = readFirstText(record, ['cta_link', 'ctaUrl']);
  const isFeatured = readFirstBoolean(record, ['is_featured', 'featured'], false);
  const isPublished = readFirstBoolean(record, ['is_published', 'published'], true);

  return {
    id:
      typeof record.id === 'number' && Number.isFinite(record.id)
        ? record.id
        : index + 1,
    title,
    slug,
    client_name: clientName,
    summary,
    challenge,
    solution,
    results,
    services_provided: servicesProvided,
    featured_image_url: featuredImageUrl,
    gallery_images: galleryImages,
    tech_stack: techStack,
    cta_text: ctaText,
    cta_link: ctaLink,
    is_featured: isFeatured,
    is_published: isPublished,
    created_at: parseText(record.created_at),
    updated_at: parseText(record.updated_at)
  };
};

export const normalizeCaseStudyCollection = (items: unknown[]): CaseStudyRecord[] => {
  const seen = new Set<string>();
  const normalized: CaseStudyRecord[] = [];

  items.forEach((item, index) => {
    const next = normalizeCaseStudy(item, index);
    if (!next) return;
    if (!next.slug || seen.has(next.slug)) return;
    seen.add(next.slug);
    normalized.push(next);
  });

  return normalized;
};

const normalizeLimit = (value = 12) => clamp(Math.trunc(value), 1, 30);

const APPROVED_CASE_STUDIES = normalizeCaseStudyCollection(INITIAL_CASE_STUDIES);

export const buildFallbackCaseStudies = ({
  featuredOnly = false,
  includeDrafts = false,
  limit = 12
}: CaseStudiesFallbackOptions = {}) => {
  const safeLimit = normalizeLimit(limit);
  const published = includeDrafts
    ? APPROVED_CASE_STUDIES
    : APPROVED_CASE_STUDIES.filter((item) => item.is_published);
  const filtered = featuredOnly
    ? published.filter((item) => item.is_featured)
    : published;
  return filtered.slice(0, safeLimit);
};

export const findFallbackCaseStudyBySlug = (slug: string, includeDrafts = false) => {
  const normalizedSlug = slug.trim().toLowerCase();
  if (!normalizedSlug) return null;

  const source = includeDrafts
    ? APPROVED_CASE_STUDIES
    : APPROVED_CASE_STUDIES.filter((item) => item.is_published);

  return source.find((item) => item.slug.toLowerCase() === normalizedSlug) || null;
};
