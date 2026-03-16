import React from 'react';
import { Link } from 'react-router-dom';

type BrandLockupVariant = 'header' | 'footer';

type BrandLockupProps = {
  variant?: BrandLockupVariant;
  className?: string;
};

const BRAND_LOGO_SRC = '/black%20logo.png';

const byVariant = {
  header: {
    link: 'inline-flex items-center gap-2.5 sm:gap-3 group shrink-0',
    logoWrap:
      'h-10 w-10 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl p-1.5 bg-white border border-apple-gray-100 shadow-[0_8px_24px_rgba(17,24,39,0.08)]',
    title: 'text-sm sm:text-base font-semibold tracking-tight leading-tight text-apple-gray-500',
    subtitle: 'text-[11px] sm:text-xs tracking-[0.08em] uppercase font-medium text-apple-gray-300'
  },
  footer: {
    link: 'inline-flex items-center gap-3.5 sm:gap-4 group shrink-0',
    logoWrap:
      'h-14 w-14 sm:h-16 sm:w-16 rounded-2xl p-2 bg-white border border-apple-gray-100 shadow-[0_12px_28px_rgba(17,24,39,0.10)]',
    title: 'text-xl sm:text-2xl font-semibold tracking-tight leading-tight text-apple-gray-500',
    subtitle: 'text-xs sm:text-sm tracking-[0.08em] uppercase font-medium text-apple-gray-300'
  }
} as const;

export const BrandLockup = ({ variant = 'header', className = '' }: BrandLockupProps) => {
  const classes = byVariant[variant];

  return (
    <Link to="/" className={`${classes.link} ${className}`.trim()} aria-label="Apex Digital Consultants">
      <span className={classes.logoWrap} aria-hidden="true">
        <img
          src={BRAND_LOGO_SRC}
          alt=""
          className="h-full w-full object-contain"
          loading="eager"
          decoding="async"
        />
      </span>

      <span className="flex flex-col items-start">
        <span className={classes.title}>Apex Digital</span>
        <span className={classes.subtitle}>Consultants</span>
      </span>
    </Link>
  );
};
