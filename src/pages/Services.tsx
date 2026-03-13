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
        title="Solutions Tailored to Your Success."
        subtitle="Our Expertise"
        description="From initial branding to complex digital workflows, we provide the tools and strategy you need to thrive in a competitive market."
      />

      <section className="pt-10 md:pt-14 pb-24 md:pb-32">
        <div className="container-wide px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
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
                  className="p-7 sm:p-8 md:p-12 lg:p-14 rounded-[2rem] sm:rounded-[3rem] bg-apple-gray-50 border border-transparent hover:border-apex-yellow hover:bg-white transition-all duration-500 group"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white flex items-center justify-center mb-7 sm:mb-8 shadow-sm group-hover:bg-apex-yellow group-hover:text-apple-gray-500 transition-all">
                    <Icon size={28} className="sm:w-8 sm:h-8" />
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-5 md:mb-6 leading-tight group-hover:text-apex-yellow transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-base sm:text-lg text-apple-gray-300 leading-8 mb-7 sm:mb-8 md:mb-10">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-4">
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
                      Get a Quote
                    </Link>
                  </div>
                </motion.div>
              );
            })}
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
                <h4 className="text-xl font-bold">{p.title}</h4>
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
