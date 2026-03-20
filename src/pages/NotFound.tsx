import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { applySeo } from '../utils/seo';

export const NotFound = () => {
  useEffect(() => {
    const canonical = `${window.location.origin}${window.location.pathname}`;
    applySeo({
      title: 'Page Not Found | Apex Digital Consultants',
      description: 'The page you requested is not available.',
      canonical,
      robots: 'noindex, follow'
    });
  }, []);

  return (
    <div className="pt-16 md:pt-20">
      <PageHeader
        title="Page Not Found."
        subtitle="404"
        description="The page you requested could not be found."
      />

      <section className="pb-24 md:pb-32">
        <div className="container-wide px-6 md:px-8">
          <div className="max-w-3xl mx-auto rounded-[2.5rem] border border-apple-gray-100 bg-white p-10 md:p-12 text-center">
            <p className="text-apple-gray-300 leading-8 mb-8">
              Try one of the main navigation routes below.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/" className="apple-button apple-button-primary text-sm">
                Go Home
              </Link>
              <Link to="/services" className="apple-button apple-button-secondary text-sm">
                Explore Services
              </Link>
              <Link to="/contact" className="apple-button apple-button-secondary text-sm">
                Contact Apex
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

