
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
    <section className="section-padding relative overflow-hidden bg-[#0a0a0a] pt-32 pb-20 md:pt-40 md:pb-32">
      <NetworkBackground />
      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-[3rem] border border-white/10"
        >
          {subtitle && (
            <span className="text-sm font-semibold tracking-widest text-apex-yellow uppercase mb-6 block">
              {subtitle}
            </span>
          )}
          <h1 className="heading-xl mb-8 text-white">{title}</h1>
          {description && (
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};
