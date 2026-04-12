import React from 'react';
import { motion } from 'framer-motion';
import { Target, Layout, PenTool, Megaphone, Zap, Briefcase, Cpu, BarChart, ArrowRight } from 'lucide-react';
import { SERVICES } from '../constants';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

const IconMap: Record<string, any> = {
  Target, Layout, PenTool, Megaphone, Zap, Briefcase, Cpu, BarChart
};

export const Services = () => {
  return (
    <div className="pt-16 md:pt-20">
      <PageHeader
        title="Website Development & Digital Services."
        subtitle="Our Expertise"
        description="From website development in Barbados to Caribbean-wide digital execution, we provide the strategy and systems needed to drive measurable growth."
      />

      <section className="pt-10 md:pt-14 pb-24 md:pb-32">
        <div className="container-wide px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
            {SERVICES.map((service, index) => {
              const Icon = IconMap[service.icon];
              return (
                <motion.div
                  key={service.id}
                  id={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 2) * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="relative h-full overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-apple-gray-100/80 bg-apple-gray-50/85 p-6 sm:p-7 md:p-8 lg:p-9 text-center flex flex-col items-center transition-all duration-500 group hover:border-apex-yellow/45 hover:bg-white hover:shadow-[0_16px_38px_rgba(8,28,44,0.12)]"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(140%_95%_at_50%_0%,rgba(247,203,67,0.15)_0%,rgba(52,137,174,0.09)_35%,rgba(255,255,255,0)_68%)]" />

                  <div className="relative z-[1] w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/95 flex items-center justify-center mb-5 sm:mb-6 shadow-[0_8px_18px_rgba(7,23,37,0.08)] group-hover:bg-apex-yellow group-hover:text-apple-gray-500 transition-all">
                    <Icon size={24} className="sm:w-7 sm:h-7" />
                  </div>

                  <h3 className="relative z-[1] text-xl sm:text-[1.6rem] md:text-[1.75rem] font-bold mb-3 sm:mb-4 leading-tight group-hover:text-apex-yellow transition-colors">
                    {service.title}
                  </h3>

                  <p className="relative z-[1] text-sm sm:text-[15px] text-apple-gray-300 leading-7 mb-5 sm:mb-6 md:mb-7 max-w-[34ch]">
                    {service.description}
                  </p>

                  <div className="relative z-[1] mt-auto flex flex-wrap justify-center gap-3">
                    <Link to={`/services/${service.id}`} className="apple-button apple-button-secondary text-sm">
                      Explore {service.title}
                    </Link>

                    {service.id === 'web-development' && (
                      <>
                        <Link to="/services/web-design" className="apple-button apple-button-secondary text-sm">
                          Design Details
                        </Link>
                        <Link to="/services/websites" className="apple-button apple-button-secondary text-sm">
                          Dev Details
                        </Link>
                      </>
                    )}

                    {service.id === 'graphic-design' && (
                      <Link to="/services/logos" className="apple-button apple-button-secondary text-sm">
                        Logo Portfolio
                      </Link>
                    )}

                    <Link to="/contact" className="apple-button apple-button-primary text-sm">
                      Request Website Quote
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-24">
        <div className="container-wide px-6 md:px-8">
          <div className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 md:p-10">
            <h2 className="text-3xl md:text-4xl font-bold text-apple-gray-500 mb-5">
              Need a Dedicated Website Service Page?
            </h2>
            <p className="text-base md:text-lg leading-8 text-apple-gray-300 mb-7 max-w-4xl">
              Explore focused pages for website development Barbados, website development Caribbean, ecommerce website development Barbados, and SEO-friendly web design services.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/website-development-barbados" className="apple-button apple-button-secondary text-sm">
                Website Development Barbados
              </Link>
              <Link to="/website-development-caribbean" className="apple-button apple-button-secondary text-sm">
                Website Development Caribbean
              </Link>
              <Link to="/web-design-barbados" className="apple-button apple-button-secondary text-sm">
                Web Design Barbados
              </Link>
              <Link
                to="/ecommerce-website-development-barbados"
                className="apple-button apple-button-secondary text-sm"
              >
                Ecommerce Website Development
              </Link>
              <Link to="/seo-friendly-websites-barbados" className="apple-button apple-button-secondary text-sm">
                SEO-Friendly Websites
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-24">
        <div className="container-wide px-6 md:px-8">
          <div className="rounded-[2.5rem] border border-apple-gray-100 bg-apple-gray-50 p-8 md:p-10">
            <h2 className="text-3xl md:text-4xl font-bold text-apple-gray-500 mb-5">
              Services FAQs
            </h2>
            <div className="space-y-4">
              {[
                {
                  question: 'Do you provide custom website development in Barbados?',
                  answer:
                    'Yes. We build tailored websites for Barbados businesses, including business websites, ecommerce builds, and redesign projects.'
                },
                {
                  question: 'Can you support clients across the Caribbean?',
                  answer:
                    'Yes. We support Caribbean clients remotely with structured planning, communication, and launch workflows.'
                },
                {
                  question: 'Do your services include SEO-friendly website structure?',
                  answer:
                    'Yes. We include SEO-friendly structure, metadata foundations, responsive UX, and internal linking considerations.'
                }
              ].map((item) => (
                <details
                  key={item.question}
                  className="rounded-2xl border border-apple-gray-100 bg-white p-6"
                >
                  <summary className="cursor-pointer list-none text-lg font-semibold text-apple-gray-500">
                    {item.question}
                  </summary>
                  <p className="mt-4 text-base leading-8 text-apple-gray-300">{item.answer}</p>
                </details>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/portfolio" className="apple-button apple-button-secondary text-sm">
                See Website Development Portfolio
              </Link>
              <Link to="/case-studies" className="apple-button apple-button-secondary text-sm">
                Read Website Case Studies
              </Link>
              <Link to="/contact" className="apple-button apple-button-primary text-sm">
                Request Website Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-apple-gray-500 text-white">
        <div className="container-wide">
          <div className="text-center mb-14 md:mb-16">
            <h2 className="heading-lg mb-6">
              Our <span className="text-apex-yellow">Process</span>
            </h2>
            <p className="text-apple-gray-200 max-w-2xl mx-auto leading-8">
              How we turn your vision into a digital reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
            {[
              { step: '01', title: 'Analyze', desc: 'We dive deep into your market and business goals.' },
              { step: '02', title: 'Strategize', desc: 'We craft a custom roadmap for your digital growth.' },
              { step: '03', title: 'Execute', desc: 'Our experts build and design with precision.' },
              { step: '04', title: 'Optimize', desc: 'We refine and scale for long-term success.' }
            ].map((p, i) => (
              <div key={i} className="relative space-y-4 md:space-y-5">
                <span className="text-4xl sm:text-5xl font-bold text-apex-yellow opacity-40 block">
                  {p.step}
                </span>
                <h3 className="text-xl font-bold">{p.title}</h3>
                <p className="text-apple-gray-200 leading-8">{p.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 -right-6 text-apex-yellow/20">
                    <ArrowRight />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
