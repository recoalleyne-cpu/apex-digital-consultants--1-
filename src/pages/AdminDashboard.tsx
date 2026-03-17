import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CreditCard,
  FileText,
  FolderKanban,
  ImageIcon,
  Layers,
  MessageSquareQuote,
  Newspaper,
  Rocket,
  Settings2
} from 'lucide-react';

type AdminModuleCard = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  chip: string;
};

const MODULE_CARDS: AdminModuleCard[] = [
  {
    title: 'Media Library',
    description: 'Upload single or bulk assets and map them to site placements.',
    href: '/admin/media',
    icon: ImageIcon,
    chip: 'Core'
  },
  {
    title: 'Blog Manager',
    description: 'Create editorial content with publication and SEO controls.',
    href: '/admin/blog',
    icon: Newspaper,
    chip: 'Content'
  },
  {
    title: 'Testimonials',
    description: 'Manage manual testimonials and Google review imports safely.',
    href: '/admin/testimonials',
    icon: MessageSquareQuote,
    chip: 'Trust'
  },
  {
    title: 'Landing Pages',
    description: 'Run AI-assisted and bulk SEO page generation workflows.',
    href: '/admin/landing-pages',
    icon: Rocket,
    chip: 'SEO'
  },
  {
    title: 'Portfolio Assets',
    description: 'Upload portfolio media with locked category and placement.',
    href: '/admin/portfolio',
    icon: FolderKanban,
    chip: 'Showcase'
  },
  {
    title: 'Logos & Brand',
    description: 'Manage logo assets for the public logos page and brand use.',
    href: '/admin/logos',
    icon: Layers,
    chip: 'Brand'
  },
  {
    title: 'Payment Gateways',
    description: 'Set up card gateway credentials and integration templates.',
    href: '/admin/payment-gateways',
    icon: CreditCard,
    chip: 'Payments'
  },
  {
    title: 'Google Integrations',
    description: 'Configure Analytics, GTM, Ads, Search Console, reCAPTCHA, and Maps.',
    href: '/admin/google-integrations',
    icon: Settings2,
    chip: 'Tracking'
  },
  {
    title: 'Case Studies',
    description: 'Publish long-form project proof pages and outcomes.',
    href: '/admin/case-studies',
    icon: FileText,
    chip: 'Proof'
  }
];

const QUICK_ACTIONS = [
  {
    label: 'Upload Portfolio Batch',
    href: '/admin/portfolio'
  },
  {
    label: 'Upload Logo Batch',
    href: '/admin/logos'
  },
  {
    label: 'Create Blog Draft',
    href: '/admin/blog'
  },
  {
    label: 'Generate Landing Page',
    href: '/admin/landing-pages'
  },
  {
    label: 'Configure Card Gateway',
    href: '/admin/payment-gateways'
  },
  {
    label: 'Review Google Setup',
    href: '/admin/google-integrations'
  }
];

export const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-apple-gray-100 bg-white p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-apple-gray-500">
          Welcome to Apex CMS
        </h2>
        <p className="mt-3 max-w-3xl text-sm sm:text-base leading-7 text-apple-gray-300">
          Use this dashboard to manage media uploads, publish content, and keep dynamic website sections up to date
          through the existing Postgres + Blob architecture.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {MODULE_CARDS.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.href}
              to={card.href}
              className="group rounded-3xl border border-apple-gray-100 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(17,24,39,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-apple-gray-50 text-apple-gray-400">
                  <Icon size={18} />
                </div>
                <span className="rounded-full border border-apple-gray-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-apple-gray-300">
                  {card.chip}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-apple-gray-500">{card.title}</h3>
              <p className="mt-2 text-sm leading-7 text-apple-gray-300">{card.description}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-apple-gray-400 transition-colors group-hover:text-apex-yellow">
                <span>Open Module</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </section>

      <section className="rounded-3xl border border-apple-gray-100 bg-white p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-apple-gray-500">Quick Actions</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              to={action.href}
              className="inline-flex items-center justify-between rounded-2xl border border-apple-gray-100 px-4 py-3 text-sm font-medium text-apple-gray-400 transition-colors hover:border-apex-yellow/40 hover:text-apple-gray-500"
            >
              <span>{action.label}</span>
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
