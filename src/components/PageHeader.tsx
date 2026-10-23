import React from 'react';
import { motion } from 'framer-motion';
import { NetworkBackground } from './NetworkBackground';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, description }) => {
  return (
    <section className="section-padding relative overflow-hidden bg-white pt-24 pb-14 sm:pt-28 sm:pb-16 md:pt-40 md:pb-32">
      {/* Network background */}
      <div className="absolute inset-0 z-0">
        <NetworkBackground />
      </div>

      {/* Softer blend overlays */}
      <div className="absolute inset-0 z-[1] bg-white/32" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-white/20 via-white/8 to-white/28" />

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl bg-white/58 backdrop-blur-md p-6 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[3rem] border border-black/6 shadow-[0_12px_40px_rgba(0,0,0,0.05)]"
        >
          {subtitle && (
            <span className="text-xs sm:text-sm font-semibold tracking-widest text-apex-yellow uppercase mb-5 sm:mb-6 block">
              {subtitle}
            </span>
          )}

          <h1 className="heading-xl mb-8 text-apple-gray-500">
            {title}
          </h1>

          {description && (
            <p className="text-lg sm:text-xl md:text-2xl text-apple-gray-300 leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};
