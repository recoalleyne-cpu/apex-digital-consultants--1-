
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { PageHeader } from '../components/PageHeader';

export const Logos = () => {
  return (
    <div className="pt-12">
      <PageHeader 
        title="Logo & Brand Identity."
        subtitle="Service Details"
        description="Your logo is the face of your brand. We craft clean, memorable designs that reflect your business identity and leave a lasting impression."
      />

      <section className="pb-24">
        <div className="container-wide px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square rounded-[2rem] bg-apple-gray-50 flex items-center justify-center p-12 group hover:bg-white border border-transparent hover:border-apple-gray-100 transition-all duration-500">
                <div className="w-full h-full bg-apple-gray-200 rounded-xl animate-pulse group-hover:animate-none group-hover:bg-apple-gray-100 flex items-center justify-center text-apple-gray-300 font-bold">
                  LOGO {i}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-24 text-center">
            <h2 className="heading-lg mb-8">Ready for a Brand Refresh?</h2>
            <Link to="/contact" className="apple-button apple-button-primary">
              Get a Custom Logo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
