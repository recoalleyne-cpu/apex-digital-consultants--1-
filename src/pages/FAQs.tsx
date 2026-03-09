
import React from 'react';
import { motion } from 'framer-motion';
import { FAQS } from '../constants';
import { ChevronDown } from 'lucide-react';

import { PageHeader } from '../components/PageHeader';

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
