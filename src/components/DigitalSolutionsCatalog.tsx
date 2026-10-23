import { useMemo, useState } from 'react';
import { ArrowRight, Search, Sparkles, SlidersHorizontal } from 'lucide-react';
import { digitalSolutions, type DigitalSolution, type DigitalSolutionCategory } from './digitalSolutionsCatalogData';

const ALL = 'All solutions';
const categories: DigitalSolutionCategory[] = [
  'WordPress Plugins & Enhancements',
  'E-commerce & Retail Automation',
  'Secure Forms & Business Automation',
  'CRM, Customer Portals & Membership',
  'Logistics, Booking & Calculators',
  'Website Operations & Digital Intelligence',
];

function inquiryHref(item: DigitalSolution): string {
  const subject = `Digital Solutions enquiry: ${item.title}`;
  const body = `Hello Apex Digital Consultants,\n\nI would like to discuss the ${item.title} solution for my business.\n\nBusiness name:\nWebsite (optional):\nWhat I need:\n`;
  return `mailto:info@apexdigitalconsultants.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function SolutionCard({ item }: { item: DigitalSolution }) {
  return (
    <article className="flex h-full flex-col rounded-[2rem] border border-apple-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-apex-yellow hover:shadow-lg">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em]">
        {item.featured && <span className="rounded-full bg-apex-yellow/20 px-2.5 py-1 text-apple-gray-500">Featured</span>}
        <span className="rounded-full bg-apple-gray-50 px-2.5 py-1 text-apple-gray-400">{item.delivery}</span>
      </div>

      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold leading-snug text-apple-gray-500">{item.title}</h3>
        <Sparkles className="h-5 w-5 shrink-0 text-apex-yellow" aria-hidden="true" />
      </div>

      <p className="text-sm leading-relaxed text-apple-gray-300">{item.description}</p>

      <ul className="mt-5 space-y-2 text-sm text-apple-gray-400" aria-label={`${item.title} features`}>
        {item.features.map(feature => (
          <li key={feature} className="flex gap-2">
            <span aria-hidden="true" className="font-bold text-apex-yellow">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <a
          href={inquiryHref(item)}
          className="apple-button apple-button-primary inline-flex w-full items-center justify-center gap-2 text-sm"
        >
          Request this solution
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export default function DigitalSolutionsCatalog() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL);

  const matches = useMemo(() => digitalSolutions.filter(item => {
    const matchCategory = selectedCategory === ALL || item.category === selectedCategory;
    const haystack = [item.title, item.category, item.description, ...item.features].join(' ').toLowerCase();
    return matchCategory && haystack.includes(search.trim().toLowerCase());
  }), [search, selectedCategory]);

  const featured = digitalSolutions.filter(item => item.featured);

  return (
    <section aria-labelledby="digital-solutions-heading" className="bg-apple-gray-50 py-16 text-apple-gray-500 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-apex-yellow">Built around real business needs</p>
          <h1 id="digital-solutions-heading" className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Digital solutions that make busy teams work better.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-apple-gray-300 sm:text-lg">
            From custom WordPress enhancements and secure forms to CRM workspaces, booking systems, and business automations, Apex builds practical digital tools tailored to how your organisation operates.
          </p>
        </div>

        <div className="mt-14">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-apex-yellow" aria-hidden="true" />
            <h2 className="text-2xl font-bold sm:text-3xl">Featured offerings</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featured.map(item => <SolutionCard key={item.id} item={item} />)}
          </div>
        </div>

        <div className="mt-16" id="solutions-catalogue">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Browse the full catalogue</h2>
              <p className="mt-2 text-apple-gray-300">Filter by category or search for the exact type of solution you need.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-apple-gray-100 bg-white px-3 py-2 text-sm font-medium text-apple-gray-400 shadow-sm">
              <SlidersHorizontal className="h-4 w-4 text-apex-yellow" aria-hidden="true" />
              {digitalSolutions.length} solutions available
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_minmax(16rem,20rem)]">
            <div>
              <label htmlFor="solution-search" className="mb-2 block text-sm font-medium text-apple-gray-400">Search solutions</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-apple-gray-300" aria-hidden="true" />
                <input
                  id="solution-search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  type="search"
                  placeholder="Try product personalization, booking systems, CRM..."
                  className="w-full rounded-2xl border border-apple-gray-200 bg-white py-3 pl-11 pr-4 text-base text-apple-gray-500 placeholder:text-apple-gray-300 focus:border-apex-yellow focus:outline-none focus:ring-4 focus:ring-apex-yellow/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="solution-category" className="mb-2 block text-sm font-medium text-apple-gray-400">Filter by category</label>
              <select
                id="solution-category"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full rounded-2xl border border-apple-gray-200 bg-white px-4 py-3 text-base text-apple-gray-500 focus:border-apex-yellow focus:outline-none focus:ring-4 focus:ring-apex-yellow/20"
              >
                <option>{ALL}</option>
                {categories.map(category => <option key={category}>{category}</option>)}
              </select>
            </div>
          </div>

          <p className="my-5 text-sm text-apple-gray-300" role="status" aria-live="polite">
            Showing {matches.length} of {digitalSolutions.length} solutions
          </p>

          {matches.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {matches.map(item => <SolutionCard key={item.id} item={item} />)}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-apple-gray-100 bg-white p-8 text-center shadow-sm">
              <p className="font-semibold text-apple-gray-500">No matching solutions found.</p>
              <button
                type="button"
                onClick={() => { setSearch(''); setSelectedCategory(ALL); }}
                className="mt-3 text-sm font-semibold text-apple-gray-500 underline decoration-apex-yellow underline-offset-4"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        <div className="mt-16 rounded-[2.5rem] bg-apple-gray-500 px-6 py-10 text-white sm:px-10 lg:px-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-apex-yellow">Need something more specific?</p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Let’s design the right solution for your business.</h2>
            </div>
            <a href="mailto:info@apexdigitalconsultants.com?subject=Custom%20Digital%20Solutions%20Enquiry" className="apple-button apple-button-primary inline-flex items-center justify-center">
              Discuss a custom solution
            </a>
          </div>
          <p className="mt-5 max-w-3xl text-apple-gray-200">
            Tell us how your business operates and what you want to improve. We can review the right plugin, integration, portal, workflow, or custom system for your needs.
          </p>
        </div>
      </div>
    </section>
  );
}

