export const MEDIA_PLACEMENT_VALUES = {
  ABOUT_TOP_IMAGE: 'about-top-image',
  ABOUT_FOUNDER_IMAGE: 'about-founder-image',
  HOME_CERTIFICATION_TICKER: 'home-certification-ticker',
  LOGOS_PAGE: 'logos-page',
  PORTFOLIO_GRID: 'portfolio-grid'
} as const;

export type MediaPlacementValue =
  (typeof MEDIA_PLACEMENT_VALUES)[keyof typeof MEDIA_PLACEMENT_VALUES];

export type MediaPlacementOption = {
  value: MediaPlacementValue;
  label: string;
  description?: string;
};

export type MediaPlacementPreset = {
  label: string;
  category: string;
  placement: MediaPlacementValue;
};

export const MEDIA_PLACEMENT_OPTIONS: MediaPlacementOption[] = [
  {
    value: MEDIA_PLACEMENT_VALUES.ABOUT_TOP_IMAGE,
    label: 'About Page - Top Brand Image',
    description: 'Primary image block shown at the top of the About page.'
  },
  {
    value: MEDIA_PLACEMENT_VALUES.ABOUT_FOUNDER_IMAGE,
    label: 'About Page - Founder Image',
    description: 'Founder portrait shown in the About page founder section.'
  },
  {
    value: MEDIA_PLACEMENT_VALUES.HOME_CERTIFICATION_TICKER,
    label: 'Homepage - Certification Ticker',
    description: 'Scrolling certification logos under the homepage hero.'
  },
  {
    value: MEDIA_PLACEMENT_VALUES.LOGOS_PAGE,
    label: 'Logos Page - Brand Logos',
    description: 'Logo grid media rendered on the Logos service page.'
  },
  {
    value: MEDIA_PLACEMENT_VALUES.PORTFOLIO_GRID,
    label: 'Portfolio Page - Grid Projects',
    description: 'Portfolio project media cards shown on the portfolio page.'
  }
];

export const MEDIA_PLACEMENT_PRESETS: MediaPlacementPreset[] = [
  {
    label: 'Portfolio Grid',
    category: 'portfolio',
    placement: MEDIA_PLACEMENT_VALUES.PORTFOLIO_GRID
  },
  {
    label: 'Logos Page',
    category: 'logos',
    placement: MEDIA_PLACEMENT_VALUES.LOGOS_PAGE
  },
  {
    label: 'About Top Image',
    category: 'branding',
    placement: MEDIA_PLACEMENT_VALUES.ABOUT_TOP_IMAGE
  },
  {
    label: 'Founder Image',
    category: 'branding',
    placement: MEDIA_PLACEMENT_VALUES.ABOUT_FOUNDER_IMAGE
  },
  {
    label: 'Certification Ticker',
    category: 'certifications',
    placement: MEDIA_PLACEMENT_VALUES.HOME_CERTIFICATION_TICKER
  }
];
