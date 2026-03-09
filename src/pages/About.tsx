import React from 'react';
import { motion } from 'framer-motion';
import { TEAM } from '../constants';
import { PageHeader } from '../components/PageHeader';

export const About = () => {
  return (
    <div className="pt-16 md:pt-20">
      <PageHeader 
        title="Forward-Thinking Digital Solutions."
        subtitle="About Apex Digital Consultants"
        description="Apex Digital Consultants is a forward-thinking digital solutions company dedicated to helping businesses establish, grow, and optimize their online presence."
      />

      {/* Mission / Details */}
      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200" 
                alt="Our Mission" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-8 md:space-y-10">
              <h2 className="heading-lg leading-tight">Our Approach</h2>

              <p className="text-lg text-apple-gray-300 leading-8">
                The company specializes in delivering strategic digital services including website development, branding and logo design, digital marketing solutions, and custom digital tools that empower businesses to operate more efficiently in the modern digital landscape.
              </p>

              <p className="text-lg text-apple-gray-300 leading-8">
                At Apex Digital Consultants, the focus is on combining creativity, technology, and practical business strategy to produce solutions that not only look exceptional but also deliver measurable results. From professional websites and brand identities to custom digital solutions and automation tools, the company works with businesses to build strong digital foundations that support long-term growth.
              </p>

              <p className="text-lg text-apple-gray-300 leading-8">
                Apex Digital Consultants takes a client-focused approach to every project, ensuring that each solution is tailored to the unique goals and needs of the business it serves. By prioritizing quality, innovation, and reliability, the company aims to provide digital solutions that help organizations strengthen their brand, improve customer engagement, and unlock new opportunities online.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            <div className="order-2 lg:order-1 space-y-8 md:space-y-10">
              <span className="text-sm font-semibold tracking-widest text-apex-yellow uppercase block">
                The Visionary
              </span>

              <h2 className="heading-lg leading-tight">
                Meet Our Founder
              </h2>

              <p className="text-lg text-apple-gray-300 leading-8">
                Apex Digital Consultants was founded by Reco Alleyne, a digital strategist and technology professional with a passion for helping businesses leverage digital platforms to achieve meaningful growth.
              </p>

              <p className="text-lg text-apple-gray-300 leading-8">
                Reco established Apex Digital Consultants with the vision of creating a company that bridges the gap between technology and business strategy. With experience managing digital projects, building online platforms, and implementing practical digital solutions, he recognized the growing need for businesses to have access to reliable expertise that could guide them through the evolving digital landscape.
              </p>

              <p className="text-lg text-apple-gray-300 leading-8">
                Under Reco’s leadership, Apex Digital Consultants focuses on delivering high-quality digital services that combine thoughtful design, smart technology, and strategic insight. His commitment to innovation and continuous improvement drives the company’s mission to provide modern digital solutions that enable businesses to compete effectively in an increasingly digital world.
              </p>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200" 
                  alt="Reco Alleyne - Founder" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-apex-yellow/10 rounded-full blur-3xl -z-0" />
              <div className="absolute top-12 -left-12 w-24 h-24 border-t-2 border-l-2 border-apex-yellow rounded-tl-3xl" />
            </div>

          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-apple-gray-500 text-white">
        <div className="container-wide">

          <div className="text-center mb-14 md:mb-16">
            <h2 className="heading-lg mb-6">
              Our Core Values
            </h2>
            <p className="text-apple-gray-200 max-w-2xl mx-auto leading-8">
              The principles that guide every project we deliver and every partnership we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">

            <div className="space-y-5">
              <h3 className="text-2xl font-bold text-apex-yellow">Strategy</h3>
              <p className="text-apple-gray-200 leading-8">
                We don't just execute; we plan. Every move is backed by data and market analysis.
              </p>
            </div>

            <div className="space-y-5">
              <h3 className="text-2xl font-bold text-apex-yellow">Creativity</h3>
              <p className="text-apple-gray-200 leading-8">
                We bring fresh perspectives and innovative designs that make your brand stand out.
              </p>
            </div>

            <div className="space-y-5">
              <h3 className="text-2xl font-bold text-apex-yellow">Precision</h3>
              <p className="text-apple-gray-200 leading-8">
                Attention to detail is at the core of everything we do, from code to copy.
              </p>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
};