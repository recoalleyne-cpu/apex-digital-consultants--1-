import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

import { PageHeader } from '../components/PageHeader';

export const Contact = () => {
  return (
    <div className="pt-16 md:pt-20">
      <PageHeader 
        title="Let's Build Something Great Together."
        subtitle="Contact Us"
        description="Have a question or ready to start your project? We're here to assist you in any way we can."
      />

      <section className="pt-10 md:pt-14 pb-24 md:pb-32">
        <div className="container-wide px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Contact Info */}
            <div className="space-y-14">

              <div className="space-y-12">

                <div className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-apple-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-apex-yellow transition-colors duration-300">
                    <Mail className="text-apple-gray-500" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-2">Email Us</h4>
                    <p className="text-apple-gray-300 mb-2">Our team is here to help.</p>

                    <a
                      href="mailto:info@apexdigitalconsultants.com"
                      className="text-lg font-semibold hover:text-apex-yellow transition-colors"
                    >
                      info@apexdigitalconsultants.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-apple-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-apex-yellow transition-colors duration-300">
                    <Phone className="text-apple-gray-500" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-2">Call Us</h4>
                    <p className="text-apple-gray-300 mb-2">Mon-Fri from 9am to 5pm.</p>

                    <a
                      href="tel:9015932119"
                      className="text-lg font-semibold hover:text-apex-yellow transition-colors"
                    >
                      901-593-2119
                    </a>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-apple-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-apex-yellow transition-colors duration-300">
                    <MapPin className="text-apple-gray-500" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-2">Visit Us</h4>
                    <p className="text-apple-gray-300 mb-2">Come say hello at our office.</p>

                    <p className="text-lg font-semibold leading-relaxed">
                      1000 S. Cooper<br />
                      Memphis, TN 38104
                    </p>
                  </div>
                </div>

              </div>

              {/* Social */}
              <div className="p-10 rounded-[2.5rem] bg-apple-gray-50 border border-apple-gray-100">
                <h4 className="font-bold mb-5">Follow Our Journey</h4>

                <div className="flex flex-wrap gap-5">
                  {['Instagram', 'LinkedIn', 'Twitter', 'Facebook'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="text-sm font-medium text-apple-gray-300 hover:text-apex-yellow transition-colors"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* Contact Form */}
            <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-apple-gray-100 shadow-sm">

              <form className="space-y-8 md:space-y-10">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-apple-gray-300 uppercase tracking-wider">
                      First Name
                    </label>

                    <input
                      type="text"
                      className="w-full px-6 py-4 rounded-2xl bg-apple-gray-50 border-none focus:ring-2 focus:ring-apex-yellow transition-all"
                      placeholder="Jane"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-apple-gray-300 uppercase tracking-wider">
                      Last Name
                    </label>

                    <input
                      type="text"
                      className="w-full px-6 py-4 rounded-2xl bg-apple-gray-50 border-none focus:ring-2 focus:ring-apex-yellow transition-all"
                      placeholder="Doe"
                    />
                  </div>

                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-apple-gray-300 uppercase tracking-wider">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="w-full px-6 py-4 rounded-2xl bg-apple-gray-50 border-none focus:ring-2 focus:ring-apex-yellow transition-all"
                    placeholder="jane@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-apple-gray-300 uppercase tracking-wider">
                    Service Interested In
                  </label>

                  <select className="w-full px-6 py-4 rounded-2xl bg-apple-gray-50 border-none focus:ring-2 focus:ring-apex-yellow transition-all appearance-none">
                    <option>Website Design</option>
                    <option>Digital Strategy</option>
                    <option>Logo Design</option>
                    <option>Business Consulting</option>
                    <option>Digital Solutions</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-apple-gray-300 uppercase tracking-wider">
                    Message
                  </label>

                  <textarea
                    rows={4}
                    className="w-full px-6 py-4 rounded-2xl bg-apple-gray-50 border-none focus:ring-2 focus:ring-apex-yellow transition-all"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button className="apple-button apple-button-primary w-full flex items-center justify-center gap-2">
                  <Send size={18} /> Send Message
                </button>

              </form>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
};