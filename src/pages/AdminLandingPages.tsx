import React, { useEffect, useState } from 'react';

type LandingPageSummary = {
  id: number;
  title: string;
  slug: string;
  region?: string | null;
  service_category?: string | null;
  is_published?: boolean;
  updated_at?: string | null;
};

type GeneratedLandingPageDraft = {
  title?: string;
  slug?: string;
  hero_heading?: string;
  hero_subheading?: string;
  body_content?: string;
  seo_title?: string;
  seo_description?: string;
  cta_text?: string;
  cta_link?: string;
  region?: string;
  service_category?: string;
};

type LandingPageCreatePayload = {
  title: string;
  slug: string;
  hero_heading: string;
  hero_subheading: string;
  body_content: string;
  featured_image_url: string;
  cta_text: string;
  cta_link: string;
  seo_title: string;
  seo_description: string;
  region: string;
  service_category: string;
  is_published: boolean;
};

type BulkEntryInput = Record<string, unknown>;

type BulkGenerationResult = {
  index: number;
  status: 'created' | 'failed';
  title: string;
  slug?: string;
  source?: 'ai' | 'template';
  message: string;
};

type ParsedBulkEntries = {
  entries: BulkEntryInput[];
  warnings: string[];
  error: string | null;
};

const BULK_MAX_ENTRIES = 24;

const BULK_SAMPLE_JSON = `[
  {
    "service": "Google Ads Management",
    "location": "Barbados",
    "target_keyword": "google ads barbados",
    "target_audience": "small business owners",
    "cta_text": "Book Your Strategy Call",
    "cta_link": "/contact",
    "region": "Barbados",
    "service_category": "Google Ads",
    "is_published": false
  },
  {
    "service": "Web Design",
    "location": "Caribbean",
    "target_keyword": "web design caribbean",
    "target_audience": "service businesses",
    "cta_text": "Request A Quote",
    "cta_link": "/contact",
    "region": "Caribbean",
    "service_category": "Web Design",
    "is_published": false
  }
]`;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const formatDate = (value?: string | null) => {
  if (!value) return 'No update date';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'No update date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const readText = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const readBoolean = (value: unknown, fallback: boolean) => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  return fallback;
};

const toObject = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
};

const parseBulkEntries = (input: string): ParsedBulkEntries => {
  if (!input.trim()) {
    return {
      entries: [],
      warnings: [],
      error: 'Paste a JSON array of bulk entries first.'
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    return {
      entries: [],
      warnings: [],
      error: 'Invalid JSON. Paste a valid JSON array of entry objects.'
    };
  }

  let rawEntries: unknown[] | null = null;

  if (Array.isArray(parsed)) {
    rawEntries = parsed;
  } else {
    const parsedObject = toObject(parsed);
    if (parsedObject && Array.isArray(parsedObject.entries)) {
      rawEntries = parsedObject.entries as unknown[];
    }
  }

  if (!rawEntries) {
    return {
      entries: [],
      warnings: [],
      error: 'Expected a JSON array or an object with an "entries" array.'
    };
  }

  const entries: BulkEntryInput[] = [];
  let skipped = 0;

  rawEntries.forEach((entry) => {
    const normalized = toObject(entry);
    if (!normalized) {
      skipped += 1;
      return;
    }
    entries.push(normalized);
  });

  if (!entries.length) {
    return {
      entries: [],
      warnings: [],
      error: 'No valid entry objects were found in the provided JSON.'
    };
  }

  return {
    entries,
    warnings: skipped ? [`Skipped ${skipped} invalid non-object entries.`] : [],
    error: null
  };
};

export const AdminLandingPages = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);

  const [heroHeading, setHeroHeading] = useState('');
  const [heroSubheading, setHeroSubheading] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');

  const [ctaText, setCtaText] = useState('Get A Quote');
  const [ctaLink, setCtaLink] = useState('/contact');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const [region, setRegion] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const [saving, setSaving] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [generatorSource, setGeneratorSource] = useState<'ai' | 'template' | null>(null);
  const [generatorMessage, setGeneratorMessage] = useState<string | null>(null);
  const [bulkInput, setBulkInput] = useState('');
  const [bulkPublishImmediately, setBulkPublishImmediately] = useState(false);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<string | null>(null);
  const [bulkSummary, setBulkSummary] = useState<string | null>(null);
  const [bulkResults, setBulkResults] = useState<BulkGenerationResult[]>([]);
  const [items, setItems] = useState<LandingPageSummary[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const loadLandingPages = async () => {
    try {
      setLoadingItems(true);
      const res = await fetch('/api/landing-pages?include_drafts=true&limit=25');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Failed to load (${res.status})`);
      }

      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (error) {
      console.error(error);
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    loadLandingPages();
  }, []);

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setSlugEdited(false);
    setHeroHeading('');
    setHeroSubheading('');
    setBodyContent('');
    setFeaturedImageUrl('');
    setCtaText('Get A Quote');
    setCtaLink('/contact');
    setSeoTitle('');
    setSeoDescription('');
    setRegion('');
    setServiceCategory('');
    setTargetKeyword('');
    setTargetAudience('');
    setIsPublished(true);
    setGeneratorSource(null);
    setGeneratorMessage(null);
  };

  const applyGeneratedDraft = (draft: GeneratedLandingPageDraft) => {
    if (draft.title?.trim()) setTitle(draft.title.trim());
    if (draft.slug?.trim()) {
      setSlug(slugify(draft.slug));
      setSlugEdited(true);
    }
    if (draft.hero_heading?.trim()) setHeroHeading(draft.hero_heading.trim());
    if (draft.hero_subheading?.trim()) setHeroSubheading(draft.hero_subheading.trim());
    if (draft.body_content?.trim()) setBodyContent(draft.body_content.trim());
    if (draft.seo_title?.trim()) setSeoTitle(draft.seo_title.trim());
    if (draft.seo_description?.trim()) setSeoDescription(draft.seo_description.trim());
    if (draft.cta_text?.trim()) setCtaText(draft.cta_text.trim());
    if (draft.cta_link?.trim()) setCtaLink(draft.cta_link.trim());
    if (draft.region?.trim()) setRegion(draft.region.trim());
    if (draft.service_category?.trim()) setServiceCategory(draft.service_category.trim());
  };

  const requestGeneratedDraft = async (params: {
    service: string;
    location: string;
    target_keyword: string;
    target_audience: string;
    cta_text: string;
    cta_link: string;
  }) => {
    const response = await fetch('/api/landing-pages-generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || `Landing page generation failed (${response.status})`);
    }

    return {
      draft: (data?.item || {}) as GeneratedLandingPageDraft,
      source: data?.source === 'ai' ? 'ai' : 'template',
      message: readText(data?.message)
    };
  };

  const postLandingPage = async (payload: LandingPageCreatePayload) => {
    const response = await fetch('/api/landing-pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      message: text || `Landing page create failed (${response.status})`
    };
  };

  const saveLandingPageWithSlugRetries = async (
    payload: LandingPageCreatePayload,
    usedSlugs: Set<string>
  ) => {
    const rootSlug = slugify(payload.slug || payload.title || 'landing-page');
    if (!rootSlug) {
      return {
        success: false,
        error: 'A valid slug could not be generated for this entry.'
      };
    }

    for (let attempt = 0; attempt < 7; attempt += 1) {
      const candidateSlug = attempt === 0 ? rootSlug : `${rootSlug}-${attempt + 1}`;
      if (usedSlugs.has(candidateSlug)) {
        continue;
      }

      const result = await postLandingPage({
        ...payload,
        slug: candidateSlug
      });

      if (result.ok) {
        usedSlugs.add(candidateSlug);
        return {
          success: true,
          slug: candidateSlug
        };
      }

      if (result.status === 409) {
        usedSlugs.add(candidateSlug);
        continue;
      }

      return {
        success: false,
        error: result.message
      };
    }

    return {
      success: false,
      error: `Could not find a unique slug after multiple attempts for "${payload.title}".`
    };
  };

  const handleGenerateTemplateDraft = () => {
    const service = serviceCategory.trim();
    const market = region.trim();
    const keyword = targetKeyword.trim() || [service, market].filter(Boolean).join(' ').trim();
    const audience = targetAudience.trim() || 'business owners';

    if (!service && !market && !keyword) {
      alert('Enter at least a service, region, or target keyword to generate a draft.');
      return;
    }

    const serviceLabel = service || 'Digital Marketing';
    const locationSuffix = market ? ` in ${market}` : '';
    const titleCandidate = `${serviceLabel}${locationSuffix}`.trim();
    const headingCandidate = `${serviceLabel}${locationSuffix}`.trim();
    const subheadingCandidate = `Performance-focused ${serviceLabel.toLowerCase()} services${
      market ? ` for ${audience} in ${market}` : ` for ${audience}`
    }.`;
    const seoTitleCandidate = `${titleCandidate} | Apex Digital Consultants`;
    const seoDescriptionCandidate = `Need ${serviceLabel.toLowerCase()}${
      locationSuffix ? locationSuffix : ''
    }? Apex Digital Consultants helps ${audience} execute measurable growth strategies.`;
    const bodyCandidate = `If you're searching for ${keyword || serviceLabel}, Apex Digital Consultants delivers conversion-focused execution built for ${audience}.\n\nWe combine strategy, design, and performance systems to attract qualified leads, strengthen visibility, and grow revenue${
      market ? ` in ${market}` : ''
    }.\n\nEvery campaign is tailored to your business goals with clear reporting and practical next steps.\n\nReady to move forward? Contact us for a custom growth plan and implementation roadmap.`;

    applyGeneratedDraft({
      title: titleCandidate,
      slug: slugEdited ? slug : slugify(keyword || titleCandidate),
      hero_heading: headingCandidate,
      hero_subheading: subheadingCandidate,
      body_content: bodyCandidate,
      seo_title: seoTitleCandidate,
      seo_description: seoDescriptionCandidate,
      cta_text: ctaText || 'Get A Quote',
      cta_link: ctaLink || '/contact'
    });
    setGeneratorSource('template');
    setGeneratorMessage('Template draft generated. Review and edit before saving.');
  };

  const handleGenerateAiDraft = async () => {
    const service = serviceCategory.trim();
    const market = region.trim();
    const keyword = targetKeyword.trim();

    if (!service && !market && !keyword) {
      alert('Enter at least a service, region, or target keyword to generate AI content.');
      return;
    }

    setGeneratingAi(true);
    setGeneratorSource(null);
    setGeneratorMessage(null);

    try {
      const generated = await requestGeneratedDraft({
        service,
        location: market,
        target_keyword: keyword,
        target_audience: targetAudience.trim(),
        cta_text: ctaText.trim(),
        cta_link: ctaLink.trim()
      });

      applyGeneratedDraft(generated.draft);
      setGeneratorSource(generated.source);
      setGeneratorMessage(
        generated.message ||
          (generated.source === 'ai'
            ? 'AI draft generated. Review and edit before publishing.'
            : 'Template draft generated. Review and edit before publishing.')
      );
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to generate AI draft');
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !bodyContent.trim()) {
      alert('Title and body content are required.');
      return;
    }

    const resolvedSlug = slugify(slug || title);
    if (!resolvedSlug) {
      alert('A valid slug could not be generated. Please adjust title or slug.');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/landing-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          slug: resolvedSlug,
          hero_heading: heroHeading,
          hero_subheading: heroSubheading,
          body_content: bodyContent,
          featured_image_url: featuredImageUrl,
          cta_text: ctaText,
          cta_link: ctaLink,
          seo_title: seoTitle,
          seo_description: seoDescription,
          region,
          service_category: serviceCategory,
          is_published: isPublished
        })
      });

      const text = await res.text();
      if (!res.ok) {
        throw new Error(text || 'Failed to create landing page');
      }

      resetForm();
      await loadLandingPages();
      alert('Landing page created successfully.');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to create landing page');
    } finally {
      setSaving(false);
    }
  };

  const handleRunBulkGeneration = async () => {
    const parsed = parseBulkEntries(bulkInput);

    if (parsed.error) {
      alert(parsed.error);
      return;
    }

    if (parsed.entries.length > BULK_MAX_ENTRIES) {
      alert(`Please run up to ${BULK_MAX_ENTRIES} entries at a time for production-safe processing.`);
      return;
    }

    setBulkRunning(true);
    setBulkResults([]);
    setBulkSummary(null);
    setBulkProgress(`Preparing ${parsed.entries.length} entries...`);

    const usedSlugs = new Set(items.map((entry) => entry.slug));
    let createdCount = 0;
    let failedCount = 0;

    try {
      for (let index = 0; index < parsed.entries.length; index += 1) {
        const entry = parsed.entries[index];
        const displayIndex = index + 1;
        setBulkProgress(`Processing ${displayIndex} of ${parsed.entries.length}...`);

        const service = readText(entry.service) || readText(entry.service_category) || '';
        const location = readText(entry.location) || readText(entry.region) || '';
        const keyword =
          readText(entry.target_keyword) || readText(entry.targetKeyword) || '';
        const audience =
          readText(entry.target_audience) || readText(entry.targetAudience) || '';
        const ctaTextValue = readText(entry.cta_text) || readText(entry.ctaText) || 'Get A Quote';
        const ctaLinkValue = readText(entry.cta_link) || readText(entry.ctaLink) || '/contact';
        const regionValue = readText(entry.region) || location;
        const serviceCategoryValue = readText(entry.service_category) || service;
        const featuredImageValue =
          readText(entry.featured_image_url) || readText(entry.featuredImageUrl) || '';
        const publishValue = readBoolean(entry.is_published, bulkPublishImmediately);

        if (!service && !location && !keyword) {
          failedCount += 1;
          setBulkResults((prev) => [
            ...prev,
            {
              index: displayIndex,
              status: 'failed',
              title: `Entry ${displayIndex}`,
              message: 'Missing required generator context. Add service, location, or target keyword.'
            }
          ]);
          continue;
        }

        try {
          const generated = await requestGeneratedDraft({
            service,
            location,
            target_keyword: keyword,
            target_audience: audience,
            cta_text: ctaTextValue,
            cta_link: ctaLinkValue
          });

          const draft = generated.draft;
          const resolvedTitle =
            readText(entry.title) ||
            readText(draft.title) ||
            [service, location].filter(Boolean).join(' ') ||
            keyword ||
            `Landing Page ${displayIndex}`;
          const resolvedBody = readText(draft.body_content) || readText(entry.body_content);

          if (!resolvedBody) {
            throw new Error('Generated draft did not include body content.');
          }

          const resolvedSlug = slugify(
            readText(entry.slug) ||
              readText(draft.slug) ||
              keyword ||
              resolvedTitle
          );

          const payload: LandingPageCreatePayload = {
            title: resolvedTitle,
            slug: resolvedSlug,
            hero_heading: readText(draft.hero_heading) || readText(entry.hero_heading) || resolvedTitle,
            hero_subheading:
              readText(draft.hero_subheading) || readText(entry.hero_subheading) || '',
            body_content: resolvedBody,
            featured_image_url: featuredImageValue,
            cta_text: ctaTextValue,
            cta_link: ctaLinkValue,
            seo_title:
              readText(draft.seo_title) ||
              readText(entry.seo_title) ||
              `${resolvedTitle} | Apex Digital Consultants`,
            seo_description:
              readText(draft.seo_description) ||
              readText(entry.seo_description) ||
              '',
            region: regionValue || '',
            service_category: serviceCategoryValue || '',
            is_published: publishValue
          };

          const saveResult = await saveLandingPageWithSlugRetries(payload, usedSlugs);
          if (!saveResult.success) {
            throw new Error(saveResult.error || 'Failed to save generated landing page.');
          }

          createdCount += 1;
          setBulkResults((prev) => [
            ...prev,
            {
              index: displayIndex,
              status: 'created',
              title: payload.title,
              slug: saveResult.slug,
              source: generated.source,
              message: generated.source === 'ai' ? 'Generated with AI and saved.' : 'Template-generated and saved.'
            }
          ]);
        } catch (error) {
          failedCount += 1;
          setBulkResults((prev) => [
            ...prev,
            {
              index: displayIndex,
              status: 'failed',
              title: readText(entry.title) || [service, location].filter(Boolean).join(' ') || `Entry ${displayIndex}`,
              message: error instanceof Error ? error.message : 'Unexpected bulk generation error'
            }
          ]);
        }
      }

      const warningsText = parsed.warnings.length ? ` ${parsed.warnings.join(' ')}` : '';
      setBulkSummary(
        `${createdCount} landing page${createdCount === 1 ? '' : 's'} created, ${failedCount} failed.${warningsText}`
      );
      await loadLandingPages();
    } finally {
      setBulkRunning(false);
      setBulkProgress(null);
    }
  };

  return (
    <div className="container-wide py-6">
      <div className="max-w-6xl">
        <h1 className="heading-lg mb-4">SEO Landing Page Generator</h1>
        <p className="text-apple-gray-300 leading-8 mb-10">
          Create scalable service/location landing pages from structured inputs. This workflow is prepared for future
          AI-assisted content autofill while remaining stable for production now.
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-6 space-y-4">
              <h2 className="text-xl font-semibold">Generator Inputs</h2>
              <p className="text-sm text-apple-gray-300">
                Generate landing page copy from structured service/location inputs. You can always edit everything
                before saving.
              </p>

              <input
                type="text"
                placeholder="Service (example: Google Ads)"
                value={serviceCategory}
                onChange={(e) => setServiceCategory(e.target.value)}
                className="w-full border border-apple-gray-100 p-4 rounded-xl bg-white"
              />

              <input
                type="text"
                placeholder="Location (example: Barbados)"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full border border-apple-gray-100 p-4 rounded-xl bg-white"
              />

              <input
                type="text"
                placeholder="Target Keyword (example: google ads barbados)"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                className="w-full border border-apple-gray-100 p-4 rounded-xl bg-white"
              />

              <input
                type="text"
                placeholder="Target Audience (example: local business owners)"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full border border-apple-gray-100 p-4 rounded-xl bg-white"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleGenerateAiDraft}
                  className="apple-button apple-button-primary"
                  disabled={generatingAi}
                >
                  {generatingAi ? 'Generating...' : 'Generate with AI'}
                </button>
                <button
                  onClick={handleGenerateTemplateDraft}
                  className="apple-button apple-button-secondary"
                >
                  Quick Template Draft
                </button>
              </div>

              {generatorMessage ? (
                <p className="text-sm text-apple-gray-300">
                  <span className="font-semibold text-apple-gray-500 uppercase tracking-wide mr-2">
                    {generatorSource === 'ai' ? 'AI' : 'Template'}
                  </span>
                  {generatorMessage}
                </p>
              ) : null}
            </div>

            <input
              type="text"
              placeholder="Title*"
              value={title}
              onChange={(e) => {
                const nextTitle = e.target.value;
                setTitle(nextTitle);
                if (!slugEdited) {
                  setSlug(slugify(nextTitle));
                }
              }}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="Slug* (example: google-ads-barbados)"
              value={slug}
              onChange={(e) => {
                setSlugEdited(true);
                setSlug(slugify(e.target.value));
              }}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="Hero Heading"
              value={heroHeading}
              onChange={(e) => setHeroHeading(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <textarea
              placeholder="Hero Subheading"
              value={heroSubheading}
              onChange={(e) => setHeroSubheading(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[100px]"
            />

            <textarea
              placeholder="Body Content*"
              value={bodyContent}
              onChange={(e) => setBodyContent(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[220px]"
            />

            <input
              type="text"
              placeholder="Featured Image URL"
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="CTA Text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full border border-apple-gray-100 p-4 rounded-xl"
              />

              <input
                type="text"
                placeholder="CTA Link"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                className="w-full border border-apple-gray-100 p-4 rounded-xl"
              />
            </div>

            <input
              type="text"
              placeholder="SEO Title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <textarea
              placeholder="SEO Description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[100px]"
            />

            <label className="flex items-center gap-3 text-sm text-apple-gray-300">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4"
              />
              Publish immediately
            </label>

            <button onClick={handleCreate} className="apple-button apple-button-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Create Landing Page'}
            </button>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-apple-gray-100 p-6 bg-apple-gray-50 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Bulk Generator (Staged)</h2>
                  <p className="text-sm text-apple-gray-300 mt-1">
                    Paste a structured JSON list, generate pages one-by-one through the existing AI endpoint, and save
                    safely into `landing_pages`.
                  </p>
                </div>
                <button
                  onClick={() => setBulkInput(BULK_SAMPLE_JSON)}
                  className="apple-button apple-button-secondary text-sm whitespace-nowrap"
                  disabled={bulkRunning}
                >
                  Load Sample
                </button>
              </div>

              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder='Paste JSON array of entries. Example: [{"service":"Google Ads","location":"Barbados","target_keyword":"google ads barbados"}]'
                className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[220px] font-mono text-sm bg-white"
              />

              <p className="text-xs text-apple-gray-300 leading-6">
                Accepted keys per entry: `service`, `location`, `target_keyword`, `target_audience`, `cta_text`,
                `cta_link`, `region`, `service_category`, `featured_image_url`, `slug`, `is_published`.
              </p>

              <label className="flex items-center gap-3 text-sm text-apple-gray-300">
                <input
                  type="checkbox"
                  checked={bulkPublishImmediately}
                  onChange={(e) => setBulkPublishImmediately(e.target.checked)}
                  className="w-4 h-4"
                />
                Publish generated pages immediately (otherwise saved as drafts)
              </label>

              <button
                onClick={handleRunBulkGeneration}
                className="apple-button apple-button-primary"
                disabled={bulkRunning}
              >
                {bulkRunning ? 'Generating Bulk Pages...' : 'Run Bulk Generation'}
              </button>

              {bulkProgress ? <p className="text-sm text-apple-gray-300">{bulkProgress}</p> : null}
              {bulkSummary ? <p className="text-sm text-apple-gray-500 font-medium">{bulkSummary}</p> : null}

              {bulkResults.length ? (
                <div className="space-y-3 max-h-[340px] overflow-auto pr-1">
                  {bulkResults.map((result) => (
                    <div key={`${result.index}-${result.title}-${result.slug || 'none'}`} className="rounded-xl border border-apple-gray-100 bg-white p-4">
                      <p className="font-semibold text-apple-gray-500">
                        {result.index}. {result.title}
                      </p>
                      <p className="text-sm text-apple-gray-300 mt-1">
                        {result.slug ? `/lp/${result.slug}` : 'No slug saved'}
                      </p>
                      <p className="text-sm mt-2 text-apple-gray-300">{result.message}</p>
                      <p className="text-xs mt-2 uppercase tracking-wider font-semibold text-apex-yellow">
                        {result.status}
                        {result.source ? ` · ${result.source}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-apple-gray-100 p-6 bg-apple-gray-50">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold">Recent Landing Pages</h2>
                <button onClick={loadLandingPages} className="apple-button apple-button-secondary text-sm">
                  Refresh
                </button>
              </div>

              {loadingItems ? (
                <p className="text-apple-gray-300">Loading landing pages...</p>
              ) : !items.length ? (
                <p className="text-apple-gray-300">No landing pages found yet.</p>
              ) : (
                <div className="space-y-4 max-h-[760px] overflow-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="rounded-xl border border-apple-gray-100 bg-white p-4">
                      <p className="font-semibold text-apple-gray-500">{item.title}</p>
                      <p className="text-sm text-apple-gray-300 mt-1 break-all">/lp/{item.slug}</p>
                      <p className="text-sm text-apple-gray-300 mt-2">
                        {[item.service_category, item.region].filter(Boolean).join(' · ') || 'General'}
                      </p>
                      <p className="text-xs text-apex-yellow mt-2 uppercase tracking-wider font-semibold">
                        {item.is_published ? 'published' : 'draft'} · {formatDate(item.updated_at)}
                      </p>
                      <a
                        href={`/lp/${item.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex mt-3 text-sm font-medium text-apple-gray-500 hover:text-apex-yellow transition-colors"
                      >
                        Open Live Preview
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
