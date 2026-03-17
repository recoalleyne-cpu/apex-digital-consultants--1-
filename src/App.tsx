import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Layout';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { DigitalSolutions } from './pages/DigitalSolutions';
import { DigitalSolutionDetails } from './pages/DigitalSolutionDetails';
import { DigitalSolutionCheckout } from './pages/DigitalSolutionCheckout';
import { Portfolio } from './pages/Portfolio';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { FAQs } from './pages/FAQs';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { CaseStudies } from './pages/CaseStudies';
import { CaseStudy } from './pages/CaseStudy';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { WebDesign } from './pages/WebDesign';
import { Logos } from './pages/Logos';
import { Websites } from './pages/Websites';
import { AdminMedia } from './pages/AdminMedia';
import { AdminTestimonials } from './pages/AdminTestimonials';
import { AdminBlog } from './pages/AdminBlog';
import { AdminLandingPages } from './pages/AdminLandingPages';
import { AdminCaseStudies } from './pages/AdminCaseStudies';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminPortfolio } from './pages/AdminPortfolio';
import { AdminLogos } from './pages/AdminLogos';
import { AdminPaymentGateways } from './pages/AdminPaymentGateways';
import { AdminShell } from './components/admin/AdminShell';
import { LandingPage } from './pages/LandingPage';
import { applySeo } from './utils/seo';
import { GoogleIntegrationRuntime } from './components/GoogleIntegrationRuntime';

type RouteSeoConfig = {
  title: string;
  description: string;
  image?: string;
};

const DEFAULT_SEO: RouteSeoConfig = {
  title: 'Apex Digital Consultants',
  description:
    'Apex Digital Consultants helps businesses grow with premium web design, branding, marketing, and digital strategy solutions.'
};

const STATIC_ROUTE_SEO: Record<string, RouteSeoConfig> = {
  '/': {
    ...DEFAULT_SEO,
    image: '/black%20logo.png'
  },
  '/about': {
    title: 'About | Apex Digital Consultants',
    description:
      'Learn about Apex Digital Consultants and our approach to strategy, digital execution, and measurable business growth.'
  },
  '/services': {
    title: 'Services | Apex Digital Consultants',
    description:
      'Explore Apex services including web development, branding, Google advertising, and business digitization.'
  },
  '/services/web-design': {
    title: 'Web Design Services | Apex Digital Consultants',
    description:
      'Custom web design and development built for performance, clarity, and conversion.'
  },
  '/services/logos': {
    title: 'Logo and Brand Identity | Apex Digital Consultants',
    description:
      'Professional logo and brand identity design crafted to make your business memorable and credible.'
  },
  '/services/websites': {
    title: 'Website Packages | Apex Digital Consultants',
    description:
      'Compare Apex website packages and choose the right solution for your business goals.'
  },
  '/digital-solutions': {
    title: 'Digital Solutions | Apex Digital Consultants',
    description:
      'Discover Apex digital tools and solutions designed to improve operations, conversions, and growth.'
  },
  '/portfolio': {
    title: 'Portfolio | Apex Digital Consultants',
    description:
      'View real client projects delivered by Apex Digital Consultants across web, branding, and digital strategy.'
  },
  '/pricing': {
    title: 'Pricing | Apex Digital Consultants',
    description:
      'Review Apex pricing options for landing pages, websites, e-commerce builds, and digital services.'
  },
  '/contact': {
    title: 'Contact | Apex Digital Consultants',
    description:
      'Start your next digital project with Apex Digital Consultants. Request a quote or book a consultation.'
  },
  '/faqs': {
    title: 'FAQs | Apex Digital Consultants',
    description:
      'Find answers to common questions about Apex services, timelines, and support.'
  },
  '/blog': {
    title: 'Blog | Apex Digital Consultants',
    description:
      'Read insights on digital strategy, marketing, branding, and business growth from Apex Digital Consultants.'
  },
  '/case-studies': {
    title: 'Case Studies | Apex Digital Consultants',
    description:
      'Explore Apex case studies with real client challenges, execution strategy, and measurable outcomes.'
  },
  '/terms': {
    title: 'Terms and Conditions | Apex Digital Consultants',
    description: 'Review the terms and conditions for using Apex Digital Consultants services and website.'
  },
  '/privacy': {
    title: 'Privacy Policy | Apex Digital Consultants',
    description: 'Read the Apex Digital Consultants privacy policy and data handling practices.'
  }
};

const RESERVED_TOP_LEVEL_SEGMENTS = new Set([
  'about',
  'services',
  'digital-solutions',
  'portfolio',
  'pricing',
  'contact',
  'faqs',
  'blog',
  'case-studies',
  'terms',
  'privacy',
  'admin',
  'checkout',
  'lp'
]);

const normalizePath = (path: string) => {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1);
  }
  return path;
};

const isTopLevelLandingPath = (path: string) => {
  const segments = path.split('/').filter(Boolean);
  if (segments.length !== 1) return false;
  return !RESERVED_TOP_LEVEL_SEGMENTS.has(segments[0]);
};

const RouteSeo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath = normalizePath(pathname);
    const origin = window.location.origin;

    if (normalizedPath.startsWith('/admin')) {
      applySeo({
        title: 'Admin | Apex Digital Consultants',
        description: 'Internal content management interface for Apex Digital Consultants.',
        robots: 'noindex, nofollow',
        canonical: `${origin}${normalizedPath}`
      });
      return;
    }

    const staticSeo = STATIC_ROUTE_SEO[normalizedPath];

    if (staticSeo) {
      applySeo({
        title: staticSeo.title,
        description: staticSeo.description,
        image: staticSeo.image
          ? staticSeo.image.startsWith('http')
            ? staticSeo.image
            : `${origin}${staticSeo.image}`
          : undefined,
        robots: 'index, follow',
        canonical: `${origin}${normalizedPath}`
      });
      return;
    }

    if (/^\/blog\/[^/]+$/.test(normalizedPath)) {
      applySeo({
        title: 'Article | Apex Digital Consultants',
        description:
          'Read this article from Apex Digital Consultants for insights on digital growth and strategy.',
        canonical: `${origin}${normalizedPath}`,
        robots: 'index, follow'
      });
      return;
    }

    if (/^\/digital-solutions\/[^/]+$/.test(normalizedPath)) {
      applySeo({
        title: 'Digital Solution Details | Apex Digital Consultants',
        description:
          'Review detailed funnel-driven product information, implementation value, and purchase options.',
        canonical: `${origin}${normalizedPath}`,
        robots: 'index, follow'
      });
      return;
    }

    if (/^\/checkout\/[^/]+$/.test(normalizedPath)) {
      applySeo({
        title: 'Secure Checkout | Apex Digital Consultants',
        description:
          'Complete your digital solution purchase details through the secure Apex checkout intake flow.',
        canonical: `${origin}${normalizedPath}`,
        robots: 'noindex, nofollow'
      });
      return;
    }

    if (/^\/lp\/[^/]+$/.test(normalizedPath) || isTopLevelLandingPath(normalizedPath)) {
      applySeo({
        title: 'Service Page | Apex Digital Consultants',
        description:
          'Discover a tailored Apex Digital Consultants solution designed for your business goals.',
        canonical: `${origin}${normalizedPath}`,
        robots: 'index, follow'
      });
      return;
    }

    applySeo({
      title: DEFAULT_SEO.title,
      description: DEFAULT_SEO.description,
      canonical: `${origin}${normalizedPath}`,
      robots: 'index, follow'
    });
  }, [pathname]);

  return null;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppFrame = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');
  const hasTransparentHero = pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute ? <Header /> : null}
      <main
        className={
          !isAdminRoute
            ? hasTransparentHero
              ? 'flex-grow'
              : 'flex-grow pt-20'
            : 'flex-grow'
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/digital-solutions" element={<DigitalSolutions />} />
          <Route path="/digital-solutions/:productId" element={<DigitalSolutionDetails />} />
          <Route path="/checkout/:productId" element={<DigitalSolutionCheckout />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<CaseStudy />} />
          <Route path="/lp/:slug" element={<LandingPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/:slug" element={<LandingPage />} />
          <Route path="/services/web-design" element={<WebDesign />} />
          <Route path="/services/logos" element={<Logos />} />
          <Route path="/services/websites" element={<Websites />} />

          <Route path="/admin" element={<AdminShell />}>
            <Route index element={<AdminDashboard />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="landing-pages" element={<AdminLandingPages />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="logos" element={<AdminLogos />} />
            <Route path="payment-gateways" element={<AdminPaymentGateways />} />
            <Route path="case-studies" element={<AdminCaseStudies />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute ? <Footer /> : null}
      {!isAdminRoute ? <ChatWidget /> : null}
    </div>
  );
};

function App() {
  return (
    <Router>
      <RouteSeo />
      <GoogleIntegrationRuntime />
      <ScrollToTop />
      <AppFrame />
    </Router>
  );
}

export default App;
