import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -8, transition: { duration: 0.3 } } : {}}
      className={cn(
        'bg-white rounded-3xl p-8 border border-black/5 shadow-sm transition-shadow hover:shadow-xl hover:shadow-black/5',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
