/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
  readonly VITE_GA4_MEASUREMENT_ID?: string;
  readonly VITE_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT?: string;
  readonly VITE_GOOGLE_TAG_MANAGER_ID?: string;
  readonly VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION?: string;
  readonly VITE_GOOGLE_ADS_ID?: string;
  readonly VITE_GOOGLE_ADS_CONVERSION_LABEL?: string;
  readonly VITE_GOOGLE_RECAPTCHA_SITE_KEY?: string;
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  readonly VITE_GOOGLE_FONTS_ENABLED?: string;
  readonly VITE_GOOGLE_FONTS_STYLESHEET_URL?: string;
  readonly VITE_GOOGLE_DEBUG?: string;
  readonly [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
