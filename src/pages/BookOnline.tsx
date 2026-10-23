import React from 'react';
import Section from '../components/Section';
import Card from '../components/Card';
import Button from '../components/Button';
import { motion } from 'motion/react';
import { Clock, DollarSign, ArrowRight, Globe, MessageSquare, User, Laptop, PenTool, Mail } from 'lucide-react';

const BOOKING_SERVICES = [
  {
    id: 'google-advertising',
    title: 'Google Advertising Strategy',
    duration: '1 hr 30 min',
    price: '$100',
    icon: MessageSquare,
    link: 'https://www.apexitconsults.com/booking-calendar'
  },
  {
    id: 'website-building',
    title: '🌐 Website Building & Content Creation',
    duration: 'Varies',
    price: '$120',
    icon: Globe,
    link: 'https://www.apexitconsults.com/booking-calendar/website-building-content-creation'
  },
  {
    id: 'brand-consulting',
    title: '1-on-1 Brand Consulting Session',
    duration: '2 hr',
    price: '$175',
    icon: User,
    link: 'https://www.apexitconsults.com/booking-calendar/1-on-1-brand-consulting-session'
  },
  {
    id: 'kid-code',
    title: '1. Kid Code: Intro to Web Design',
    duration: 'Course',
    price: '$85',
    icon: Laptop,
    link: 'https://www.apexitconsults.com/service-page/1-kid-code-intro-to-web-design'
  },
  {
    id: 'logo-pro',
    title: '2. Logo Like a Pro',
    duration: 'Course',
    price: '$65',
    icon: PenTool,
    link: 'https://www.apexitconsults.com/service-page/2-logo-like-a-pro'
  },
  {
    id: 'tech-smart',
    title: '3. Tech Smart: Microsoft 365 Essentials',
    duration: '2 hr',
    price: '$95',
    icon: Laptop,
    link: 'https://www.apexitconsults.com/booking-calendar/3-tech-smart-microsoft-365-essentials'
  },
  {
    id: 'email-boss',
    title: '4. Email & Calendar Boss:',
    duration: 'Varies',
    price: '$55',
    icon: Mail,
    link: 'https://www.apexitconsults.com/booking-calendar/4-email-calendar-boss'
  }
];

import { PageHeader } from '../components/PageHeader';

export default function BookOnline() {
  return (
    <div className="pt-20">
      <PageHeader 
        title="Book Online"
        description="Select a service to book your session or enroll in our digital training courses."
      />

      {/* Services Grid */}
      <Section className="bg-apple-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BOOKING_SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full flex flex-col justify-between group hover:border-apex-yellow transition-all duration-500">
                <div>
                  <div className="w-14 h-14 bg-white border border-apple-gray-100 rounded-2xl flex items-center justify-center text-apex-yellow mb-8 group-hover:bg-apex-yellow group-hover:text-apple-gray-500 transition-all duration-300">
                    <service.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-apex-yellow transition-colors">{service.title}</h3>
                  <div className="flex flex-col gap-3 mb-8">
                    <div className="flex items-center gap-2 text-apple-gray-300">
                      <Clock size={16} />
                      <span className="text-sm">{service.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-apple-gray-300">
                      <DollarSign size={16} />
                      <span className="text-sm font-bold text-apple-gray-500">{service.price}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => window.open(service.link, '_blank')}
                  className="w-full group/btn"
                >
                  Book Now
                  <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Contact Footer */}
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl mb-8">Need a <span className="text-apex-yellow">custom solution?</span></h2>
          <p className="text-xl text-apple-gray-300 mb-12">
            If you don't see the service you're looking for, feel free to reach out to us directly for a personalized quote.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-lg font-medium">
            <a href="mailto:info@apexdigitalconsultants.com" className="flex items-center gap-2 hover:text-apex-yellow transition-colors">
              <Mail size={20} /> info@apexdigitalconsultants.com
            </a>
            <span className="hidden sm:block opacity-20">|</span>
            <a href="tel:901-593-2119" className="flex items-center gap-2 hover:text-apex-yellow transition-colors">
              <Clock size={20} /> 901-593-2119
            </a>
          </div>
        </div>
      </Section>
    </div>
  );
}
