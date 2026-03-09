import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'APEX Training Academy', path: '/apex-training-academy' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Book Online', path: '/book-online' },
];

export default function Navbar() {
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
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-apex-yellow rounded-lg flex items-center justify-center text-apple-gray-500 font-bold text-xl group-hover:scale-110 transition-transform shadow-sm">
            A
          </div>
          <span className="font-sans font-bold text-xl tracking-tight">APEX</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-apex-yellow',
                location.pathname === link.path ? 'text-apex-yellow' : 'text-apple-gray-300'
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/contact"
            className="apple-button-primary px-5 py-2 text-sm"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-apple-gray-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-apple-gray-100 shadow-2xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-lg font-medium flex items-center justify-between p-2 rounded-lg transition-colors',
                    location.pathname === link.path ? 'bg-apple-gray-50 text-apex-yellow' : 'hover:bg-apple-gray-50'
                  )}
                >
                  {link.name}
                  <ChevronRight size={18} className="opacity-50" />
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-4 apple-button-primary text-center"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
