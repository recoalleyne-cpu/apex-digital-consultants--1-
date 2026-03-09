import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../utils/cn';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-apex-yellow text-apple-gray-500 hover:bg-apex-yellow-hover shadow-lg shadow-apex-yellow/20',
    secondary: 'bg-white text-apple-gray-500 border-2 border-apex-yellow hover:bg-apex-yellow/10',
    outline: 'bg-transparent border border-apex-yellow text-apple-gray-500 hover:bg-apex-yellow/10',
    ghost: 'bg-transparent text-apple-gray-500 hover:bg-apex-yellow/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
