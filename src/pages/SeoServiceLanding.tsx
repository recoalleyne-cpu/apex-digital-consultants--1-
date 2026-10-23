import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

export type SeoLandingKey =
  | 'website-development-barbados'
  | 'website-development-caribbean'
  | 'web-design-barbados'
  | 'ecommerce-website-development-barbados'
  | 'seo-friendly-websites-barbados';

type LandingFaq = {
  question: string;
  answer: string;
};

type SeoLandingConfig = {
  title: string;
  subtitle: string;
  description: string;
  trustLine: string;
  localIntentLine: string;
  introParagraphs: string[];
  serviceHighlights: string[];
  processSteps: string[];
  industries: string[];
  ctaLabel: string;
  ctaHref: string;
  relatedLinks: Array<{ label: string; href: string }>;
  faqs: LandingFaq[];
};

const LANDING_PAGES: Record<SeoLandingKey, SeoLandingConfig> = {
  'website-development-barbados': {
    title: 'Website Development Barbados',
    subtitle: 'Local Business Websites',
    description:
      'Custom website development in Barbados for service businesses, retailers, and growing teams that need a faster, conversion-focused website.',
    trustLine:
      'Apex builds professional website services for Barbados businesses that want stronger visibility, better user experience, and more qualified leads.',
    localIntentLine:
      'From Bridgetown to island-wide service businesses, we build websites that reflect local buyer behavior and business goals.',
    introParagraphs: [
      'Our website development process starts with your business goals, then translates them into a clear page structure, persuasive messaging, and performance-first execution.',
      'We build custom website development solutions for Barbados brands that need websites to do real commercial work: generate inquiries, support sales conversations, and improve customer trust.',
      'Every project is designed for mobile responsiveness, fast loading, SEO-friendly structure, and practical content management.'
    ],
    serviceHighlights: [
      'Custom website architecture mapped to your offer and lead flow',
      'Responsive web design for modern mobile-first behavior',
      'SEO-ready page structure, metadata, and technical foundations',
      'Conversion-focused sections with strategic calls to action',
      'Support for website redesigns, migrations, and expansion'
    ],
    processSteps: [
      'Discovery and business goal mapping',
      'Information architecture and conversion wireframing',
      'Design system and development implementation',
      'SEO setup, QA, launch, and handoff support'
    ],
    industries: [
      'Professional services',
      'Hospitality and tourism',
      'Retail and ecommerce',
      'Education and training',
      'Health and wellness'
    ],
    ctaLabel: 'Book a Website Strategy Call',
    ctaHref: '/contact',
    relatedLinks: [
      { label: 'Website Development Services', href: '/services/websites' },
      { label: 'Website Development Portfolio', href: '/portfolio' },
      { label: 'Website Case Studies', href: '/case-studies' }
    ],
    faqs: [
      {
        question: 'Do you offer custom website development in Barbados for small businesses?',
        answer:
          'Yes. We tailor each build to your service model, market, and growth stage instead of using generic templates.'
      },
      {
        question: 'Can you redesign an existing website instead of building from scratch?',
        answer:
          'Yes. We handle website redesigns that improve speed, clarity, and conversion performance while preserving important brand assets.'
      },
      {
        question: 'Will my website be optimized for search engines?',
        answer:
          'Yes. We implement SEO web design fundamentals including metadata, structure, mobile UX, internal linking, and technical crawl readiness.'
      },
      {
        question: 'How long does website development usually take?',
        answer:
          'Most projects run between 3 and 8 weeks depending on content readiness, revision cycles, and feature complexity.'
      }
    ]
  },
  'website-development-caribbean': {
    title: 'Website Development Caribbean',
    subtitle: 'Regional Growth Websites',
    description:
      'Caribbean web development services for businesses expanding across islands and international markets with modern, scalable websites.',
    trustLine:
      'We support brands across the Caribbean with professional website systems built for performance, trust, and long-term growth.',
    localIntentLine:
      'We help regional companies present one clear brand experience while still serving different Caribbean markets effectively.',
    introParagraphs: [
      'Caribbean businesses often need websites that work for multiple audiences, service areas, and campaign channels. We build with that complexity in mind from day one.',
      'Our process aligns web strategy, design, and development so your website supports lead generation, customer education, and conversion across your region.',
      'From corporate websites to service funnels and ecommerce storefronts, we focus on clear messaging, high usability, and durable technical quality.'
    ],
    serviceHighlights: [
      'Scalable Caribbean web development architecture',
      'Regional content structure for multi-market targeting',
      'Responsive web design Caribbean users can navigate easily',
      'Analytics-ready builds with conversion event planning',
      'Ongoing support and iterative optimization'
    ],
    processSteps: [
      'Market and audience strategy alignment',
      'Regional content and conversion planning',
      'Custom design and development execution',
      'Launch support and performance refinement'
    ],
    industries: [
      'B2B and consulting',
      'Logistics and transport',
      'Hospitality and events',
      'Media and entertainment',
      'Professional training'
    ],
    ctaLabel: 'Plan My Caribbean Website Build',
    ctaHref: '/contact',
    relatedLinks: [
      { label: 'Caribbean Website Development Service', href: '/website-development-caribbean' },
      { label: 'Web Design Barbados', href: '/web-design-barbados' },
      { label: 'Discuss Your Project', href: '/contact' }
    ],
    faqs: [
      {
        question: 'Do you build websites for companies serving multiple Caribbean countries?',
        answer:
          'Yes. We structure content and navigation to support regional service delivery and clearer intent for both users and search engines.'
      },
      {
        question: 'Can this include ecommerce and online payment workflows?',
        answer:
          'Yes. We can scope ecommerce website development, checkout flows, and conversion tracking as part of your implementation plan.'
      },
      {
        question: 'How do you handle SEO for regional targeting?',
        answer:
          'We use location-aware page architecture, semantic keyword targeting, technical metadata, and internal linking to support regional discoverability.'
      },
      {
        question: 'Can your team support us remotely across multiple islands?',
        answer:
          'Yes. Our process is structured for remote planning, approvals, and staged delivery for Caribbean organizations.'
      }
    ]
  },
  'web-design-barbados': {
    title: 'Web Design Barbados',
    subtitle: 'Conversion-Focused Design',
    description:
      'Professional website design Barbados businesses can rely on for stronger brand trust, cleaner UX, and better conversion rates.',
    trustLine:
      'Our website design process combines brand direction, UX strategy, and SEO-friendly structure to help Barbados businesses convert more visitors.',
    localIntentLine:
      'We design for local and regional customer journeys so your pages look premium and guide users toward inquiry.',
    introParagraphs: [
      'Great web design is not just visual polish. It is strategic page flow, clear message hierarchy, and intuitive user experience that moves visitors to action.',
      'We design websites around your business objectives and customer behavior, not generic trends.',
      'The result is a modern website design Barbados teams can confidently use for sales, marketing, and credibility.'
    ],
    serviceHighlights: [
      'Website design systems aligned to your brand positioning',
      'Conversion-first page layouts and CTA structure',
      'Accessible, mobile-friendly interface patterns',
      'SEO-friendly web design planning and content hierarchy',
      'Design handoff ready for development and scaling'
    ],
    processSteps: [
      'Brand and audience alignment workshop',
      'Wireframes and conversion layout planning',
      'Visual direction and UI system design',
      'Final design QA and development handoff'
    ],
    industries: [
      'Professional services',
      'Beauty and wellness',
      'Home and trade services',
      'Education providers',
      'Creative and media brands'
    ],
    ctaLabel: 'Start My Web Design Project',
    ctaHref: '/contact',
    relatedLinks: [
      { label: 'Web Design Service Details', href: '/services/web-design' },
      { label: 'Website Development Barbados', href: '/website-development-barbados' },
      { label: 'Website Portfolio', href: '/portfolio' }
    ],
    faqs: [
      {
        question: 'What is included in your website design service?',
        answer:
          'We include strategy, wireframing, visual design, mobile responsiveness, and conversion-focused section planning.'
      },
      {
        question: 'Do you also handle development after design?',
        answer:
          'Yes. We can move directly into full website development so your design is implemented accurately and efficiently.'
      },
      {
        question: 'Can you improve an existing design without a full rebuild?',
        answer:
          'Yes. We can redesign high-impact pages first and stage improvements in phases based on business priorities.'
      },
      {
        question: 'Do you design with mobile and SEO in mind?',
        answer:
          'Yes. We design for responsive UX and search-friendly structure so your pages perform across devices and search intent.'
      }
    ]
  },
  'ecommerce-website-development-barbados': {
    title: 'Ecommerce Website Development Barbados',
    subtitle: 'Online Store Solutions',
    description:
      'Ecommerce website development for Barbados businesses that need secure checkout, scalable product management, and conversion-ready storefronts.',
    trustLine:
      'We build ecommerce websites that help Barbados retailers and service brands sell more effectively online.',
    localIntentLine:
      'Our ecommerce development approach supports local stores, regional fulfillment models, and scalable online growth.',
    introParagraphs: [
      'Our ecommerce builds are designed for clear product discovery, smooth checkout experiences, and practical back-office management.',
      'Whether you are launching a new online store or upgrading an existing one, we focus on reliability, speed, and user confidence at each buying step.',
      'We also integrate tracking and reporting foundations so you can optimize campaigns and sales performance over time.'
    ],
    serviceHighlights: [
      'Custom ecommerce website development and storefront UX',
      'Checkout and payment flow implementation support',
      'Product catalog architecture and category strategy',
      'Conversion tracking setup for campaign optimization',
      'Post-launch support for updates and enhancements'
    ],
    processSteps: [
      'Catalog and offer strategy planning',
      'Store architecture and UX design',
      'Development, payment setup, and QA',
      'Launch support and performance tuning'
    ],
    industries: [
      'Beauty and cosmetics',
      'Apparel and accessories',
      'Specialty retail',
      'Digital products',
      'Hybrid service-commerce brands'
    ],
    ctaLabel: 'Build My Ecommerce Website',
    ctaHref: '/contact',
    relatedLinks: [
      { label: 'Ecommerce Website Development Barbados', href: '/ecommerce-website-development-barbados' },
      { label: 'SEO-Friendly Websites Barbados', href: '/seo-friendly-websites-barbados' },
      { label: 'Contact Apex for Ecommerce', href: '/contact' }
    ],
    faqs: [
      {
        question: 'Can you build ecommerce websites for local Barbados businesses?',
        answer:
          'Yes. We scope ecommerce solutions for local operations and brands serving regional or international customers.'
      },
      {
        question: 'Do you support secure payments and checkout optimization?',
        answer:
          'Yes. We support payment workflow planning and checkout UX improvements to reduce friction and abandoned carts.'
      },
      {
        question: 'Will my ecommerce website be SEO-ready?',
        answer:
          'Yes. We include SEO-friendly structure and metadata planning so your product and category pages are indexable and discoverable.'
      },
      {
        question: 'Can you support post-launch updates and optimization?',
        answer:
          'Yes. We provide post-launch support for catalog updates, UX improvements, and conversion optimization.'
      }
    ]
  },
  'seo-friendly-websites-barbados': {
    title: 'SEO-Friendly Websites Barbados',
    subtitle: 'Search-Ready Website Builds',
    description:
      'SEO-friendly website development and web design in Barbados, built to improve crawlability, relevance, and conversion outcomes.',
    trustLine:
      'We design and develop websites with technical SEO, user experience, and conversion strategy built into the foundation.',
    localIntentLine:
      'For businesses in Barbados and across the Caribbean, we combine local search relevance with modern technical SEO standards.',
    introParagraphs: [
      'If a website looks good but cannot rank or convert, it underperforms. Our SEO-friendly web design approach aligns technical structure with search intent and sales outcomes.',
      'We focus on metadata quality, heading hierarchy, semantic relevance, internal linking, and page speed fundamentals.',
      'This gives your business a stronger foundation to compete for valuable local and regional keywords over time.'
    ],
    serviceHighlights: [
      'Technical SEO foundations from initial build stage',
      'Semantic content structure aligned to search intent',
      'Internal linking strategy for service page authority flow',
      'Responsive performance for mobile-first indexing',
      'Conversion-focused content and CTA architecture'
    ],
    processSteps: [
      'SEO opportunity mapping and keyword intent alignment',
      'Content architecture and on-page strategy',
      'Design and development implementation',
      'Post-launch measurement and iterative improvements'
    ],
    industries: [
      'Professional services',
      'Local businesses',
      'Ecommerce brands',
      'Education and coaching',
      'Agency and consulting teams'
    ],
    ctaLabel: 'Request an SEO Website Build',
    ctaHref: '/contact',
    relatedLinks: [
      { label: 'SEO-Friendly Websites Service', href: '/seo-friendly-websites-barbados' },
      { label: 'Website Development Caribbean', href: '/website-development-caribbean' },
      { label: 'Book an SEO Website Call', href: '/contact' }
    ],
    faqs: [
      {
        question: 'What makes a website SEO-friendly?',
        answer:
          'A strong SEO-friendly website combines technical crawlability, content relevance, performance, accessibility, and clear internal linking.'
      },
      {
        question: 'Do you optimize pages for Barbados-focused search terms?',
        answer:
          'Yes. We build pages around local search intent and natural geographic relevance for Barbados and wider Caribbean audiences.'
      },
      {
        question: 'Can SEO improvements be added to an existing website?',
        answer:
          'Yes. We can audit the current build and prioritize the highest-impact technical and on-page improvements.'
      },
      {
        question: 'Do you include technical SEO setup during development?',
        answer:
          'Yes. We implement metadata, heading structure, internal links, and crawl-ready page architecture during the build process.'
      }
    ]
  }
};

type SeoServiceLandingProps = {
  pageKey: SeoLandingKey;
};

export const SeoServiceLanding = ({ pageKey }: SeoServiceLandingProps) => {
  const page = LANDING_PAGES[pageKey];

  return (
    <div className="pt-16 md:pt-20">
      <PageHeader title={page.title} subtitle={page.subtitle} description={page.description} />

      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 md:gap-12">
            <div className="space-y-6">
              <h2 className="heading-lg">Built for Visibility and Conversion</h2>
              <p className="text-lg leading-8 text-apple-gray-300">{page.trustLine}</p>
              <p className="text-base md:text-lg leading-8 text-apple-gray-300">{page.localIntentLine}</p>
              {page.introParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-base md:text-lg leading-8 text-apple-gray-300">
                  {paragraph}
                </p>
              ))}

              <div className="flex flex-wrap gap-3 pt-2">
                {page.relatedLinks.map((link) => (
                  <Link key={link.label} to={link.href} className="apple-button apple-button-secondary text-sm">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <aside className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-7 sm:p-8 md:p-10 h-fit">
              <h3 className="text-2xl font-semibold text-apple-gray-500 mb-4">What You Get</h3>
              <ul className="space-y-4">
                {page.serviceHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-apple-gray-400">
                    <CheckCircle2 size={18} className="mt-1 shrink-0 text-apex-yellow" />
                    <span className="leading-7">{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
            <article className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 md:p-10">
              <h2 className="text-3xl md:text-4xl font-bold text-apple-gray-500 mb-6">
                Our Delivery Process
              </h2>
              <ol className="space-y-4">
                {page.processSteps.map((step, index) => (
                  <li key={step} className="rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300 mb-2">
                      Step {String(index + 1).padStart(2, '0')}
                    </p>
                    <p className="text-base leading-7 text-apple-gray-400">{step}</p>
                  </li>
                ))}
              </ol>
            </article>

            <article className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 md:p-10">
              <h2 className="text-3xl md:text-4xl font-bold text-apple-gray-500 mb-6">
                Industries We Support
              </h2>
              <p className="text-base md:text-lg leading-8 text-apple-gray-300 mb-6">
                We partner with businesses in Barbados and across the Caribbean that need websites to drive measurable outcomes.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {page.industries.map((industry) => (
                  <li
                    key={industry}
                    className="rounded-xl border border-apple-gray-100 bg-apple-gray-50 px-4 py-3 text-sm font-medium text-apple-gray-400"
                  >
                    {industry}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section-padding bg-apple-gray-500 text-white">
        <div className="container-wide px-6 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="heading-lg text-white">Need Proof Before You Decide?</h2>
            <p className="mx-auto mt-4 max-w-3xl text-base md:text-lg leading-8 text-apple-gray-200">
              Review real project work, outcomes, and execution quality before you commit.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/portfolio" className="apple-button apple-button-primary">
                View Portfolio
              </Link>
              <Link
                to="/case-studies"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Read Case Studies <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide px-6 md:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="heading-lg text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {page.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-2xl border border-apple-gray-100 bg-white p-6"
                >
                  <summary className="cursor-pointer list-none text-lg font-semibold text-apple-gray-500">
                    {faq.question}
                  </summary>
                  <p className="mt-4 text-base leading-8 text-apple-gray-300">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-wide px-6 md:px-8">
          <div className="rounded-[2.5rem] border border-apple-gray-100 bg-apple-gray-50 p-8 md:p-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-apple-gray-500 mb-4">
              Ready to Build a Better Website?
            </h2>
            <p className="mx-auto max-w-3xl text-base md:text-lg leading-8 text-apple-gray-300 mb-8">
              Tell us what you need and we will map the right website strategy for your business goals, audience, and growth stage.
            </p>
            <Link to={page.ctaHref} className="apple-button apple-button-primary">
              {page.ctaLabel}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export const SEO_LANDING_PATH_TO_KEY: Record<string, SeoLandingKey> = {
  '/website-development-barbados': 'website-development-barbados',
  '/website-development-caribbean': 'website-development-caribbean',
  '/web-design-barbados': 'web-design-barbados',
  '/ecommerce-website-development-barbados': 'ecommerce-website-development-barbados',
  '/seo-friendly-websites-barbados': 'seo-friendly-websites-barbados'
};

export const getSeoLandingFaqs = (path: string) => {
  const key = SEO_LANDING_PATH_TO_KEY[path];
  if (!key) return [];
  return LANDING_PAGES[key].faqs;
};
