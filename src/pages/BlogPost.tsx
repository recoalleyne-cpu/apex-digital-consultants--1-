import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { applySeo, removeJsonLd, toAbsoluteUrl, upsertJsonLd } from '../utils/seo';

type BlogPostItem = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  body_content: string;
  featured_image_url?: string | null;
  category?: string | null;
  author_name?: string | null;
  publish_date?: string | null;
  created_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1400';

const DEFAULT_DESCRIPTION =
  'Read the latest insight from Apex Digital Consultants on growth, marketing, and digital strategy.';

const formatDate = (value?: string | null) => {
  if (!value) return 'Coming Soon';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'Coming Soon';

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setNotFound(true);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    setLoading(true);
    setErrorMessage(null);
    setNotFound(false);

    const loadPost = async () => {
      try {
        const response = await fetch(`/api/blog?slug=${encodeURIComponent(slug)}`, {
          signal: controller.signal
        });

        if (response.status === 404) {
          setPost(null);
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error(`Blog API failed (${response.status})`);
        }

        const data = await response.json();
        const item = data?.item ?? null;

        if (!item) {
          setPost(null);
          setNotFound(true);
          return;
        }

        setPost(item);
        setNotFound(false);
      } catch (error) {
        console.error(error);
        setPost(null);
        setNotFound(false);
        setErrorMessage('This blog post is temporarily unavailable. Please try again shortly.');
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    loadPost();

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [slug]);

  useEffect(() => {
    const canonicalPath = slug ? `/blog/${slug}` : '/blog';
    const canonical = `${window.location.origin}${canonicalPath}`;

    if (loading) {
      applySeo({
        title: 'Loading Article | Apex Digital Consultants',
        description: DEFAULT_DESCRIPTION,
        canonical,
        type: 'article'
      });
      return;
    }

    if (notFound) {
      applySeo({
        title: 'Post Not Found | Apex Digital Consultants',
        description: 'The requested article could not be found.',
        canonical,
        type: 'article'
      });
      return;
    }

    if (errorMessage) {
      applySeo({
        title: 'Blog Temporarily Unavailable | Apex Digital Consultants',
        description: errorMessage,
        canonical,
        type: 'article'
      });
      return;
    }

    if (!post) return;

    const title = post.seo_title?.trim() || post.title;
    const description =
      post.seo_description?.trim() || post.excerpt?.trim() || DEFAULT_DESCRIPTION;

    applySeo({
      title,
      description,
      image: post.featured_image_url || FALLBACK_IMAGE,
      canonical,
      type: 'article'
    });
  }, [slug, post, loading, notFound, errorMessage]);

  useEffect(() => {
    if (loading || notFound || errorMessage || !post || !slug) {
      removeJsonLd('blog-post-article');
      return;
    }

    const origin = window.location.origin;
    const canonical = `${origin}/blog/${slug}`;

    upsertJsonLd('blog-post-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt?.trim() || post.seo_description?.trim() || DEFAULT_DESCRIPTION,
      image: toAbsoluteUrl(post.featured_image_url || FALLBACK_IMAGE),
      datePublished: post.publish_date || post.created_at || undefined,
      dateModified: post.publish_date || post.created_at || undefined,
      author: {
        '@type': 'Person',
        name: post.author_name || 'Apex Editorial Team'
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
      articleSection: post.category || 'Insights'
    });

    return () => {
      removeJsonLd('blog-post-article');
    };
  }, [slug, post, loading, notFound, errorMessage]);

  const paragraphs = useMemo(() => {
    if (!post?.body_content) return [];
    return post.body_content
      .split(/\n{2,}/)
      .map((segment) => segment.trim())
      .filter(Boolean);
  }, [post?.body_content]);

  if (loading) {
    return (
      <div className="pt-12">
        <PageHeader
          title="Loading Article..."
          subtitle="APEX Journal"
          description="Preparing the full post details."
        />
        <section className="pb-24">
          <div className="container-wide px-6">
            <div className="max-w-4xl mx-auto rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 md:p-10 animate-pulse">
              <div className="aspect-[16/9] rounded-[2rem] bg-apple-gray-100 mb-8" />
              <div className="h-3 w-40 bg-apple-gray-100 rounded mb-5" />
              <div className="h-8 w-9/12 bg-apple-gray-100 rounded mb-6" />
              <div className="space-y-3">
                <div className="h-4 bg-apple-gray-100 rounded" />
                <div className="h-4 bg-apple-gray-100 rounded" />
                <div className="h-4 w-10/12 bg-apple-gray-100 rounded" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="pt-12">
        <PageHeader
          title="Post Not Found."
          subtitle="APEX Journal"
          description="This article is not currently available."
        />
        <section className="pb-24">
          <div className="container-wide px-6">
            <div className="max-w-3xl mx-auto rounded-[2.5rem] border border-apple-gray-100 bg-white p-10 md:p-12 text-center">
              <p className="text-apple-gray-300 leading-8 mb-8">
                The requested post may be unpublished or the link may be incorrect.
              </p>
              <Link to="/blog" className="apple-button apple-button-primary">
                Back to Blog
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
        <PageHeader title="Temporarily Unavailable." subtitle="APEX Journal" description={errorMessage} />
        <section className="pb-24">
          <div className="container-wide px-6">
            <div className="max-w-3xl mx-auto rounded-[2.5rem] border border-apple-gray-100 bg-white p-10 md:p-12 text-center">
              <p className="text-apple-gray-300 leading-8 mb-8">{errorMessage}</p>
              <Link to="/blog" className="apple-button apple-button-primary">
                Back to Blog
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="pt-12">
      <PageHeader
        title={post.title}
        subtitle={post.category || 'APEX Journal'}
        description={
          post.excerpt?.trim() ||
          post.seo_description?.trim() ||
          'Practical insight from Apex Digital Consultants.'
        }
      />

      <section className="pb-24">
        <div className="container-wide px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 md:gap-12">
            <article className="lg:col-span-3 rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 md:p-10">
              <div className="aspect-[16/9] rounded-[2rem] overflow-hidden bg-apple-gray-50 mb-8">
                <img
                  src={post.featured_image_url || FALLBACK_IMAGE}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-apple-gray-300 uppercase tracking-widest mb-8">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDate(post.publish_date || post.created_at)}
                </span>
                <span className="w-1 h-1 rounded-full bg-apple-gray-200" />
                <span className="flex items-center gap-1">
                  <User size={12} />
                  {post.author_name || 'Apex Editorial Team'}
                </span>
              </div>

              <div className="space-y-6">
                {(paragraphs.length ? paragraphs : [post.body_content]).map((paragraph, index) => (
                  <p key={index} className="text-lg text-apple-gray-300 leading-9">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>

            <aside className="lg:col-span-2 space-y-6">
              <div className="rounded-[2.5rem] border border-apple-gray-100 bg-apple-gray-50 p-8 md:p-9">
                <h3 className="text-2xl font-bold text-apple-gray-500 mb-4">
                  Need Help Implementing This?
                </h3>
                <p className="text-apple-gray-300 leading-8 mb-8">
                  Partner with Apex to turn strategy into measurable growth for your business.
                </p>
                <Link to="/contact" className="apple-button apple-button-primary inline-flex items-center gap-2">
                  Start Your Project <ArrowRight size={16} />
                </Link>
              </div>

              <div className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8">
                <Link to="/blog" className="text-sm font-semibold tracking-wider uppercase text-apple-gray-300">
                  Back to All Articles
                </Link>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/services/websites" className="apple-button apple-button-secondary text-sm">
                    Website Development
                  </Link>
                  <Link to="/web-design-barbados" className="apple-button apple-button-secondary text-sm">
                    Web Design Barbados
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
