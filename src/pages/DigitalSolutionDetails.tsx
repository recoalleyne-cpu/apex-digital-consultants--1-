import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { BarChart3, CheckCircle2, Clock3, ShieldCheck, ShoppingCart, Sparkles } from 'lucide-react';
import { DIGITAL_SOLUTIONS } from '../constants';
import { PageHeader } from '../components/PageHeader';

type FunnelStage = {
  stage: string;
  title: string;
  description: string;
};

const STAGES_BY_CATEGORY: Record<string, FunnelStage[]> = {
  'Ecommerce Tools': [
    {
      stage: 'Stage 1',
      title: 'Capture High-Intent Visitors',
      description:
        'Improve discoverability and merchandising so buyers see the right products faster.'
    },
    {
      stage: 'Stage 2',
      title: 'Increase Cart Confidence',
      description:
        'Give shoppers clear product clarity and trust signals to reduce purchase hesitation.'
    },
    {
      stage: 'Stage 3',
      title: 'Lift Conversion & Order Value',
      description:
        'Use smart conversion mechanics to drive more completed checkouts and higher spend.'
    }
  ],
  'Marketing Tools': [
    {
      stage: 'Stage 1',
      title: 'Acquire Qualified Traffic',
      description:
        'Turn passive visitors into targeted prospects through optimized capture mechanics.'
    },
    {
      stage: 'Stage 2',
      title: 'Nurture Buyer Interest',
      description:
        'Deliver segmented messaging and content paths that move leads toward purchase intent.'
    },
    {
      stage: 'Stage 3',
      title: 'Convert Leads to Revenue',
      description:
        'Automate and optimize final conversion touchpoints for measurable pipeline growth.'
    }
  ],
  'Business Tools': [
    {
      stage: 'Stage 1',
      title: 'Streamline Operations',
      description:
        'Replace manual bottlenecks with structured digital workflows and accurate data capture.'
    },
    {
      stage: 'Stage 2',
      title: 'Improve Decision Speed',
      description:
        'Centralize insights and process controls so teams can execute with confidence.'
    },
    {
      stage: 'Stage 3',
      title: 'Scale Profitably',
      description:
        'Build repeatable systems that support growth without proportional increases in overhead.'
    }
  ]
};

const DEFAULT_STAGES: FunnelStage[] = [
  {
    stage: 'Stage 1',
    title: 'Attract',
    description: 'Capture the right audience with strategic digital touchpoints.'
  },
  {
    stage: 'Stage 2',
    title: 'Engage',
    description: 'Deliver a clear product journey with measurable value communication.'
  },
  {
    stage: 'Stage 3',
    title: 'Convert',
    description: 'Drive purchase actions through high-trust, low-friction user experience.'
  }
];

const IDEAL_USE_CASES_BY_CATEGORY: Record<string, string[]> = {
  'Ecommerce Tools': [
    'Growing WooCommerce stores focused on conversion rate and AOV',
    'Product catalogs that need clearer buyer decision support',
    'Teams optimizing checkout efficiency and repeat revenue'
  ],
  'Marketing Tools': [
    'Brands scaling lead generation and email capture quality',
    'Campaign teams running A/B testing and audience segmentation',
    'Businesses strengthening top-of-funnel to bottom-of-funnel conversion'
  ],
  'Business Tools': [
    'Service businesses needing faster quote-to-close workflows',
    'Operations teams standardizing booking and CRM handoffs',
    'Companies reducing admin overhead with automation-ready tooling'
  ]
};

export const DigitalSolutionDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = DIGITAL_SOLUTIONS.find((item) => item.id === productId);

  if (!product) {
    return (
      <div className="pt-20 pb-24">
        <div className="container-wide max-w-3xl">
          <div className="rounded-[2rem] border border-apple-gray-100 bg-white p-8 sm:p-10 text-center">
            <h1 className="heading-lg mb-4">Solution Not Found</h1>
            <p className="text-apple-gray-300 mb-8">
              The requested solution details page is unavailable. Please return to the solutions catalog.
            </p>
            <Link to="/digital-solutions" className="apple-button apple-button-primary">
              Back to Digital Solutions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const funnelStages = STAGES_BY_CATEGORY[product.category] || DEFAULT_STAGES;
  const useCases = IDEAL_USE_CASES_BY_CATEGORY[product.category] || [
    'Businesses seeking cleaner digital workflows and stronger conversion outcomes',
    'Teams that need implementation-ready tools with clear business value',
    'Organizations focused on measurable operational and revenue lift'
  ];

  return (
    <div className="pt-12">
      <PageHeader
        title={product.name}
        subtitle={`${product.category} - Conversion Funnel Solution`}
        description={product.description}
      />

      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-8 lg:gap-12 items-start">
            <div className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-apex-yellow mb-5">
                Sales Funnel Structure
              </p>
              <h2 className="heading-lg mb-6">How This Solution Converts Into Revenue</h2>
              <div className="space-y-6">
                {funnelStages.map((stage) => (
                  <div key={stage.title} className="rounded-2xl border border-apple-gray-100 p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-apex-yellow mb-2">
                      {stage.stage}
                    </p>
                    <h3 className="text-xl font-semibold mb-2">{stage.title}</h3>
                    <p className="text-apple-gray-300 leading-7">{stage.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 sm:p-10 lg:sticky lg:top-28">
              <span className="inline-flex items-center gap-2 rounded-full bg-apex-yellow/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-apex-yellow mb-5">
                <Sparkles size={14} />
                Funnel Ready
              </span>
              <h3 className="text-3xl font-bold text-apple-gray-500 mb-3">{product.price}</h3>
              <p className="text-sm text-apple-gray-300 mb-8">
                One-time implementation package with conversion-focused delivery and onboarding guidance.
              </p>
              <div className="space-y-3">
                <Link
                  to={`/checkout/${product.id}`}
                  className="apple-button apple-button-primary w-full inline-flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Purchase & Checkout
                </Link>
                <Link
                  to="/contact"
                  className="apple-button apple-button-secondary w-full inline-flex items-center justify-center"
                >
                  Talk to a Specialist
                </Link>
              </div>
              <div className="mt-8 space-y-3 text-sm text-apple-gray-300">
                <p className="flex items-start gap-2">
                  <ShieldCheck size={16} className="text-apex-yellow mt-0.5 shrink-0" />
                  Secure checkout intake and implementation handoff workflow.
                </p>
                <p className="flex items-start gap-2">
                  <Clock3 size={16} className="text-apex-yellow mt-0.5 shrink-0" />
                  Typical onboarding review within one business day.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-8 sm:p-10">
              <h2 className="text-3xl font-semibold mb-6">What You Get</h2>
              <ul className="space-y-4">
                {(product.features || []).map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-apple-gray-300">
                    <CheckCircle2 size={18} className="text-apex-yellow mt-1 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2.5rem] border border-apple-gray-100 bg-apple-gray-50 p-8 sm:p-10">
              <h2 className="text-3xl font-semibold mb-6">Ideal For</h2>
              <ul className="space-y-4">
                {useCases.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-apple-gray-300">
                    <BarChart3 size={18} className="text-apex-yellow mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 rounded-[2.5rem] border border-apple-gray-100 bg-apple-gray-500 text-white p-10 sm:p-14 text-center">
            <h2 className="heading-lg mb-6 text-white">Ready to Launch This Funnel Asset?</h2>
            <p className="max-w-2xl mx-auto text-apple-gray-200 mb-8">
              Move from product interest to implementation with a structured checkout workflow and conversion-first onboarding.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to={`/checkout/${product.id}`} className="apple-button apple-button-primary">
                Start Secure Checkout
              </Link>
              <Link to="/digital-solutions" className="apple-button apple-button-secondary">
                Browse Other Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
