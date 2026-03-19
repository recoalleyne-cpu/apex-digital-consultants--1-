import React from 'react';
import { motion } from 'framer-motion';
import { PRICING } from '../constants';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '../components/PageHeader';

export const Pricing = () => {
  return (
    <div className="pt-16 md:pt-20">
      <PageHeader
        title="Invest in Your Business Growth."
        subtitle="Pricing"
        description="Transparent, value-driven pricing for our consulting and design services. No hidden fees, just results."
      />

      <section className="pt-10 md:pt-14 pb-24 md:pb-32">
        <div className="container-wide px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {PRICING.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-10 md:p-12 rounded-[3rem] border border-apple-gray-100 bg-white hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
              >
                <h3 className="text-2xl font-bold mb-3 leading-tight">{plan.name}</h3>

                <div className="flex items-baseline gap-2 mb-8 md:mb-10">
                  <span className="text-4xl md:text-5xl font-bold tracking-tight">{plan.price}</span>
                  {plan.duration && (
                    <span className="text-apple-gray-300 font-medium">/ {plan.duration}</span>
                  )}
                </div>

                <ul className="space-y-5 md:space-y-6 mb-10 md:mb-12 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-4 text-apple-gray-400 leading-7">
                      <div className="w-6 h-6 rounded-full bg-apple-gray-50 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check size={14} className="text-apple-gray-500" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/contact" className="apple-button apple-button-primary w-full text-center">
                  Get A Quote
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] border border-apple-gray-100 bg-white p-6 sm:p-7 md:p-8">
            <p className="text-sm md:text-base text-apple-gray-300 leading-7 mb-4">
              Need a package aligned to your market? Explore dedicated service pages for website development in Barbados and the Caribbean.
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
        </div>
      </section>

      {/* Custom Quote */}
      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto bg-white px-8 py-12 md:px-12 md:py-20 lg:px-16 lg:py-24 rounded-[3rem] shadow-sm text-center">
            <h2 className="heading-lg mb-8 md:mb-9">Need a Custom Package?</h2>

            <p className="text-lg md:text-xl text-apple-gray-300 leading-8 max-w-3xl mx-auto mb-10 md:mb-12">
              For larger projects, ongoing retainers, or full-scale digital transformations, we provide custom quotes tailored to your specific needs.
            </p>

            <Link to="/contact" className="apple-button apple-button-secondary">
              Get A Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
