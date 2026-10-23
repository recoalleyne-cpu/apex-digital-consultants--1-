/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
  readonly VITE_GA4_MEASUREMENT_ID?: string;
  readonly NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?: string;
  readonly NEXT_PUBLIC_GA4_MEASUREMENT_ID?: string;
  readonly VITE_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT?: string;
  readonly NEXT_PUBLIC_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT?: string;
  readonly VITE_GOOGLE_TAG_MANAGER_ID?: string;
  readonly NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID?: string;
  readonly VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION?: string;
  readonly NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION?: string;
  readonly VITE_GOOGLE_ADS_ID?: string;
  readonly NEXT_PUBLIC_GOOGLE_ADS_ID?: string;
  readonly VITE_GOOGLE_ADS_CONVERSION_LABEL?: string;
  readonly NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL?: string;
  readonly VITE_GOOGLE_RECAPTCHA_SITE_KEY?: string;
  readonly NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY?: string;
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  readonly NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string;
  readonly VITE_GOOGLE_FONTS_ENABLED?: string;
  readonly NEXT_PUBLIC_GOOGLE_FONTS_ENABLED?: string;
  readonly VITE_GOOGLE_FONTS_STYLESHEET_URL?: string;
  readonly NEXT_PUBLIC_GOOGLE_FONTS_STYLESHEET_URL?: string;
  readonly VITE_GOOGLE_DEBUG?: string;
  readonly NEXT_PUBLIC_GOOGLE_DEBUG?: string;
  readonly [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APEX_GOOGLE_ANALYTICS_ID__: string | undefined;
declare const __APEX_GOOGLE_TAG_MANAGER_ID__: string | undefined;
declare const __APEX_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT__: string | undefined;
declare const __APEX_GOOGLE_SEARCH_CONSOLE_VERIFICATION__: string | undefined;
declare const __APEX_GOOGLE_ADS_ID__: string | undefined;
declare const __APEX_GOOGLE_ADS_CONVERSION_LABEL__: string | undefined;
declare const __APEX_GOOGLE_RECAPTCHA_SITE_KEY__: string | undefined;
declare const __APEX_GOOGLE_MAPS_API_KEY__: string | undefined;
declare const __APEX_GOOGLE_FONTS_ENABLED__: string | undefined;
declare const __APEX_GOOGLE_FONTS_STYLESHEET_URL__: string | undefined;
declare const __APEX_GOOGLE_DEBUG__: string | undefined;
