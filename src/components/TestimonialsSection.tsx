import React, { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';

type TestimonialItem = {
  id: number;
  name: string;
  company?: string | null;
  role?: string | null;
  quote: string;
  rating?: number | null;
  image_url?: string | null;
  source?: string | null;
};

const SectionShell = ({ children }: { children: React.ReactNode }) => (
  <section className="section-padding bg-apple-gray-50">
    <div className="container-wide">
      <div className="text-center mb-14 md:mb-16">
        <span className="text-sm font-semibold tracking-widest text-apex-yellow uppercase mb-5 block">
          Client Testimonials
        </span>
        <h2 className="heading-lg mb-6">Trusted by Businesses We Serve.</h2>
        <p className="text-apple-gray-300 max-w-2xl mx-auto">
          Real feedback from clients who have partnered with Apex Digital Consultants.
        </p>
      </div>
      {children}
    </div>
  </section>
);

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating
            ? 'text-apex-yellow fill-apex-yellow'
            : 'text-apple-gray-200'
        }
      />
    ))}
  </div>
);

export const TestimonialsSection = () => {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const loadTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials?featured=true&limit=6', {
          signal: controller.signal
        });

        if (!res.ok) {
          throw new Error(`Testimonials API failed (${res.status})`);
        }

        const data = await res.json();

        if (data?.items && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.warn('Failed to load testimonials', error);
        setItems([]);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    loadTestimonials();

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <SectionShell>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 md:p-9 animate-pulse"
            >
              <div className="h-4 w-24 bg-apple-gray-100 rounded mb-6" />
              <div className="space-y-3 mb-8">
                <div className="h-3.5 bg-apple-gray-100 rounded" />
                <div className="h-3.5 bg-apple-gray-100 rounded" />
                <div className="h-3.5 w-3/4 bg-apple-gray-100 rounded" />
              </div>
              <div className="h-10 w-40 bg-apple-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </SectionShell>
    );
  }

  if (!items.length) {
    return (
      <SectionShell>
        <div className="max-w-3xl mx-auto rounded-[2.5rem] border border-apple-gray-100 bg-white p-10 md:p-12 text-center">
          <p className="text-apple-gray-300 leading-8">
            Testimonials are being updated and will appear here shortly.
          </p>
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {items.map((item) => {
          const rating =
            typeof item.rating === 'number' && Number.isFinite(item.rating)
              ? Math.min(Math.max(Math.round(item.rating), 1), 5)
              : 5;
          const meta = [item.role, item.company].filter(Boolean).join(' · ');

          return (
            <article
              key={item.id}
              className="h-full rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 md:p-9 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <Stars rating={rating} />
                <Quote size={18} className="text-apex-yellow/70" />
              </div>

              <p className="text-apple-gray-300 leading-8 mb-8">"{item.quote}"</p>

              <div className="flex items-center gap-4">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={`Photo of ${item.name}, Apex client testimonial`}
                    className="w-12 h-12 rounded-full object-cover border border-apple-gray-100"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-apple-gray-50 border border-apple-gray-100 flex items-center justify-center text-sm font-bold text-apple-gray-500 uppercase">
                    {item.name.slice(0, 1)}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="font-semibold text-apple-gray-500 truncate">{item.name}</p>
                  <p className="text-sm text-apple-gray-300 truncate">
                    {meta || 'Verified Client'}
                  </p>
                </div>

                <span className="ml-auto text-[10px] md:text-[11px] font-semibold tracking-widest uppercase text-apex-yellow text-right">
                  {item.source === 'google' ? 'Google' : 'Manual'}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
};
