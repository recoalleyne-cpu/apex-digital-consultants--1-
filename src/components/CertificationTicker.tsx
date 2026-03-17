import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MEDIA_PLACEMENT_VALUES } from '../constants/mediaPlacements';

type MediaItem = {
  id: number;
  title: string;
  file_url: string;
  alt_text?: string | null;
};

export const CertificationTicker = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadMedia = async () => {
      const timeout = setTimeout(() => controller.abort(), 10000);

      try {
        const res = await fetch(
          `/api/media?placement=${encodeURIComponent(
            MEDIA_PLACEMENT_VALUES.HOME_CERTIFICATION_TICKER
          )}`,
          {
            signal: controller.signal
          }
        );

        clearTimeout(timeout);

        if (!res.ok) {
          throw new Error(`Ticker media request failed (${res.status})`);
        }

        const data = await res.json();

        if (data?.items && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.warn('Failed to load certification ticker media', err);
        setItems([]);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    loadMedia();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-14 bg-white border-y border-apple-gray-100">
        <div className="container-wide text-center">
          <p className="text-sm font-semibold tracking-[0.22em] text-apex-yellow uppercase">
            Certified & Trusted Provider
          </p>
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="py-12 md:py-14 bg-white border-y border-apple-gray-100">
        <div className="container-wide text-center">
          <p className="text-sm font-semibold tracking-[0.22em] text-apex-yellow uppercase">
            Certified & Trusted Provider
          </p>
        </div>
      </section>
    );
  }

  const tickerItems = [...items, ...items];

  return (
    <section className="py-12 md:py-14 bg-white border-y border-apple-gray-100 overflow-hidden">
      <div className="container-wide mb-8">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-[0.22em] text-apex-yellow uppercase">
            Certified & Trusted Provider
          </p>
        </div>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="mx-4 md:mx-6 border border-white/5 bg-[#111827] shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
          <motion.div
            className="flex w-max items-center"
            animate={isPaused ? { x: '-25%' } : { x: ['0%', '-50%'] }}
            transition={
              isPaused
                ? { duration: 0.2, ease: 'linear' }
                : { duration: 18, ease: 'linear', repeat: Infinity }
            }
          >
            {tickerItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="relative flex h-[104px] md:h-[116px] min-w-[210px] md:min-w-[260px] items-center justify-center px-10 md:px-12"
              >
                <img
                  src={item.file_url}
                  alt={item.alt_text || item.title}
                  className="max-h-12 md:max-h-14 max-w-[170px] md:max-w-[210px] object-contain opacity-100 transition-transform duration-300"
                />

                <div className="absolute right-0 top-1/2 h-12 w-px -translate-y-1/2 bg-white/12 last:hidden" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
