const DEFAULT_GOOGLE_FONTS_STYLESHEET_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap';
const DEFAULT_APEX_GA4_MEASUREMENT_ID = 'G-P90G0JVPHR';
const DEFAULT_APEX_GTM_ID = 'GTM-NCS79KC';
const DEFAULT_SEARCH_CONSOLE_VERIFICATION_VALUE =
  'google-site-verification=Ctitn_aQbeuInLxzINTGztWfH58b28h3PU3S-bLKLvQ';
const SEARCH_CONSOLE_TOKEN_PREFIX = 'google-site-verification=';

const BUILD_TIME_ENV_FALLBACKS: Record<string, unknown> = {
  VITE_GOOGLE_ANALYTICS_ID: __APEX_GOOGLE_ANALYTICS_ID__,
  VITE_GA4_MEASUREMENT_ID: __APEX_GOOGLE_ANALYTICS_ID__,
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: __APEX_GOOGLE_ANALYTICS_ID__,
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: __APEX_GOOGLE_ANALYTICS_ID__,
  GOOGLE_ANALYTICS_ID: __APEX_GOOGLE_ANALYTICS_ID__,
  GA4_MEASUREMENT_ID: __APEX_GOOGLE_ANALYTICS_ID__,
  VITE_GOOGLE_TAG_MANAGER_ID: __APEX_GOOGLE_TAG_MANAGER_ID__,
  NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: __APEX_GOOGLE_TAG_MANAGER_ID__,
  GOOGLE_TAG_MANAGER_ID: __APEX_GOOGLE_TAG_MANAGER_ID__,
  VITE_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT: __APEX_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT__,
  NEXT_PUBLIC_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT: __APEX_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT__,
  GOOGLE_ANALYTICS_USE_GTM_TRANSPORT: __APEX_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT__,
  VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION: __APEX_GOOGLE_SEARCH_CONSOLE_VERIFICATION__,
  NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION: __APEX_GOOGLE_SEARCH_CONSOLE_VERIFICATION__,
  GOOGLE_SEARCH_CONSOLE_VERIFICATION: __APEX_GOOGLE_SEARCH_CONSOLE_VERIFICATION__,
  VITE_GOOGLE_ADS_ID: __APEX_GOOGLE_ADS_ID__,
  NEXT_PUBLIC_GOOGLE_ADS_ID: __APEX_GOOGLE_ADS_ID__,
  GOOGLE_ADS_ID: __APEX_GOOGLE_ADS_ID__,
  VITE_GOOGLE_ADS_CONVERSION_LABEL: __APEX_GOOGLE_ADS_CONVERSION_LABEL__,
  NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL: __APEX_GOOGLE_ADS_CONVERSION_LABEL__,
  GOOGLE_ADS_CONVERSION_LABEL: __APEX_GOOGLE_ADS_CONVERSION_LABEL__,
  VITE_GOOGLE_RECAPTCHA_SITE_KEY: __APEX_GOOGLE_RECAPTCHA_SITE_KEY__,
  NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY: __APEX_GOOGLE_RECAPTCHA_SITE_KEY__,
  GOOGLE_RECAPTCHA_SITE_KEY: __APEX_GOOGLE_RECAPTCHA_SITE_KEY__,
  VITE_GOOGLE_MAPS_API_KEY: __APEX_GOOGLE_MAPS_API_KEY__,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: __APEX_GOOGLE_MAPS_API_KEY__,
  GOOGLE_MAPS_API_KEY: __APEX_GOOGLE_MAPS_API_KEY__,
  VITE_GOOGLE_FONTS_ENABLED: __APEX_GOOGLE_FONTS_ENABLED__,
  NEXT_PUBLIC_GOOGLE_FONTS_ENABLED: __APEX_GOOGLE_FONTS_ENABLED__,
  GOOGLE_FONTS_ENABLED: __APEX_GOOGLE_FONTS_ENABLED__,
  VITE_GOOGLE_FONTS_STYLESHEET_URL: __APEX_GOOGLE_FONTS_STYLESHEET_URL__,
  NEXT_PUBLIC_GOOGLE_FONTS_STYLESHEET_URL: __APEX_GOOGLE_FONTS_STYLESHEET_URL__,
  GOOGLE_FONTS_STYLESHEET_URL: __APEX_GOOGLE_FONTS_STYLESHEET_URL__,
  VITE_GOOGLE_DEBUG: __APEX_GOOGLE_DEBUG__,
  NEXT_PUBLIC_GOOGLE_DEBUG: __APEX_GOOGLE_DEBUG__,
  GOOGLE_DEBUG: __APEX_GOOGLE_DEBUG__
};

const normalizeText = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const normalizeSearchConsoleVerificationToken = (value: string | null) => {
  const normalized = normalizeText(value);
  if (!normalized) return null;

  if (normalized.toLowerCase().startsWith(SEARCH_CONSOLE_TOKEN_PREFIX)) {
    const token = normalized.slice(SEARCH_CONSOLE_TOKEN_PREFIX.length).trim();
    return token.length ? token : null;
  }

  return normalized;
};

const parseBoolean = (value: unknown) => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return null;

  const normalized = value.trim().toLowerCase();
  if (!normalized.length) return null;

  if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
    return true;
  }

  if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
    return false;
  }

  return null;
};

const readEnvValue = (...keys: string[]) => {
  const viteEnv = import.meta.env as Record<string, unknown>;
  const runtimeEnv = globalThis.process?.env as Record<string, unknown> | undefined;

  for (const key of keys) {
    const fromVite = normalizeText(viteEnv[key]);
    if (fromVite) {
      return {
        value: fromVite,
        source: `import.meta.env.${key}`
      };
    }

    const fromBuildTime = normalizeText(BUILD_TIME_ENV_FALLBACKS[key]);
    if (fromBuildTime) {
      return {
        value: fromBuildTime,
        source: `build-time.${key}`
      };
    }

    const fromRuntime = normalizeText(runtimeEnv?.[key]);
    if (fromRuntime) {
      return {
        value: fromRuntime,
        source: `runtime.${key}`
      };
    }
  }

  return {
    value: null,
    source: null
  };
};

const readBooleanEnvValue = (keys: string[], fallback: boolean) => {
  const viteEnv = import.meta.env as Record<string, unknown>;
  const runtimeEnv = globalThis.process?.env as Record<string, unknown> | undefined;

  for (const key of keys) {
    const fromVite = parseBoolean(viteEnv[key]);
    if (fromVite !== null) {
      return {
        value: fromVite,
        source: `import.meta.env.${key}`
      };
    }

    const fromBuildTime = parseBoolean(BUILD_TIME_ENV_FALLBACKS[key]);
    if (fromBuildTime !== null) {
      return {
        value: fromBuildTime,
        source: `build-time.${key}`
      };
    }

    const fromRuntime = parseBoolean(runtimeEnv?.[key]);
    if (fromRuntime !== null) {
      return {
        value: fromRuntime,
        source: `runtime.${key}`
      };
    }
  }

  return {
    value: fallback,
    source: null
  };
};

const analyticsMeasurementIdResolution = readEnvValue(
  'VITE_GOOGLE_ANALYTICS_ID',
  'VITE_GA4_MEASUREMENT_ID',
  'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID',
  'NEXT_PUBLIC_GA4_MEASUREMENT_ID',
  'GOOGLE_ANALYTICS_ID',
  'GA4_MEASUREMENT_ID'
);

const tagManagerIdResolution = readEnvValue(
  'VITE_GOOGLE_TAG_MANAGER_ID',
  'NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID',
  'GOOGLE_TAG_MANAGER_ID'
);
const searchConsoleVerificationTokenResolution = readEnvValue(
  'VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION',
  'NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION',
  'GOOGLE_SEARCH_CONSOLE_VERIFICATION'
);
const adsConversionIdResolution = readEnvValue(
  'VITE_GOOGLE_ADS_ID',
  'NEXT_PUBLIC_GOOGLE_ADS_ID',
  'GOOGLE_ADS_ID'
);
const adsConversionLabelResolution = readEnvValue(
  'VITE_GOOGLE_ADS_CONVERSION_LABEL',
  'NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL',
  'GOOGLE_ADS_CONVERSION_LABEL'
);
const recaptchaSiteKeyResolution = readEnvValue(
  'VITE_GOOGLE_RECAPTCHA_SITE_KEY',
  'NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY',
  'GOOGLE_RECAPTCHA_SITE_KEY'
);
const mapsApiKeyResolution = readEnvValue(
  'VITE_GOOGLE_MAPS_API_KEY',
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  'GOOGLE_MAPS_API_KEY'
);

const prefersGtmTransportResolution = readBooleanEnvValue(
  [
    'VITE_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT',
    'NEXT_PUBLIC_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT',
    'GOOGLE_ANALYTICS_USE_GTM_TRANSPORT'
  ],
  true
);

const fontsEnabledResolution = readBooleanEnvValue(
  ['VITE_GOOGLE_FONTS_ENABLED', 'NEXT_PUBLIC_GOOGLE_FONTS_ENABLED', 'GOOGLE_FONTS_ENABLED'],
  true
);

const configuredFontsStylesheetUrlResolution = readEnvValue(
  'VITE_GOOGLE_FONTS_STYLESHEET_URL',
  'NEXT_PUBLIC_GOOGLE_FONTS_STYLESHEET_URL',
  'GOOGLE_FONTS_STYLESHEET_URL'
);

const debugModeResolution = readBooleanEnvValue(
  ['VITE_GOOGLE_DEBUG', 'NEXT_PUBLIC_GOOGLE_DEBUG', 'GOOGLE_DEBUG'],
  false
);

const analyticsMeasurementId = analyticsMeasurementIdResolution.value || DEFAULT_APEX_GA4_MEASUREMENT_ID;
const tagManagerId = tagManagerIdResolution.value || DEFAULT_APEX_GTM_ID;
const searchConsoleVerificationToken = normalizeSearchConsoleVerificationToken(
  searchConsoleVerificationTokenResolution.value || DEFAULT_SEARCH_CONSOLE_VERIFICATION_VALUE
);
const adsConversionId = adsConversionIdResolution.value;
const adsConversionLabel = adsConversionLabelResolution.value;
const recaptchaSiteKey = recaptchaSiteKeyResolution.value;
const mapsApiKey = mapsApiKeyResolution.value;
const prefersGtmTransport = prefersGtmTransportResolution.value;
const fontsEnabled = fontsEnabledResolution.value;
const configuredFontsStylesheetUrl = configuredFontsStylesheetUrlResolution.value;

const fontsStylesheetUrl = fontsEnabled
  ? configuredFontsStylesheetUrl || DEFAULT_GOOGLE_FONTS_STYLESHEET_URL
  : null;

export type GoogleIntegrationsConfig = {
  analytics: {
    measurementId: string | null;
    enabled: boolean;
    useTagManagerTransport: boolean;
    debugMode: boolean;
  };
  tagManager: {
    id: string | null;
    enabled: boolean;
  };
  searchConsole: {
    verificationToken: string | null;
    enabled: boolean;
  };
  ads: {
    conversionId: string | null;
    conversionLabel: string | null;
    enabled: boolean;
  };
  recaptcha: {
    siteKey: string | null;
    enabled: boolean;
  };
  maps: {
    apiKey: string | null;
    enabled: boolean;
  };
  fonts: {
    stylesheetUrl: string | null;
    enabled: boolean;
  };
};

export const GOOGLE_INTEGRATIONS: GoogleIntegrationsConfig = {
  analytics: {
    measurementId: analyticsMeasurementId,
    enabled: Boolean(analyticsMeasurementId),
    useTagManagerTransport: Boolean(analyticsMeasurementId && tagManagerId && prefersGtmTransport),
    debugMode: debugModeResolution.value
  },
  tagManager: {
    id: tagManagerId,
    enabled: Boolean(tagManagerId)
  },
  searchConsole: {
    verificationToken: searchConsoleVerificationToken,
    enabled: Boolean(searchConsoleVerificationToken)
  },
  ads: {
    conversionId: adsConversionId,
    conversionLabel: adsConversionLabel,
    enabled: Boolean(adsConversionId)
  },
  recaptcha: {
    siteKey: recaptchaSiteKey,
    enabled: Boolean(recaptchaSiteKey)
  },
  maps: {
    apiKey: mapsApiKey,
    enabled: Boolean(mapsApiKey)
  },
  fonts: {
    stylesheetUrl: fontsStylesheetUrl,
    enabled: Boolean(fontsStylesheetUrl)
  }
};

export type GoogleIntegrationsDiagnostics = {
  mode: string;
  envSources: {
    analyticsMeasurementId: string | null;
    tagManagerId: string | null;
    searchConsoleVerificationToken: string | null;
    adsConversionId: string | null;
    adsConversionLabel: string | null;
    recaptchaSiteKey: string | null;
    mapsApiKey: string | null;
    analyticsUseTagManagerTransport: string | null;
    fontsEnabled: string | null;
    fontsStylesheetUrl: string | null;
    debugMode: string | null;
  };
  enabledIntegrations: string[];
};

const enabledIntegrations = Object.entries(GOOGLE_INTEGRATIONS)
  .filter(([, integration]) => integration.enabled)
  .map(([name]) => name);

export const GOOGLE_INTEGRATIONS_DIAGNOSTICS: GoogleIntegrationsDiagnostics = {
  mode: import.meta.env.MODE,
  envSources: {
    analyticsMeasurementId: analyticsMeasurementIdResolution.source,
    tagManagerId: tagManagerIdResolution.source,
    searchConsoleVerificationToken: searchConsoleVerificationTokenResolution.source,
    adsConversionId: adsConversionIdResolution.source,
    adsConversionLabel: adsConversionLabelResolution.source,
    recaptchaSiteKey: recaptchaSiteKeyResolution.source,
    mapsApiKey: mapsApiKeyResolution.source,
    analyticsUseTagManagerTransport: prefersGtmTransportResolution.source,
    fontsEnabled: fontsEnabledResolution.source,
    fontsStylesheetUrl: configuredFontsStylesheetUrlResolution.source,
    debugMode: debugModeResolution.source
  },
  enabledIntegrations
};
