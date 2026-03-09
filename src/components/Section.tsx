import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  animate?: boolean;
}

export default function Section({ children, className, id, animate = true }: SectionProps) {
  return (
    <section id={id} className={cn('relative overflow-hidden', className)}>
      {animate ? (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="section-padding"
        >
          {children}
        </motion.div>
      ) : (
        <div className="section-padding">{children}</div>
      )}
    </section>
  );
}
