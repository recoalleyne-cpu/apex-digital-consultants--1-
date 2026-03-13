import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '../components/PageHeader';

type BlogPostSummary = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  featured_image_url?: string | null;
  category?: string | null;
  author_name?: string | null;
  publish_date?: string | null;
  created_at?: string | null;
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800';

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

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const loadPosts = async () => {
      try {
        const response = await fetch('/api/blog?limit=12', {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Blog API failed (${response.status})`);
        }

        const data = await response.json();
        const items = Array.isArray(data?.items) ? data.items : [];
        setPosts(items);
        setErrorMessage(null);
      } catch (error) {
        console.error(error);
        setPosts([]);
        setErrorMessage('Blog content is currently unavailable. Please try again shortly.');
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    loadPosts();

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return (
    <div className="pt-12">
      <PageHeader 
        title="The APEX Journal."
        subtitle="Insights"
        description="Expert perspectives on digital strategy, design, and business innovation."
      />

      <section className="pb-24">
        <div className="container-wide px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 animate-pulse"
                >
                  <div className="aspect-[16/10] rounded-[2rem] bg-apple-gray-100 mb-8" />
                  <div className="h-3 w-28 bg-apple-gray-100 rounded mb-4" />
                  <div className="h-6 bg-apple-gray-100 rounded mb-3" />
                  <div className="h-6 w-10/12 bg-apple-gray-100 rounded mb-6" />
                  <div className="h-4 bg-apple-gray-100 rounded mb-2" />
                  <div className="h-4 w-9/12 bg-apple-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : errorMessage ? (
            <div className="max-w-3xl mx-auto rounded-[2.5rem] border border-apple-gray-100 bg-white p-10 md:p-12 text-center">
              <p className="text-apple-gray-300 leading-8">{errorMessage}</p>
            </div>
          ) : !posts.length ? (
            <div className="max-w-3xl mx-auto rounded-[2.5rem] border border-apple-gray-100 bg-white p-10 md:p-12 text-center">
              <p className="text-apple-gray-300 leading-8">
                New journal entries are being prepared. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {posts.map((post, index) => (
                <motion.article
                  key={post.slug || post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-8 bg-apple-gray-50">
                      <img
                        src={post.featured_image_url || FALLBACK_IMAGE}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="px-4">
                      <div className="flex items-center gap-4 text-xs font-bold text-apple-gray-300 uppercase tracking-widest mb-4">
                        <span>{post.category || 'Insights'}</span>
                        <span className="w-1 h-1 rounded-full bg-apple-gray-200" />
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(post.publish_date || post.created_at)}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 group-hover:text-apple-gray-300 transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-apple-gray-300 leading-relaxed mb-6 line-clamp-2">
                        {post.excerpt || 'Read the latest insight from Apex Digital Consultants.'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <div className="w-6 h-6 rounded-full bg-apple-gray-100 flex items-center justify-center">
                            <User size={12} />
                          </div>
                          {post.author_name || 'Apex Editorial Team'}
                        </div>
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
