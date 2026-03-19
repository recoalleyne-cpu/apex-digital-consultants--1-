import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildFallbackCaseStudies } from '../utils/caseStudies';

type MediaItem = {
  id: number;
  title: string;
  client_name?: string | null;
  file_url: string;
  alt_text?: string | null;
  category?: string | null;
  placement?: string | null;
  description?: string | null;
  project_type?: string | null;
  services_provided?: string | null;
  project_url?: string | null;
  is_featured?: boolean;
  display_order?: number;
  tech_stack?: string | null;
  features?: string | null;
};

const PORTFOLIO_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400';

const isPlaceholderImage = (value?: string | null) => {
  if (!value) return true;
  const normalized = value.trim().toLowerCase();
  return normalized === '[add image]' || normalized === '[add url]' || normalized === '[add urls]';
};

const resolveProjectImage = (value?: string | null) => {
  if (isPlaceholderImage(value)) return PORTFOLIO_FALLBACK_IMAGE;
  return value?.trim() || PORTFOLIO_FALLBACK_IMAGE;
};

const splitDelimited = (value?: string | null) => {
  if (!value) return [];
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const isLikelyModuleResponse = (payload: string) => {
  const normalized = payload.trimStart();
  return normalized.startsWith('import ') || normalized.startsWith('export ');
};

const parseJsonResponseSafely = async (res: Response) => {
  const payload = await res.text();

  try {
    return JSON.parse(payload);
  } catch {
    if (isLikelyModuleResponse(payload)) {
      throw new Error(
        'Portfolio API returned JavaScript instead of JSON. Falling back to approved portfolio entries.'
      );
    }

    throw new Error('Portfolio API returned invalid JSON.');
  }
};

const buildPortfolioFallbackItems = (): MediaItem[] => {
  return buildFallbackCaseStudies({ limit: 30 }).map((entry, index) => ({
    id: -(index + 1),
    title: entry.title,
    client_name: entry.client_name || entry.title,
    file_url: entry.featured_image_url || '[Add Image]',
    alt_text: entry.client_name || entry.title,
    category: 'portfolio',
    placement: 'portfolio-grid',
    description: entry.summary || '',
    project_type: 'Website Design & Development',
    services_provided: entry.services_provided || '',
    project_url: `/case-studies/${entry.slug}`,
    is_featured: entry.is_featured,
    display_order: index + 1,
    tech_stack: entry.tech_stack || null,
    features: entry.services_provided || ''
  }));
};

export const Portfolio = () => {
  const [projects, setProjects] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Loading portfolio...');
  const [activeProject, setActiveProject] = useState<MediaItem | null>(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadProjects = async () => {
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        setLoading(true);
        setStatusMessage('Loading portfolio...');

        const res = await fetch('/api/portfolio', {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          },
          signal: controller.signal
        });

        if (!res.ok) {
          throw new Error(`Portfolio API failed with status ${res.status}`);
        }

        const data = await parseJsonResponseSafely(res);

        if (!isMounted) return;

        if (data?.items && Array.isArray(data.items)) {
          setProjects(data.items);
          setStatusMessage(data.items.length ? '' : 'No portfolio projects uploaded yet.');
        } else {
          setProjects([]);
          setStatusMessage('No portfolio projects uploaded yet.');
        }
      } catch (err) {
        console.error('Failed to load portfolio projects:', err);

        if (!isMounted) return;

        const fallbackItems = buildPortfolioFallbackItems();

        if (fallbackItems.length > 0) {
          setProjects(fallbackItems);
          setStatusMessage('Live portfolio feed unavailable. Showing approved portfolio entries.');
        } else {
          setProjects([]);
          if (err instanceof DOMException && err.name === 'AbortError') {
            setStatusMessage('Portfolio request timed out. Please try again.');
          } else {
            setStatusMessage(
              err instanceof Error ? err.message : 'Portfolio request failed.'
            );
          }
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

  useEffect(() => {
    if (!activeProject) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setIsDragging(false);
    }
  }, [activeProject]);

  const parsedFeatures = useMemo(
    () => splitDelimited(activeProject?.services_provided || activeProject?.features),
    [activeProject]
  );

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const handleZoomIn = () => {
    setZoom((prev) => clamp(Number((prev + 0.25).toFixed(2)), 1, 4));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = clamp(Number((prev - 0.25).toFixed(2)), 1, 4);
      if (next === 1) {
        setOffset({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleResetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const handleImageClick = () => {
    if (zoom === 1) {
      setZoom(2);
    } else {
      handleResetView();
    }
  };

  const handleWheelZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.2 : 0.2;

    setZoom((prev) => {
      const next = clamp(Number((prev + delta).toFixed(2)), 1, 4);
      if (next === 1) {
        setOffset({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;

    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    offsetStartRef.current = { ...offset };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || zoom <= 1) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    setOffset({
      x: offsetStartRef.current.x + dx,
      y: offsetStartRef.current.y + dy
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="pt-16 md:pt-20">
      <PageHeader
        title="Our Work"
        subtitle="Portfolio"
        description="A growing collection of website development, web design, and digital project outcomes delivered for Barbados and Caribbean businesses."
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="mb-10 rounded-[2rem] border border-apple-gray-100 bg-white p-6 sm:p-7 md:p-8">
            <p className="text-sm md:text-base text-apple-gray-300 leading-7 mb-4">
              Looking for similar outcomes? Explore our dedicated pages for website development Barbados and Caribbean service delivery.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/website-development-barbados" className="apple-button apple-button-secondary text-sm">
                Website Development Barbados
              </Link>
              <Link to="/website-development-caribbean" className="apple-button apple-button-secondary text-sm">
                Website Development Caribbean
              </Link>
              <Link to="/ecommerce-website-development-barbados" className="apple-button apple-button-secondary text-sm">
                Ecommerce Website Development
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-apple-gray-300">{statusMessage}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-apple-gray-300">{statusMessage || 'No portfolio projects uploaded yet.'}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
                {projects.map((project) => (
                  <div
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

                      <button
                        type="button"
                        onClick={() => setActiveProject(project)}
                        className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-apple-gray-500 shadow-md hover:bg-white transition"
                      >
                        <ZoomIn size={16} />
                        View Larger
                      </button>
                    </div>

                    <div className="p-6 md:p-8 space-y-5">
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <p className="text-sm uppercase tracking-widest text-apple-gray-300">
                            {project.client_name || project.title}
                          </p>
                          {project.is_featured ? (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-apex-yellow">
                              Featured
                            </span>
                          ) : null}
                        </div>
                        <h3 className="text-2xl font-bold text-apple-gray-500 leading-tight">
                          {project.title}
                        </h3>
                        <p className="text-sm uppercase tracking-widest text-apex-yellow mt-3">
                          {project.project_type || project.tech_stack || 'Website Design & Development'}
                        </p>
                      </div>

                      {project.description && (
                        <p className="text-apple-gray-300 leading-8">
                          {project.description}
                        </p>
                      )}

                      {(project.services_provided || project.features) && (
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-widest text-apple-gray-500 mb-3">
                            Services Provided
                          </h4>
                          <p className="text-apple-gray-300 leading-7">
                            {(splitDelimited(project.services_provided || project.features).slice(0, 5)).join(' · ')}
                          </p>
                        </div>
                      )}

                      {project.project_url ? (
                        <div>
                          <Link
                            to={project.project_url}
                            className="apple-button apple-button-secondary text-sm"
                          >
                            View Case Study
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-6 sm:p-7 md:p-8">
                <h2 className="text-2xl font-semibold text-apple-gray-500 mb-3">
                  Need Website Development Like This for Your Business?
                </h2>
                <p className="text-apple-gray-300 leading-8 mb-5">
                  Explore our service options and discuss your project goals with the Apex team.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/services" className="apple-button apple-button-secondary text-sm">
                    Explore Website Development Services
                  </Link>
                  <Link to="/case-studies" className="apple-button apple-button-secondary text-sm">
                    Read Website Case Studies
                  </Link>
                  <Link to="/contact" className="apple-button apple-button-primary text-sm">
                    Discuss Your Website Project
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {activeProject && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
          <div className="relative w-full max-w-6xl max-h-[92vh] overflow-auto rounded-[1.5rem] sm:rounded-[2rem] bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 z-20 rounded-full bg-white/90 p-2 text-apple-gray-500 shadow-md hover:bg-white transition"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr]">
              <div className="bg-apple-gray-50 relative">
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="rounded-full bg-white/95 p-2 text-apple-gray-500 shadow-md hover:bg-white transition"
                    aria-label="Zoom out"
                  >
                    <ZoomOut size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="rounded-full bg-white/95 p-2 text-apple-gray-500 shadow-md hover:bg-white transition"
                    aria-label="Zoom in"
                  >
                    <ZoomIn size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={handleResetView}
                    className="rounded-full bg-white/95 p-2 text-apple-gray-500 shadow-md hover:bg-white transition"
                    aria-label="Reset zoom"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>

                <div
                  className={`w-full max-h-[65vh] sm:max-h-[75vh] min-h-[280px] sm:min-h-[420px] overflow-hidden flex items-center justify-center ${
                    zoom > 1 ? 'cursor-grab' : 'cursor-zoom-in'
                  } ${isDragging ? '!cursor-grabbing' : ''}`}
                  onWheel={handleWheelZoom}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                >
                  <img
                    src={resolveProjectImage(activeProject.file_url)}
                    alt={activeProject.alt_text || activeProject.title}
                    onClick={handleImageClick}
                    draggable={false}
                    className="max-w-full max-h-[65vh] sm:max-h-[75vh] object-contain select-none transition-transform duration-200"
                    style={{
                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                      transformOrigin: 'center center'
                    }}
                  />
                </div>

                <div className="px-5 sm:px-6 pb-5 pt-2 text-center">
                  <p className="text-sm text-apple-gray-300">
                    Click image to zoom, use mouse wheel to zoom further, and drag to pan.
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 md:p-10 space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-widest text-apex-yellow mb-3">
                    {activeProject.project_type || activeProject.tech_stack || 'Website Design & Development'}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-apple-gray-500 leading-tight">
                    {activeProject.title}
                  </h3>
                  {activeProject.client_name ? (
                    <p className="text-apple-gray-300 mt-3">{activeProject.client_name}</p>
                  ) : null}
                </div>

                {activeProject.description && (
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-apple-gray-500 mb-3">
                      Overview
                    </h4>
                    <p className="text-apple-gray-300 leading-8">
                      {activeProject.description}
                    </p>
                  </div>
                )}

                {(activeProject.project_type || activeProject.tech_stack) && (
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-apple-gray-500 mb-3">
                      Project Type
                    </h4>
                    <p className="text-apple-gray-300 leading-8">
                      {activeProject.project_type || activeProject.tech_stack}
                    </p>
                  </div>
                )}

                {parsedFeatures.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-apple-gray-500 mb-3">
                      Services Provided
                    </h4>
                    <ul className="space-y-3 text-apple-gray-300">
                      {parsedFeatures.map((feature, index) => (
                        <li key={index} className="flex gap-3 leading-7">
                          <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-apex-yellow shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeProject.project_url ? (
                  <div>
                    <Link
                      to={activeProject.project_url}
                      className="apple-button apple-button-primary text-sm"
                    >
                      View Full Case Study
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
