import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { X, ZoomIn } from 'lucide-react';

type MediaItem = {
  id: number;
  title: string;
  file_url: string;
  alt_text?: string | null;
  category?: string | null;
  placement?: string | null;
  description?: string | null;
  tech_stack?: string | null;
  features?: string | null;
};

export const Portfolio = () => {
  const [projects, setProjects] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<MediaItem | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch('/api/media?category=portfolio');
        const data = await res.json();

        if (data?.items && Array.isArray(data.items)) {
          setProjects(data.items);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.warn('Failed to load portfolio projects', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const parsedFeatures = useMemo(() => {
    if (!activeProject?.features) return [];
    return activeProject.features
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }, [activeProject]);

  return (
    <div className="pt-16 md:pt-20">
      <PageHeader
        title="Our Work"
        subtitle="Portfolio"
        description="A growing collection of digital projects, client builds, and creative solutions delivered through Apex Digital Consultants."
      />

      <section className="section-padding">
        <div className="container-wide">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-apple-gray-300">Loading portfolio...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-apple-gray-300">No portfolio projects uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-white rounded-[2rem] overflow-hidden border border-apple-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-apple-gray-50">
                    <img
                      src={project.file_url}
                      alt={project.alt_text || project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
                      <h3 className="text-2xl font-bold text-apple-gray-500 leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-sm uppercase tracking-widest text-apex-yellow mt-3">
                        Portfolio Project
                      </p>
                    </div>

                    {project.description && (
                      <p className="text-apple-gray-300 leading-8">
                        {project.description}
                      </p>
                    )}

                    {project.tech_stack && (
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-widest text-apple-gray-500 mb-3">
                          Technology Used
                        </h4>
                        <p className="text-apple-gray-300 leading-7">
                          {project.tech_stack}
                        </p>
                      </div>
                    )}

                    {project.features && (
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-widest text-apple-gray-500 mb-3">
                          Site Features
                        </h4>
                        <p className="text-apple-gray-300 leading-7">
                          {project.features}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {activeProject && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 py-8">
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-auto rounded-[2rem] bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-apple-gray-500 shadow-md hover:bg-white transition"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr]">
              <div className="bg-apple-gray-50">
                <img
                  src={activeProject.file_url}
                  alt={activeProject.alt_text || activeProject.title}
                  className="w-full h-full object-contain max-h-[75vh]"
                />
              </div>

              <div className="p-8 md:p-10 space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-widest text-apex-yellow mb-3">
                    Portfolio Project
                  </p>
                  <h3 className="text-3xl font-bold text-apple-gray-500 leading-tight">
                    {activeProject.title}
                  </h3>
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

                {activeProject.tech_stack && (
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-apple-gray-500 mb-3">
                      Technology Used
                    </h4>
                    <p className="text-apple-gray-300 leading-8">
                      {activeProject.tech_stack}
                    </p>
                  </div>
                )}

                {parsedFeatures.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-apple-gray-500 mb-3">
                      Site Features
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};