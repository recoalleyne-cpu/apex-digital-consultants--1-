import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { SERVICES } from '../constants';

type FunnelStep = {
  title: string;
  description: string;
};

type ServiceFunnelContent = {
  heroPromise: string;
  painPoints: string[];
  deliverables: string[];
  process: FunnelStep[];
  outcomes: string[];
  offerSummary: string;
  ctaLabel: string;
};

const SERVICE_FUNNEL_CONTENT: Record<string, ServiceFunnelContent> = {
  'web-development': {
    heroPromise:
      'Launch a website that looks premium, loads fast, and guides visitors toward action.',
    painPoints: [
      'Your current site looks outdated and does not reflect your brand credibility.',
      'Visitors are dropping off before they reach your contact form or offer.',
      'You need a site that can grow with your campaigns, products, or service expansion.'
    ],
    deliverables: [
      'Conversion-focused page architecture for homepage, service, and lead capture pages.',
      'Responsive design system optimized for mobile, tablet, and desktop behavior.',
      'Speed, structure, and on-page SEO foundations for discoverability.',
      'CTA strategy with clear next steps that move users from interest to inquiry.',
      'Launch readiness checklist with QA, analytics setup, and handoff support.'
    ],
    process: [
      {
        title: 'Discovery + Positioning',
        description: 'We map your goals, audience, and offer into a focused website strategy.'
      },
      {
        title: 'Funnel Wireframe',
        description: 'We design the conversion path before visuals to protect clarity and intent.'
      },
      {
        title: 'Build + Optimization',
        description: 'We develop the site, then refine speed, UX, and conversion behavior.'
      },
      {
        title: 'Launch + Iterate',
        description: 'After launch, we track behavior and tighten weak points in the funnel.'
      }
    ],
    outcomes: [
      'Clearer user journey from first visit to qualified inquiry.',
      'Stronger perceived authority through premium design execution.',
      'A scalable website foundation for campaigns and long-term growth.'
    ],
    offerSummary:
      'Best for businesses that need a high-converting website, not just an online brochure.',
    ctaLabel: 'Start My Website Funnel'
  },
  'marketing-management': {
    heroPromise:
      'Move from disconnected marketing activity to a structured system that generates demand consistently.',
    painPoints: [
      'Campaigns are being run, but there is no clear system for strategy, testing, and scale.',
      'Content, ads, and social activity are not aligned to one conversion objective.',
      'You are spending budget without strong visibility into what is driving results.'
    ],
    deliverables: [
      'Marketing strategy mapped to your sales goals and audience behavior.',
      'Monthly campaign architecture with channel priorities and execution cadence.',
      'Creative direction for offers, messaging, and campaign angles.',
      'Performance dashboards with practical actions instead of vanity metrics.',
      'Optimization loop for testing headlines, CTAs, and audience segments.'
    ],
    process: [
      {
        title: 'Audit + Alignment',
        description: 'We identify bottlenecks across your current channels and offer flow.'
      },
      {
        title: 'Campaign Blueprint',
        description: 'We build a realistic plan for awareness, consideration, and conversion.'
      },
      {
        title: 'Execution Oversight',
        description: 'We manage campaign rollout and keep messaging consistent across channels.'
      },
      {
        title: 'Performance Refinement',
        description: 'We review weekly signals and adjust targeting, messaging, and offers.'
      }
    ],
    outcomes: [
      'A predictable marketing rhythm tied to business outcomes.',
      'Higher campaign efficiency through clearer targeting and messaging.',
      'Better decision-making from real performance visibility.'
    ],
    offerSummary:
      'Best for businesses that need strategic marketing leadership without hiring a full in-house team.',
    ctaLabel: 'Build My Marketing System'
  },
  'google-advertising': {
    heroPromise:
      'Capture high-intent traffic and turn paid clicks into measurable lead opportunities.',
    painPoints: [
      'You are paying for clicks, but qualified leads are inconsistent.',
      'Campaign targeting, keyword intent, and landing pages are misaligned.',
      'There is no clean conversion tracking to prove what is working.'
    ],
    deliverables: [
      'Search campaign structure aligned to high-intent keyword clusters.',
      'Landing page alignment for message match and conversion lift.',
      'Negative keyword and budget controls to reduce wasted ad spend.',
      'GA4 and conversion event tracking architecture for accurate reporting.',
      'Ongoing optimization for bids, ad copy, assets, and audience segments.'
    ],
    process: [
      {
        title: 'Offer + Intent Mapping',
        description: 'We map your offer to keywords that represent buyer readiness.'
      },
      {
        title: 'Campaign Setup',
        description: 'We deploy ad groups, assets, extensions, and conversion configuration.'
      },
      {
        title: 'Funnel Alignment',
        description: 'We connect ads to the right landing experience for stronger conversion rates.'
      },
      {
        title: 'Optimization Cycle',
        description: 'We refine bids, creatives, and audiences based on performance data.'
      }
    ],
    outcomes: [
      'More qualified traffic from users actively searching for your offer.',
      'Lower waste through tighter targeting and budget controls.',
      'Clearer conversion reporting for confident scaling decisions.'
    ],
    offerSummary:
      'Best for businesses that want Google Ads to function as a reliable lead engine.',
    ctaLabel: 'Launch My Google Ads Funnel'
  },
  'graphic-design': {
    heroPromise:
      'Turn first impressions into trust with a brand identity designed for recognition and conversion.',
    painPoints: [
      'Your visuals are inconsistent across website, social, and print assets.',
      'Your current logo does not communicate quality or market positioning.',
      'Potential clients do not clearly understand what your brand stands for.'
    ],
    deliverables: [
      'Logo direction and refined final identity built around your positioning.',
      'Visual system guidance for color, typography, and consistent usage.',
      'Primary brand assets for digital channels and marketing collateral.',
      'Funnel-ready creative for hero sections, offers, and campaign graphics.',
      'Implementation guidance for web, social, and sales presentation materials.'
    ],
    process: [
      {
        title: 'Brand Clarity Session',
        description: 'We define audience perception targets and brand personality.'
      },
      {
        title: 'Concept Development',
        description: 'We present focused concepts designed around strategic positioning.'
      },
      {
        title: 'System Finalization',
        description: 'We finalize identity assets and usage standards for consistency.'
      },
      {
        title: 'Deployment Support',
        description: 'We help apply the new identity across your highest-impact touchpoints.'
      }
    ],
    outcomes: [
      'Stronger market perception and immediate visual credibility.',
      'Consistent branding across customer-facing channels.',
      'Creative assets that support lead generation and conversion campaigns.'
    ],
    offerSummary:
      'Best for businesses that need brand visuals to support growth, not just aesthetics.',
    ctaLabel: 'Build My Brand Identity Funnel'
  },
  'photography-videography': {
    heroPromise:
      'Use strategic photo and video assets to increase trust, engagement, and action across your funnel.',
    painPoints: [
      'Stock visuals are weakening trust and making your brand look generic.',
      'Your campaigns lack original content that communicates real value quickly.',
      'You need visual assets that work across website, ads, and social channels.'
    ],
    deliverables: [
      'Creative direction based on your offer, audience, and channel priorities.',
      'Brand-aligned photography and video production for high-impact touchpoints.',
      'Funnel-specific edits optimized for hero sections, ads, and social snippets.',
      'Asset organization for easy reuse across campaigns and launch phases.',
      'Content usage plan tied to your conversion and visibility goals.'
    ],
    process: [
      {
        title: 'Creative Planning',
        description: 'We define what to shoot based on your funnel stages and offers.'
      },
      {
        title: 'Production',
        description: 'We capture branded visuals built for clarity, emotion, and trust.'
      },
      {
        title: 'Post-Production',
        description: 'We edit and package assets in formats tailored to each channel.'
      },
      {
        title: 'Deployment Strategy',
        description: 'We map assets to your website and campaigns for immediate use.'
      }
    ],
    outcomes: [
      'Higher engagement from authentic brand-driven visuals.',
      'Improved trust at critical conversion moments.',
      'A reusable content library for ongoing campaign execution.'
    ],
    offerSummary:
      'Best for businesses that need premium visual assets to support sales and marketing growth.',
    ctaLabel: 'Plan My Visual Content Funnel'
  },
  'business-digitization': {
    heroPromise:
      'Replace manual bottlenecks with digital workflows that improve speed, visibility, and operational control.',
    painPoints: [
      'Manual processes are causing delays, errors, and missed opportunities.',
      'Your team is spending too much time on repetitive admin tasks.',
      'You need clearer process visibility to scale operations confidently.'
    ],
    deliverables: [
      'Workflow audit to identify time-loss and friction points.',
      'Digitization roadmap prioritized by business impact and effort.',
      'Tool stack recommendations for forms, automation, and reporting.',
      'Implementation support for intake, approvals, and follow-up workflows.',
      'SOP and team enablement guidance for consistent adoption.'
    ],
    process: [
      {
        title: 'Operational Audit',
        description: 'We map your current workflow and quantify where inefficiencies exist.'
      },
      {
        title: 'Workflow Architecture',
        description: 'We design a streamlined digital process for your highest-impact tasks.'
      },
      {
        title: 'Implementation',
        description: 'We configure forms, automation, and process handoffs in your stack.'
      },
      {
        title: 'Adoption + Scale',
        description: 'We train your team and refine process steps based on usage feedback.'
      }
    ],
    outcomes: [
      'Reduced manual workload and fewer process breakdowns.',
      'Faster turnaround and stronger consistency across team operations.',
      'A clearer operational foundation for scaling services or sales.'
    ],
    offerSummary:
      'Best for businesses ready to modernize operations and improve execution speed.',
    ctaLabel: 'Digitize My Business Workflow'
  }
};

export const ServiceFunnel = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = SERVICES.find((item) => item.id === serviceId);
  const content = service ? SERVICE_FUNNEL_CONTENT[service.id] : null;

  if (!service || !content) {
    return <Navigate to="/services" replace />;
  }

  return (
    <div className="pt-16 md:pt-20">
      <section className="relative overflow-hidden border-b border-apple-gray-100 bg-gradient-to-b from-apple-gray-50 to-white">
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-apex-yellow/20 blur-3xl" />
        <div className="container-wide relative px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="heading-xl">{service.title}</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-apple-gray-300">
              {service.description}
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-apple-gray-400">
              {content.heroPromise}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/contact" className="apple-button apple-button-primary">
                {content.ctaLabel}
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 rounded-2xl border border-apple-gray-100 px-5 py-3 text-sm font-semibold text-apple-gray-400 transition-colors hover:text-apple-gray-500"
              >
                See Proof in Portfolio
                <ArrowRight size={16} />
              </Link>
            </div>
            <p className="mt-7 text-sm text-apple-gray-300">{content.offerSummary}</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide px-6">
          <div className="max-w-3xl">
            <h2 className="heading-lg">Where Most Funnels Break</h2>
            <p className="mt-4 text-lg leading-8 text-apple-gray-300">
              We focus on solving the friction points that stop visitors from becoming qualified
              leads.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {content.painPoints.map((pain) => (
              <article
                key={pain}
                className="rounded-3xl border border-apple-gray-100 bg-white p-6 sm:p-7"
              >
                <p className="text-base leading-7 text-apple-gray-400">{pain}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide px-6">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <h2 className="heading-lg">What You Get</h2>
              <p className="mt-4 text-lg leading-8 text-apple-gray-300">
                A structured service package built to move prospects from awareness to inquiry.
              </p>
              <ul className="mt-8 space-y-4">
                {content.deliverables.map((deliverable) => (
                  <li key={deliverable} className="flex items-start gap-3 text-apple-gray-400">
                    <CheckCircle2 size={18} className="mt-1 shrink-0 text-apex-yellow" />
                    <span className="text-base leading-7">{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="rounded-3xl border border-apple-gray-100 bg-apple-gray-50 p-7 sm:p-8">
              <h3 className="text-xl font-semibold text-apple-gray-500">Ready-To-Act Next Step</h3>
              <p className="mt-4 text-base leading-7 text-apple-gray-300">
                Share your current goals and blockers, and we will map the right execution path for
                your business.
              </p>
              <Link to="/contact" className="apple-button apple-button-primary mt-7 inline-flex">
                Request Strategy Call
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-padding bg-apple-gray-500 text-white">
        <div className="container-wide px-6">
          <div className="max-w-3xl">
            <h2 className="heading-lg text-white">How Delivery Works</h2>
            <p className="mt-4 text-lg leading-8 text-apple-gray-200">
              Each engagement follows a clear funnel-focused workflow so execution stays fast and
              measurable.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {content.process.map((step, index) => (
              <article key={step.title} className="rounded-3xl border border-white/15 bg-white/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-apex-yellow">
                  Step {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-base leading-7 text-apple-gray-200">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide px-6">
          <div className="max-w-3xl">
            <h2 className="heading-lg">Expected Outcomes</h2>
            <p className="mt-4 text-lg leading-8 text-apple-gray-300">
              Your service engagement is designed to produce concrete business movement, not just
              deliverables.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {content.outcomes.map((outcome) => (
              <article
                key={outcome}
                className="rounded-3xl border border-apple-gray-100 bg-white p-6 sm:p-7"
              >
                <p className="text-base leading-7 text-apple-gray-400">{outcome}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide px-6">
          <div className="rounded-[2rem] border border-apple-gray-100 bg-white p-8 text-center sm:p-10">
            <h2 className="heading-lg">Ready to Turn This Service Into Results?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-apple-gray-300">
              We will align your offer, messaging, and execution path into a conversion-focused
              plan built for your business goals.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/contact" className="apple-button apple-button-primary">
                {content.ctaLabel}
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-2xl border border-apple-gray-100 px-5 py-3 text-sm font-semibold text-apple-gray-400 transition-colors hover:text-apple-gray-500"
              >
                Back to All Services
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
