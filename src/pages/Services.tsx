
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Layout, PenTool, Megaphone, Zap, Briefcase, Cpu, BarChart, ArrowRight } from 'lucide-react';
import { SERVICES } from '../constants';
import { Link } from 'react-router-dom';

const IconMap: Record<string, any> = {
  Target, Layout, PenTool, Megaphone, Zap, Briefcase, Cpu, BarChart
};

import { PageHeader } from '../components/PageHeader';

export const Services = () => {
  return (
    <div className="pt-12">
      <PageHeader 
        title="Solutions Tailored to Your Success."
        subtitle="Our Expertise"
        description="From initial branding to complex digital workflows, we provide the tools and strategy you need to thrive in a competitive market."
      />

      <section className="pb-24">
        <div className="container-wide px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  className="p-12 rounded-[3rem] bg-apple-gray-50 border border-transparent hover:border-apex-yellow hover:bg-white transition-all duration-500 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm group-hover:bg-apex-yellow group-hover:text-apple-gray-500 transition-all">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-3xl font-bold mb-6 group-hover:text-apex-yellow transition-colors">{service.title}</h3>
                  <p className="text-lg text-apple-gray-300 leading-relaxed mb-8">
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
          <div className="text-center mb-24">
            <h2 className="heading-lg mb-6">Our <span className="text-apex-yellow">Process</span></h2>
            <p className="text-apple-gray-200">How we turn your vision into a digital reality.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { step: '01', title: 'Analyze', desc: 'We dive deep into your market and business goals.' },
              { step: '02', title: 'Strategize', desc: 'We craft a custom roadmap for your digital growth.' },
              { step: '03', title: 'Execute', desc: 'Our experts build and design with precision.' },
              { step: '04', title: 'Optimize', desc: 'We refine and scale for long-term success.' }
            ].map((p, i) => (
              <div key={i} className="relative">
                <span className="text-5xl font-bold text-apex-yellow opacity-40 mb-6 block">{p.step}</span>
                <h4 className="text-xl font-bold mb-4">{p.title}</h4>
                <p className="text-apple-gray-200">{p.desc}</p>
                {i < 3 && <div className="hidden md:block absolute top-8 -right-6 text-apex-yellow/20"><ArrowRight /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
