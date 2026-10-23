import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { DEFAULT_IMAGE, toAbsoluteUrl } from '../utils/seo';
import { MEDIA_PLACEMENT_VALUES } from '../constants/mediaPlacements';

type MediaItem = {
  id: number;
  title: string;
  file_url: string;
};

export const About = () => {
  const [aboutTopImage, setAboutTopImage] = useState<string | null>(null);
  const [founderImage, setFounderImage] = useState<string | null>(null);
  const brandLogo = '/black%20logo.png';

  useEffect(() => {
    const loadPlacementImage = async (
      placement: string,
      setImage: (value: string | null) => void,
      warningMessage: string
    ) => {
      try {
        const res = await fetch(`/api/media?placement=${encodeURIComponent(placement)}`);
        const data = await res.json();

        if (data?.items?.length) {
          setImage(data.items[0].file_url);
        }
      } catch (err) {
        console.warn(warningMessage, err);
      }
    };

    // Some older deployments used the placement slug `about-founder` (without "-image").
    // Try that as a fallback when the canonical placement returns no results.
    const loadFounderImageWithFallback = async () => {
      try {
        const canonical = MEDIA_PLACEMENT_VALUES.ABOUT_FOUNDER_IMAGE;
        const res = await fetch(`/api/media?placement=${encodeURIComponent(canonical)}`);
        const data = await res.json();
        // debug log
        // eslint-disable-next-line no-console
        console.debug('About: founder media (canonical) response', canonical, data);

        if (data?.items?.length) {
          const raw = data.items[0].file_url as string | undefined | null;
          const url = raw ? (raw as string).trim() : null;
          const resolved = toAbsoluteUrl(url) || null;
          // eslint-disable-next-line no-console
          console.debug('About: using founder media url (canonical)', { raw, url, resolved });
          setFounderImage(resolved);
          return;
        }

        // fallback to legacy placement slug
        const legacy = 'about-founder';
        const res2 = await fetch(`/api/media?placement=${encodeURIComponent(legacy)}`);
        const data2 = await res2.json();
        // eslint-disable-next-line no-console
        console.debug('About: founder media (legacy) response', legacy, data2);

        if (data2?.items?.length) {
          const raw = data2.items[0].file_url as string | undefined | null;
          const url = raw ? (raw as string).trim() : null;
          const resolved = toAbsoluteUrl(url) || null;
          // eslint-disable-next-line no-console
          console.debug('About: using founder media url (legacy)', { raw, url, resolved });
          setFounderImage(resolved);
          return;
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Failed to load founder image', err);
      }
    };

    void loadPlacementImage(
      MEDIA_PLACEMENT_VALUES.ABOUT_TOP_IMAGE,
      setAboutTopImage,
      'Failed to load about top image'
    );
    void loadFounderImageWithFallback();
  }, []);

  return (
    <div className="pt-16 md:pt-20">
      <PageHeader
        title="Barbados & Caribbean Website Development Team."
        subtitle="About Apex Digital Consultants"
        description="Apex Digital Consultants helps businesses in Barbados and across the Caribbean build modern websites, stronger digital brands, and scalable growth systems."
      />

      {/* Mission / Details */}
      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="aspect-[4/5] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-4 sm:border-8 border-white">
              <img
                src={aboutTopImage || brandLogo}
                alt="Apex Digital Consultants website development and digital services brand logo"
                className="w-full h-full object-contain bg-white p-6 sm:p-8"
              />
            </div>

            <div className="space-y-8 md:space-y-10">
              <h2 className="heading-lg leading-tight">Our Approach</h2>

              <p className="text-base md:text-lg text-apple-gray-300 leading-8">
                The company specializes in delivering strategic digital services including website development, web design, branding and logo design, digital marketing solutions, and custom digital tools that empower businesses to operate more efficiently in the modern digital landscape.
              </p>

              <p className="text-base md:text-lg text-apple-gray-300 leading-8">
                At Apex Digital Consultants, the focus is on combining creativity, technology, and practical business strategy to produce solutions that not only look exceptional but also deliver measurable results. From professional websites and brand identities to custom digital solutions and automation tools, the company works with businesses in Barbados and the wider Caribbean to build strong digital foundations that support long-term growth.
              </p>

              <p className="text-base md:text-lg text-apple-gray-300 leading-8">
                Apex Digital Consultants takes a client-focused approach to every project, ensuring that each solution is tailored to the unique goals and needs of the business it serves. By prioritizing quality, innovation, and reliability, the company provides professional website services that help organizations strengthen their brand, improve customer engagement, and unlock new opportunities online.
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
              <span className="text-xs sm:text-sm font-semibold tracking-widest text-apex-yellow uppercase block">
                The Visionary
              </span>

              <h2 className="heading-lg leading-tight">
                Meet Our Founder
              </h2>

              <p className="text-base md:text-lg text-apple-gray-300 leading-8">
                Apex Digital Consultants was founded by Reco Alleyne, a digital strategist and technology professional with a passion for helping businesses leverage digital platforms to achieve meaningful growth.
              </p>

              <p className="text-base md:text-lg text-apple-gray-300 leading-8">
                Reco established Apex Digital Consultants with the vision of creating a company that bridges the gap between technology and business strategy. With experience managing digital projects, building online platforms, and implementing practical digital solutions, he recognized the growing need for businesses to have access to reliable expertise that could guide them through the evolving digital landscape.
              </p>

              <p className="text-base md:text-lg text-apple-gray-300 leading-8">
                Under Reco’s leadership, Apex Digital Consultants focuses on delivering high-quality digital services that combine thoughtful design, smart technology, and strategic insight. His commitment to innovation and continuous improvement drives the company’s mission to provide modern digital solutions that enable businesses to compete effectively in an increasingly digital world.
              </p>
            </div>

            <div className="order-1 lg:order-2 relative overflow-hidden">
              <div className="aspect-[4/5] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl relative z-10 bg-apple-gray-50">
                <img
                  src={founderImage || DEFAULT_IMAGE}
                  alt="Reco Alleyne founder of Apex Digital Consultants in Barbados"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="absolute -bottom-8 -right-8 w-48 h-48 sm:w-64 sm:h-64 bg-apex-yellow/10 rounded-full blur-3xl -z-0 pointer-events-none" />
              <div className="hidden sm:block absolute top-12 -left-12 w-24 h-24 border-t-2 border-l-2 border-apex-yellow rounded-tl-3xl" />
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

      <section className="section-padding">
        <div className="container-wide">
          <div className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 md:p-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-apple-gray-500 mb-4">
              Ready to Work With Apex?
            </h2>
            <p className="mx-auto max-w-3xl text-base md:text-lg leading-8 text-apple-gray-300 mb-8">
              Explore our website development services, review recent project outcomes, and request a strategy call for your Barbados or Caribbean business.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/services" className="apple-button apple-button-secondary text-sm">
                Explore Services
              </Link>
              <Link to="/portfolio" className="apple-button apple-button-secondary text-sm">
                See Portfolio
              </Link>
              <Link to="/contact" className="apple-button apple-button-primary text-sm">
                Contact Apex
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
