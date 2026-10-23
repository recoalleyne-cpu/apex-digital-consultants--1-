import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { applySeo } from '../utils/seo';

type LandingPageItem = {
  id: number;
  title: string;
  slug: string;
  hero_heading?: string | null;
  hero_subheading?: string | null;
  body_content: string;
  featured_image_url?: string | null;
  cta_text?: string | null;
  cta_link?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  region?: string | null;
  service_category?: string | null;
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1600';
const DEFAULT_DESCRIPTION = 'Custom digital solutions tailored to your business goals.';

export const LandingPage = () => {
  const { slug } = useParams();
  const [item, setItem] = useState<LandingPageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const loadLandingPage = async () => {
      try {
        const response = await fetch(`/api/landing-pages?slug=${encodeURIComponent(slug)}`, {
          signal: controller.signal
        });

        if (response.status === 404) {
          setNotFound(true);
          setItem(null);
          setErrorMessage(null);
          return;
        }

        if (!response.ok) {
          throw new Error(`Landing page API failed (${response.status})`);
        }

        const data = await response.json();
        const payload = data?.item ?? null;

        if (!payload) {
          setNotFound(true);
          setItem(null);
          return;
        }

        setItem(payload);
        setNotFound(false);
        setErrorMessage(null);
      } catch (error) {
        console.error(error);
        setItem(null);
        setNotFound(false);
        setErrorMessage('This page is temporarily unavailable. Please try again shortly.');
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    loadLandingPage();

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [slug]);

  const pageTitle = item?.hero_heading || item?.title || 'Apex Digital Consultants';
  const pageDescription = item?.hero_subheading || item?.seo_description || DEFAULT_DESCRIPTION;
  const subtitleBits = [item?.service_category, item?.region].filter(Boolean) as string[];

  useEffect(() => {
    const canonicalPath = window.location.pathname;
    const canonical = `${window.location.origin}${canonicalPath}`;

    if (loading) {
      applySeo({
        title: 'Loading Service Page | Apex Digital Consultants',
        description: DEFAULT_DESCRIPTION,
        canonical
      });
      return;
    }

    if (notFound) {
      applySeo({
        title: 'Page Not Found | Apex Digital Consultants',
        description: 'The requested landing page is not currently published.',
        canonical
      });
      return;
    }

    if (errorMessage) {
      applySeo({
        title: 'Landing Page Temporarily Unavailable | Apex Digital Consultants',
        description: errorMessage,
        canonical
      });
      return;
    }

    if (!item) return;

    const title = item.seo_title?.trim() || item.title;
    const description =
      item.seo_description?.trim() || item.hero_subheading?.trim() || DEFAULT_DESCRIPTION;

    applySeo({
      title,
      description,
      image: item.featured_image_url || FALLBACK_IMAGE,
      canonical
    });
  }, [item, loading, notFound, errorMessage]);

  const bodyParagraphs = useMemo(() => {
    if (!item?.body_content) return [];
    return item.body_content
      .split(/\n{2,}/)
      .map((segment) => segment.trim())
      .filter(Boolean);
  }, [item?.body_content]);

  if (loading) {
    return (
      <div className="pt-16 md:pt-20">
        <PageHeader title="Loading..." subtitle="SEO Landing Page" description="Preparing content for this page." />
        <section className="pb-24 md:pb-32">
          <div className="container-wide px-6 md:px-8">
            <div className="rounded-[3rem] border border-apple-gray-100 bg-white p-10 md:p-14 animate-pulse space-y-5">
              <div className="h-8 bg-apple-gray-100 rounded w-3/5" />
              <div className="h-5 bg-apple-gray-100 rounded w-full" />
              <div className="h-5 bg-apple-gray-100 rounded w-10/12" />
              <div className="h-5 bg-apple-gray-100 rounded w-9/12" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="pt-16 md:pt-20">
        <PageHeader
          title="Page Not Found."
          subtitle="SEO Landing Page"
          description="The requested landing page is not currently published."
        />
        <section className="pb-24 md:pb-32">
          <div className="container-wide px-6 md:px-8">
            <div className="max-w-3xl mx-auto rounded-[3rem] border border-apple-gray-100 bg-white p-10 md:p-12 text-center">
              <p className="text-apple-gray-300 leading-8 mb-8">
                We could not find a published page for this address.
              </p>
              <Link to="/services" className="apple-button apple-button-primary">
                Explore Services
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="pt-16 md:pt-20">
        <PageHeader title="Temporarily Unavailable." subtitle="SEO Landing Page" description={errorMessage} />
        <section className="pb-24 md:pb-32">
          <div className="container-wide px-6 md:px-8">
            <div className="max-w-3xl mx-auto rounded-[3rem] border border-apple-gray-100 bg-white p-10 md:p-12 text-center">
              <p className="text-apple-gray-300 leading-8 mb-8">{errorMessage}</p>
              <Link to="/contact" className="apple-button apple-button-primary">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!item) return null;

  const ctaText = item.cta_text?.trim() || 'Get A Quote';
  const ctaLink = item.cta_link?.trim() || '/contact';
  const isExternalCta = /^https?:\/\//i.test(ctaLink);

  return (
    <div className="pt-16 md:pt-20">
      <PageHeader
        title={pageTitle}
        subtitle={subtitleBits.length ? subtitleBits.join(' • ') : 'SEO Landing Page'}
        description={pageDescription}
      />

      <section className="pb-24 md:pb-32">
        <div className="container-wide px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 md:gap-12">
            <div className="lg:col-span-3 rounded-[3rem] border border-apple-gray-100 bg-white p-8 md:p-10 lg:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-apple-gray-500 mb-6">
                {item.title}
              </h2>

              <div className="space-y-6">
                {(bodyParagraphs.length ? bodyParagraphs : [item.body_content]).map((paragraph, index) => (
                  <p key={index} className="text-lg text-apple-gray-300 leading-9">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-2 space-y-8">
              <div className="rounded-[3rem] border border-apple-gray-100 bg-white overflow-hidden">
                <img
                  src={item.featured_image_url || FALLBACK_IMAGE}
                  alt={item.title}
                  className="w-full h-[260px] md:h-[320px] object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="rounded-[3rem] border border-apple-gray-100 bg-apple-gray-50 p-8 md:p-9">
                <h3 className="text-2xl font-bold text-apple-gray-500 mb-4">
                  Ready to Move Forward?
                </h3>
                <p className="text-apple-gray-300 leading-8 mb-8">
                  Partner with Apex Digital Consultants for strategy and execution that supports measurable growth.
                </p>

                {isExternalCta ? (
                  <a
                    href={ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apple-button apple-button-primary inline-flex items-center gap-2"
                  >
                    {ctaText} <ArrowRight size={16} />
                  </a>
                ) : (
                  <Link to={ctaLink} className="apple-button apple-button-primary inline-flex items-center gap-2">
                    {ctaText} <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};
