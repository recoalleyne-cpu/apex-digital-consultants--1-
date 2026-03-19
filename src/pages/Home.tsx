import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FAQS, SERVICES } from '../constants';
import { CertificationTicker } from '../components/CertificationTicker';
import { TestimonialsSection } from '../components/TestimonialsSection';

export const Home = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const featuredLogo = '/black%20logo.png';
  const heroVideoSources = [
    'https://videos.pexels.com/video-files/33834276/14359124_2560_1440_30fps.mp4'
  ];
  const maskImage = useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, transparent 0%, black 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <div className="overflow-hidden">

      {/* Hero */}
      <section
        className="relative min-h-[92vh] flex items-center justify-center text-center px-5 sm:px-6 overflow-hidden"
        onMouseMove={handleMouseMove}
      >

        <div className="absolute inset-0">
          <video
            className="absolute inset-0 h-full w-full object-cover scale-105"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            {heroVideoSources.map((source) => (
              <source key={source} src={source} type="video/mp4" />
            ))}
          </video>

          <motion.div
            className="absolute inset-0 z-10 backdrop-blur-2xl bg-white/6"
            style={{
              maskImage,
              WebkitMaskImage: maskImage
            }}
          />

          <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/28 via-black/20 to-black/38" />
          <div className="absolute top-1/4 left-1/4 z-20 w-80 h-80 rounded-full bg-white/12 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 z-20 w-72 h-72 rounded-full bg-apex-yellow/10 blur-3xl" />
        </div>

        <div className="relative z-30 container-wide py-24 sm:py-28 md:py-32">
          <div className="mx-auto max-w-5xl rounded-[2rem] sm:rounded-[3rem] border border-white/20 bg-white/10 backdrop-blur-xl px-6 py-10 sm:px-8 sm:py-12 md:px-14 md:py-16 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mx-auto mb-8 inline-flex h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 items-center justify-center rounded-[1.5rem] bg-white/95 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.22)]"
            >
              <img
                src={featuredLogo}
                alt="Apex Digital Consultants featured logo"
                className="h-full w-full object-contain"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="heading-xl mb-10 text-white"
            >
              Website Development{' '}<br className="hidden md:block" />
              Barbados & Caribbean
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl text-white max-w-3xl mx-auto mb-8 sm:mb-10"
            >
              Apex Digital Consultants delivers website development and web design services for businesses in Barbados and across the Caribbean. We build custom, responsive, SEO-friendly websites designed to convert visitors into qualified leads.
            </motion.p>

            <p className="text-sm sm:text-base text-apple-gray-200 max-w-2xl mx-auto mb-8">
              From business websites and ecommerce builds to website redesigns and ongoing support, Apex helps growth-focused teams launch digital experiences that perform.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/contact" className="apple-button apple-button-primary">
                Get Your Website Quote
              </Link>
              <Link
                to="/website-development-barbados"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore Barbados Website Services <ChevronRight size={16} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Certification ticker (dynamic from database) */}
      <CertificationTicker />

      {/* Services */}
      <section className="section-padding">
        <div className="container-wide">

          <div className="text-center mb-20">
            <h2 className="heading-lg mb-6">
              Website Services Built for Real Business Growth
            </h2>
            <p className="text-apple-gray-300 max-w-2xl mx-auto">
              From custom website development in Barbados to Caribbean-ready web design systems, we help businesses build digital foundations that improve visibility, trust, and conversions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">

            {SERVICES.slice(0,6).map((service) => (
              <div
                key={service.id}
                className="p-7 sm:p-8 md:p-10 rounded-[2rem] border border-apple-gray-100 bg-white hover:shadow-xl transition"
              >

                <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                  {service.title}
                </h3>

                <p className="text-sm sm:text-base text-apple-gray-300 leading-relaxed mb-6">
                  {service.description}
                </p>

                <Link
                  to={`/services/${service.id}`}
                  className="flex items-center gap-2 text-apex-yellow font-medium"
                >
                  View {service.title} <ChevronRight size={16} />
                </Link>

              </div>
            ))}

          </div>

        </div>
      </section>

      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-12 items-start">
            <div>
              <h2 className="heading-lg mb-6">Website Development in Barbados and the Caribbean</h2>
              <p className="text-apple-gray-300 text-base md:text-lg leading-8 mb-6">
                We help local businesses and regional brands launch high-performing websites with clear service messaging, SEO-friendly page structure, and conversion-focused design.
              </p>
              <p className="text-apple-gray-300 text-base md:text-lg leading-8 mb-8">
                Whether you need a professional company website, ecommerce website development, or a full website redesign, our process is built around measurable business outcomes.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/website-development-barbados" className="apple-button apple-button-secondary text-sm">
                  Website Development Barbados
                </Link>
                <Link to="/website-development-caribbean" className="apple-button apple-button-secondary text-sm">
                  Website Development Caribbean
                </Link>
                <Link to="/ecommerce-website-development-barbados" className="apple-button apple-button-secondary text-sm">
                  Ecommerce Website Development
                </Link>
                <Link to="/seo-friendly-websites-barbados" className="apple-button apple-button-secondary text-sm">
                  SEO-Friendly Website Builds
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-apple-gray-100 bg-white p-7 sm:p-8 md:p-9">
              <h3 className="text-2xl font-semibold text-apple-gray-500 mb-5">Why Businesses Choose Apex</h3>
              <ul className="space-y-4 text-apple-gray-300 leading-7">
                <li>Custom website strategy aligned to your offer and audience.</li>
                <li>Responsive design optimized for mobile-first behavior.</li>
                <li>SEO web design foundations from day one.</li>
                <li>Conversion-focused layouts and stronger call-to-action flow.</li>
                <li>Support for updates, scaling, and ongoing optimization.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-14">
            <h2 className="heading-lg mb-6">How We Work</h2>
            <p className="text-apple-gray-300 max-w-2xl mx-auto">
              A structured process that keeps delivery clear, collaborative, and outcome-focused.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: 'Discovery',
                description: 'We map your goals, audience, and service priorities before design begins.'
              },
              {
                title: 'Planning',
                description: 'We structure pages, messaging, and CTA paths for better conversion readiness.'
              },
              {
                title: 'Build',
                description: 'We design and develop responsive website experiences built for performance.'
              },
              {
                title: 'Launch + Improve',
                description: 'We launch with tracking in place and support ongoing optimization.'
              }
            ].map((step) => (
              <article key={step.title} className="rounded-2xl border border-apple-gray-100 bg-white p-6">
                <h3 className="text-xl font-semibold text-apple-gray-500 mb-3">{step.title}</h3>
                <p className="text-apple-gray-300 leading-7">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide">
          <div className="text-center mb-14">
            <h2 className="heading-lg mb-6">Proof From Recent Website Projects</h2>
            <p className="text-apple-gray-300 max-w-3xl mx-auto">
              See how our Barbados and Caribbean website development projects combine strategy, design, and technical execution to drive measurable business results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                title: 'The Science Plug',
                summary: 'Custom website development with booking and growth-focused user flow.'
              },
              {
                title: 'Jriver Transport & Logistics (Barbados)',
                summary: 'Service-focused website structure designed for clarity and trust.'
              },
              {
                title: 'Hitz 106.7 FM — Initial Build',
                summary: 'Media-ready build supporting stronger digital presence and engagement.'
              }
            ].map((item) => (
              <article key={item.title} className="rounded-2xl border border-apple-gray-100 bg-white p-6">
                <h3 className="text-xl font-semibold text-apple-gray-500 mb-3">{item.title}</h3>
                <p className="text-apple-gray-300 leading-7">{item.summary}</p>
              </article>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/portfolio" className="apple-button apple-button-secondary text-sm">
              See Website Development Portfolio
            </Link>
            <Link to="/case-studies" className="apple-button apple-button-secondary text-sm">
              Read Website Case Studies
            </Link>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-6">Website Development FAQs</h2>
            <p className="text-apple-gray-300 max-w-2xl mx-auto">
              Quick answers to common questions from businesses in Barbados and across the Caribbean.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {FAQS.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-apple-gray-100 bg-white p-6">
                <summary className="cursor-pointer list-none text-lg font-semibold text-apple-gray-500">
                  {faq.question}
                </summary>
                <p className="mt-4 text-apple-gray-300 leading-8">{faq.answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/faqs" className="apple-button apple-button-secondary text-sm">
              View Full Website Development FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-apple-gray-500 text-white text-center">
        <div className="container-wide">

          <h2 className="heading-lg mb-6">
            Ready to Build a High-Converting Website?
          </h2>

          <p className="max-w-xl mx-auto mb-8 sm:mb-10 text-apple-gray-200 text-sm sm:text-base">
            Talk with Apex about custom website development, web design, ecommerce builds, and SEO-friendly website strategy for your business.
          </p>

          <Link to="/contact" className="apple-button apple-button-primary">
            Book a Website Strategy Call
          </Link>

        </div>
      </section>

    </div>
  );
};
