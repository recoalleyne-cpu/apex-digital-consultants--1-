import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { applySeo, removeJsonLd, toAbsoluteUrl, upsertJsonLd } from '../utils/seo';
import {
  findFallbackCaseStudyBySlug,
  normalizeCaseStudy,
  type CaseStudyRecord
} from '../utils/caseStudies';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1400';

const DEFAULT_DESCRIPTION =
  'Read this Apex case study for a detailed breakdown of challenge, strategy, and outcomes.';
const UNAVAILABLE_MESSAGE =
  'This case study is temporarily unavailable. Please try again shortly.';

const isPlaceholderValue = (value?: string | null) => {
  if (!value) return true;
  const normalized = value.trim().toLowerCase();
  return normalized === '[add url]' || normalized === '[add urls]';
};

const getRenderableImageUrl = (value?: string | null) => {
  if (isPlaceholderValue(value)) return null;
  return value?.trim() || null;
};

const splitDelimited = (value?: string | null) => {
  if (!value) return [];
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => Boolean(entry) && !isPlaceholderValue(entry));
};

const toParagraphs = (value?: string | null) => {
  if (!value) return [];
  return value
    .split(/\n{2,}/)
    .map((entry) => entry.trim())
    .filter(Boolean);
};

export const CaseStudy = () => {
  const { slug } = useParams();
  const [item, setItem] = useState<CaseStudyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setItem(null);
      setNotFound(true);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    setLoading(true);
    setErrorMessage(null);
    setNotFound(false);

    const loadItem = async () => {
      try {
        const response = await fetch(`/api/case-studies?slug=${encodeURIComponent(slug)}`, {
          headers: {
            Accept: 'application/json'
          },
          signal: controller.signal
        });

        if (response.status === 404) {
          const fallbackItem = findFallbackCaseStudyBySlug(slug);
          if (fallbackItem) {
            setItem(fallbackItem);
            setNotFound(false);
            return;
          }

          setItem(null);
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          const responseText = await response.text();
          throw new Error(
            `Case studies API failed (${response.status}): ${
              responseText.slice(0, 220) || 'No response body'
            }`
          );
        }

        const contentType = response.headers.get('content-type')?.toLowerCase() || '';
        if (!contentType.includes('application/json')) {
          const responsePreview = (await response.text()).slice(0, 220);
          throw new Error(
            `Case study endpoint returned non-JSON content (${contentType || 'unknown'}). Preview: ${responsePreview}`
          );
        }

        const data = await response.json();
        const nextItem = normalizeCaseStudy(data?.item ?? null);

        if (!nextItem || !nextItem.is_published) {
          const fallbackItem = findFallbackCaseStudyBySlug(slug);
          if (fallbackItem) {
            setItem(fallbackItem);
            setNotFound(false);
            return;
          }

          setItem(null);
          setNotFound(true);
          return;
        }

        setItem(nextItem);
        setNotFound(false);
      } catch (error) {
        console.error(
          '[CaseStudy] Failed to load case study from API; attempting approved local fallback.',
          error
        );
        const fallbackItem = findFallbackCaseStudyBySlug(slug);
        if (fallbackItem) {
          setItem(fallbackItem);
          setNotFound(false);
          setErrorMessage(null);
          return;
        }
        setItem(null);
        setNotFound(false);
        setErrorMessage(UNAVAILABLE_MESSAGE);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    loadItem();

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [slug]);

  useEffect(() => {
    const canonicalPath = slug ? `/case-studies/${slug}` : '/case-studies';
    const canonical = `${window.location.origin}${canonicalPath}`;

    if (loading) {
      applySeo({
        title: 'Loading Case Study | Apex Digital Consultants',
        description: DEFAULT_DESCRIPTION,
        canonical
      });
      return;
    }

    if (notFound) {
      applySeo({
        title: 'Case Study Not Found | Apex Digital Consultants',
        description: 'The requested case study could not be found.',
        canonical
      });
      return;
    }

    if (errorMessage) {
      applySeo({
        title: 'Case Study Temporarily Unavailable | Apex Digital Consultants',
        description: errorMessage,
        canonical
      });
      return;
    }

    if (!item) return;

    applySeo({
      title: `${item.title} | Case Study | Apex Digital Consultants`,
      description: item.summary?.trim() || DEFAULT_DESCRIPTION,
      image: getRenderableImageUrl(item.featured_image_url) || FALLBACK_IMAGE,
      canonical,
      type: 'article'
    });
  }, [slug, item, loading, notFound, errorMessage]);

  useEffect(() => {
    if (loading || notFound || errorMessage || !item || !slug) {
      removeJsonLd('case-study-article');
      return;
    }

    const canonical = `${window.location.origin}/case-studies/${slug}`;

    upsertJsonLd('case-study-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: item.title,
      description: item.summary?.trim() || DEFAULT_DESCRIPTION,
      image: toAbsoluteUrl(getRenderableImageUrl(item.featured_image_url) || FALLBACK_IMAGE),
      author: {
        '@type': 'Organization',
        name: 'Apex Digital Consultants'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Apex Digital Consultants',
        logo: {
          '@type': 'ImageObject',
          url: toAbsoluteUrl('/black%20logo.png')
        }
      },
      mainEntityOfPage: canonical,
      about: item.client_name || item.title
    });

    return () => {
      removeJsonLd('case-study-article');
    };
  }, [slug, item, loading, notFound, errorMessage]);

  const galleryImages = useMemo(
    () => splitDelimited(item?.gallery_images),
    [item?.gallery_images]
  );
  const techStack = useMemo(
    () => splitDelimited(item?.tech_stack),
    [item?.tech_stack]
  );
  const servicesProvided = useMemo(
    () => splitDelimited(item?.services_provided),
    [item?.services_provided]
  );

  if (loading) {
    return (
      <div className="pt-12">
        <PageHeader
          title="Loading Case Study..."
          subtitle="Client Success"
          description="Preparing full project details."
        />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="pt-12">
        <PageHeader
          title="Case Study Not Found."
          subtitle="Client Success"
          description="This case study is not currently available."
        />
        <section className="pb-24">
          <div className="container-wide px-6">
            <div className="max-w-3xl mx-auto rounded-[2.5rem] border border-apple-gray-100 bg-white p-10 md:p-12 text-center">
              <p className="text-apple-gray-300 leading-8 mb-8">
                The requested case study may be unpublished or the link may be incorrect.
              </p>
              <Link to="/case-studies" className="apple-button apple-button-primary">
                Back to Case Studies
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="pt-12">
        <PageHeader title="Temporarily Unavailable." subtitle="Client Success" description={errorMessage} />
        <section className="pb-24">
          <div className="container-wide px-6">
            <div className="max-w-3xl mx-auto rounded-[2.5rem] border border-apple-gray-100 bg-white p-10 md:p-12 text-center">
              <p className="text-apple-gray-300 leading-8 mb-8">{errorMessage}</p>
              <Link to="/case-studies" className="apple-button apple-button-primary">
                Back to Case Studies
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="pt-12">
      <PageHeader
        title={item.title}
        subtitle={item.client_name || 'Case Study'}
        description={item.summary || DEFAULT_DESCRIPTION}
      />

      <section className="pb-24">
        <div className="container-wide px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 md:gap-12">
            <article className="lg:col-span-3 rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 md:p-10">
              <div className="aspect-[16/9] rounded-[2rem] overflow-hidden bg-apple-gray-50 mb-8">
                <img
                  src={getRenderableImageUrl(item.featured_image_url) || FALLBACK_IMAGE}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {item.summary && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-apple-gray-500 mb-4">Overview</h2>
                  {toParagraphs(item.summary).map((paragraph, index) => (
                    <p key={index} className="text-lg text-apple-gray-300 leading-9 mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {item.challenge && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-apple-gray-500 mb-4">Challenge</h2>
                  {toParagraphs(item.challenge).map((paragraph, index) => (
                    <p key={index} className="text-lg text-apple-gray-300 leading-9 mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {item.solution && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-apple-gray-500 mb-4">Solution</h2>
                  {toParagraphs(item.solution).map((paragraph, index) => (
                    <p key={index} className="text-lg text-apple-gray-300 leading-9 mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {item.results && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-apple-gray-500 mb-4">Results</h2>
                  {toParagraphs(item.results).map((paragraph, index) => (
                    <p key={index} className="text-lg text-apple-gray-300 leading-9 mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {galleryImages.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-apple-gray-500 mb-5">Project Gallery</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {galleryImages.map((url, index) => (
                      <div key={`${url}-${index}`} className="rounded-2xl overflow-hidden bg-apple-gray-50">
                        <img
                          src={url}
                          alt={`${item.title} gallery ${index + 1}`}
                          className="w-full h-48 object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>

            <aside className="lg:col-span-2 space-y-6">
              <div className="rounded-[2.5rem] border border-apple-gray-100 bg-apple-gray-50 p-8 md:p-9">
                <h3 className="text-2xl font-bold text-apple-gray-500 mb-4">Project Snapshot</h3>
                <p className="text-apple-gray-300 leading-8 mb-4">
                  Client: {item.client_name || 'Confidential project'}
                </p>
                {techStack.length > 0 && (
                  <p className="text-apple-gray-300 leading-8 mb-6">
                    Stack: {techStack.join(' · ')}
                  </p>
                )}
                {servicesProvided.length > 0 && (
                  <div className="mb-6">
                    <p className="text-apple-gray-500 font-semibold mb-3">Services Provided</p>
                    <p className="text-apple-gray-300 leading-8">
                      {servicesProvided.join(' · ')}
                    </p>
                  </div>
                )}
                {item.cta_text && item.cta_link && (
                  <Link
                    to={item.cta_link}
                    className="apple-button apple-button-primary inline-flex items-center gap-2"
                  >
                    {item.cta_text} <ArrowRight size={16} />
                  </Link>
                )}
              </div>

              <div className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8">
                <Link
                  to="/case-studies"
                  className="text-sm font-semibold tracking-wider uppercase text-apple-gray-300"
                >
                  Back to All Case Studies
                </Link>
              </div>

              <div className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8">
                <h3 className="text-xl font-semibold text-apple-gray-500 mb-4">Related Services</h3>
                <div className="flex flex-wrap gap-3">
                  <Link to="/services/websites" className="apple-button apple-button-secondary text-sm">
                    Website Development
                  </Link>
                  <Link to="/services/web-design" className="apple-button apple-button-secondary text-sm">
                    Web Design
                  </Link>
                  <Link to="/contact" className="apple-button apple-button-primary text-sm">
                    Start Your Project
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};
