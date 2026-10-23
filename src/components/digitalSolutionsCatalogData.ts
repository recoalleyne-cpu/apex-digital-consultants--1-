/**
 * Apex Digital Consultants — Digital Solutions catalogue
 * Tailored service offerings and custom solution capabilities.
 * The entries below are NOT automatically purchasable products or licensing promises.
 * Existing product prices, licence data, and checkout logic remain authoritative.
 */
export type DigitalSolutionCategory =
  | 'WordPress Plugins & Enhancements'
  | 'E-commerce & Retail Automation'
  | 'Secure Forms & Business Automation'
  | 'CRM, Customer Portals & Membership'
  | 'Logistics, Booking & Calculators'
  | 'Website Operations & Digital Intelligence';

export type DigitalSolutionDelivery =
  | 'Custom Plugin'
  | 'Tailored Service'
  | 'Custom Development'
  | 'Custom Integration';

export interface DigitalSolution {
  id: string;
  title: string;
  category: DigitalSolutionCategory;
  description: string;
  delivery: DigitalSolutionDelivery;
  features: string[];
  featured: boolean;
}

export const digitalSolutions: DigitalSolution[] = [
  {
    "id": "apex-safe-backup",
    "title": "Apex Safe Backup",
    "category": "WordPress Plugins & Enhancements",
    "description": "Flexible WordPress backup tools for website files, database exports, and downloadable archive parts.",
    "delivery": "Custom Plugin",
    "features": [
      "Selective backup scope",
      "Database export",
      "Downloadable archive parts"
    ],
    "featured": true
  },
  {
    "id": "smart-promotional-popups",
    "title": "Smart Promotional Popups",
    "category": "WordPress Plugins & Enhancements",
    "description": "Responsive announcement, offer, and lead-generation popups tailored to your website experience.",
    "delivery": "Custom Plugin",
    "features": [
      "Mobile-friendly layouts",
      "Campaign content",
      "Configurable display"
    ],
    "featured": false
  },
  {
    "id": "knowledge-base-search-filters",
    "title": "Knowledge Base Search & Filters",
    "category": "WordPress Plugins & Enhancements",
    "description": "Make policies, FAQs, and internal resources easier to discover with structured search and filtering.",
    "delivery": "Custom Plugin",
    "features": [
      "Searchable articles",
      "Category filtering",
      "Related content"
    ],
    "featured": false
  },
  {
    "id": "custom-loan-calculator",
    "title": "Custom Loan Calculator",
    "category": "WordPress Plugins & Enhancements",
    "description": "Help customers explore estimated repayment amounts and amortization schedules with configurable loan terms.",
    "delivery": "Custom Plugin",
    "features": [
      "Rate presets",
      "Repayment estimates",
      "Amortization breakdowns"
    ],
    "featured": true
  },
  {
    "id": "custom-product-personalization",
    "title": "Custom Product Personalization",
    "category": "WordPress Plugins & Enhancements",
    "description": "Let shoppers select or enter product colors, materials, sizes, and other custom options.",
    "delivery": "Custom Plugin",
    "features": [
      "Conditional product choices",
      "Option validation",
      "Order detail capture"
    ],
    "featured": true
  },
  {
    "id": "cart-checkout-enhancements",
    "title": "Cart & Checkout Enhancements",
    "category": "WordPress Plugins & Enhancements",
    "description": "Improve purchase flows with clearer cart feedback, payment instructions, and order information.",
    "delivery": "Custom Plugin",
    "features": [
      "Cart indicators",
      "Payment instructions",
      "Checkout experience improvements"
    ],
    "featured": false
  },
  {
    "id": "website-ui-enhancements",
    "title": "Website UI Enhancements",
    "category": "WordPress Plugins & Enhancements",
    "description": "Refine existing WordPress websites with responsive navigation, sticky headers, and mobile usability improvements.",
    "delivery": "Custom Development",
    "features": [
      "Responsive navigation",
      "Accessible interactions",
      "Theme-compatible styling"
    ],
    "featured": false
  },
  {
    "id": "bulk-product-import-sku-reconciliation",
    "title": "Bulk Product Import & SKU Reconciliation",
    "category": "E-commerce & Retail Automation",
    "description": "Prepare and reconcile product catalogues using SKU-aware updates, categories, variations, and structured import files.",
    "delivery": "Tailored Service",
    "features": [
      "SKU matching",
      "Variation-aware imports",
      "Category mapping"
    ],
    "featured": false
  },
  {
    "id": "product-image-matching-catalog-preparation",
    "title": "Product Image Matching & Catalog Preparation",
    "category": "E-commerce & Retail Automation",
    "description": "Organize and map approved images to product records to support more accurate catalogue uploads.",
    "delivery": "Tailored Service",
    "features": [
      "Image-to-SKU mapping",
      "Filename normalization",
      "Import-ready outputs"
    ],
    "featured": false
  },
  {
    "id": "variable-product-attribute-management",
    "title": "Variable Product & Attribute Management",
    "category": "E-commerce & Retail Automation",
    "description": "Configure product variations, custom attributes, and category-specific purchase options.",
    "delivery": "Tailored Service",
    "features": [
      "Sizes and materials",
      "Product variations",
      "Structured product data"
    ],
    "featured": false
  },
  {
    "id": "checkout-payment-gateway-integrations",
    "title": "Checkout & Payment Gateway Integrations",
    "category": "E-commerce & Retail Automation",
    "description": "Connect online stores to appropriate payment providers with checkout configuration and transaction-flow testing.",
    "delivery": "Custom Integration",
    "features": [
      "Gateway setup",
      "Checkout testing",
      "Order status flows"
    ],
    "featured": false
  },
  {
    "id": "currency-display-conversion-tools",
    "title": "Currency Display & Conversion Tools",
    "category": "E-commerce & Retail Automation",
    "description": "Scope a customized storefront currency display experience appropriate for the store and payment gateway.",
    "delivery": "Custom Development",
    "features": [
      "Currency selection",
      "Rate configuration",
      "Checkout compatibility assessment"
    ],
    "featured": false
  },
  {
    "id": "product-comparison-upsell-tools",
    "title": "Product Comparison & Upsell Tools",
    "category": "E-commerce & Retail Automation",
    "description": "Plan comparison and merchandising features that help shoppers assess products and explore complementary items.",
    "delivery": "Custom Development",
    "features": [
      "Comparison experience",
      "Upsell placement",
      "Responsive design"
    ],
    "featured": false
  },
  {
    "id": "secure-submission-document-routing",
    "title": "Secure Submission & Document Routing",
    "category": "Secure Forms & Business Automation",
    "description": "Route sensitive application submissions toward approved destinations with controlled retention, validation, and operational audit support.",
    "delivery": "Custom Development",
    "features": [
      "Multi-step forms",
      "Authenticated transfer patterns",
      "Retention controls"
    ],
    "featured": true
  },
  {
    "id": "multi-step-digital-application-forms",
    "title": "Multi-Step Digital Application Forms",
    "category": "Secure Forms & Business Automation",
    "description": "Turn paper and email-heavy applications into guided forms with structured validation and supporting uploads.",
    "delivery": "Tailored Service",
    "features": [
      "Step-by-step forms",
      "Field validation",
      "Document attachment support"
    ],
    "featured": false
  },
  {
    "id": "document-upload-operations-workflows",
    "title": "Document Upload & Operations Workflows",
    "category": "Secure Forms & Business Automation",
    "description": "Organize document intake and operational review through purpose-built upload and staff-facing workflows.",
    "delivery": "Custom Development",
    "features": [
      "Upload workflows",
      "Staff review views",
      "Status handling"
    ],
    "featured": false
  },
  {
    "id": "api-sftp-third-party-integrations",
    "title": "API, SFTP & Third-Party Integrations",
    "category": "Secure Forms & Business Automation",
    "description": "Connect your website or business system with approved external services, APIs, and data destinations.",
    "delivery": "Custom Integration",
    "features": [
      "REST API workflows",
      "Secure transfer options",
      "Integration testing"
    ],
    "featured": false
  },
  {
    "id": "submission-tracking-audit-support",
    "title": "Submission Tracking & Audit Support",
    "category": "Secure Forms & Business Automation",
    "description": "Improve traceability using submission references, operational events, and privacy-aware audit outputs.",
    "delivery": "Custom Development",
    "features": [
      "Reference identifiers",
      "Event tracking",
      "Privacy-aware logging"
    ],
    "featured": false
  },
  {
    "id": "custom-crm-customer-dashboards",
    "title": "Custom CRM & Customer Dashboards",
    "category": "CRM, Customer Portals & Membership",
    "description": "Create client-facing and staff-facing workspaces to manage business relationships, records, and self-service tasks.",
    "delivery": "Custom Development",
    "features": [
      "Account dashboards",
      "Role-aware access",
      "Workflow customization"
    ],
    "featured": true
  },
  {
    "id": "invoice-document-upload-portals",
    "title": "Invoice & Document Upload Portals",
    "category": "CRM, Customer Portals & Membership",
    "description": "Provide structured portals where customers can submit invoices and documents for review.",
    "delivery": "Custom Development",
    "features": [
      "Customer uploads",
      "Admin review",
      "Status visibility"
    ],
    "featured": false
  },
  {
    "id": "membership-registration-accounts",
    "title": "Membership Registration & Accounts",
    "category": "CRM, Customer Portals & Membership",
    "description": "Support member onboarding with registration flows, account profiles, and appropriate permission controls.",
    "delivery": "Custom Development",
    "features": [
      "Registration workflows",
      "Member profiles",
      "Role permissions"
    ],
    "featured": false
  },
  {
    "id": "customer-messaging-communication",
    "title": "Customer Messaging & Communication",
    "category": "CRM, Customer Portals & Membership",
    "description": "Build account-based communication workflows that help customers and service teams stay connected.",
    "delivery": "Custom Development",
    "features": [
      "Messaging workflows",
      "Notifications",
      "Account integration"
    ],
    "featured": false
  },
  {
    "id": "moderated-community-portals",
    "title": "Moderated Community Portals",
    "category": "CRM, Customer Portals & Membership",
    "description": "Scope private community experiences with membership approval, content posting, and moderation workflows.",
    "delivery": "Custom Development",
    "features": [
      "Approval-based membership",
      "Content moderation",
      "Community interactions"
    ],
    "featured": false
  },
  {
    "id": "shipping-freight-rate-calculators",
    "title": "Shipping & Freight Rate Calculators",
    "category": "Logistics, Booking & Calculators",
    "description": "Let customers estimate shipment charges with configurable weight bands, rates, and service rules.",
    "delivery": "Custom Development",
    "features": [
      "Weight-based pricing",
      "Rate rules",
      "Clear estimate summaries"
    ],
    "featured": false
  },
  {
    "id": "shipment-tracking-customer-dashboards",
    "title": "Shipment Tracking & Customer Dashboards",
    "category": "Logistics, Booking & Calculators",
    "description": "Give logistics customers a place to follow shipments, status changes, and package details.",
    "delivery": "Custom Development",
    "features": [
      "Shipment records",
      "Tracking statuses",
      "Customer account views"
    ],
    "featured": true
  },
  {
    "id": "logistics-customer-management",
    "title": "Logistics Customer Management",
    "category": "Logistics, Booking & Calculators",
    "description": "Adapt account, document, and shipment administration tools to the needs of courier and import businesses.",
    "delivery": "Custom Development",
    "features": [
      "Customer profiles",
      "Package records",
      "Operations workflows"
    ],
    "featured": false
  },
  {
    "id": "booking-reservation-inquiry-systems",
    "title": "Booking & Reservation Inquiry Systems",
    "category": "Logistics, Booking & Calculators",
    "description": "Build guided booking inquiries, date selection experiences, and connections to appropriate booking platforms.",
    "delivery": "Custom Integration",
    "features": [
      "Booking inquiries",
      "Calendar interfaces",
      "Provider integration assessment"
    ],
    "featured": false
  },
  {
    "id": "custom-quotation-price-estimators",
    "title": "Custom Quotation & Price Estimators",
    "category": "Logistics, Booking & Calculators",
    "description": "Provide instant preliminary cost estimates for services, shipping, financing, and other configurable pricing models.",
    "delivery": "Custom Development",
    "features": [
      "Configurable pricing",
      "Input validation",
      "Responsive estimates"
    ],
    "featured": false
  },
  {
    "id": "website-migration-deployment-planning",
    "title": "Website Migration & Deployment Planning",
    "category": "Website Operations & Digital Intelligence",
    "description": "Plan website moves and cutovers with staging, DNS coordination, testing, and rollback preparation.",
    "delivery": "Tailored Service",
    "features": [
      "Migration planning",
      "Cutover checklists",
      "Rollback readiness"
    ],
    "featured": false
  },
  {
    "id": "wordpress-maintenance-security-improvements",
    "title": "WordPress Maintenance & Security Improvements",
    "category": "Website Operations & Digital Intelligence",
    "description": "Keep websites supportable through updates, compatibility checks, backups, and practical security improvements.",
    "delivery": "Tailored Service",
    "features": [
      "Version audits",
      "Backup planning",
      "Update testing"
    ],
    "featured": false
  },
  {
    "id": "react-web-applications-custom-interfaces",
    "title": "React Web Applications & Custom Interfaces",
    "category": "Website Operations & Digital Intelligence",
    "description": "Develop responsive application interfaces and tailored business tools using modern frontend technologies.",
    "delivery": "Custom Development",
    "features": [
      "React-based UI",
      "Mobile-ready components",
      "API-ready architecture"
    ],
    "featured": false
  },
  {
    "id": "google-analytics-4-conversion-tracking",
    "title": "Google Analytics 4 & Conversion Tracking",
    "category": "Website Operations & Digital Intelligence",
    "description": "Implement practical measurement for customer journeys, campaigns, and website conversion events.",
    "delivery": "Custom Integration",
    "features": [
      "GA4 setup",
      "Event tracking",
      "Measurement checks"
    ],
    "featured": false
  },
  {
    "id": "seo-performance-responsive-ux",
    "title": "SEO, Performance & Responsive UX",
    "category": "Website Operations & Digital Intelligence",
    "description": "Improve discoverability and usability through technical SEO, page performance, and cross-device refinements.",
    "delivery": "Tailored Service",
    "features": [
      "Technical SEO",
      "Responsive testing",
      "UX optimization"
    ],
    "featured": false
  },
  {
    "id": "digital-workflow-planning-uat",
    "title": "Digital Workflow Planning & UAT",
    "category": "Website Operations & Digital Intelligence",
    "description": "Document requirements, map user journeys, and run structured acceptance reviews before launch.",
    "delivery": "Tailored Service",
    "features": [
      "Requirements mapping",
      "UAT templates",
      "Launch readiness"
    ],
    "featured": false
  }
] as DigitalSolution[];
