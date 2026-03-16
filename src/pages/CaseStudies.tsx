import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

type CaseStudySummary = {
  id: number;
  title: string;
  slug: string;
  client_name?: string | null;
  summary?: string | null;
  featured_image_url?: string | null;
  tech_stack?: string | null;
  is_featured?: boolean;
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200';

const splitList = (value?: string | null) => {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const CaseStudies = () => {
  const [items, setItems] = useState<CaseStudySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const loadItems = async () => {
      try {
        const response = await fetch('/api/case-studies?limit=12', {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Case studies API failed (${response.status})`);
        }

        const data = await response.json();
        const nextItems = Array.isArray(data?.items) ? data.items : [];
        setItems(nextItems);
        setErrorMessage(null);
      } catch (error) {
        console.error(error);
        setItems([]);
        setErrorMessage('Case studies are currently unavailable. Please try again shortly.');
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    loadItems();

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const featuredItems = useMemo(
    () => items.filter((item) => item.is_featured),
    [items]
  );

  return (
    <div className="pt-12">
      <PageHeader
        title="Case Studies."
        subtitle="Proof of Impact"
        description="Explore detailed project stories showing how Apex digital strategy translates into measurable business outcomes."
      />

      <section className="pb-24">
        <div className="container-wide px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 animate-pulse"
                >
                  <div className="aspect-[16/10] rounded-[2rem] bg-apple-gray-100 mb-8" />
                  <div className="h-4 w-2/5 bg-apple-gray-100 rounded mb-4" />
                  <div className="h-8 w-4/5 bg-apple-gray-100 rounded mb-4" />
                  <div className="h-4 bg-apple-gray-100 rounded mb-2" />
                  <div className="h-4 w-10/12 bg-apple-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : errorMessage ? (
            <div className="max-w-3xl mx-auto rounded-[2.5rem] border border-apple-gray-100 bg-white p-10 md:p-12 text-center">
              <p className="text-apple-gray-300 leading-8">{errorMessage}</p>
            </div>
          ) : !items.length ? (
            <div className="max-w-3xl mx-auto rounded-[2.5rem] border border-apple-gray-100 bg-white p-10 md:p-12 text-center">
              <p className="text-apple-gray-300 leading-8">
                Case studies are being prepared. Check back soon.
              </p>
            </div>
          ) : (
            <>
              {featuredItems.length > 0 && (
                <div className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 md:p-10 mb-12">
                  <p className="text-xs font-bold text-apple-gray-300 uppercase tracking-widest mb-4">
                    Featured
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredItems.slice(0, 2).map((item) => (
                      <Link
                        key={item.id}
                        to={`/case-studies/${item.slug}`}
                        className="group rounded-[2rem] bg-apple-gray-50 border border-apple-gray-100 p-6"
                      >
                        <p className="text-sm text-apple-gray-300 mb-3">
                          {item.client_name || 'Client'}
                        </p>
                        <h2 className="text-2xl font-bold text-apple-gray-500 mb-4 group-hover:text-apple-gray-300 transition-colors">
                          {item.title}
                        </h2>
                        <p className="text-apple-gray-300 leading-7 line-clamp-3">
                          {item.summary || 'Read the full case study for challenge, solution, and results.'}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 md:p-9"
                  >
                    <Link to={`/case-studies/${item.slug}`} className="group block">
                      <div className="aspect-[16/10] rounded-[2rem] overflow-hidden bg-apple-gray-50 mb-7">
                        <img
                          src={item.featured_image_url || FALLBACK_IMAGE}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-3 mb-4">
                        <p className="text-sm font-semibold uppercase tracking-widest text-apple-gray-300">
                          {item.client_name || 'Client Project'}
                        </p>
                        {item.is_featured && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-apex-yellow">
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold text-apple-gray-500 group-hover:text-apple-gray-300 transition-colors mb-4">
                        {item.title}
                      </h3>

                      <p className="text-apple-gray-300 leading-8 mb-6 line-clamp-3">
                        {item.summary || 'Read the full case study for challenge, strategy, and measurable outcomes.'}
                      </p>

                      {splitList(item.tech_stack).length > 0 && (
                        <p className="text-sm text-apple-gray-300 mb-6">
                          {splitList(item.tech_stack).slice(0, 4).join(' · ')}
                        </p>
                      )}

                      <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-apple-gray-400">
                        View Case Study <ArrowRight size={15} />
                      </span>
                    </Link>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
