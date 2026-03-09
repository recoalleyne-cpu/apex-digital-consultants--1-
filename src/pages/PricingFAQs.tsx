
import React from 'react';
import { motion } from 'framer-motion';
import { PRICING, FAQS } from '../constants';
import { Check, ChevronDown } from 'lucide-react';

import { PageHeader } from '../components/PageHeader';

export const Pricing = () => {
  return (
    <div className="pt-12">
      <PageHeader 
        title="Invest in Your Business Growth."
        subtitle="Pricing"
        description="Transparent, value-driven pricing for our consulting and design services. No hidden fees, just results."
      />

      <section className="pb-24">
        <div className="container-wide px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-12 rounded-[3rem] border border-apple-gray-100 bg-white hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                  {plan.duration && <span className="text-apple-gray-300 font-medium">/ {plan.duration}</span>}
                </div>
                <ul className="space-y-6 mb-12 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-4 text-apple-gray-400">
                      <div className="w-6 h-6 rounded-full bg-apple-gray-50 flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-apple-gray-500" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="apple-button apple-button-primary w-full">
                  Book This Session
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Quote */}
      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto bg-white p-12 md:p-24 rounded-[3rem] shadow-sm text-center">
            <h2 className="heading-lg mb-8">Need a Custom Package?</h2>
            <p className="text-xl text-apple-gray-300 mb-12">
              For larger projects, ongoing retainers, or full-scale digital transformations, we provide custom quotes tailored to your specific needs.
            </p>
            <button className="apple-button apple-button-secondary">
              Request Custom Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export const FAQs = () => {
  return (
    <div className="pt-12">
      <PageHeader 
        title="Frequently Asked Questions."
        subtitle="Support"
        description="Everything you need to know about working with APEX."
      />

      <section className="pb-24">
        <div className="container-wide px-6 max-w-4xl">
          <div className="space-y-6">
            {FAQS.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <details className="p-8 rounded-[2rem] bg-apple-gray-50 hover:bg-white border border-transparent hover:border-apple-gray-100 transition-all duration-300 cursor-pointer">
                  <summary className="list-none flex items-center justify-between font-bold text-xl">
                    {faq.question}
                    <ChevronDown size={20} className="text-apple-gray-300 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="mt-6 text-apple-gray-300 leading-relaxed text-lg">
                    {faq.answer}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
