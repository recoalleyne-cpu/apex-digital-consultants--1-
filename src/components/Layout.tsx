import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BrandLockup } from './BrandLockup';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Digital Solutions', path: '/digital-solutions' },
  {
    name: 'Portfolio',
    path: '/portfolio',
    children: [
      { name: 'Logos', path: '/portfolio/logos' }
    ]
  },
  { name: 'Case Studies', path: '/case-studies' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Contact', path: '/contact' },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'py-2.5 sm:py-3'
          : 'py-4 sm:py-5 lg:py-6'
      )}
    >
      <nav className="container-wide px-4 sm:px-6">
        <div
          className={cn(
            'flex items-center justify-between gap-3 sm:gap-4 rounded-2xl border backdrop-blur-2xl shadow-[0_18px_48px_rgba(0,0,0,0.16)] transition-all duration-300 px-3 sm:px-4',
            scrolled
              ? 'bg-white/84 border-white/70 py-2 sm:py-2.5'
              : 'bg-white/62 border-white/55 py-2.5 sm:py-3'
          )}
        >
          <BrandLockup variant="header" />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);

              if (link.children && link.children.length > 0) {
                return (
                  <div key={link.path} className="relative group">
                    <Link
                      to={link.path}
                      className={cn(
                        'text-sm font-medium transition-colors hover:text-apple-gray-500',
                        isActive ? 'text-apple-gray-500' : 'text-apple-gray-500/85'
                      )}
                    >
                      {link.name}
                    </Link>
                    <div className="pointer-events-none absolute left-0 top-full z-50 pt-3 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                      <div className="min-w-[220px] rounded-2xl border border-white/60 bg-white/95 p-2 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                        {link.children.map((child) => {
                          const isChildActive = location.pathname === child.path;
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={cn(
                                'block rounded-xl px-3 py-2.5 text-sm transition-colors',
                                isChildActive
                                  ? 'bg-apple-gray-50 text-apple-gray-500'
                                  : 'text-apple-gray-400 hover:bg-apple-gray-50 hover:text-apple-gray-500'
                              )}
                            >
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-apple-gray-500',
                    isActive ? 'text-apple-gray-500' : 'text-apple-gray-500/85'
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link to="/contact" className="apple-button apple-button-primary text-sm py-2 px-5">
              Get A Quote
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={cn(
              'md:hidden rounded-xl border border-white/55 bg-white/22 p-1.5 sm:p-2 text-apple-gray-500 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.10)]',
              isOpen ? 'text-apple-gray-500' : 'text-apple-gray-500/85'
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <div className="container-wide px-4 sm:px-6 md:hidden">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="mt-2 overflow-hidden rounded-2xl border border-white/40 bg-white/26 backdrop-blur-3xl shadow-[0_18px_48px_rgba(0,0,0,0.14)]"
            >
              <div className="flex max-h-[calc(100vh-5rem)] flex-col overflow-y-auto p-4 sm:p-5 gap-2.5">
                {NAV_LINKS.map((link) => (
                  <div key={link.path} className="rounded-xl border border-white/20 bg-white/20 px-3 py-2.5">
                    <Link
                      to={link.path}
                      className={cn(
                        'text-base sm:text-lg font-medium flex items-center justify-between',
                        location.pathname === link.path || location.pathname.startsWith(`${link.path}/`)
                          ? 'text-apple-gray-500'
                          : 'text-apple-gray-500/85'
                      )}
                    >
                      {link.name}
                      <ChevronRight size={18} className="text-apple-gray-300" />
                    </Link>

                    {link.children && link.children.length > 0 ? (
                      <div className="mt-2 space-y-1.5 pl-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={cn(
                              'flex items-center justify-between rounded-lg px-2.5 py-2 text-sm',
                              location.pathname === child.path
                                ? 'bg-white/85 text-apple-gray-500'
                                : 'text-apple-gray-400 hover:bg-white/60 hover:text-apple-gray-500'
                            )}
                          >
                            {child.name}
                            <ChevronRight size={16} className="text-apple-gray-300" />
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
                <Link to="/contact" className="apple-button apple-button-primary text-center mt-3">
                  Get A Quote
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-apple-gray-50 pt-24 pb-12 px-6">
      <div className="container-wide grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="inline-flex flex-wrap items-baseline gap-x-2 text-xl sm:text-2xl font-bold tracking-tight mb-6 leading-tight">
            <span className="whitespace-nowrap">Apex</span>
            <span className="whitespace-nowrap">Digital</span>
            <span className="whitespace-nowrap text-apple-gray-300 font-light">Consultants</span>
          </Link>
          <p className="text-apple-gray-300 max-w-md leading-relaxed">
            Empowering businesses with dynamic marketing solutions that drive growth and engagement. Your vision is our mission.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-6">Company</h4>
          <ul className="space-y-4">
            <li><Link to="/about" className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors">About Us</Link></li>
            <li><Link to="/services" className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors">Services</Link></li>
            <li><Link to="/portfolio" className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors">Portfolio</Link></li>
            <li><Link to="/blog" className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-6">Legal</h4>
          <ul className="space-y-4">
            <li><Link to="/terms" className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/faqs" className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors">FAQs</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-wide border-t border-apple-gray-100 pt-8 flex flex-col md:row items-center justify-between gap-4 text-sm text-apple-gray-300">
        <p>© {new Date().getFullYear()} Apex Digital Consultants. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="mailto:info@apexdigitalconsultants.com" className="hover:text-apple-gray-500 transition-colors">info@apexdigitalconsultants.com</a>
          <span>Memphis, TN</span>
        </div>
      </div>
    </footer>
  );
};
