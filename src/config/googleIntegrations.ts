const DEFAULT_GOOGLE_FONTS_STYLESHEET_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap';

const normalizeText = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const parseBoolean = (value: unknown, fallback: boolean) => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return fallback;

  const normalized = value.trim().toLowerCase();

  if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
    return true;
  }

  if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
    return false;
  }

  return fallback;
};

const readEnvValue = (...keys: string[]) => {
  const viteEnv = import.meta.env as Record<string, unknown>;
  const runtimeEnv = globalThis.process?.env as Record<string, unknown> | undefined;

  for (const key of keys) {
    const fromVite = normalizeText(viteEnv[key]);
    if (fromVite) return fromVite;

    const fromRuntime = normalizeText(runtimeEnv?.[key]);
    if (fromRuntime) return fromRuntime;
  }

  return null;
};

const readBooleanEnvValue = (keys: string[], fallback: boolean) => {
  const viteEnv = import.meta.env as Record<string, unknown>;
  const runtimeEnv = globalThis.process?.env as Record<string, unknown> | undefined;

  for (const key of keys) {
    if (viteEnv[key] !== undefined) {
      return parseBoolean(viteEnv[key], fallback);
    }
    if (runtimeEnv?.[key] !== undefined) {
      return parseBoolean(runtimeEnv[key], fallback);
    }
  }

  return fallback;
};

const analyticsMeasurementId = readEnvValue(
  'VITE_GOOGLE_ANALYTICS_ID',
  'VITE_GA4_MEASUREMENT_ID',
  'GOOGLE_ANALYTICS_ID',
  'GA4_MEASUREMENT_ID'
);

const tagManagerId = readEnvValue(
  'VITE_GOOGLE_TAG_MANAGER_ID',
  'GOOGLE_TAG_MANAGER_ID'
);
const searchConsoleVerificationToken = readEnvValue(
  'VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION',
  'GOOGLE_SEARCH_CONSOLE_VERIFICATION'
);
const adsConversionId = readEnvValue('VITE_GOOGLE_ADS_ID', 'GOOGLE_ADS_ID');
const adsConversionLabel = readEnvValue(
  'VITE_GOOGLE_ADS_CONVERSION_LABEL',
  'GOOGLE_ADS_CONVERSION_LABEL'
);
const recaptchaSiteKey = readEnvValue(
  'VITE_GOOGLE_RECAPTCHA_SITE_KEY',
  'GOOGLE_RECAPTCHA_SITE_KEY'
);
const mapsApiKey = readEnvValue('VITE_GOOGLE_MAPS_API_KEY', 'GOOGLE_MAPS_API_KEY');

const prefersGtmTransport = readBooleanEnvValue(
  ['VITE_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT', 'GOOGLE_ANALYTICS_USE_GTM_TRANSPORT'],
  true
);

const fontsEnabled = readBooleanEnvValue(
  ['VITE_GOOGLE_FONTS_ENABLED', 'GOOGLE_FONTS_ENABLED'],
  true
);

const configuredFontsStylesheetUrl = readEnvValue(
  'VITE_GOOGLE_FONTS_STYLESHEET_URL',
  'GOOGLE_FONTS_STYLESHEET_URL'
);

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
    useTagManagerTransport: Boolean(
      analyticsMeasurementId && tagManagerId && prefersGtmTransport
    ),
    debugMode: readBooleanEnvValue(['VITE_GOOGLE_DEBUG', 'GOOGLE_DEBUG'], false)
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
