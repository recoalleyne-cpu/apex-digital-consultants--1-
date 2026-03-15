import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export const config = {
  runtime: 'nodejs'
};

type GeneratorInput = {
  service: string | null;
  location: string | null;
  targetKeyword: string | null;
  targetAudience: string | null;
  ctaText: string;
  ctaLink: string;
};

type LandingPageDraft = {
  title: string;
  slug: string;
  hero_heading: string;
  hero_subheading: string;
  body_content: string;
  seo_title: string;
  seo_description: string;
  cta_text: string;
  cta_link: string;
  region: string | null;
  service_category: string | null;
};

const parseText = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const toObject = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const clip = (value: string, max: number) => {
  if (value.length <= max) return value;
  return value.slice(0, max).trim();
};

const buildTemplateDraft = (input: GeneratorInput): LandingPageDraft => {
  const serviceLabel = input.service || 'Digital Marketing Services';
  const locationLabel = input.location;
  const keywordLabel =
    input.targetKeyword ||
    [serviceLabel, locationLabel].filter(Boolean).join(' ').trim() ||
    serviceLabel;
  const audienceLabel = input.targetAudience || 'business owners';
  const locationSuffix = locationLabel ? ` in ${locationLabel}` : '';
  const title = `${serviceLabel}${locationSuffix}`.trim();
  const slug = slugify(keywordLabel || title);

  const heroHeading = `${serviceLabel}${locationSuffix}`.trim();
  const heroSubheading = `Data-driven ${serviceLabel.toLowerCase()} tailored for ${audienceLabel}${
    locationLabel ? ` in ${locationLabel}` : ''
  }.`;

  const bodyContent = `Apex Digital Consultants helps ${audienceLabel} achieve measurable growth through ${
    keywordLabel || serviceLabel
  }.\n\nOur team combines strategy, creative execution, and performance tracking to improve visibility, attract qualified leads, and increase conversions${
    locationLabel ? ` across ${locationLabel}` : ''
  }.\n\nEvery engagement is built around your business goals, timeline, and market position so you can scale with confidence.\n\nReady to get started? Connect with Apex Digital Consultants for a focused plan that turns opportunities into results.`;

  const seoTitle = clip(`${title} | Apex Digital Consultants`, 60);
  const seoDescription = clip(
    `Need ${serviceLabel.toLowerCase()}${locationSuffix}? Apex Digital Consultants helps ${audienceLabel} generate qualified leads with strategy-driven execution.`,
    160
  );

  return {
    title,
    slug: slug || slugify(title),
    hero_heading: heroHeading,
    hero_subheading: heroSubheading,
    body_content: bodyContent,
    seo_title: seoTitle,
    seo_description: seoDescription,
    cta_text: input.ctaText,
    cta_link: input.ctaLink,
    region: input.location,
    service_category: input.service
  };
};

const extractJsonObject = (raw: string): Record<string, unknown> | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const parseCandidate = (candidate: string) => {
    try {
      const parsed = JSON.parse(candidate);
      return toObject(parsed);
    } catch {
      return null;
    }
  };

  const direct = parseCandidate(trimmed);
  if (direct) return direct;

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    const fenced = parseCandidate(fencedMatch[1]);
    if (fenced) return fenced;
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    const loose = parseCandidate(trimmed.slice(firstBrace, lastBrace + 1));
    if (loose) return loose;
  }

  return null;
};

const normalizeDraft = (
  modelDraft: Record<string, unknown> | null,
  input: GeneratorInput,
  fallback: LandingPageDraft
): LandingPageDraft => {
  const title = parseText(modelDraft?.title) || fallback.title;
  const heroHeading = parseText(modelDraft?.hero_heading) || fallback.hero_heading;
  const heroSubheading = parseText(modelDraft?.hero_subheading) || fallback.hero_subheading;
  const bodyContent = parseText(modelDraft?.body_content) || fallback.body_content;
  const seoTitle = clip(parseText(modelDraft?.seo_title) || fallback.seo_title, 60);
  const seoDescription = clip(
    parseText(modelDraft?.seo_description) || fallback.seo_description,
    160
  );
  const rawSlug =
    parseText(modelDraft?.slug) ||
    parseText(modelDraft?.title) ||
    input.targetKeyword ||
    title;
  const slug = slugify(rawSlug || fallback.slug) || fallback.slug;

  return {
    title,
    slug,
    hero_heading: heroHeading,
    hero_subheading: heroSubheading,
    body_content: bodyContent,
    seo_title: seoTitle,
    seo_description: seoDescription,
    cta_text: parseText(modelDraft?.cta_text) || fallback.cta_text,
    cta_link: parseText(modelDraft?.cta_link) || fallback.cta_link,
    region: parseText(modelDraft?.region) || fallback.region,
    service_category: parseText(modelDraft?.service_category) || fallback.service_category
  };
};

const generateWithAi = async (
  input: GeneratorInput,
  fallback: LandingPageDraft
): Promise<LandingPageDraft> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY');
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `You are an SEO copywriter for Apex Digital Consultants.
Generate conversion-focused landing page content using the inputs below.

Inputs:
- service: ${input.service || ''}
- location: ${input.location || ''}
- target keyword: ${input.targetKeyword || ''}
- target audience: ${input.targetAudience || ''}
- CTA text: ${input.ctaText}
- CTA link: ${input.ctaLink}

Return JSON only with this exact shape:
{
  "title": "...",
  "slug": "...",
  "hero_heading": "...",
  "hero_subheading": "...",
  "body_content": "...",
  "seo_title": "...",
  "seo_description": "...",
  "cta_text": "...",
  "cta_link": "...",
  "region": "...",
  "service_category": "..."
}

Rules:
- Keep title and hero heading concise and keyword-aware.
- slug must be lowercase and hyphenated.
- body_content must be plain text with short paragraphs separated by blank lines.
- seo_title should stay under 60 characters.
- seo_description should stay under 160 characters.
- Keep tone premium, professional, and clear.
- Do not include markdown, extra keys, or explanations outside JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      temperature: 0.5,
      topP: 0.9,
      maxOutputTokens: 900,
      responseMimeType: 'application/json'
    }
  });

  const parsed = extractJsonObject(response.text || '');
  return normalizeDraft(parsed, input, fallback);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
    }

    let payload: Record<string, unknown>;
    try {
      const body =
        typeof req.body === 'string'
          ? JSON.parse(req.body || '{}')
          : req.body || {};
      payload = toObject(body) ?? {};
    } catch {
      return res.status(400).send('Invalid JSON payload');
    }

    const service = parseText(payload.service) || parseText(payload.service_category);
    const location = parseText(payload.location) || parseText(payload.region);
    const targetKeyword = parseText(payload.target_keyword);
    const targetAudience = parseText(payload.target_audience);
    const ctaText = parseText(payload.cta_text) || 'Get A Quote';
    const ctaLink = parseText(payload.cta_link) || '/contact';

    if (!service && !location && !targetKeyword) {
      return res
        .status(400)
        .send('Provide at least one of service, location, or target_keyword');
    }

    const input: GeneratorInput = {
      service,
      location,
      targetKeyword,
      targetAudience,
      ctaText,
      ctaLink
    };

    const fallbackDraft = buildTemplateDraft(input);

    try {
      const aiDraft = await generateWithAi(input, fallbackDraft);
      return res.status(200).json({
        success: true,
        source: 'ai',
        item: aiDraft
      });
    } catch (error) {
      console.error('Landing page AI generation failed:', error);
      return res.status(200).json({
        success: true,
        source: 'template',
        message:
          'AI generation is unavailable right now. A structured template draft was generated instead.',
        item: fallbackDraft
      });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown landing page generation error';
    return res.status(500).send(`Landing page generation failed: ${message}`);
  }
}
