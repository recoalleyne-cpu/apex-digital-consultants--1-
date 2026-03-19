
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Websites = () => {
  return (
    <div className="pt-12">
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <span className="text-sm font-semibold tracking-widest text-apple-gray-300 uppercase mb-6 block">Service Details</span>
            <h1 className="heading-xl mb-12">Website Development.</h1>
            <p className="text-2xl text-apple-gray-300 leading-relaxed">
              From simple landing pages to advanced ecommerce builds, we deliver custom website development for Barbados businesses and teams across the Caribbean.
            </p>
            <p className="mt-6 text-base md:text-lg text-apple-gray-300 leading-8">
              Our approach combines responsive web design, conversion-focused page strategy, and SEO-friendly technical structure so your website performs as a true growth asset.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/website-development-barbados" className="apple-button apple-button-secondary text-sm">
                Website Development Barbados
              </Link>
              <Link to="/website-development-caribbean" className="apple-button apple-button-secondary text-sm">
                Website Development Caribbean
              </Link>
              <Link to="/seo-friendly-websites-barbados" className="apple-button apple-button-secondary text-sm">
                SEO-Friendly Websites
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-wide px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { title: 'E-Commerce Solutions', desc: 'Sell your products online with secure, easy-to-manage online stores.' },
              { title: 'Business Portals', desc: 'Custom portals for clients or employees to streamline communication and data.' },
              { title: 'Landing Pages', desc: 'High-converting pages designed for specific marketing campaigns.' },
              { title: 'CMS Integration', desc: 'Manage your own content with ease using modern CMS platforms.' }
            ].map((item, i) => (
              <div key={i} className="p-12 rounded-[3rem] bg-apple-gray-50">
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-lg text-apple-gray-300 leading-relaxed mb-8">
                  {item.desc}
                </p>
                <Link to="/contact" className="flex items-center gap-2 font-semibold hover:gap-3 transition-all">
                  Inquire Now <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
