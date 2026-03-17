import React, { useEffect, useState } from 'react';

type CaseStudySummaryItem = {
  id: number;
  title: string;
  slug: string;
  client_name?: string | null;
  is_featured?: boolean;
  is_published?: boolean;
  updated_at?: string | null;
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

export const AdminCaseStudies = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);

  const [clientName, setClientName] = useState('');
  const [summary, setSummary] = useState('');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [results, setResults] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState('');
  const [techStack, setTechStack] = useState('');

  const [ctaText, setCtaText] = useState('Start Your Project');
  const [ctaLink, setCtaLink] = useState('/contact');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<CaseStudySummaryItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const loadCaseStudies = async () => {
    try {
      setLoadingItems(true);
      const res = await fetch('/api/case-studies?include_drafts=true&limit=30');
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
    loadCaseStudies();
  }, []);

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setSlugEdited(false);
    setClientName('');
    setSummary('');
    setChallenge('');
    setSolution('');
    setResults('');
    setFeaturedImageUrl('');
    setGalleryImages('');
    setTechStack('');
    setCtaText('Start Your Project');
    setCtaLink('/contact');
    setIsFeatured(false);
    setIsPublished(true);
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      alert('Title is required.');
      return;
    }

    if (!summary.trim()) {
      alert('Summary is required.');
      return;
    }

    const resolvedSlug = slugify(slug || title);
    if (!resolvedSlug) {
      alert('A valid slug could not be generated. Please adjust title or slug.');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/case-studies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          slug: resolvedSlug,
          client_name: clientName,
          summary,
          challenge,
          solution,
          results,
          featured_image_url: featuredImageUrl,
          gallery_images: galleryImages,
          tech_stack: techStack,
          cta_text: ctaText,
          cta_link: ctaLink,
          is_featured: isFeatured,
          is_published: isPublished
        })
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || 'Failed to create case study');
      }

      resetForm();
      await loadCaseStudies();
      alert('Case study created successfully.');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to create case study');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-wide py-6">
      <div className="max-w-6xl">
        <h1 className="heading-lg mb-4">Case Studies CMS</h1>
        <p className="text-apple-gray-300 leading-8 mb-10">
          Publish long-form project stories to support portfolio proof, trust, and conversions.
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Case Study Title*"
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
              placeholder="Slug* (example: retail-brand-redesign-barbados)"
              value={slug}
              onChange={(e) => {
                setSlugEdited(true);
                setSlug(slugify(e.target.value));
              }}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <textarea
              placeholder="Project Summary*"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[120px]"
            />

            <textarea
              placeholder="Challenge"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[140px]"
            />

            <textarea
              placeholder="Solution"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[160px]"
            />

            <textarea
              placeholder="Results"
              value={results}
              onChange={(e) => setResults(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[140px]"
            />

            <input
              type="text"
              placeholder="Featured Image URL"
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <textarea
              placeholder="Gallery Image URLs (comma or new-line separated)"
              value={galleryImages}
              onChange={(e) => setGalleryImages(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[110px]"
            />

            <textarea
              placeholder="Tech Stack (comma or new-line separated)"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[90px]"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 text-sm text-apple-gray-300">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4"
                />
                Featured case study
              </label>

              <label className="flex items-center gap-3 text-sm text-apple-gray-300">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4"
                />
                Published
              </label>
            </div>

            <button
              onClick={handleCreate}
              className="apple-button apple-button-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Create Case Study'}
            </button>
          </div>

          <div className="rounded-2xl border border-apple-gray-100 p-6 bg-apple-gray-50">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-xl font-semibold">Recent Case Studies</h2>
              <button onClick={loadCaseStudies} className="apple-button apple-button-secondary text-sm">
                Refresh
              </button>
            </div>

            {loadingItems ? (
              <p className="text-apple-gray-300">Loading case studies...</p>
            ) : !items.length ? (
              <p className="text-apple-gray-300">No case studies found yet.</p>
            ) : (
              <div className="space-y-4 max-h-[780px] overflow-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="rounded-xl border border-apple-gray-100 bg-white p-4">
                    <p className="font-semibold text-apple-gray-500">{item.title}</p>
                    <p className="text-sm text-apple-gray-300 mt-1 break-all">
                      /case-studies/{item.slug}
                    </p>
                    <p className="text-sm text-apple-gray-300 mt-2">
                      {item.client_name || 'Client name not set'}
                    </p>
                    <p className="text-xs text-apex-yellow mt-2 uppercase tracking-wider font-semibold">
                      {item.is_published ? 'published' : 'draft'} ·{' '}
                      {item.is_featured ? 'featured' : 'standard'} · {formatDate(item.updated_at)}
                    </p>
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
