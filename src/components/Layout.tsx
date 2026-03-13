import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Digital Solutions', path: '/digital-solutions' },
  { name: 'Portfolio', path: '/portfolio' },
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
          ? 'bg-white/80 backdrop-blur-md border-b border-apple-gray-100 py-2.5 sm:py-3'
          : 'bg-transparent py-4 sm:py-5 lg:py-6'
      )}
    >
      <nav className="container-wide px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">
        <Link
          to="/"
          className="inline-flex flex-wrap items-baseline gap-x-1.5 sm:gap-x-2 text-sm sm:text-base md:text-xl font-bold tracking-tight leading-tight"
          aria-label="Apex Digital Consultants"
        >
          <span className="whitespace-nowrap">Apex</span>
          <span className="whitespace-nowrap">Digital</span>
          <span className="whitespace-nowrap text-apple-gray-300 font-light">Consultants</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-apple-gray-300',
                location.pathname === link.path ? 'text-apple-gray-500' : 'text-apple-gray-300'
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/contact" className="apple-button apple-button-primary text-sm py-2 px-5">
            Get A Quote
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-1.5 sm:p-2 text-apple-gray-500"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-apple-gray-100 md:hidden overflow-hidden"
          >
            <div className="flex max-h-[calc(100vh-5rem)] flex-col overflow-y-auto p-4 sm:p-5 gap-2.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-base sm:text-lg font-medium py-2.5 flex items-center justify-between',
                    location.pathname === link.path ? 'text-apple-gray-500' : 'text-apple-gray-300'
                  )}
                >
                  {link.name}
                  <ChevronRight size={18} className="text-apple-gray-100" />
                </Link>
              ))}
              <Link to="/contact" className="apple-button apple-button-primary text-center mt-3">
                Get A Quote
              </Link>
            </div>
          </motion.div>
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
