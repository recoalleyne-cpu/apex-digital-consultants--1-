import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

export const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    projectDetails: '',
    service: '',
    customService: ''
  });

  const creativeOptions = [
    'Branding',
    'Designing',
    'Web Design',
    'Payment System',
    'Hosting',
    'Add something else'
  ];

  return (
    <div className="pt-16 md:pt-20">
      <PageHeader
        title="Let's Build Something Great Together."
        subtitle="Contact Us"
        description="Have a question or ready to start your project? We're here to assist you in any way we can."
      />

      <section id="quote" className="pt-10 md:pt-14 pb-24 md:pb-32 scroll-mt-32">
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
                      href="tel:2468416543"
                      className="text-lg font-semibold hover:text-apex-yellow transition-colors"
                    >
                      246-841-6543
                    </a>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-apple-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-apex-yellow transition-colors duration-300">
                    <MapPin className="text-apple-gray-500" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-2">Location</h4>
                    <p className="text-apple-gray-300 mb-2">Serving clients across Barbados and the wider Caribbean region.</p>
                    <p className="text-lg font-semibold leading-relaxed">
                      Bridgetown, Barbados
                    </p>
                  </div>
                </div>
              </div>

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

            {/* Main Contact Form */}
            <div className="bg-white p-8 md:p-10 lg:p-12 rounded-[3rem] border border-apple-gray-100 shadow-sm">
              <form className="space-y-8 md:space-y-10">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-10">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl md:text-2xl font-medium text-apex-blue">
                        Helps us get in touch with you.
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        type="text"
                        placeholder="First Name*"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-0 py-4 border-0 border-b border-apple-gray-100 bg-transparent text-base text-apple-gray-500 placeholder:text-apple-gray-300 focus:outline-none focus:border-apex-yellow"
                      />

                      <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-0 py-4 border-0 border-b border-apple-gray-100 bg-transparent text-base text-apple-gray-500 placeholder:text-apple-gray-300 focus:outline-none focus:border-apex-yellow"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        type="email"
                        placeholder="Email*"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-0 py-4 border-0 border-b border-apple-gray-100 bg-transparent text-base text-apple-gray-500 placeholder:text-apple-gray-300 focus:outline-none focus:border-apex-yellow"
                      />

                      <input
                        type="text"
                        placeholder="Phone*"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-0 py-4 border-0 border-b border-apple-gray-100 bg-transparent text-base text-apple-gray-500 placeholder:text-apple-gray-300 focus:outline-none focus:border-apex-yellow"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Company Name*"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-0 py-4 border-0 border-b border-apple-gray-100 bg-transparent text-base text-apple-gray-500 placeholder:text-apple-gray-300 focus:outline-none focus:border-apex-yellow"
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl md:text-2xl font-medium text-apex-blue">
                        What is the project all about?
                      </h3>
                    </div>

                    <textarea
                      rows={8}
                      placeholder="I'd love to talk to you about..."
                      value={formData.projectDetails}
                      onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                      className="w-full px-0 py-4 border-0 border-b border-apple-gray-100 bg-transparent text-base text-apple-gray-500 placeholder:text-apple-gray-300 focus:outline-none focus:border-apex-yellow resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <h4 className="text-xl md:text-2xl font-medium text-apex-blue">
                    What sort of creative work you need help with?
                  </h4>

                  <div className="flex flex-wrap gap-3">
                    {creativeOptions.map((option) => {
                      const isSelected = formData.service === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFormData({ ...formData, service: option })}
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm md:text-[15px] font-medium transition-all border ${
                            isSelected
                              ? 'border-apex-yellow bg-apex-yellow/10 text-apple-gray-500 shadow-sm'
                              : 'border-apple-gray-100 bg-white text-apple-gray-300 hover:border-apex-yellow/50 hover:bg-apple-gray-50'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-apex-yellow' : 'border-apple-gray-200'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isSelected ? 'bg-apex-yellow' : 'bg-transparent'
                              }`}
                            />
                          </span>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {formData.service === 'Add something else' && (
                    <input
                      type="text"
                      placeholder="Add something else"
                      value={formData.customService}
                      onChange={(e) => setFormData({ ...formData, customService: e.target.value })}
                      className="w-full px-0 py-4 border-0 border-b border-apple-gray-100 bg-transparent text-base text-apple-gray-500 placeholder:text-apple-gray-300 focus:outline-none focus:border-apex-yellow"
                    />
                  )}
                </div>

                <button className="apple-button apple-button-primary w-full md:w-auto px-10 flex items-center justify-center gap-2">
                  <Send size={18} /> Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};