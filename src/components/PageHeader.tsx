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
    <section className="section-padding relative overflow-hidden bg-white pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Network background */}
      <div className="absolute inset-0 opacity-90">
        <NetworkBackground />
      </div>

      {/* Soft white blend overlay */}
      <div className="absolute inset-0 bg-white/55" />

      {/* Subtle gradient depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/20 to-white/45" />

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl bg-white/78 backdrop-blur-md p-8 md:p-12 rounded-[3rem] border border-black/8 shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
        >
          {subtitle && (
            <span className="text-sm font-semibold tracking-widest text-apex-yellow uppercase mb-6 block">
              {subtitle}
            </span>
          )}

          <h1 className="heading-xl mb-8 text-apple-gray-500">
            {title}
          </h1>

          {description && (
            <p className="text-xl md:text-2xl text-apple-gray-300 leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};