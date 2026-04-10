import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

type PortfolioProject = {
  id: number;
  title: string;
  client_name?: string | null;
  file_url?: string | null;
  alt_text?: string | null;
  description?: string | null;
  project_type?: string | null;
  category?: string | null;
  tech_stack?: string | null;
  services_provided?: string | null;
  project_url?: string | null;
  is_featured?: boolean;
};

const PORTFOLIO_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400';

const WEBSITE_KEYWORDS = [
  'website',
  'web design',
  'web development',
  'wordpress',
  'ecommerce',
  'woocommerce',
  'site',
  'landing page'
];

const normalizeText = (value: unknown) =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

const resolveProjectImage = (value: unknown) => {
  if (typeof value !== 'string') return PORTFOLIO_FALLBACK_IMAGE;
  const trimmed = value.trim();
  if (!trimmed) return PORTFOLIO_FALLBACK_IMAGE;
  if (trimmed.toLowerCase() === '[add image]') return PORTFOLIO_FALLBACK_IMAGE;
  return trimmed;
};

const parseJsonResponseSafely = async (response: Response) => {
  const payload = await response.text();
  try {
    return JSON.parse(payload);
  } catch {
    const normalized = payload.trimStart();
    if (normalized.startsWith('import ') || normalized.startsWith('export ')) {
      throw new Error('Portfolio API returned JavaScript instead of JSON.');
    }
    throw new Error('Portfolio API returned invalid JSON.');
  }
};

const isWebsiteFocusedProject = (item: PortfolioProject) => {
  const combined = [
    item.title,
    item.client_name,
    item.description,
    item.project_type,
    item.category,
    item.tech_stack,
    item.services_provided
  ]
    .map((value) => normalizeText(value))
    .join(' ');

  return WEBSITE_KEYWORDS.some((keyword) => combined.includes(keyword));
};

export const PortfolioWebsites = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Loading completed websites...');

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadProjects = async () => {
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        setLoading(true);
        setStatusMessage('Loading completed websites...');

        const response = await fetch('/api/portfolio', {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Portfolio API failed with status ${response.status}`);
        }

        const data = await parseJsonResponseSafely(response);
        const items = Array.isArray(data?.items) ? (data.items as PortfolioProject[]) : [];

        if (!isMounted) return;

        setProjects(items);
        setStatusMessage(items.length ? '' : 'No completed website projects are available yet.');
      } catch (error) {
        if (!isMounted) return;

        setProjects([]);
        if (error instanceof DOMException && error.name === 'AbortError') {
          setStatusMessage('Website portfolio request timed out. Please refresh and try again.');
        } else {
          setStatusMessage(
            error instanceof Error
              ? error.message
              : 'Unable to load completed website projects right now.'
          );
        }
      } finally {
        clearTimeout(timeout);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const websiteProjects = useMemo(() => {
    const filtered = projects.filter(isWebsiteFocusedProject);
    return filtered.length ? filtered : projects;
  }, [projects]);

  return (
    <div className="pt-16 md:pt-20">
      <PageHeader
        title="Websites Completed"
        subtitle="Portfolio"
        description="A focused view of completed website projects delivered for business growth across Barbados and the Caribbean."
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="mb-10 rounded-[2rem] border border-apple-gray-100 bg-white p-6 sm:p-7 md:p-8">
            <p className="text-sm md:text-base text-apple-gray-300 leading-7 mb-4">
              These projects highlight completed website builds, redesigns, and conversion-focused implementations. Explore logo work or return to the full portfolio for all project categories.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/portfolio/logos" className="apple-button apple-button-secondary text-sm">
                Logo Portfolio
              </Link>
              <Link to="/portfolio" className="apple-button apple-button-secondary text-sm">
                Full Portfolio
              </Link>
              <Link to="/contact" className="apple-button apple-button-primary text-sm">
                Discuss Your Website Project
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-apple-gray-300">{statusMessage}</div>
          ) : websiteProjects.length === 0 ? (
            <div className="text-center py-20 text-apple-gray-300">
              {statusMessage || 'No completed website projects are available yet.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
              {websiteProjects.map((project) => (
                <article
                  key={project.id}
                  className="group bg-white rounded-[2rem] overflow-hidden border border-apple-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-apple-gray-50">
                    <img
                      src={resolveProjectImage(project.file_url)}
                      alt={project.alt_text || project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />

                    {project.is_featured ? (
                      <span className="absolute top-4 left-4 inline-flex rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-apex-yellow shadow-md">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <div className="p-6 md:p-8 space-y-4">
                    <div>
                      <p className="text-sm uppercase tracking-widest text-apple-gray-300 mb-2">
                        {project.client_name || project.title}
                      </p>
                      <h2 className="text-2xl font-bold text-apple-gray-500 leading-tight">
                        {project.title}
                      </h2>
                    </div>

                    <p className="text-sm uppercase tracking-widest text-apex-yellow">
                      {project.project_type || project.tech_stack || 'Website Project'}
                    </p>

                    {project.description ? (
                      <p className="text-apple-gray-300 leading-8">{project.description}</p>
                    ) : null}

                    <div className="flex flex-wrap gap-3 pt-1">
                      {project.project_url ? (
                        <Link
                          to={project.project_url}
                          className="apple-button apple-button-secondary text-sm"
                        >
                          View Case Study
                        </Link>
                      ) : null}
                      <Link to="/contact" className="apple-button apple-button-primary text-sm">
                        Build Something Similar
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
