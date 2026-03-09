import React from 'react';
import { motion } from 'motion/react';
import Section from '../components/Section';
import Card from '../components/Card';
import Button from '../components/Button';
import { Laptop, BookOpen, Rocket, Users, CheckCircle2, ArrowRight } from 'lucide-react';

const PROGRAMS = [
  {
    title: 'Digital Marketing Courses',
    description: 'Equip yourself with the skills and knowledge needed to excel in the digital world. From mastering software to understanding the latest marketing trends.',
    icon: BookOpen
  },
  {
    title: 'Professional Development Workshops',
    description: 'Take your business to the next level with expert consulting services and workshops tailored to enhance business acumen and leadership.',
    icon: Users
  },
  {
    title: 'Startup Accelerator Programs',
    description: 'Turn your entrepreneurial dreams into reality with guidance to launch and grow your business successfully in today\'s competitive market.',
    icon: Rocket
  },
  {
    title: 'Tech Capacity Building',
    description: 'Empower your nonprofit organization with the digital skills it needs to make a greater impact and drive meaningful change.',
    icon: Laptop
  }
];

import { PageHeader } from '../components/PageHeader';

export default function Academy() {
  return (
    <div className="pt-20">
      <PageHeader 
        title="APEX Training Academy"
        description="Close the digital gap and empower your team with the skills to scale faster."
      />

      {/* About Section */}
      <Section className="bg-apple-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">About APEX Training Academy</h2>
            <p className="text-xl text-apple-gray-300 leading-relaxed">
              At APEX Digital Marketing & Business Consulting, we know the difference between surviving and thriving in business often comes down to one thing: how well you and your team use your digital tools.
            </p>
            <p className="text-xl text-apple-gray-300 leading-relaxed">
              Imagine a small business struggling to keep up with orders, employee records lost in email chains, and staff taking twice as long to complete reports. Contrast that with a competitor whose team confidently uses Microsoft Office 365, automates tasks, and presents data clearly. Which business is scaling faster?
            </p>
            <div className="pt-8">
              <Button size="lg" className="group">
                Book Today
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-apple-gray-100">
            <h3 className="text-2xl font-bold mb-8">Our online training courses cover:</h3>
            <ul className="space-y-6">
              {[
                'Microsoft Office 365 Essentials',
                'Digital File Management & Cloud Navigation',
                'Email & Calendar Efficiency',
                'Business Startup Tools',
                'Nonprofit Management Basics',
                'And more!'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-lg font-medium text-apple-gray-400">
                  <CheckCircle2 className="text-apex-yellow" size={24} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Programs */}
      <Section className="bg-white">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">Our Programs</h2>
          <p className="text-xl text-apple-gray-300">Designed to equip you with the skills to excel.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROGRAMS.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-12 h-full group hover:border-apex-yellow transition-all duration-500">
                <div className="w-16 h-16 bg-apple-gray-50 rounded-2xl flex items-center justify-center text-apex-yellow mb-10 group-hover:bg-apex-yellow group-hover:text-apple-gray-500 transition-all duration-500">
                  <program.icon size={32} />
                </div>
                <h3 className="text-3xl font-bold mb-6 group-hover:text-apex-yellow transition-colors">{program.title}</h3>
                <p className="text-xl text-apple-gray-300 leading-relaxed">
                  {program.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Commitment */}
      <Section className="bg-apple-gray-500 text-white rounded-[4rem] mx-6 mb-20">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-5xl md:text-7xl font-bold mb-12 tracking-tight">Our <span className="text-apex-yellow">Commitment</span></h2>
          <p className="text-xl md:text-2xl opacity-70 leading-relaxed mb-16">
            At APEX Digital Marketing & Business Consulting, we are committed to empowering individuals and businesses with the digital skills and knowledge necessary to thrive in today's competitive landscape. Our mission is to provide comprehensive training and consulting services that drive professional growth and organizational success.
          </p>
          <Button size="lg" className="bg-apex-yellow text-apple-gray-500 hover:bg-apex-yellow-hover px-12">
            Get a Quote
          </Button>
        </div>
      </Section>
    </div>
  );
}
