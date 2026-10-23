import React, { useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
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
import { PortfolioLogos } from './pages/PortfolioLogos';
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
import { ServiceFunnel } from './pages/ServiceFunnel';
import { AdminMedia } from './pages/AdminMedia';
import { AdminTestimonials } from './pages/AdminTestimonials';
import { AdminBlog } from './pages/AdminBlog';
import { AdminLandingPages } from './pages/AdminLandingPages';
import { AdminCaseStudies } from './pages/AdminCaseStudies';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminPortfolio } from './pages/AdminPortfolio';
import { AdminLogos } from './pages/AdminLogos';
import { AdminPaymentGateways } from './pages/AdminPaymentGateways';
import { AdminGoogleIntegrations } from './pages/AdminGoogleIntegrations';
import { AdminShell } from './components/admin/AdminShell';
import { AdminRouteGuard } from './components/admin/AdminRouteGuard';
import { AdminLogin } from './pages/AdminLogin';
import { LandingPage } from './pages/LandingPage';
import { NotFound } from './pages/NotFound';
import { GoogleIntegrationRuntime } from './components/GoogleIntegrationRuntime';
import { NewsletterSignupModal } from './components/NewsletterSignupModal';
import { FAQS } from './constants';
import {
  applySeo,
  clearManagedJsonLd,
  DEFAULT_SEO_DESCRIPTION,
  resolveSiteUrl,
  SITE_NAME,
  toAbsoluteUrl,
  upsertJsonLd
} from './utils/seo';
import { SeoServiceLanding, getSeoLandingFaqs } from './pages/SeoServiceLanding';

type RouteSeoConfig = {
  title: string;
  description: string;
  image?: string;
  keywords?: string[];
  type?: 'website' | 'article';
  robots?: string;
};

const TARGET_KEYWORDS = [
  'website development Barbados',
  'website development Caribbean',
  'web design Barbados',
  'website design Barbados',
  'Barbados web developer',
  'Caribbean web development',
  'Caribbean web design',
  'ecommerce website development Barbados',
  'custom website development Barbados',
  'responsive web design Caribbean',
  'SEO web design Barbados',
  'professional website services Barbados'
];

const SERVICES_FAQ_SCHEMA_ENTRIES = [
  {
    question: 'Do you provide custom website development in Barbados?',
    answer:
      'Yes. Apex builds custom business websites, ecommerce websites, and redesign solutions for businesses in Barbados.'
  },
  {
    question: 'Can Apex support clients across the Caribbean?',
    answer:
      'Yes. Apex supports businesses across the Caribbean with structured delivery, remote collaboration, and launch support.'
  },
  {
    question: 'Do your website services include SEO-friendly setup?',
    answer:
      'Yes. Apex includes SEO-friendly structure, metadata foundations, responsive UX, and internal linking guidance in website projects.'
  }
];

const DEFAULT_SEO: RouteSeoConfig = {
  title: 'Website Development Barbados & Caribbean | Apex Digital Consultants',
  description: DEFAULT_SEO_DESCRIPTION,
  image: '/black%20logo.png',
  keywords: TARGET_KEYWORDS
};

const STATIC_ROUTE_SEO: Record<string, RouteSeoConfig> = {
  '/': {
    ...DEFAULT_SEO
  },
  '/about': {
    title: 'About Our Barbados Web Development Team | Apex Digital Consultants',
    description:
      'Meet the Apex team delivering website development and web design services for businesses in Barbados and across the Caribbean.',
    keywords: ['Barbados web developer', 'website development Barbados', 'Caribbean web development']
  },
  '/services': {
    title: 'Website Development & Digital Services Barbados | Apex Digital Consultants',
    description:
      'Explore website development, web design, ecommerce, branding, and growth-focused digital services for Barbados and Caribbean businesses.',
    keywords: ['professional website services Barbados', 'website design Barbados', 'Caribbean web design']
  },
  '/services/web-development': {
    title: 'Website Development Service Barbados | Apex Digital Consultants',
    description:
      'Conversion-focused website development service for Barbados and Caribbean businesses that need better UX, lead generation, and long-term growth.',
    keywords: ['custom website development Barbados', 'website development Barbados']
  },
  '/services/marketing-management': {
    title: 'Digital Marketing Management Service | Apex Digital Consultants',
    description:
      'Structured digital marketing management for Barbados and Caribbean businesses focused on campaign consistency, lead quality, and growth performance.',
    keywords: ['digital marketing Barbados', 'campaign strategy Caribbean']
  },
  '/services/google-advertising': {
    title: 'Google Advertising Service Barbados | Apex Digital Consultants',
    description:
      'Google advertising service built for qualified traffic, conversion tracking, and ROI-driven optimization for Barbados and Caribbean businesses.',
    keywords: ['Google ads Barbados', 'conversion tracking Caribbean']
  },
  '/services/graphic-design': {
    title: 'Graphic Design & Brand Identity Service | Apex Digital Consultants',
    description:
      'Brand identity and graphic design service that improves trust, recognition, and conversion performance.',
    keywords: ['brand design Barbados', 'graphic design Caribbean']
  },
  '/services/photography-videography': {
    title: 'Photography & Videography Service | Apex Digital Consultants',
    description:
      'Strategic visual content service designed to improve engagement and conversion across your digital funnel.',
    keywords: ['commercial content Barbados', 'brand visuals Caribbean']
  },
  '/services/business-digitization': {
    title: 'Business Digitization Service | Apex Digital Consultants',
    description:
      'Business digitization service that reduces manual bottlenecks and improves operational speed for growing businesses.',
    keywords: ['business automation Barbados', 'digital operations Caribbean']
  },
  '/services/web-design': {
    title: 'Web Design Barbados | Apex Digital Consultants',
    description:
      'Custom website design in Barbados with responsive UX, SEO-friendly structure, and conversion-focused page strategy.',
    keywords: ['web design Barbados', 'website design Barbados', 'SEO web design Barbados']
  },
  '/services/logos': {
    title: 'Logo & Brand Identity Services | Apex Digital Consultants',
    description:
      'Professional logo and brand identity services to help businesses stand out with clear visual positioning.',
    keywords: ['logo design Barbados', 'brand identity Caribbean']
  },
  '/services/websites': {
    title: 'Custom Website Development Barbados | Apex Digital Consultants',
    description:
      'Website development services for Barbados businesses, including business sites, ecommerce builds, responsive design, and SEO-ready structure.',
    keywords: ['custom website development Barbados', 'website development Barbados', 'ecommerce website development Barbados']
  },
  '/website-development-barbados': {
    title: 'Website Development Barbados | Apex Digital Consultants',
    description:
      'Custom website development Barbados businesses can rely on for stronger visibility, lead generation, and long-term digital growth.',
    keywords: ['website development Barbados', 'custom website development Barbados']
  },
  '/website-development-caribbean': {
    title: 'Website Development Caribbean | Apex Digital Consultants',
    description:
      'Caribbean web development services for businesses that need scalable, high-converting websites across regional markets.',
    keywords: ['website development Caribbean', 'Caribbean web development']
  },
  '/web-design-barbados': {
    title: 'Web Design Barbados | Apex Digital Consultants',
    description:
      'Conversion-focused web design Barbados companies use to improve user experience, trust, and sales readiness.',
    keywords: ['web design Barbados', 'website design Barbados', 'responsive web design Caribbean']
  },
  '/ecommerce-website-development-barbados': {
    title: 'Ecommerce Website Development Barbados | Apex Digital Consultants',
    description:
      'Ecommerce website development for Barbados businesses that need secure checkout, scalable product pages, and stronger online sales.',
    keywords: ['ecommerce website development Barbados', 'website development Barbados']
  },
  '/seo-friendly-websites-barbados': {
    title: 'SEO-Friendly Websites Barbados | Apex Digital Consultants',
    description:
      'SEO-friendly website development and design in Barbados built for search visibility, technical quality, and conversion performance.',
    keywords: ['SEO web design Barbados', 'professional website services Barbados']
  },
  '/digital-solutions': {
    title: 'Digital Solutions | Apex Digital Consultants',
    description:
      'Discover practical digital tools and automation solutions designed to improve efficiency, visibility, and growth.',
    keywords: ['digital solutions Barbados', 'automation tools Caribbean']
  },
  '/portfolio': {
    title: 'Website Development Portfolio Barbados | Apex Digital Consultants',
    description:
      'Review live website development and design projects delivered by Apex for businesses in Barbados and the Caribbean.',
    keywords: ['website development Barbados', 'Barbados web developer', 'Caribbean web design']
  },
  '/portfolio/logos': {
    title: 'Logo Portfolio Barbados | Apex Digital Consultants',
    description:
      'Browse logo and brand identity portfolio work delivered for businesses in Barbados and across the Caribbean.',
    keywords: ['logo portfolio Barbados', 'brand identity portfolio Caribbean', 'logo design Barbados']
  },
  '/pricing': {
    title: 'Website Development Pricing Barbados | Apex Digital Consultants',
    description:
      'Compare website development, ecommerce, and digital service packages designed for Barbados and Caribbean business growth.',
    keywords: ['website development Barbados', 'professional website services Barbados']
  },
  '/contact': {
    title: 'Contact a Barbados Web Developer | Apex Digital Consultants',
    description:
      'Talk with Apex about custom website development, web design, and digital growth services for Barbados and Caribbean businesses.',
    keywords: ['Barbados web developer', 'website development Barbados']
  },
  '/faqs': {
    title: 'Website Development FAQs Barbados | Apex Digital Consultants',
    description:
      'Get answers about timelines, pricing, SEO-friendly web design, and website development support in Barbados and the Caribbean.',
    keywords: ['website development Barbados', 'professional website services Barbados']
  },
  '/blog': {
    title: 'Website Growth Insights | Apex Digital Consultants',
    description:
      'Read practical insights on website development, web design, SEO, and conversion strategy for Caribbean businesses.',
    keywords: ['Caribbean web development', 'SEO web design Barbados']
  },
  '/case-studies': {
    title: 'Website Case Studies Barbados & Caribbean | Apex Digital Consultants',
    description:
      'Explore case studies showing how Apex improves digital performance for clients through design, development, and strategy.',
    keywords: ['website development Barbados', 'Caribbean web design']
  },
  '/terms': {
    title: 'Terms and Conditions | Apex Digital Consultants',
    description: 'Review the terms and conditions for Apex Digital Consultants services and website.'
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
  'website-development-barbados',
  'website-development-caribbean',
  'web-design-barbados',
  'ecommerce-website-development-barbados',
  'seo-friendly-websites-barbados',
  'admin',
  'checkout',
  'lp'
]);

const BREADCRUMB_LABEL_OVERRIDES: Record<string, string> = {
  faqs: 'FAQs',
  lp: 'Landing Pages',
  seo: 'SEO',
  web: 'Web'
};

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

const toReadableSegmentLabel = (segment: string) => {
  if (BREADCRUMB_LABEL_OVERRIDES[segment]) {
    return BREADCRUMB_LABEL_OVERRIDES[segment];
  }

  return segment
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const buildBreadcrumbSchema = (origin: string, normalizedPath: string) => {
  const segments = normalizedPath.split('/').filter(Boolean);
  const items: Array<{ '@type': 'ListItem'; position: number; name: string; item: string }> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${origin}/`
    }
  ];

  let accumulatedPath = '';
  segments.forEach((segment, index) => {
    accumulatedPath += `/${segment}`;
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name: toReadableSegmentLabel(segment),
      item: `${origin}${accumulatedPath}`
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
  };
};

const buildOrganizationSchema = (origin: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${origin}/#organization`,
  name: SITE_NAME,
  url: origin,
  logo: toAbsoluteUrl('/black%20logo.png'),
  email: 'info@apexdigitalconsultants.com',
  sameAs: [
    'https://www.facebook.com/ApexDigitalConsultants',
    'https://www.instagram.com/apexdigitalconsultants/',
    'https://www.linkedin.com/company/apex-digital-consultants/'
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'info@apexdigitalconsultants.com',
      telephone: '+1-246-841-6543',
      availableLanguage: ['en']
    }
  ],
  areaServed: ['Barbados', 'Caribbean']
});

const buildWebsiteSchema = (origin: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${origin}/#website`,
  url: origin,
  name: SITE_NAME,
  publisher: {
    '@id': `${origin}/#organization`
  },
  inLanguage: 'en'
});

const buildLocalBusinessSchema = (origin: string) => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${origin}/#local-business`,
  name: SITE_NAME,
  image: toAbsoluteUrl('/black%20logo.png'),
  url: origin,
  telephone: '+1-246-841-6543',
  email: 'info@apexdigitalconsultants.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bridgetown',
    addressCountry: 'BB'
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00'
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'info@apexdigitalconsultants.com',
      telephone: '+1-246-841-6543',
      availableLanguage: ['en']
    }
  ],
  areaServed: ['Barbados', 'Caribbean']
});

const buildContactPageSchema = (origin: string) => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${origin}/contact#contact-page`,
  name: 'Contact Apex Digital Consultants',
  url: `${origin}/contact`,
  about: {
    '@id': `${origin}/#organization`
  },
  description:
    'Contact Apex Digital Consultants for website development and web design services in Barbados and across the Caribbean.'
});

const buildProfessionalServiceSchema = (
  origin: string,
  path: string,
  name: string,
  description: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${origin}${path}#service`,
  name,
  description,
  url: `${origin}${path}`,
  provider: {
    '@id': `${origin}/#organization`
  },
  areaServed: ['Barbados', 'Caribbean'],
  serviceType: [
    'Website Development',
    'Web Design',
    'Ecommerce Website Development',
    'SEO-Friendly Website Builds'
  ]
});

const buildServiceSchema = (origin: string, path: string, name: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${origin}${path}#service-offer`,
  name,
  description,
  serviceType: 'Website Development and Web Design',
  provider: {
    '@id': `${origin}/#organization`
  },
  areaServed: ['Barbados', 'Caribbean']
});

const buildFaqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

const RouteSeo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath = normalizePath(pathname);
    const origin = resolveSiteUrl();
    const canonical = `${origin}${normalizedPath}`;

    clearManagedJsonLd();

    if (normalizedPath.startsWith('/admin')) {
      applySeo({
        title: 'Admin | Apex Digital Consultants',
        description: 'Internal content management interface for Apex Digital Consultants.',
        robots: 'noindex, nofollow',
        canonical
      });
      return;
    }

    let seoToApply: RouteSeoConfig = DEFAULT_SEO;

    const staticSeo = STATIC_ROUTE_SEO[normalizedPath];
    if (staticSeo) {
      seoToApply = staticSeo;
    } else if (/^\/blog\/[^/]+$/.test(normalizedPath)) {
      seoToApply = {
        title: 'Website Strategy Article | Apex Digital Consultants',
        description:
          'Read this article from Apex for website development, web design, and digital growth insight relevant to Barbados and Caribbean businesses.',
        keywords: ['website development Caribbean', 'SEO web design Barbados'],
        type: 'article'
      };
    } else if (/^\/digital-solutions\/[^/]+$/.test(normalizedPath)) {
      seoToApply = {
        title: 'Digital Solution Details | Apex Digital Consultants',
        description:
          'Review product details, use cases, and implementation value for this Apex digital solution.',
        keywords: ['digital tools Barbados', 'business automation Caribbean']
      };
    } else if (/^\/checkout\/[^/]+$/.test(normalizedPath)) {
      seoToApply = {
        title: 'Secure Checkout | Apex Digital Consultants',
        description:
          'Complete your digital solution purchase details through the secure Apex checkout intake flow.',
        robots: 'noindex, nofollow',
        keywords: ['secure checkout']
      };
    } else if (/^\/lp\/[^/]+$/.test(normalizedPath) || isTopLevelLandingPath(normalizedPath)) {
      seoToApply = {
        title: 'Website Development Service Page | Apex Digital Consultants',
        description:
          'Discover a tailored Apex solution for website development, design, and digital growth.',
        keywords: TARGET_KEYWORDS
      };
    }

    applySeo({
      title: seoToApply.title,
      description: seoToApply.description,
      image: seoToApply.image ? toAbsoluteUrl(seoToApply.image) || undefined : undefined,
      canonical,
      robots: seoToApply.robots || 'index, follow',
      keywords: seoToApply.keywords || TARGET_KEYWORDS,
      type: seoToApply.type || 'website'
    });

    upsertJsonLd('organization', buildOrganizationSchema(origin));
    upsertJsonLd('website', buildWebsiteSchema(origin));
    upsertJsonLd('breadcrumbs', buildBreadcrumbSchema(origin, normalizedPath));

    if (normalizedPath === '/' || normalizedPath === '/contact') {
      upsertJsonLd('local-business', buildLocalBusinessSchema(origin));
    }

    if (normalizedPath === '/') {
      upsertJsonLd(
        'homepage-service',
        buildProfessionalServiceSchema(
          origin,
          '/',
          'Website Development Barbados & Caribbean',
          'Custom website development, web design, ecommerce builds, and SEO-friendly digital experiences for businesses in Barbados and across the Caribbean.'
        )
      );
      upsertJsonLd(
        'homepage-service-offer',
        buildServiceSchema(
          origin,
          '/',
          'Website Development and Web Design Services',
          'Custom website development and web design services for businesses in Barbados and across the Caribbean.'
        )
      );
      upsertJsonLd('homepage-faq', buildFaqSchema(FAQS));
    }

    if (normalizedPath === '/faqs') {
      upsertJsonLd('faq', buildFaqSchema(FAQS));
    }
    if (normalizedPath === '/services') {
      upsertJsonLd('services-faq', buildFaqSchema(SERVICES_FAQ_SCHEMA_ENTRIES));
    }

    const seoLandingFaqs = getSeoLandingFaqs(normalizedPath);
    if (seoLandingFaqs.length > 0) {
      upsertJsonLd('seo-landing-faq', buildFaqSchema(seoLandingFaqs));
    }

    if (
      normalizedPath === '/services/web-development' ||
      normalizedPath === '/services/marketing-management' ||
      normalizedPath === '/services/google-advertising' ||
      normalizedPath === '/services/graphic-design' ||
      normalizedPath === '/services/photography-videography' ||
      normalizedPath === '/services/business-digitization' ||
      normalizedPath === '/services/websites' ||
      normalizedPath === '/services/web-design' ||
      normalizedPath === '/services' ||
      normalizedPath === '/website-development-barbados' ||
      normalizedPath === '/website-development-caribbean' ||
      normalizedPath === '/web-design-barbados' ||
      normalizedPath === '/ecommerce-website-development-barbados' ||
      normalizedPath === '/seo-friendly-websites-barbados'
    ) {
      upsertJsonLd(
        'service-page',
        buildProfessionalServiceSchema(
          origin,
          normalizedPath,
          seoToApply.title,
          seoToApply.description
        )
      );
      upsertJsonLd(
        'service-offer-page',
        buildServiceSchema(origin, normalizedPath, seoToApply.title, seoToApply.description)
      );
    }

    if (normalizedPath === '/contact') {
      upsertJsonLd('contact-page', buildContactPageSchema(origin));
      upsertJsonLd(
        'contact-service',
        buildProfessionalServiceSchema(
          origin,
          '/contact',
          'Contact Apex Digital Consultants',
          'Connect with Apex Digital Consultants for website development and web design services in Barbados and across the Caribbean.'
        )
      );
    }
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
          <Route path="/services/:serviceId" element={<ServiceFunnel />} />
          <Route path="/digital-solutions" element={<DigitalSolutions />} />
          <Route path="/digital-solutions/:productId" element={<DigitalSolutionDetails />} />
          <Route path="/checkout/:productId" element={<DigitalSolutionCheckout />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/logos" element={<PortfolioLogos />} />
          <Route path="/portfolio/websites" element={<Navigate to="/portfolio" replace />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<CaseStudy />} />
          <Route
            path="/website-development-barbados"
            element={<SeoServiceLanding pageKey="website-development-barbados" />}
          />
          <Route
            path="/website-development-caribbean"
            element={<SeoServiceLanding pageKey="website-development-caribbean" />}
          />
          <Route path="/web-design-barbados" element={<SeoServiceLanding pageKey="web-design-barbados" />} />
          <Route
            path="/ecommerce-website-development-barbados"
            element={<SeoServiceLanding pageKey="ecommerce-website-development-barbados" />}
          />
          <Route
            path="/seo-friendly-websites-barbados"
            element={<SeoServiceLanding pageKey="seo-friendly-websites-barbados" />}
          />
          <Route path="/lp/:slug" element={<LandingPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/services/web-design" element={<WebDesign />} />
          <Route path="/services/logos" element={<Logos />} />
          <Route path="/services/websites" element={<Websites />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRouteGuard>
                <AdminShell />
              </AdminRouteGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="landing-pages" element={<AdminLandingPages />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="logos" element={<AdminLogos />} />
            <Route path="payment-gateways" element={<AdminPaymentGateways />} />
            <Route path="google-integrations" element={<AdminGoogleIntegrations />} />
            <Route path="case-studies" element={<AdminCaseStudies />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute ? <Footer /> : null}
      {!isAdminRoute ? <ChatWidget /> : null}
      {!isAdminRoute ? <NewsletterSignupModal /> : null}
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
