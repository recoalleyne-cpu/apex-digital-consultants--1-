import React, { useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  CreditCard,
  FileText,
  FolderKanban,
  ImageIcon,
  LayoutDashboard,
  Layers,
  Menu,
  MessageSquareQuote,
  Newspaper,
  Rocket,
  Settings2,
  X
} from 'lucide-react';
import {
  logoutAdmin
} from '../../utils/adminApi';

type AdminNavItem = {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Media', path: '/admin/media', icon: ImageIcon },
  { label: 'Blog', path: '/admin/blog', icon: Newspaper },
  { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
  { label: 'Landing Pages', path: '/admin/landing-pages', icon: Rocket },
  { label: 'Portfolio Assets', path: '/admin/portfolio', icon: FolderKanban },
  { label: 'Logos & Brand', path: '/admin/logos', icon: Layers },
  { label: 'Payment Gateways', path: '/admin/payment-gateways', icon: CreditCard },
  { label: 'Integrations', path: '/admin/google-integrations', icon: Settings2 },
  { label: 'Case Studies', path: '/admin/case-studies', icon: FileText }
];

const getPageMeta = (pathname: string) => {
  if (pathname === '/admin') {
    return {
      title: 'Admin Dashboard',
      description: 'Navigate CMS modules, organize assets, and manage published content.'
    };
  }
  if (pathname.startsWith('/admin/media')) {
    return {
      title: 'Media Library',
      description: 'Upload and organize media assets used across the website.'
    };
  }
  if (pathname.startsWith('/admin/blog')) {
    return {
      title: 'Blog Manager',
      description: 'Create and publish editorial content with SEO-ready fields.'
    };
  }
  if (pathname.startsWith('/admin/testimonials')) {
    return {
      title: 'Testimonials Manager',
      description: 'Manage trust content and Google review imports safely.'
    };
  }
  if (pathname.startsWith('/admin/landing-pages')) {
    return {
      title: 'Landing Page Manager',
      description: 'Generate and manage SEO landing pages with draft controls.'
    };
  }
  if (pathname.startsWith('/admin/portfolio')) {
    return {
      title: 'Portfolio Assets',
      description: 'Upload and curate portfolio visuals using locked media presets.'
    };
  }
  if (pathname.startsWith('/admin/logos')) {
    return {
      title: 'Logos & Brand Assets',
      description: 'Manage logo assets and keep placement mappings consistent.'
    };
  }
  if (pathname.startsWith('/admin/google-integrations')) {
    return {
      title: 'Integrations Settings',
      description:
        'Manage Google analytics/tracking setup and email marketing integration drafts in one workspace.'
    };
  }
  if (pathname.startsWith('/admin/payment-gateways')) {
    return {
      title: 'Payment Gateway Setup',
      description:
        'Configure provider credentials and environment templates for secure card processing.'
    };
  }
  if (pathname.startsWith('/admin/case-studies')) {
    return {
      title: 'Case Studies Manager',
      description: 'Publish long-form project proof pages for conversion support.'
    };
  }

  return {
    title: 'Admin',
    description: 'Internal content management workspace.'
  };
};

const NavItems = ({ onNavigate }: { onNavigate?: () => void }) => {
  return (
    <nav className="space-y-1">
      {ADMIN_NAV_ITEMS.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition-all',
                isActive
                  ? 'bg-white text-apple-gray-500 shadow-sm ring-1 ring-apple-gray-100'
                  : 'text-apple-gray-300 hover:bg-white/70 hover:text-apple-gray-500'
              ].join(' ')
            }
          >
            <Icon size={16} className="shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export const AdminShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pageMeta = useMemo(() => getPageMeta(location.pathname), [location.pathname]);

  const handleLock = async () => {
    await logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-apple-gray-50 text-apple-gray-500">
      <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:flex lg:min-h-screen lg:flex-col lg:border-r lg:border-apple-gray-100 lg:bg-white/80 lg:backdrop-blur">
          <div className="border-b border-apple-gray-100 px-6 py-6">
            <Link to="/admin" className="block">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-apple-gray-300">
                Apex CMS
              </p>
              <p className="mt-2 text-lg font-semibold tracking-tight text-apple-gray-500">
                Content Dashboard
              </p>
            </Link>
          </div>

          <div className="flex-1 px-4 py-5">
            <NavItems />
          </div>

          <div className="border-t border-apple-gray-100 px-4 py-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
            >
              <span>Open Site</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-apple-gray-100 bg-white/90 backdrop-blur">
            <div className="px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-apple-gray-100 bg-white text-apple-gray-400 lg:hidden"
                    onClick={() => setMobileMenuOpen(true)}
                    aria-label="Open admin navigation"
                  >
                    <Menu size={18} />
                  </button>

                  <div>
                    <h1 className="text-lg font-semibold tracking-tight text-apple-gray-500 sm:text-2xl">
                      {pageMeta.title}
                    </h1>
                    <p className="mt-1 text-sm text-apple-gray-300">{pageMeta.description}</p>
                  </div>
                </div>

                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                    >
                      <span>View Site</span>
                      <ArrowUpRight size={14} />
                    </Link>
                    <button
                      type="button"
                      onClick={handleLock}
                      className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                    >
                      Lock
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close admin navigation backdrop"
          />

          <aside className="relative h-full w-[85%] max-w-[320px] border-r border-apple-gray-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-apple-gray-100 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-apple-gray-300">
                  Apex CMS
                </p>
                <p className="mt-1 text-base font-semibold text-apple-gray-500">Navigation</p>
              </div>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-apple-gray-100 text-apple-gray-400"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close admin navigation"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-4 py-4">
              <NavItems onNavigate={() => setMobileMenuOpen(false)} />
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
};
