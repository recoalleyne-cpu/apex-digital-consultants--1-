import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

type LogoItem = {
  id: number;
  title: string;
  file_url: string;
  alt_text?: string | null;
};

export const Logos = () => {
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [nonDisplayableLogoIds, setNonDisplayableLogoIds] = useState<Record<number, true>>({});
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Loading logos...');

  useEffect(() => {
    let isMounted = true;

    const loadLogos = async () => {
      try {
        setLoading(true);
        setStatusMessage('Loading logos...');

        const res = await fetch('/api/media?placement=logos-page', {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error(`Logos API failed with status ${res.status}`);
        }

        const data = await res.json();

        if (!isMounted) return;

        if (data?.items && Array.isArray(data.items)) {
          setNonDisplayableLogoIds({});
          setLogos(data.items);
          setStatusMessage(data.items.length ? '' : 'No logos uploaded yet.');
        } else {
          setNonDisplayableLogoIds({});
          setLogos([]);
          setStatusMessage('No logos uploaded yet.');
        }
      } catch (err) {
        console.error('Failed to load logos:', err);

        if (!isMounted) return;

        setLogos([]);
        setStatusMessage(
          err instanceof Error ? err.message : 'Logo request failed.'
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadLogos();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="pt-12">
      <PageHeader
        title="Logo & Brand Identity."
        subtitle="Service Details"
        description="Your logo is the face of your brand. We craft clean, memorable designs that reflect your business identity and leave a lasting impression."
      />

      <section className="pb-24">
        <div className="container-wide px-6">
          {loading ? (
            <div className="py-20 text-center text-apple-gray-300">
              {statusMessage}
            </div>
          ) : logos.length === 0 ? (
            <div className="py-20 text-center text-apple-gray-300">
              {statusMessage || 'No logos uploaded yet.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {logos.map((logo) => (
                <div
                  key={logo.id}
                  className="group relative isolate aspect-square overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-apple-gray-100/80 bg-gradient-to-br from-white via-apple-gray-50 to-white flex items-center justify-center p-6 sm:p-7 md:p-8 lg:p-10 shadow-[0_8px_24px_rgba(17,24,39,0.04)] transition-all duration-500 active:scale-[0.995] md:hover:-translate-y-1 md:hover:shadow-[0_18px_36px_rgba(17,24,39,0.10)]"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.85),rgba(255,255,255,0))]" />

                  {nonDisplayableLogoIds[logo.id] ? (
                    <div className="text-center text-apple-gray-300 text-sm leading-6">
                      <p className="font-medium text-apple-gray-500 mb-2">{logo.title}</p>
                      <p>This item is not a displayable image.</p>
                    </div>
                  ) : (
                    <img
                      src={logo.file_url}
                      alt={logo.alt_text || logo.title}
                      className="relative z-10 max-w-full max-h-full object-contain transition-all duration-500 ease-out xl:grayscale xl:contrast-125 xl:opacity-75 xl:group-hover:grayscale-0 xl:group-hover:contrast-100 xl:group-hover:opacity-100 xl:group-hover:scale-105"
                      onError={() =>
                        setNonDisplayableLogoIds((prev) =>
                          prev[logo.id] ? prev : { ...prev, [logo.id]: true }
                        )
                      }
                    />
                  )}

                  {!nonDisplayableLogoIds[logo.id] && (
                    <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 hidden md:block">
                      <p className="truncate text-[10px] font-semibold tracking-[0.12em] uppercase text-apple-gray-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {logo.title}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-24 text-center">
            <h2 className="heading-lg mb-8">Ready for a Brand Refresh?</h2>
            <Link to="/contact" className="apple-button apple-button-primary">
              Get a Custom Logo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
