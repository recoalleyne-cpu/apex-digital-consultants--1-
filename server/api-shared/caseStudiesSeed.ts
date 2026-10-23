export type CaseStudySeedItem = {
  title: string;
  slug: string;
  client_name: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  services_provided: string;
  featured_image_url: string;
  gallery_images: string;
  tech_stack: string;
  cta_text: string;
  cta_link: string;
  is_featured: boolean;
  is_published: boolean;
};

const DEFAULT_SERVICES_PROVIDED =
  'Website Design, Website Development, Responsive Web Design, Content Structuring, Brand Presentation';

const DEFAULT_TECH_STACK = 'WordPress, HTML, CSS, JavaScript, Responsive Design';
const DEFAULT_CTA_TEXT = 'Start Your Project';
const DEFAULT_CTA_LINK = '/contact';
const PLACEHOLDER_FEATURED_IMAGE = '[Add URL]';
const PLACEHOLDER_GALLERY_IMAGES = '[Add URLs]';

export const INITIAL_CASE_STUDIES: CaseStudySeedItem[] = [
  {
    title: 'The Science Plug Website Development',
    slug: 'the-science-plug-website-development',
    client_name: 'The Science Plug',
    summary:
      'Apex delivered a modern education-focused website for The Science Plug to present tutoring services, resources, and booking pathways in a clear, conversion-ready format.',
    challenge:
      'The business needed to communicate multiple offerings for students and families while keeping navigation simple and professional.',
    solution:
      'We designed a structured service architecture, streamlined page hierarchy, and responsive layouts that made it easy for visitors to understand programs and take action.',
    results:
      'The new site created a stronger digital foundation, improved service clarity, and gave the brand a more credible platform for ongoing growth.',
    services_provided: DEFAULT_SERVICES_PROVIDED,
    featured_image_url: PLACEHOLDER_FEATURED_IMAGE,
    gallery_images: PLACEHOLDER_GALLERY_IMAGES,
    tech_stack: DEFAULT_TECH_STACK,
    cta_text: DEFAULT_CTA_TEXT,
    cta_link: DEFAULT_CTA_LINK,
    is_featured: true,
    is_published: true
  },
  {
    title: 'Jriver Transport & Logistics (Barbados) Website Development',
    slug: 'jriver-transport-logistics-barbados-website-development',
    client_name: 'Jriver Transport & Logistics (Barbados)',
    summary:
      'Apex built a dedicated transport and logistics website that positions Jriver as a dependable partner for clients across Barbados.',
    challenge:
      'The company needed a stronger digital presence that could communicate core services quickly and build trust with commercial and individual clients.',
    solution:
      'We delivered a clean, mobile-ready website with focused service messaging, brand-consistent visuals, and straightforward conversion pathways.',
    results:
      'Jriver now has a polished web presence that supports credibility, improves service visibility, and provides a stronger foundation for lead generation.',
    services_provided: DEFAULT_SERVICES_PROVIDED,
    featured_image_url: PLACEHOLDER_FEATURED_IMAGE,
    gallery_images: PLACEHOLDER_GALLERY_IMAGES,
    tech_stack: DEFAULT_TECH_STACK,
    cta_text: DEFAULT_CTA_TEXT,
    cta_link: DEFAULT_CTA_LINK,
    is_featured: false,
    is_published: true
  },
  {
    title: 'Highlighted Beauty By Shan Website Development',
    slug: 'highlighted-beauty-by-shan-website-development',
    client_name: 'Highlighted Beauty By Shan',
    summary:
      'Apex created an elegant beauty-service website that showcases offerings, reinforces trust, and guides visitors toward booking decisions.',
    challenge:
      'The business needed a premium digital presence that matched brand quality while keeping information concise and easy to navigate.',
    solution:
      'We designed a refined visual system, structured service-focused content, and responsive layouts that perform smoothly across devices.',
    results:
      'The new site elevated brand presentation and made it easier for potential clients to understand services and move toward contact or booking.',
    services_provided: DEFAULT_SERVICES_PROVIDED,
    featured_image_url: PLACEHOLDER_FEATURED_IMAGE,
    gallery_images: PLACEHOLDER_GALLERY_IMAGES,
    tech_stack: DEFAULT_TECH_STACK,
    cta_text: DEFAULT_CTA_TEXT,
    cta_link: DEFAULT_CTA_LINK,
    is_featured: true,
    is_published: true
  },
  {
    title: 'Finish Line Cleaning Services Website Development',
    slug: 'finish-line-cleaning-services-website-development',
    client_name: 'Finish Line Cleaning Services',
    summary:
      'Apex developed a straightforward service website for Finish Line Cleaning Services to highlight core offerings and simplify inquiry flow.',
    challenge:
      'The prior digital presence did not clearly organize services or support a smooth path for quotation requests.',
    solution:
      'We built a clean website structure with concise service pages, clear calls to action, and mobile-first usability for busy customers.',
    results:
      'The business gained a more professional online profile and a clearer process for converting visitors into qualified service inquiries.',
    services_provided: DEFAULT_SERVICES_PROVIDED,
    featured_image_url: PLACEHOLDER_FEATURED_IMAGE,
    gallery_images: PLACEHOLDER_GALLERY_IMAGES,
    tech_stack: DEFAULT_TECH_STACK,
    cta_text: DEFAULT_CTA_TEXT,
    cta_link: DEFAULT_CTA_LINK,
    is_featured: false,
    is_published: true
  },
  {
    title: 'Hitz 106.7 FM Initial Website Build',
    slug: 'hitz-1067-fm-initial-website-build',
    client_name: 'Hitz 106.7 FM',
    summary:
      'Apex delivered the initial website build for Hitz 106.7 FM, creating the first structured digital platform for brand presentation and audience access.',
    challenge:
      'Hitz needed an initial web presence that could reflect station identity, organize content areas, and provide a usable experience for listeners.',
    solution:
      'We designed and launched the initial website build with responsive page layouts, clear brand styling, and foundational content structure for future expansion.',
    results:
      'The initial build gave Hitz 106.7 FM a credible digital starting point and established a foundation the brand could continue evolving over time.',
    services_provided:
      'Website Design, Front-End Development, Responsive Layout, Brand Presentation, Initial Website Build',
    featured_image_url: PLACEHOLDER_FEATURED_IMAGE,
    gallery_images: PLACEHOLDER_GALLERY_IMAGES,
    tech_stack: DEFAULT_TECH_STACK,
    cta_text: DEFAULT_CTA_TEXT,
    cta_link: DEFAULT_CTA_LINK,
    is_featured: true,
    is_published: true
  },
  {
    title: 'Be Blessed Skin Care & Beauty E-commerce Website Development',
    slug: 'be-blessed-skin-care-beauty-ecommerce-website-development',
    client_name: 'Be Blessed Skin Care & Beauty',
    summary:
      'Apex created an e-commerce-ready beauty website that supports product discovery, brand trust, and smoother online purchasing journeys.',
    challenge:
      'The brand needed a digital storefront that could present products clearly while remaining easy to browse across desktop and mobile.',
    solution:
      'We implemented a structured e-commerce website with intuitive product presentation, responsive layouts, and conversion-focused page flows.',
    results:
      'The business gained a stronger online retail presence with clearer product communication and a more professional digital shopping experience.',
    services_provided:
      'Website Design, Website Development, Responsive Web Design, Product Presentation, E-commerce Setup',
    featured_image_url: PLACEHOLDER_FEATURED_IMAGE,
    gallery_images: PLACEHOLDER_GALLERY_IMAGES,
    tech_stack: DEFAULT_TECH_STACK,
    cta_text: DEFAULT_CTA_TEXT,
    cta_link: DEFAULT_CTA_LINK,
    is_featured: true,
    is_published: true
  },
  {
    title: 'Rhea Renee Website Development',
    slug: 'rhea-renee-website-development',
    client_name: 'Rhea Renee',
    summary:
      'Apex built a professional brand website for Rhea Renee to establish a clearer digital identity and support service-focused communication.',
    challenge:
      'The brand needed a central online platform that could unify messaging, improve presentation quality, and support trust with new visitors.',
    solution:
      'We developed a polished website with focused content structuring, visual consistency, and responsive performance for modern browsing behavior.',
    results:
      'Rhea Renee now has a stronger digital foundation for brand visibility, client communication, and future marketing activity.',
    services_provided: DEFAULT_SERVICES_PROVIDED,
    featured_image_url: PLACEHOLDER_FEATURED_IMAGE,
    gallery_images: PLACEHOLDER_GALLERY_IMAGES,
    tech_stack: DEFAULT_TECH_STACK,
    cta_text: DEFAULT_CTA_TEXT,
    cta_link: DEFAULT_CTA_LINK,
    is_featured: false,
    is_published: true
  },
  {
    title: 'Mobile & Marine Services Website Development',
    slug: 'mobile-and-marine-services-website-development',
    client_name: 'Mobile & Marine Services',
    summary:
      'Apex delivered a service-led website for Mobile & Marine Services to present technical offerings in a more accessible and conversion-focused format.',
    challenge:
      'The company needed a clear way to explain specialized services and help prospects quickly determine fit.',
    solution:
      'We designed a structured, mobile-friendly site experience with clearer service presentation and direct inquiry pathways.',
    results:
      'The updated web presence improved communication clarity and gave the company a more credible platform for attracting new business.',
    services_provided: DEFAULT_SERVICES_PROVIDED,
    featured_image_url: PLACEHOLDER_FEATURED_IMAGE,
    gallery_images: PLACEHOLDER_GALLERY_IMAGES,
    tech_stack: DEFAULT_TECH_STACK,
    cta_text: DEFAULT_CTA_TEXT,
    cta_link: DEFAULT_CTA_LINK,
    is_featured: false,
    is_published: true
  },
  {
    title: 'Rachel Thomas - Executive Coach Website Development',
    slug: 'rachel-thomas-executive-coach-website-development',
    client_name: 'Rachel Thomas - Executive Coach',
    summary:
      'Apex built a refined personal brand website for Rachel Thomas to communicate executive coaching services with clarity and authority.',
    challenge:
      'Rachel needed a digital presence that balanced professionalism and personality while guiding visitors through service offerings.',
    solution:
      'We delivered a clean, responsive website with intentional content hierarchy, clear positioning language, and conversion-ready calls to action.',
    results:
      'The final website strengthened brand trust, improved service communication, and created a stronger platform for client engagement.',
    services_provided:
      'Website Design, Website Development, Responsive Web Design, Personal Brand Positioning, Content Structuring',
    featured_image_url: PLACEHOLDER_FEATURED_IMAGE,
    gallery_images: PLACEHOLDER_GALLERY_IMAGES,
    tech_stack: DEFAULT_TECH_STACK,
    cta_text: DEFAULT_CTA_TEXT,
    cta_link: DEFAULT_CTA_LINK,
    is_featured: false,
    is_published: true
  },
  {
    title: 'Ask For Jess Website Development',
    slug: 'ask-for-jess-website-development',
    client_name: 'Ask For Jess',
    summary:
      'Apex developed a service-focused website for Ask For Jess to improve offer visibility and create a cleaner customer conversion path.',
    challenge:
      'The business needed a more structured way to present services and convert interest into direct inquiries.',
    solution:
      'We built a responsive, content-led website with simplified navigation and stronger call-to-action placement.',
    results:
      'Ask For Jess now has a premium web presence that better supports lead capture and consistent brand communication.',
    services_provided:
      'Website Design, Website Development, Responsive Web Design, Service Presentation, Content Structuring',
    featured_image_url: PLACEHOLDER_FEATURED_IMAGE,
    gallery_images: PLACEHOLDER_GALLERY_IMAGES,
    tech_stack: DEFAULT_TECH_STACK,
    cta_text: DEFAULT_CTA_TEXT,
    cta_link: DEFAULT_CTA_LINK,
    is_featured: true,
    is_published: true
  },
  {
    title: 'Sani Services Limited Website Development',
    slug: 'sani-services-limited-website-development',
    client_name: 'Sani Services Limited',
    summary:
      'Apex delivered a professional website for Sani Services Limited to better communicate services and support trust at first visit.',
    challenge:
      'The company needed a clearer online identity and a simpler way for prospective clients to understand available solutions.',
    solution:
      'We created a modern responsive site with concise service architecture, improved visual branding, and straightforward inquiry flow.',
    results:
      'The updated digital presence improved service clarity and positioned the company more strongly for ongoing business development.',
    services_provided: DEFAULT_SERVICES_PROVIDED,
    featured_image_url: PLACEHOLDER_FEATURED_IMAGE,
    gallery_images: PLACEHOLDER_GALLERY_IMAGES,
    tech_stack: DEFAULT_TECH_STACK,
    cta_text: DEFAULT_CTA_TEXT,
    cta_link: DEFAULT_CTA_LINK,
    is_featured: false,
    is_published: true
  },
  {
    title: "Sergio's Auto Follow Website Development",
    slug: 'sergios-auto-follow-website-development',
    client_name: "Sergio's Auto Follow",
    summary:
      "Apex built a streamlined website for Sergio's Auto Follow to present offerings clearly and strengthen digital credibility.",
    challenge:
      'The business needed a cleaner online structure that could communicate value quickly and reduce friction for new visitors.',
    solution:
      'We developed a responsive website with focused messaging, stronger visual hierarchy, and conversion-oriented content flow.',
    results:
      "Sergio's Auto Follow gained a more polished digital presence that supports trust and helps prospects take action faster.",
    services_provided: DEFAULT_SERVICES_PROVIDED,
    featured_image_url: PLACEHOLDER_FEATURED_IMAGE,
    gallery_images: PLACEHOLDER_GALLERY_IMAGES,
    tech_stack: DEFAULT_TECH_STACK,
    cta_text: DEFAULT_CTA_TEXT,
    cta_link: DEFAULT_CTA_LINK,
    is_featured: false,
    is_published: true
  },
  {
    title: 'Island Zest Website Development',
    slug: 'island-zest-website-development',
    client_name: 'Island Zest',
    summary:
      'Apex created a vibrant, brand-forward website for Island Zest to showcase offerings and improve customer conversion readiness.',
    challenge:
      'Island Zest needed a more premium digital presentation that could balance brand personality with clear service and product communication.',
    solution:
      'We designed and developed a responsive website with structured content sections, clear calls to action, and stronger brand storytelling.',
    results:
      'The final website improved brand consistency and gave Island Zest a stronger platform for marketing and customer engagement.',
    services_provided: DEFAULT_SERVICES_PROVIDED,
    featured_image_url: PLACEHOLDER_FEATURED_IMAGE,
    gallery_images: PLACEHOLDER_GALLERY_IMAGES,
    tech_stack: DEFAULT_TECH_STACK,
    cta_text: DEFAULT_CTA_TEXT,
    cta_link: DEFAULT_CTA_LINK,
    is_featured: true,
    is_published: true
  }
];
