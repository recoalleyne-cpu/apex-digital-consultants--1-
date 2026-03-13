
import { Service, TeamMember, Testimonial, PricingPlan, Product } from './types';

export const SERVICES: Service[] = [
  {
    id: 'web-development',
    title: 'Web Development & Design',
    description: 'We create custom, mobile-friendly websites that are visually appealing, easy to navigate, and designed to convert visitors into customers. Whether you need a simple landing page or a full-service site, we build with purpose and style.',
    icon: 'Layout'
  },
  {
    id: 'marketing-management',
    title: 'Marketing Management',
    description: 'Strategic planning and execution of marketing campaigns to grow your online presence, improve visibility, and attract the right audience.',
    icon: 'Target'
  },
  {
    id: 'google-advertising',
    title: 'Google Advertising',
    description: 'Strategic Google Advertising campaigns designed to increase visibility, drive qualified traffic, and generate measurable business results through search, display, and performance-focused ad solutions.',
    icon: 'BarChart'
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design & Logos',
    description: 'Your logo is the face of your brand. We craft clean, memorable designs that reflect your business identity and leave a lasting impression.',
    icon: 'PenTool'
  },
  {
    id: 'photography-videography',
    title: 'Photography & Videography',
    description: 'Professional visual content creation to accurately recreate your vision and compliment your business ideas.',
    icon: 'Cpu'
  },
  {
    id: 'business-digitization',
    title: 'Business Digitization',
    description: 'We help businesses transition from paper-based systems to efficient, digital workflows. Streamline your operations for speed and accuracy.',
    icon: 'Zap'
  }
];

export const TEAM: TeamMember[] = [
  {
    name: 'Tamika Williams',
    role: 'Digital Marketing Specialist & Business Consultant',
    bio: 'Tamika is a dedicated expert committed to helping entrepreneurs and organizations bring their vision to life through strategy, creativity, and precision.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Judge Lonnie Thompson',
    role: 'Judge',
    company: 'City of Memphis',
    location: 'Memphis, TN',
    content: 'Working with APEX was a game-changer. Tamika brought a level of professionalism, efficiency, and innovation that completely transformed the way my business operates.'
  },
  {
    name: 'T. Taylor',
    role: 'President',
    company: 'Harmony Transportation',
    location: 'Memphis, TN',
    content: 'Tamika identified inefficiencies and implemented a digital transformation strategy that revolutionized our operations. She developed a structured quality improvement process and a streamlined digital filing system.'
  },
  {
    name: 'C. Tate',
    role: 'Owner',
    company: 'Tate Gun Dealer',
    location: 'Memphis, TN',
    content: 'Tamika designed and built a professional website for my company that truly reflects our brand and services. It’s functional, visually appealing, and has helped increase our online presence tremendously.'
  }
];

export const PRICING: PricingPlan[] = [
  {
    name: 'Landing Page',
    price: 'Custom',
    duration: '1 Page',
    features: ['Responsive Design', '3 Stock Images', 'SEO Optimization', 'Google Listing', 'Contact Form']
  },
  {
    name: 'Standard Website',
    price: 'Custom',
    duration: 'Up to 5 Pages',
    features: ['Responsive Design', 'Social Media Integration', '5 Stock Images', 'SEO Optimization', 'Google Listing', 'Google Map Embedding']
  },
  {
    name: 'Professional Website',
    price: 'Custom',
    duration: 'Up to 10 Pages',
    features: ['Responsive Design', 'Chat/Whatsapp Integration', '10 Stock Images', 'Google Analytics', 'Google Search Console', 'Contact Form']
  },
  {
    name: 'E-Commerce Website',
    price: 'Custom',
    duration: 'Unlimited Pages',
    features: ['E-Commerce Integration', 'Payment Platform', 'Customer Registration Area', 'Google My Business Set Up', 'Unlimited Stock Images', 'Advanced SEO']
  }
];

export const PORTFOLIO = [
  {
    title: 'The Science Plug',
    category: 'Web Development',
    industry: 'Education',
    technologies: ['WordPress', 'WooCommerce', 'Custom PHP', 'JavaScript'],
    description: 'Features booking capabilities for tutorial sessions, social media integration, and online chat.',
    link: 'https://thescienceplug.com',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Okoye By Kim',
    category: 'Brand Identity',
    industry: 'Fashion & Retail',
    technologies: ['Shopify', 'Liquid', 'CSS3', 'Instagram API'],
    description: 'Reflective of the brand’s vibrant personality. Includes social media integration and online chat.',
    link: 'https://okoyebykim.com/',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Highlighted Beauty By Shan',
    category: 'Landing Page',
    industry: 'Beauty & Wellness',
    technologies: ['React', 'Tailwind CSS', 'Framer Motion'],
    description: 'Elegant and easy to navigate with concise information on services offered.',
    link: 'https://highlightedbeautyspa.com/',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Finish Line Cleaning Services',
    category: 'Web Design',
    industry: 'Service Industry',
    technologies: ['WordPress', 'Elementor', 'WPForms'],
    description: 'Simplistic design with concise information on services and quotation request feature.',
    link: 'https://finishlinecleaningservices.com',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Hitz 106.7 FM',
    category: 'Media Platform',
    industry: 'Media & Entertainment',
    technologies: ['Custom CMS', 'Streaming API', 'Node.js', 'React'],
    description: 'Developed with streaming capabilities for video and audio, including ad spaces.',
    link: 'https://www.myhitz106.com',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Be Blessed Skin Care & Beauty',
    category: 'E-Commerce',
    industry: 'Beauty & Cosmetics',
    technologies: ['WordPress', 'WooCommerce', 'Stripe Integration'],
    description: 'Online store layout using WooCommerce integration for beauty products.',
    link: 'http://beblessedskincareandbeauty.com/',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=800'
  }
];

export const DIGITAL_SOLUTIONS: Product[] = [
  {
    id: 'currency-switcher',
    name: 'WooCommerce Multi Currency Switcher',
    description: 'Automatically display product prices in your customer’s local currency.',
    price: '$49',
    category: 'Ecommerce Tools',
    image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=800',
    features: ['Automatic currency detection', 'Multi currency display', 'Easy integration with WooCommerce']
  },
  {
    id: 'product-comparison',
    name: 'Product Comparison',
    description: 'Allow customers to compare products side-by-side to make informed decisions.',
    price: '$39',
    category: 'Ecommerce Tools',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    features: ['Side-by-side comparison', 'Customizable attributes', 'Mobile responsive']
  },
  {
    id: 'cart-upsell',
    name: 'Cart Upsell Plugin',
    description: 'Increase average order value with smart product recommendations in the cart.',
    price: '$59',
    category: 'Ecommerce Tools',
    image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800',
    features: ['AI-driven recommendations', 'One-click upsells', 'Customizable design']
  },
  {
    id: 'lead-capture',
    name: 'Lead Capture Popup',
    description: 'Convert visitors into subscribers with high-converting popup forms.',
    price: '$29',
    category: 'Marketing Tools',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800',
    features: ['Exit-intent triggers', 'A/B testing', 'Email marketing integration']
  },
  {
    id: 'instagram-feed',
    name: 'Instagram Shop Feed',
    description: 'Display your Instagram posts as a shoppable gallery on your website.',
    price: '$39',
    category: 'Marketing Tools',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
    features: ['Real-time sync', 'Shoppable tags', 'Custom layouts']
  },
  {
    id: 'ai-descriptions',
    name: 'AI Product Description Generator',
    description: 'Generate high-quality, SEO-optimized product descriptions in seconds.',
    price: '$79',
    category: 'Marketing Tools',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    features: ['GPT-4 powered', 'SEO optimization', 'Bulk generation']
  },
  {
    id: 'pricing-calculator',
    name: 'Smart Pricing Calculator',
    description: 'Allow customers to receive instant quotes based on their specific requirements.',
    price: '$99',
    category: 'Business Tools',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
    features: ['Dynamic pricing logic', 'Multi-step form', 'Custom calculation formulas']
  },
  {
    id: 'booking-calendar',
    name: 'Booking Calendar',
    description: 'A powerful booking system for appointments, events, and rentals.',
    price: '$69',
    category: 'Business Tools',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800',
    features: ['Real-time availability', 'Payment integration', 'Email notifications']
  },
  {
    id: 'crm-export',
    name: 'CRM Export Tool',
    description: 'Automatically sync your website leads and orders with your CRM.',
    price: '$89',
    category: 'Business Tools',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
    features: ['Automatic syncing', 'Custom field mapping', 'Error logging']
  }
];

export const DIGITAL_SOLUTIONS_FAQS = [
  {
    question: "What are WordPress plugins?",
    answer: "WordPress plugins are pieces of software that can be added to a WordPress website to extend its functionality or add new features."
  },
  {
    question: "Do you build custom plugins?",
    answer: "Yes, we specialize in developing custom WordPress and WooCommerce plugins tailored to your specific business requirements."
  },
  {
    question: "Are your plugins compatible with WooCommerce?",
    answer: "Absolutely. Most of our digital solutions are designed specifically to enhance WooCommerce stores and improve the e-commerce experience."
  },
  {
    question: "Can plugins be customized for my business?",
    answer: "Yes, we can modify our existing plugins or build entirely new ones to fit your unique workflow and business goals."
  },
  {
    question: "Do plugins affect website performance?",
    answer: "Our plugins are built with performance in mind, using clean code and efficient logic to ensure they add functionality without slowing down your site."
  }
];

export const FAQS = [
  {
    question: "What industries do you specialize in?",
    answer: "We work with a wide range of industries, including small businesses, nonprofits, and entrepreneurs looking to scale their digital presence."
  },
  {
    question: "How long does a typical website project take?",
    answer: "Project timelines vary based on complexity, but most standard websites are completed within 2-4 weeks."
  },
  {
    question: "Do you offer ongoing support?",
    answer: "Yes, we provide ongoing maintenance, updates, and consulting to ensure your digital assets continue to perform at their best."
  }
];
