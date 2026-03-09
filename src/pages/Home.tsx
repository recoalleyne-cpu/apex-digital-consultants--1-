import React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ChevronRight, Play, ArrowRight, Target, Layout, PenTool, Megaphone, Zap, Briefcase, Cpu, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICES, PRICING, PORTFOLIO } from '../constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const IconMap: Record<string, any> = {
  Target, Layout, PenTool, Megaphone, Zap, Briefcase, Cpu, BarChart
};

export const Home = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const maskImage = useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, transparent 0%, black 60%)`;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative h-[90vh] flex items-center justify-center text-center px-6 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000")',
              filter: 'brightness(0.7)'
            }}
          />

          {/* Frosted Glass Overlay with Interactive Mask */}
          <motion.div
            className="absolute inset-0 backdrop-blur-3xl bg-white/5 z-10"
            style={{
              maskImage: maskImage,
              WebkitMaskImage: maskImage
            }}
          />

          {/* Static subtle overlay for readability */}
          <div className="absolute inset-0 bg-black/20 z-0" />
        </div>

        <div className="container-wide relative z-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="heading-xl mb-8 text-white drop-shadow-xl"
          >
            Apex Digital <br className="hidden md:block" /> Consultants
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-apple-gray-100 max-w-4xl mx-auto mb-12 leading-relaxed drop-shadow-lg"
          >
            We offer a wide selection of digital services ranging from Website Development &amp; Design, Logo &amp; Label Creation, to Social Media Management as well as Digital Campaign management.
            <br /><br />
            Proven Results, let us take your brand to the next level!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/contact" className="apple-button apple-button-primary w-full sm:w-auto">
              Get A Quote
            </Link>
            <Link to="/services" className="group flex items-center gap-2 font-medium text-white hover:text-apex-yellow transition-colors drop-shadow-md">
              Explore Services <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Abstract Background Elements (Subtle) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-apex-yellow/20 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-20" />
        </div>
      </section>

      {/* Intro / Positioning */}
      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <h2 className="heading-lg mb-8">Built for the Modern Entrepreneur.</h2>
              <p className="text-lg text-apple-gray-300 mb-8 leading-relaxed">
                At APEX, we don't just offer services—we offer strategy, creativity, and support that aligns with your goals.
                We specialize in custom web design, strategic social media management, and tailored business consulting to help you grow smarter.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-3xl font-bold mb-2 text-apex-yellow">100%</h4>
                  <p className="text-sm text-apple-gray-300 uppercase tracking-wider">Client Focused</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold mb-2 text-apex-yellow">10+</h4>
                  <p className="text-sm text-apple-gray-300 uppercase tracking-wider">Years Experience</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
                alt="Modern Office"
                className="object-cover w-full h-full"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold tracking-widest text-apex-yellow uppercase mb-4 block">Our Expertise</span>
              <h2 className="heading-lg">Comprehensive Solutions for Digital Growth.</h2>
            </div>
            <Link to="/services" className="apple-button apple-button-secondary">
              View All Services
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.slice(0, 4).map((service, index) => {
              const Icon = IconMap[service.icon];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-3xl bg-white border border-apple-gray-100 hover:shadow-xl transition-all duration-500 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-apple-gray-50 flex items-center justify-center mb-6 group-hover:bg-apex-yellow group-hover:text-apple-gray-500 transition-colors">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-apple-gray-300 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Link to={`/services#${service.id}`} className="flex items-center gap-2 text-sm font-semibold group-hover:text-apex-yellow group-hover:gap-3 transition-all">
                    Learn More <ArrowRight size={16} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="section-padding bg-apple-gray-500 text-white overflow-hidden">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-6">See the Vision in Motion.</h2>
            <p className="text-apple-gray-200 max-w-2xl mx-auto">
              Experience how we transform businesses through digital innovation and strategic design.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-[2rem] overflow-hidden shadow-3xl bg-apple-gray-400 group cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1920"
              alt="Video Thumbnail"
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-apex-yellow/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-apex-yellow transition-all duration-300">
                <Play size={32} className="text-white group-hover:text-apple-gray-500 transition-colors" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
              <div>
                <p className="text-sm font-medium tracking-widest uppercase text-apex-yellow mb-2">Featured Presentation</p>
                <h3 className="text-2xl font-bold">The APEX Methodology</h3>
              </div>
              <span className="text-sm font-mono opacity-60">02:45</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold tracking-widest text-apex-yellow uppercase mb-4 block">Our Work</span>
              <h2 className="heading-lg">Crafting Digital Excellence.</h2>
            </div>
            <Link to="/portfolio" className="apple-button apple-button-secondary">
              View All Projects
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {PORTFOLIO.slice(0, 2).map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-6 bg-apple-gray-50">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-sm font-medium text-apex-yellow uppercase tracking-wider mb-2">{project.category}</p>
                <h3 className="text-2xl font-bold group-hover:text-apex-yellow transition-colors">{project.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Solutions Preview */}
      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="heading-lg mb-6">Powerful Digital Solutions.</h2>
            <p className="text-apple-gray-300">
              Beyond design and marketing, we develop smart digital tools that help businesses automate tasks,
              improve performance, and increase conversions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-[2rem] bg-white border border-apple-gray-100">
              <h3 className="text-xl font-bold mb-4">WooCommerce Tools</h3>
              <p className="text-apple-gray-300 text-sm leading-relaxed mb-6">
                Custom plugins designed to enhance WooCommerce stores, improve conversions,
                and streamline ecommerce workflows.
              </p>
            </div>

            <div className="p-10 rounded-[2rem] bg-white border border-apple-gray-100">
              <h3 className="text-xl font-bold mb-4">Automation Tools</h3>
              <p className="text-apple-gray-300 text-sm leading-relaxed mb-6">
                Smart tools that automate repetitive business processes and integrate
                your digital systems.
              </p>
            </div>

            <div className="p-10 rounded-[2rem] bg-white border border-apple-gray-100">
              <h3 className="text-xl font-bold mb-4">Custom Plugins</h3>
              <p className="text-apple-gray-300 text-sm leading-relaxed mb-6">
                Tailored WordPress plugins built specifically for your business needs,
                from pricing calculators to booking systems.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/digital-solutions" className="apple-button apple-button-primary">
              Explore Digital Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-6">Website Packages.</h2>
            <p className="text-apple-gray-300">Tailored solutions for every stage of your business growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRICING.map((plan, index) => (
              <div key={index} className="p-10 rounded-[2.5rem] border border-apple-gray-100 flex flex-col h-full hover:border-apple-gray-300 transition-colors">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.duration && <span className="text-apple-gray-300 text-sm">/ {plan.duration}</span>}
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-apple-gray-400 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-apple-gray-300 mt-1.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="apple-button apple-button-secondary text-center">
                  Get a Quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="bg-apple-gray-500 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="heading-lg mb-8">Ready to Elevate Your Vision?</h2>
              <p className="text-xl text-apple-gray-200 max-w-2xl mx-auto mb-12">
                Join the businesses that have transformed their operations and online presence with APEX.
              </p>
              <Link to="/contact" className="apple-button bg-apex-yellow text-apple-gray-500 hover:bg-white inline-block">
                Get Started Today
              </Link>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-apex-yellow/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-apex-yellow/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
};