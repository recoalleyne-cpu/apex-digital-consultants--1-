export const MEDIA_PLACEMENT_VALUES = {
  SITE_LOGO_PRIMARY: 'site-logo-primary',
  HOME_FEATURED_LOGO: 'home-featured-logo',
  HOME_HERO_BACKGROUND_IMAGE: 'home-hero-background-image',
  ABOUT_TOP_IMAGE: 'about-top-image',
  ABOUT_FOUNDER_IMAGE: 'about-founder-image',
  HOME_CERTIFICATION_TICKER: 'home-certification-ticker',
  LOGOS_PAGE: 'logos-page',
  PORTFOLIO_GRID: 'portfolio-grid'
} as const;

export const MEDIA_CATEGORY_VALUES = {
  PORTFOLIO: 'portfolio',
  LOGOS: 'logos',
  BRANDING: 'branding',
  CERTIFICATIONS: 'certifications',
  UNCATEGORIZED: 'uncategorized'
} as const;

export type MediaPlacementValue =
  (typeof MEDIA_PLACEMENT_VALUES)[keyof typeof MEDIA_PLACEMENT_VALUES];
export type MediaCategoryValue =
  (typeof MEDIA_CATEGORY_VALUES)[keyof typeof MEDIA_CATEGORY_VALUES];

export type MediaPlacementOption = {
  value: MediaPlacementValue;
  label: string;
  description?: string;
  status: 'already-in-use' | 'recommended-for-future-use';
};

export type MediaCategoryOption = {
  value: MediaCategoryValue;
  label: string;
  description?: string;
};

export type MediaPlacementPreset = {
  label: string;
  category: MediaCategoryValue;
  placement: MediaPlacementValue;
};

export const MEDIA_CATEGORY_OPTIONS: MediaCategoryOption[] = [
  {
    value: MEDIA_CATEGORY_VALUES.PORTFOLIO,
    label: 'Portfolio',
    description: 'Portfolio project media and supporting visuals.'
  },
  {
    value: MEDIA_CATEGORY_VALUES.LOGOS,
    label: 'Logos',
    description: 'Client and brand logos for logo-focused sections.'
  },
  {
    value: MEDIA_CATEGORY_VALUES.BRANDING,
    label: 'Branding',
    description: 'Core Apex brand assets and About page imagery.'
  },
  {
    value: MEDIA_CATEGORY_VALUES.CERTIFICATIONS,
    label: 'Certifications',
    description: 'Partner/certification badges for trust sections.'
  },
  {
    value: MEDIA_CATEGORY_VALUES.UNCATEGORIZED,
    label: 'Uncategorized',
    description: 'Fallback bucket when no specific category is selected.'
  }
];

export const MEDIA_PLACEMENT_OPTIONS: MediaPlacementOption[] = [
  {
    value: MEDIA_PLACEMENT_VALUES.SITE_LOGO_PRIMARY,
    label: 'Global - Primary Site Logo',
    description: 'Reserved for shared header/footer logo once fully media-driven.',
    status: 'recommended-for-future-use'
  },
  {
    value: MEDIA_PLACEMENT_VALUES.HOME_FEATURED_LOGO,
    label: 'Homepage - Featured Logo Mark',
    description: 'Reserved for the logo shown in the homepage hero card.',
    status: 'recommended-for-future-use'
  },
  {
    value: MEDIA_PLACEMENT_VALUES.HOME_HERO_BACKGROUND_IMAGE,
    label: 'Homepage - Hero Background Image',
    description: 'Reserved for the homepage hero background visual.',
    status: 'recommended-for-future-use'
  },
  {
    value: MEDIA_PLACEMENT_VALUES.ABOUT_TOP_IMAGE,
    label: 'About Page - Top Brand Image',
    description: 'Primary image block shown at the top of the About page.',
    status: 'already-in-use'
  },
  {
    value: MEDIA_PLACEMENT_VALUES.ABOUT_FOUNDER_IMAGE,
    label: 'About Page - Founder Image',
    description: 'Founder portrait shown in the About page founder section.',
    status: 'already-in-use'
  },
  {
    value: MEDIA_PLACEMENT_VALUES.HOME_CERTIFICATION_TICKER,
    label: 'Homepage - Certification Ticker',
    description: 'Scrolling certification logos under the homepage hero.',
    status: 'already-in-use'
  },
  {
    value: MEDIA_PLACEMENT_VALUES.LOGOS_PAGE,
    label: 'Logos Page - Brand Logos',
    description: 'Logo grid media rendered on the Logos service page.',
    status: 'already-in-use'
  },
  {
    value: MEDIA_PLACEMENT_VALUES.PORTFOLIO_GRID,
    label: 'Portfolio Page - Grid Projects',
    description: 'Portfolio project media cards shown on the portfolio page.',
    status: 'already-in-use'
  }
];

export const MEDIA_PLACEMENT_PRESETS: MediaPlacementPreset[] = [
  {
    label: 'Portfolio Grid',
    category: MEDIA_CATEGORY_VALUES.PORTFOLIO,
    placement: MEDIA_PLACEMENT_VALUES.PORTFOLIO_GRID
  },
  {
    label: 'Logos Page',
    category: MEDIA_CATEGORY_VALUES.LOGOS,
    placement: MEDIA_PLACEMENT_VALUES.LOGOS_PAGE
  },
  {
    label: 'About Top Image',
    category: MEDIA_CATEGORY_VALUES.BRANDING,
    placement: MEDIA_PLACEMENT_VALUES.ABOUT_TOP_IMAGE
  },
  {
    label: 'Founder Image',
    category: MEDIA_CATEGORY_VALUES.BRANDING,
    placement: MEDIA_PLACEMENT_VALUES.ABOUT_FOUNDER_IMAGE
  },
  {
    label: 'Certification Ticker',
    category: MEDIA_CATEGORY_VALUES.CERTIFICATIONS,
    placement: MEDIA_PLACEMENT_VALUES.HOME_CERTIFICATION_TICKER
  }
];
