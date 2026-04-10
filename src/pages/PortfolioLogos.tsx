import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { MEDIA_PLACEMENT_VALUES } from '../constants/mediaPlacements';

type LogoMediaItem = {
  id: number;
  title: string;
  file_url: string;
  alt_text?: string | null;
  category?: string | null;
  placement?: string | null;
  created_at?: string | null;
};

const LOGO_PLACEMENT_VALUES = [MEDIA_PLACEMENT_VALUES.LOGOS_PAGE, 'logo-page'];
const LOGO_CATEGORY_VALUES = ['logos', 'logo'];

const normalizeText = (value: unknown) =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

const parseItems = async (response: Response): Promise<LogoMediaItem[]> => {
  if (!response.ok) {
    throw new Error(`Media API request failed with status ${response.status}`);
  }

  const data = await response.json().catch(() => null);
  if (!data || !Array.isArray((data as { items?: unknown }).items)) {
    return [];
  }

  return (data as { items: LogoMediaItem[] }).items;
};

const dedupeLogos = (items: LogoMediaItem[]) => {
  const map = new Map<string, LogoMediaItem>();

  for (const item of items) {
    if (typeof item.file_url !== 'string' || !item.file_url.trim()) continue;

    const placement = normalizeText(item.placement);
    const category = normalizeText(item.category);
    const matchesPlacement = LOGO_PLACEMENT_VALUES.includes(placement);
    const matchesCategory = LOGO_CATEGORY_VALUES.includes(category);

    if (!matchesPlacement && !matchesCategory) continue;

    const key = typeof item.id === 'number' ? `id:${item.id}` : `url:${item.file_url.trim()}`;
    if (!map.has(key)) {
      map.set(key, item);
    }
  }

  return [...map.values()].sort((a, b) => {
    const timeA = a.created_at ? Date.parse(a.created_at) : 0;
    const timeB = b.created_at ? Date.parse(b.created_at) : 0;
    return timeB - timeA;
  });
};

export const PortfolioLogos = () => {
  const [logos, setLogos] = useState<LogoMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Loading logo portfolio...');
  const [nonDisplayableLogoIds, setNonDisplayableLogoIds] = useState<Record<number, true>>({});

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadLogos = async () => {
      try {
        setLoading(true);
        setStatusMessage('Loading logo portfolio...');

        const placementQueries = LOGO_PLACEMENT_VALUES.map(
          (placement) => `/api/media?placement=${encodeURIComponent(placement)}`
        );
        const categoryQueries = LOGO_CATEGORY_VALUES.map(
          (category) => `/api/media?category=${encodeURIComponent(category)}`
        );

        const requests = [...placementQueries, ...categoryQueries].map((url) =>
          fetch(url, {
            method: 'GET',
            headers: { Accept: 'application/json' },
            signal: controller.signal
          }).then(parseItems)
        );

        const settled = await Promise.allSettled(requests);
        const merged = settled.flatMap((result) =>
          result.status === 'fulfilled' ? result.value : []
        );
        const normalized = dedupeLogos(merged);

        if (!isMounted) return;

        setNonDisplayableLogoIds({});
        setLogos(normalized);
        setStatusMessage(normalized.length ? '' : 'No logo projects are available yet.');
      } catch (error) {
        if (!isMounted) return;

        setLogos([]);
        if (error instanceof DOMException && error.name === 'AbortError') {
          setStatusMessage('Logo portfolio request timed out. Please refresh and try again.');
        } else {
          setStatusMessage(
            error instanceof Error ? error.message : 'Unable to load the logo portfolio right now.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadLogos();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="pt-16 md:pt-20">
      <PageHeader
        title="Logo Portfolio"
        subtitle="Portfolio"
        description="Browse branding and logo work delivered for businesses across Barbados and the Caribbean."
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="mb-10 rounded-[2rem] border border-apple-gray-100 bg-white p-6 sm:p-7 md:p-8">
            <p className="text-sm md:text-base text-apple-gray-300 leading-7 mb-4">
              This gallery highlights completed logo projects. Explore completed website builds or return to the main portfolio for the full project mix.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/portfolio/websites" className="apple-button apple-button-secondary text-sm">
                Websites Completed
              </Link>
              <Link to="/portfolio" className="apple-button apple-button-secondary text-sm">
                Full Portfolio
              </Link>
              <Link to="/contact" className="apple-button apple-button-primary text-sm">
                Start a Logo Project
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-apple-gray-300">{statusMessage}</div>
          ) : logos.length === 0 ? (
            <div className="py-20 text-center text-apple-gray-300">
              {statusMessage || 'No logo projects are available yet.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {logos.map((logo) => (
                <div
                  key={logo.id}
                  className="group relative isolate aspect-square overflow-hidden rounded-[1.5rem] border border-apple-gray-100 bg-gradient-to-br from-white via-apple-gray-50 to-white flex items-center justify-center p-6 shadow-[0_8px_24px_rgba(17,24,39,0.04)] transition-all duration-500 md:hover:-translate-y-1 md:hover:shadow-[0_18px_36px_rgba(17,24,39,0.10)]"
                >
                  {nonDisplayableLogoIds[logo.id] ? (
                    <div className="text-center text-apple-gray-300 text-sm leading-6">
                      <p className="font-medium text-apple-gray-500 mb-2">{logo.title}</p>
                      <p>This item is not a displayable image.</p>
                    </div>
                  ) : (
                    <img
                      src={logo.file_url}
                      alt={logo.alt_text || logo.title}
                      className="max-w-full max-h-full object-contain transition-all duration-500 ease-out xl:grayscale xl:contrast-125 xl:opacity-75 xl:group-hover:grayscale-0 xl:group-hover:contrast-100 xl:group-hover:opacity-100 xl:group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      onError={() =>
                        setNonDisplayableLogoIds((previous) =>
                          previous[logo.id] ? previous : { ...previous, [logo.id]: true }
                        )
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
