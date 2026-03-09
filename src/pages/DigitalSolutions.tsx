
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ExternalLink, Box, Code, Settings, ShieldCheck, CheckCircle2, Plus, ChevronDown } from 'lucide-react';
import { DIGITAL_SOLUTIONS, DIGITAL_SOLUTIONS_FAQS } from '../constants';
import { Link } from 'react-router-dom';

import { PageHeader } from '../components/PageHeader';

export const DigitalSolutions = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const categories = ['Ecommerce Tools', 'Marketing Tools', 'Business Tools'];
  const featuredPlugin = DIGITAL_SOLUTIONS.find(p => p.id === 'pricing-calculator');

  return (
    <div className="pt-12">
      <PageHeader 
        title="Digital Solutions for WordPress Websites."
        subtitle="Premium Assets"
        description="Custom plugins, automation tools, and powerful website enhancements designed to improve performance, increase conversions, and simplify business operations."
      >
        <div className="flex flex-wrap gap-6 mt-12">
          <a href="#solutions" className="apple-button apple-button-primary">
            Explore Digital Solutions
          </a>
          <Link to="/contact" className="apple-button apple-button-secondary">
            Request Custom Plugin
          </Link>
        </div>
      </PageHeader>

      {/* Introduction Section */}
      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="heading-lg mb-8">Custom WordPress Plugins and Business Tools</h2>
              <p className="text-xl text-apple-gray-300 leading-relaxed mb-8">
                Apex Digital Consultants develops smart digital tools designed to extend the power of your website. Our solutions help businesses stay ahead in the digital landscape.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                'Automate processes',
                'Increase online sales',
                'Improve website performance',
                'Enhance customer experience'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-6 rounded-2xl bg-white shadow-sm border-l-4 border-apex-yellow">
                  <CheckCircle2 className="text-apex-yellow shrink-0" size={24} />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Solutions Grid */}
      <section id="solutions" className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-6">Explore Our WooCommerce Plugins for Business</h2>
            <p className="text-apple-gray-300">Browse our collection of high-performance custom plugins.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {DIGITAL_SOLUTIONS.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-[2.5rem] border border-apple-gray-100 hover:border-apex-yellow hover:bg-white transition-all duration-500"
              >
                <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-apple-gray-50 relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 bg-apex-yellow rounded-full text-sm font-bold shadow-sm text-apple-gray-500">
                      {product.price}
                    </span>
                  </div>
                </div>
                <div className="mb-8">
                  <span className="text-xs font-bold text-apex-yellow uppercase tracking-widest mb-2 block">{product.category}</span>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-apex-yellow transition-colors">{product.name}</h3>
                  <p className="text-apple-gray-300 text-sm leading-relaxed mb-6">
                    {product.description}
                  </p>
                  {product.features && (
                    <ul className="space-y-2">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-apple-gray-400">
                          <CheckCircle2 size={14} className="text-apex-yellow" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-auto">
                  <button className="apple-button apple-button-primary flex items-center gap-2 text-xs py-3 px-6">
                    <ShoppingCart size={14} /> Purchase
                  </button>
                  <button className="apple-button apple-button-secondary flex items-center gap-2 text-xs py-3 px-6">
                    <ExternalLink size={14} /> Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Categories */}
      <section className="section-padding bg-apple-gray-500 text-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-6 text-white">Solution Categories</h2>
            <p className="text-apple-gray-200">Organized tools to help you find exactly what you need.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-8 text-apex-yellow">{cat}</h3>
                <ul className="space-y-4">
                  {DIGITAL_SOLUTIONS.filter(p => p.category === cat).map((p, j) => (
                    <li key={j} className="flex items-center justify-between group cursor-pointer">
                      <span className="text-apple-gray-200 group-hover:text-apex-yellow transition-colors">{p.name}</span>
                      <Plus size={16} className="text-white/30 group-hover:text-apex-yellow transition-all" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Plugin Highlight */}
      {featuredPlugin && (
        <section className="section-padding">
          <div className="container-wide">
            <div className="bg-apple-gray-50 rounded-[3rem] overflow-hidden border border-apple-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 md:p-20 flex flex-col justify-center">
                  <span className="text-sm font-bold text-apex-yellow uppercase tracking-widest mb-6 block">Featured Solution</span>
                  <h2 className="heading-lg mb-8">{featuredPlugin.name}</h2>
                  <p className="text-xl text-apple-gray-300 leading-relaxed mb-8">
                    {featuredPlugin.description}
                  </p>
                  <ul className="space-y-4 mb-12">
                    {featuredPlugin.features?.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-apple-gray-400">
                        <div className="w-2 h-2 rounded-full bg-apex-yellow" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-6">
                    <button className="apple-button apple-button-primary">View Plugin Details</button>
                    <span className="text-2xl font-bold flex items-center text-apex-yellow">{featuredPlugin.price}</span>
                  </div>
                </div>
                <div className="h-[400px] lg:h-auto relative">
                  <img 
                    src={featuredPlugin.image} 
                    alt={featuredPlugin.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Custom Plugin Development */}
      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-lg mb-8">Need a Custom Plugin Built?</h2>
            <p className="text-xl text-apple-gray-300 leading-relaxed mb-12">
              Our team develops custom WordPress and WooCommerce plugins tailored to your business needs. From workflow automation to advanced e-commerce enhancements, we build tools that solve your unique challenges.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16 text-left">
              {[
                { title: 'Workflow Automation', desc: 'Custom tools to automate repetitive business tasks.' },
                { title: 'Ecommerce Enhancements', desc: 'Specialized features for your WooCommerce store.' },
                { title: 'Custom Integrations', desc: 'Connect your website with third-party APIs and services.' },
                { title: 'Business Dashboards', desc: 'Advanced reporting and management tools for your team.' }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white shadow-sm border border-apple-gray-100 hover:border-apex-yellow transition-colors">
                  <h4 className="text-xl font-bold mb-3 group-hover:text-apex-yellow">{item.title}</h4>
                  <p className="text-apple-gray-300 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <Link to="/contact" className="apple-button apple-button-primary">
              Request Custom Plugin
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="heading-lg mb-6">Frequently Asked Questions</h2>
              <p className="text-apple-gray-300">Everything you need to know about our digital solutions.</p>
            </div>
            
            <div className="space-y-4">
              {DIGITAL_SOLUTIONS_FAQS.map((faq, i) => (
                <div key={i} className="border border-apple-gray-100 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-apple-gray-50 transition-colors"
                  >
                    <span className="font-bold group-hover:text-apex-yellow transition-colors">{faq.question}</span>
                    <ChevronDown className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-apex-yellow' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="p-6 pt-0 text-apple-gray-300 leading-relaxed border-t border-apple-gray-100 bg-apple-gray-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="bg-apple-gray-500 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
            <h2 className="heading-xl mb-8 text-white relative z-10">Upgrade Your Website With Powerful Digital Tools.</h2>
            <a href="#solutions" className="apple-button bg-apex-yellow text-apple-gray-500 hover:bg-white relative z-10">
              Explore Solutions
            </a>
            <div className="absolute top-0 right-0 w-96 h-96 bg-apex-yellow/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-apex-yellow/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          </div>
        </div>
      </section>

      {/* SEO Keywords (Hidden) */}
      <div className="sr-only">
        <h2>custom wordpress plugins</h2>
        <h2>woocommerce plugins for business</h2>
        <h2>wordpress automation tools</h2>
        <h2>Digital Solutions for WordPress Websites</h2>
      </div>
    </div>
  );
};
