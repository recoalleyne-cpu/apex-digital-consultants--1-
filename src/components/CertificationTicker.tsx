import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type MediaItem = {
  id: number;
  title: string;
  file_url: string;
  alt_text?: string | null;
  category?: string | null;
  placement?: string | null;
  created_at?: string;
};

export const CertificationTicker = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const res = await fetch('/api/media?placement=home-certification-ticker');
        const text = await res.text();

        if (!res.ok) {
          console.error('Media API error:', text);
          setItems([]);
          return;
        }

        const data = JSON.parse(text);

        if (data && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error('Failed to load certification ticker media:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, []);

  if (loading) {
    return null;
  }

  if (!items.length) {
    return (
      <section className="py-10 md:py-12 border-y border-apple-gray-100 bg-white overflow-hidden">
        <div className="container-wide">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-widest text-apex-yellow uppercase mb-3">
              Certificatied & Trusted Provider
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-12 border-y border-apple-gray-100 bg-white overflow-hidden">
      <div className="container-wide mb-8">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-widest text-apex-yellow uppercase mb-3">
            Certificatied & Trusted Provider
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex w-max gap-6"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 28,
            ease: 'linear',
            repeat: Infinity
          }}
        >
          {[...items, ...items].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center justify-center min-w-[200px] h-[100px] px-8 rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 shadow-sm"
            >
              <img
                src={item.file_url}
                alt={item.alt_text || item.title}
                className="max-h-12 object-contain opacity-90"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};