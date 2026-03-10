import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, ChevronDown } from 'lucide-react';

export default function Footer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', service: '', message: '' });
  };

  return (
    <footer className="bg-apple-gray-50 pt-24 border-t border-apple-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tight mb-6 block leading-tight">
              <span className="block sm:inline">Apex Digital</span>{' '}
              <span className="block sm:inline text-apple-gray-300 font-light">Consultants</span>
            </Link>

            <p className="text-apple-gray-300 text-sm leading-relaxed mb-8">
              Empowering businesses with dynamic marketing solutions that drive growth and engagement. Your vision is our mission.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/ApexDigitalConsultants"
                target="_blank"
                rel="noopener noreferrer"
                className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors"
              >
                <Facebook size={18} />
              </a>

              <a
                href="https://www.instagram.com/apexdigitalconsultants/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-1">
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link to="/about" className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio" className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link to="/terms" className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/faqs" className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Simpler Footer Form */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Get in Touch</h4>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-apple-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-apex-yellow/50 transition-all"
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-apple-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-apex-yellow/50 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-apple-gray-100 rounded-xl text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-apex-yellow/50 transition-all cursor-pointer"
                  required
                >
                  <option value="" disabled>
                    Select Service
                  </option>
                  <option value="website-design">Website Design</option>
                  <option value="digital-strategy">Digital Strategy</option>
                  <option value="logo-design">Logo Design</option>
                  <option value="business-consulting">Business Consulting</option>
                  <option value="digital-solutions">Digital Solutions</option>
                  <option value="social-media-management">Social Media Management</option>
                  <option value="digital-campaign-management">Digital Campaign Management</option>
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-apple-gray-200">
                  <ChevronDown size={16} />
                </div>
              </div>

              <textarea
                placeholder="Message"
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-apple-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-apex-yellow/50 transition-all resize-none"
                required
              />

              <button
                type="submit"
                className="apple-button apple-button-primary w-full py-3 text-sm font-bold"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 text-[11px] font-bold text-white uppercase tracking-wider">
            <span>© {new Date().getFullYear()} Apex Digital Consultants</span>
            <span className="hidden md:inline opacity-30 mx-2">|</span>
            <Link to="/terms" className="hover:underline">
              Terms & Conditions
            </Link>
            <span className="hidden md:inline opacity-30 mx-2">|</span>
            <Link to="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>

          <div className="text-[11px] font-bold text-white uppercase tracking-wider">
            info@apexdigitalconsultants.com
          </div>
        </div>
      </div>
    </footer>
  );
}