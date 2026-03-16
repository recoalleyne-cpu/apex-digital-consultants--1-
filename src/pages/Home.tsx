import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../constants';
import { CertificationTicker } from '../components/CertificationTicker';
import { TestimonialsSection } from '../components/TestimonialsSection';

export const Home = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const featuredLogo = '/black%20logo.png';
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
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000")'
            }}
          />

          <motion.div
            className="absolute inset-0 z-10 backdrop-blur-3xl bg-white/8"
            style={{
              maskImage,
              WebkitMaskImage: maskImage
            }}
          />

          <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/25 via-black/18 to-black/35" />
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
              Apex Digital{' '}<br className="hidden md:block" />
              Consultants
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl text-white max-w-3xl mx-auto mb-8 sm:mb-10"
            >
              We offer a wide selection of digital services ranging from Website Development
              & Design, Logo Creation, to Google Advertising and Digital Campaigns.
            </motion.p>

            <Link to="/contact" className="apple-button apple-button-primary">
              Get A Quote
            </Link>

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
              Solutions Tailored to Your Success
            </h2>
            <p className="text-apple-gray-300 max-w-2xl mx-auto">
              From branding to advanced digital systems, we help businesses build
              a strong digital presence that drives real results.
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
                  to="/services"
                  className="flex items-center gap-2 text-apex-yellow font-medium"
                >
                  Learn More <ChevronRight size={16} />
                </Link>

              </div>
            ))}

          </div>

        </div>
      </section>

      <TestimonialsSection />

      {/* CTA */}
      <section className="section-padding bg-apple-gray-500 text-white text-center">
        <div className="container-wide">

          <h2 className="heading-lg mb-6">
            Ready to Elevate Your Brand?
          </h2>

          <p className="max-w-xl mx-auto mb-8 sm:mb-10 text-apple-gray-200 text-sm sm:text-base">
            Let Apex Digital Consultants help you design, build, and scale your digital presence.
          </p>

          <Link to="/contact" className="apple-button apple-button-primary">
            Get A Quote
          </Link>

        </div>
      </section>

    </div>
  );
};
