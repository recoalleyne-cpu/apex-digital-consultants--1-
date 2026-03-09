import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Cpu, Building2, CheckCircle2 } from 'lucide-react';
import { PORTFOLIO, TESTIMONIALS } from '../constants';
import { PageHeader } from '../components/PageHeader';

export const Portfolio = () => {
  return (
    <div className="pt-16 md:pt-20">
      <PageHeader
        title="Showcasing Digital Excellence."
        subtitle="Our Portfolio"
        description="A curated selection of our most impactful work, from brand transformations to custom digital solutions."
      />

      <section className="pt-10 md:pt-14 pb-24 md:pb-32">
        <div className="container-wide px-6 md:px-8">
          <div className="grid grid-cols-1 gap-20 md:gap-24 lg:gap-28">
            {PORTFOLIO.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`flex flex-col ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } gap-12 md:gap-14 lg:gap-20 items-center`}
              >
                {/* Image Container */}
                <div className="w-full lg:w-3/5">
                  <div className="aspect-[16/10] rounded-[3rem] overflow-hidden bg-apple-gray-50 shadow-2xl group border border-apple-gray-100 hover:border-apex-yellow transition-colors duration-500">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Content Container */}
                <div className="w-full lg:w-2/5">
                  <div className="space-y-8 md:space-y-10">
                    <div>
                      <span className="text-xs font-bold text-apex-yellow uppercase tracking-widest mb-4 block">
                        {project.category}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-lg md:text-xl text-apple-gray-300 leading-8">
                        {project.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 py-8 md:py-10 border-y border-apple-gray-100">
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-2 text-apex-yellow">
                          <Building2 size={18} />
                          <span className="text-xs font-bold uppercase tracking-wider text-apple-gray-500">
                            Industry
                          </span>
                        </div>
                        <p className="font-medium leading-7">{(project as any).industry}</p>
                      </div>

                      <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-2 text-apex-yellow">
                          <Cpu size={18} />
                          <span className="text-xs font-bold uppercase tracking-wider text-apple-gray-500">
                            Technology
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(project as any).technologies?.map((tech: string, i: number) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1 bg-apple-gray-50 rounded-full text-apple-gray-300 font-medium hover:bg-apex-yellow hover:text-apple-gray-500 transition-colors cursor-default"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-5 md:gap-6 items-center pt-1">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="apple-button apple-button-primary flex items-center gap-2"
                        >
                          <Globe size={18} /> Visit Live Site
                        </a>
                      )}
                      <div className="flex items-center gap-2 text-apple-gray-300 text-sm font-medium">
                        <CheckCircle2 size={18} className="text-apex-yellow" />
                        Project Completed
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials integrated */}
      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide">
          <div className="text-center mb-14 md:mb-16">
            <h2 className="heading-lg mb-6">Client Success Stories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
            {TESTIMONIALS.slice(0, 2).map((t, i) => (
              <div
                key={i}
                className="p-10 md:p-12 rounded-[3rem] bg-white border border-apple-gray-100 shadow-sm"
              >
                <p className="text-lg md:text-xl italic font-serif mb-8 leading-8 text-apple-gray-300">
                  "{t.content}"
                </p>
                <div className="space-y-1">
                  <p className="font-bold text-lg">{t.name}</p>
                  <p className="text-sm text-apple-gray-300">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};