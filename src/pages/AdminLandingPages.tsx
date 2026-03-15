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
      const res = await fetch('/api/landing-pages-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service,
          location: market,
          target_keyword: keyword,
          target_audience: targetAudience.trim(),
          cta_text: ctaText.trim(),
          cta_link: ctaLink.trim()
        })
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || `AI generation failed (${res.status})`);
      }

      const draft = (data?.item || {}) as GeneratedLandingPageDraft;
      applyGeneratedDraft(draft);

      const source = data?.source === 'ai' ? 'ai' : 'template';
      setGeneratorSource(source);
      setGeneratorMessage(
        typeof data?.message === 'string' && data.message.trim()
          ? data.message
          : source === 'ai'
            ? 'AI draft generated. Review and edit before publishing.'
            : 'Template draft generated. Review and edit before publishing.'
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

  return (
    <div className="container-wide py-32">
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
  );
};
