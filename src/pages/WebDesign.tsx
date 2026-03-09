
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '../components/PageHeader';

export const WebDesign = () => {
  return (
    <div className="pt-12">
      <PageHeader 
        title="Custom Website Design."
        subtitle="Service Details"
        description="We create custom, mobile-friendly websites that are visually appealing, easy to navigate, and designed to convert visitors into customers."
      />

      <section className="pb-24">
        <div className="container-wide px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="heading-lg mb-8">Design with Purpose.</h2>
              <p className="text-lg text-apple-gray-300 mb-8 leading-relaxed">
                Whether you need a simple landing page or a full-service site, we build with purpose and style. Our design process focuses on user experience, brand alignment, and conversion optimization.
              </p>
              <ul className="space-y-4 mb-12">
                {[
                  'Mobile-First Responsive Design',
                  'User Experience (UX) Optimization',
                  'Conversion-Focused Layouts',
                  'Custom Graphics & Visuals',
                  'SEO-Friendly Structure'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-apple-gray-400">
                    <Check size={18} className="text-apple-gray-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="apple-button apple-button-primary">
                Start Your Project
              </Link>
            </div>
            <div className="order-1 lg:order-2 aspect-square rounded-[3rem] overflow-hidden bg-apple-gray-50 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" 
                alt="Web Design" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
