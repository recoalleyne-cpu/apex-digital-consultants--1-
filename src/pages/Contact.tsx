import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import {
  buildFormSpamPayload,
  FORM_SPAM_HONEYPOT_FIELD_NAME,
  FORM_SPAM_MIN_COMPLETION_MS
} from '../utils/formSpamProtection';

export const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    projectDetails: '',
    service: '',
    customService: '',
    subscribeToNewsletter: false
  });
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [honeypotValue, setHoneypotValue] = useState('');
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());

  const creativeOptions = [
    'Branding',
    'Designing',
    'Web Design',
    'Payment System',
    'Hosting',
    'Add something else'
  ];

  const resolveServiceValue = () => {
    if (formData.service === 'Add something else') {
      return formData.customService.trim();
    }
    return formData.service.trim();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const now = Date.now();
    if (honeypotValue.trim()) {
      setSubmitMessage("Message received! We'll get back to you shortly.");
      setFormStartedAt(Date.now());
      setHoneypotValue('');
      return;
    }

    if (now - formStartedAt < FORM_SPAM_MIN_COMPLETION_MS) {
      setSubmitMessage('Please take a moment to review your details before submitting.');
      return;
    }

    const requiredMissing = !formData.firstName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.companyName.trim();

    if (requiredMissing) {
      setSubmitMessage('Please complete all required fields before submitting.');
      return;
    }

    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_PATTERN.test(formData.email.trim())) {
      setSubmitMessage('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setSubmitMessage('');

    const selectedService = resolveServiceValue() || 'Not specified';
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          source: 'contact-form',
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          companyName: formData.companyName.trim(),
          service: selectedService,
          projectDetails: formData.projectDetails.trim(),
          subscribeToNewsletter: formData.subscribeToNewsletter,
          ...buildFormSpamPayload({
            honeypotValue,
            startedAtMs: formStartedAt,
            submittedAtMs: now
          })
        })
      });

      if (!response.ok) {
        let msg = 'Unable to submit your request.';
        try {
          const errJson = await response.json();
          msg = errJson?.error || errJson?.message || JSON.stringify(errJson) || msg;
        } catch {
          msg = (await response.text().catch(() => msg)) || msg;
        }
        throw new Error(msg);
      }

      const result = await response.json().catch(() => ({}));

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: '',
        projectDetails: '',
        service: '',
        customService: '',
        subscribeToNewsletter: false
      });
      setHoneypotValue('');
      setFormStartedAt(Date.now());
      if (result && result.mailSent) {
        setSubmitMessage('Message sent successfully!');
      } else {
        setSubmitMessage("Message received! We'll get back to you shortly.");
      }
    } catch (error) {
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : 'Unable to submit right now. Please email info@apexdigitalconsultants.com.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-16 md:pt-20">
      <PageHeader
        title="Let's Build Something Great Together."
        subtitle="Contact Us"
        description="Request custom website development, web design, ecommerce website services, or SEO-friendly redesign support for your business in Barbados or across the Caribbean."
      />

      <section className="pt-8 pb-2">
        <div className="container-wide px-6 md:px-8">
          <div className="rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-apple-gray-500 mb-3">
              Start a Website Project With Apex
            </h2>
            <p className="text-apple-gray-300 leading-8 mb-5">
              We work with businesses in Barbados and across the Caribbean on custom website development, web design, ecommerce builds, redesigns, and ongoing website support.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/services" className="apple-button apple-button-secondary text-sm">
                Explore Website Development Services
              </Link>
              <Link to="/portfolio" className="apple-button apple-button-secondary text-sm">
                See Website Development Portfolio
              </Link>
              <Link to="/case-studies" className="apple-button apple-button-secondary text-sm">
                Read Website Case Studies
              </Link>
            </div>
          </div>
        </div>
      </section>

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
                      className="text-base sm:text-lg font-semibold hover:text-apex-yellow transition-colors break-all"
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
                    <h4 className="text-xl font-bold mb-2">Whatsapp Us</h4>
                    <p className="text-apple-gray-300 mb-2">Mon-Fri from 9am to 5pm.</p>
                    <a
                      href="https://wa.me/12468416543"
                      target="_blank"
                      rel="noreferrer"
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

              <div className="p-7 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-apple-gray-50 border border-apple-gray-100">
                <h4 className="font-bold mb-5">Follow Our Journey</h4>

                <div className="flex flex-wrap gap-5">
                  {[
                    {
                      label: 'Instagram',
                      href: 'https://www.instagram.com/apexdigitalconsultants/'
                    },
                    {
                      label: 'Facebook',
                      href: 'https://www.facebook.com/ApexDigitalConsultants/'
                    },
                    {
                      label: 'LinkedIn',
                      href: 'https://www.linkedin.com/company/apex-digital-consultants/'
                    }
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-apple-gray-300 hover:text-apex-yellow transition-colors"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Contact Form */}
            <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-[2rem] sm:rounded-[3rem] border border-apple-gray-100 shadow-sm">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-apple-gray-500 mb-3">Request a Quote</h2>
                <p className="text-apple-gray-300 leading-7">
                  Share your project goals and we will respond with the best-fit next step.
                </p>
              </div>
              <form className="relative space-y-8 md:space-y-10" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name={FORM_SPAM_HONEYPOT_FIELD_NAME}
                  value={honeypotValue}
                  onChange={(event) => setHoneypotValue(event.target.value)}
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[9999px] top-auto h-px w-px opacity-0"
                />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-10">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-apex-blue">
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
                        required
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
                        required
                      />

                      <input
                        type="text"
                        placeholder="Phone*"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-0 py-4 border-0 border-b border-apple-gray-100 bg-transparent text-base text-apple-gray-500 placeholder:text-apple-gray-300 focus:outline-none focus:border-apex-yellow"
                        required
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Company Name*"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-0 py-4 border-0 border-b border-apple-gray-100 bg-transparent text-base text-apple-gray-500 placeholder:text-apple-gray-300 focus:outline-none focus:border-apex-yellow"
                      required
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-apex-blue">
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
                  <h4 className="text-lg sm:text-xl md:text-2xl font-medium text-apex-blue">
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
                      required
                    />
                  )}
                </div>

                <label className="inline-flex items-start gap-3 text-sm text-apple-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.subscribeToNewsletter}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        subscribeToNewsletter: event.target.checked
                      })
                    }
                    className="mt-0.5 h-4 w-4 rounded border-apple-gray-200 text-apex-yellow focus:ring-apex-yellow/60"
                  />
                  <span>
                    Email me occasional Apex growth insights and marketing updates.
                  </span>
                </label>

                <button
                  type="submit"
                  className="apple-button apple-button-primary w-full md:w-auto px-10 flex items-center justify-center gap-2"
                  disabled={submitting}
                >
                  <Send size={18} /> {submitting ? 'Submitting...' : 'Submit'}
                </button>
                {submitMessage && (
                  <p className="text-sm text-apple-gray-300">{submitMessage}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
