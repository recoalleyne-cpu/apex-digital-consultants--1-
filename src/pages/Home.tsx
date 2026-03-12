import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../constants';
import { CertificationTicker } from '../components/CertificationTicker';

export const Home = () => {
  return (
    <div className="overflow-hidden">

      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center text-center px-6 overflow-hidden">

        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000")'
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 container-wide py-32">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-xl mb-10 text-white"
          >
            Apex Digital<br className="hidden md:block" />
            Consultants
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white max-w-3xl mx-auto mb-10"
          >
            We offer a wide selection of digital services ranging from Website Development
            & Design, Logo Creation, to Social Media Management and Digital Campaigns.
          </motion.p>

          <Link to="/contact" className="apple-button apple-button-primary">
            Get A Quote
          </Link>

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
                className="p-10 rounded-[2rem] border border-apple-gray-100 bg-white hover:shadow-xl transition"
              >

                <h3 className="text-2xl font-semibold mb-4">
                  {service.title}
                </h3>

                <p className="text-apple-gray-300 leading-relaxed mb-6">
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

      {/* CTA */}
      <section className="section-padding bg-apple-gray-500 text-white text-center">
        <div className="container-wide">

          <h2 className="heading-lg mb-6">
            Ready to Elevate Your Brand?
          </h2>

          <p className="max-w-xl mx-auto mb-10 text-apple-gray-200">
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