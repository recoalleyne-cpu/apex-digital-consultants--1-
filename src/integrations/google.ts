import {
  GOOGLE_INTEGRATIONS,
  GOOGLE_INTEGRATIONS_DIAGNOSTICS
} from '../config/googleIntegrations';
import { hasAnalyticsConsent } from '../utils/cookieConsent';

type ScriptLoadOptions = {
  id: string;
  src: string;
  async?: boolean;
  defer?: boolean;
  attributes?: Record<string, string>;
};

type PageViewPayload = {
  path?: string;
  title?: string;
  location?: string;
};

type AnalyticsEventParams = Record<string, unknown>;

export type GoogleAdsConversionPayload = {
  label?: string;
  value?: number;
  currency?: string;
  transactionId?: string;
  eventCallback?: () => void;
} & AnalyticsEventParams;

type GoogleMapsEmbedOptions = {
  query?: string;
  placeId?: string;
  zoom?: number;
  mapType?: 'roadmap' | 'satellite';
  language?: string;
  region?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    grecaptcha?: unknown;
  }
}

const canUseDom = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const normalizeEventPayload = (payload: AnalyticsEventParams = {}) => {
  const sanitized: Record<string, unknown> = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      sanitized[key] = value;
    }
  });
  return sanitized;
};

const ensureDataLayer = () => {
  if (!canUseDom()) return [];
  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }
  return window.dataLayer;
};

const pushDataLayerEvent = (entry: Record<string, unknown>) => {
  if (!canUseDom()) return;
  ensureDataLayer().push(entry);
};

const upsertMetaTag = (name: string, content: string | null) => {
  if (!canUseDom()) return;
  const selector = `meta[name="${name}"]`;
  const existingTag = document.head.querySelector<HTMLMetaElement>(selector);

  if (!content) {
    existingTag?.remove();
    return;
  }

  const tag = existingTag ?? document.createElement('meta');
  tag.setAttribute('name', name);
  tag.setAttribute('content', content);

  if (!existingTag) {
    document.head.appendChild(tag);
  }
};

const upsertLinkTag = (
  id: string,
  rel: string,
  href: string,
  attributes?: Record<string, string>
) => {
  if (!canUseDom()) return;
  const existingTag = document.getElementById(id) as HTMLLinkElement | null;
  const link = existingTag ?? document.createElement('link');

  link.id = id;
  link.rel = rel;
  link.href = href;

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      link.setAttribute(key, value);
    });
  }

  if (!existingTag) {
    document.head.appendChild(link);
  }
};

const attachScriptLoadListeners = (
  script: HTMLScriptElement,
  resolve: (script: HTMLScriptElement) => void,
  reject: (error: Error) => void
) => {
  const handleLoad = () => {
    script.setAttribute('data-loaded', 'true');
    script.removeEventListener('load', handleLoad);
    script.removeEventListener('error', handleError);
    resolve(script);
  };

  const handleError = () => {
    script.removeEventListener('load', handleLoad);
    script.removeEventListener('error', handleError);
    reject(new Error(`Failed to load script: ${script.src}`));
  };

  script.addEventListener('load', handleLoad);
  script.addEventListener('error', handleError);
};

const loadScriptOnce = ({
  id,
  src,
  async = true,
  defer = true,
  attributes
}: ScriptLoadOptions) => {
  if (!canUseDom()) return Promise.resolve(null);

  const existingById = document.getElementById(id) as HTMLScriptElement | null;
  const existingBySrc = Array.from(document.scripts).find((script) => script.src === src) || null;
  const existingScript = existingById || existingBySrc;

  if (existingScript) {
    if (!existingScript.id) {
      existingScript.id = id;
    }

    if (existingScript.getAttribute('data-loaded') === 'true') {
      return Promise.resolve(existingScript);
    }

    return new Promise((resolve, reject) => {
      attachScriptLoadListeners(existingScript, resolve, reject);
    });
  }

  const script = document.createElement('script');
  script.id = id;
  script.src = src;
  script.async = async;
  script.defer = defer;

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });
  }

  return new Promise<HTMLScriptElement>((resolve, reject) => {
    attachScriptLoadListeners(script, resolve, reject);
    document.head.appendChild(script);
  });
};

const initializeSearchConsoleVerification = () => {
  upsertMetaTag(
    'google-site-verification',
    GOOGLE_INTEGRATIONS.searchConsole.verificationToken
  );
};

const initializeGoogleFonts = () => {
  const stylesheetUrl = GOOGLE_INTEGRATIONS.fonts.stylesheetUrl;
  if (!stylesheetUrl) return;

  upsertLinkTag('apex-google-fonts-preconnect', 'preconnect', 'https://fonts.googleapis.com');
  upsertLinkTag('apex-google-fonts-preconnect-static', 'preconnect', 'https://fonts.gstatic.com', {
    crossorigin: 'anonymous'
  });
  upsertLinkTag('apex-google-fonts-stylesheet', 'stylesheet', stylesheetUrl);
};

const initializeTagManager = () => {
  const tagManagerId = GOOGLE_INTEGRATIONS.tagManager.id;
  if (!tagManagerId || !canUseDom()) return;

  pushDataLayerEvent({
    event: 'gtm.js',
    'gtm.start': Date.now()
  });

  void loadScriptOnce({
    id: 'apex-google-tag-manager',
    src: `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(tagManagerId)}`
  }).catch((error) => {
    console.error('[GoogleIntegrations] Failed to load Google Tag Manager script.', error);
  });
};

const initializeBaseGtagLibrary = (seedId: string) => {
  void loadScriptOnce({
    id: 'apex-google-gtag',
    src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(seedId)}`
  }).catch((error) => {
    console.error('[GoogleIntegrations] Failed to load gtag library.', error);
  });
};

const ensureGtag = () => {
  if (!canUseDom()) return;
  if (typeof window.gtag === 'function') return;

  window.gtag = (...args: unknown[]) => {
    ensureDataLayer().push(args);
  };
};

const initializeAnalytics = () => {
  const { measurementId, useTagManagerTransport, debugMode } = GOOGLE_INTEGRATIONS.analytics;
  if (!measurementId || !canUseDom()) return;

  if (useTagManagerTransport) {
    return;
  }

  initializeBaseGtagLibrary(measurementId);
  ensureDataLayer();
  ensureGtag();

  window.gtag?.('js', new Date());
  window.gtag?.('config', measurementId, {
    send_page_view: false,
    anonymize_ip: true,
    debug_mode: debugMode
  });

};

const initializeAdsTracking = () => {
  if (!canUseDom()) return;

  const conversionId = GOOGLE_INTEGRATIONS.ads.conversionId;
  if (!conversionId) return;

  if (GOOGLE_INTEGRATIONS.analytics.useTagManagerTransport) {
    return;
  }

  initializeBaseGtagLibrary(conversionId);
  ensureDataLayer();
  ensureGtag();
  window.gtag?.('config', conversionId);
};

let baseIntegrationsInitialized = false;
let trackingIntegrationsInitialized = false;
let lastTrackedPath: string | null = null;
let diagnosticsLogged = false;

const logInitializationDiagnosticsOnce = () => {
  if (!canUseDom() || diagnosticsLogged) return;
  diagnosticsLogged = true;

  const enabled = GOOGLE_INTEGRATIONS_DIAGNOSTICS.enabledIntegrations;

  if (!enabled.length) {
    console.info(
      '[GoogleIntegrations] No Google integrations are enabled in this build. Set VITE_GOOGLE_* (or NEXT_PUBLIC_GOOGLE_*) env variables in Vercel and redeploy.'
    );
    return;
  }

  if (GOOGLE_INTEGRATIONS.analytics.debugMode || import.meta.env.DEV) {
    console.info('[GoogleIntegrations] Initialized with configuration:', {
      mode: GOOGLE_INTEGRATIONS_DIAGNOSTICS.mode,
      enabledIntegrations: enabled,
      envSources: GOOGLE_INTEGRATIONS_DIAGNOSTICS.envSources
    });
  }
};

export const initializeGoogleIntegrations = () => {
  if (!canUseDom()) return;
  logInitializationDiagnosticsOnce();

  if (!baseIntegrationsInitialized) {
    initializeSearchConsoleVerification();
    initializeGoogleFonts();
    baseIntegrationsInitialized = true;
  }

  if (!hasAnalyticsConsent() || trackingIntegrationsInitialized) {
    return;
  }

  initializeTagManager();
  initializeAnalytics();
  initializeAdsTracking();
  trackingIntegrationsInitialized = true;
};

const shouldUseGtagDirectly = () =>
  hasAnalyticsConsent() &&
  GOOGLE_INTEGRATIONS.analytics.enabled &&
  !GOOGLE_INTEGRATIONS.analytics.useTagManagerTransport;

const shouldPushToDataLayer = () =>
  hasAnalyticsConsent() &&
  (GOOGLE_INTEGRATIONS.tagManager.enabled || GOOGLE_INTEGRATIONS.analytics.useTagManagerTransport);

export const trackEvent = (eventName: string, params: AnalyticsEventParams = {}) => {
  if (!canUseDom()) return false;
  const normalizedName = eventName.trim();
  if (!normalizedName) return false;

  initializeGoogleIntegrations();
  if (!hasAnalyticsConsent()) return false;

  const payload = normalizeEventPayload(params);
  let dispatched = false;

  if (shouldUseGtagDirectly() && typeof window.gtag === 'function') {
    window.gtag('event', normalizedName, payload);
    dispatched = true;
  }

  if (shouldPushToDataLayer()) {
    pushDataLayerEvent({
      event: normalizedName,
      ...payload
    });
    dispatched = true;
  }

  return dispatched;
};

export const trackPageView = ({ path, title, location }: PageViewPayload = {}) => {
  if (!canUseDom()) return false;
  if (!GOOGLE_INTEGRATIONS.analytics.enabled && !GOOGLE_INTEGRATIONS.tagManager.enabled) {
    return false;
  }

  initializeGoogleIntegrations();

  const pagePath =
    path || `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (pagePath === lastTrackedPath) {
    return false;
  }

  const dispatched = trackEvent('page_view', {
    page_path: pagePath,
    page_title: title || document.title,
    page_location: location || window.location.href
  });

  if (dispatched) {
    lastTrackedPath = pagePath;
  }

  return dispatched;
};

export const trackConversion = ({
  label,
  value,
  currency = 'USD',
  transactionId,
  eventCallback,
  ...extraPayload
}: GoogleAdsConversionPayload = {}) => {
  if (!canUseDom()) return false;

  initializeGoogleIntegrations();
  if (!hasAnalyticsConsent()) return false;

  const conversionId = GOOGLE_INTEGRATIONS.ads.conversionId;
  if (!conversionId) return false;

  const conversionLabel = label || GOOGLE_INTEGRATIONS.ads.conversionLabel;
  const sendTo = conversionLabel ? `${conversionId}/${conversionLabel}` : conversionId;

  const payload = normalizeEventPayload({
    send_to: sendTo,
    value,
    currency,
    transaction_id: transactionId,
    ...extraPayload
  });

  let dispatched = false;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', payload);
    dispatched = true;
  }

  if (shouldPushToDataLayer()) {
    pushDataLayerEvent({
      event: 'google_ads_conversion',
      ...payload
    });
    dispatched = true;
  }

  if (dispatched && typeof eventCallback === 'function') {
    eventCallback();
  }

  return dispatched;
};

export const trackGoogleAdsConversion = trackConversion;

let recaptchaScriptPromise: Promise<boolean> | null = null;

export const loadRecaptchaScript = async () => {
  if (!canUseDom()) return false;
  if (!GOOGLE_INTEGRATIONS.recaptcha.siteKey) return false;
  if (window.grecaptcha) return true;

  if (!recaptchaScriptPromise) {
    const siteKey = GOOGLE_INTEGRATIONS.recaptcha.siteKey;
    recaptchaScriptPromise = loadScriptOnce({
      id: 'apex-google-recaptcha',
      src: `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
    })
      .then(() => true)
      .catch((error) => {
        console.error('[GoogleIntegrations] Failed to load reCAPTCHA script.', error);
        return false;
      });
  }

  return recaptchaScriptPromise;
};

export const getRecaptchaSiteKey = () => GOOGLE_INTEGRATIONS.recaptcha.siteKey;

let mapsScriptPromise: Promise<boolean> | null = null;

export const loadGoogleMapsApi = async (libraries: string[] = []) => {
  if (!canUseDom()) return false;

  const mapsApiKey = GOOGLE_INTEGRATIONS.maps.apiKey;
  if (!mapsApiKey) return false;

  if (!mapsScriptPromise) {
    const uniqueLibraries = Array.from(
      new Set(
        libraries
          .map((library) => library.trim())
          .filter(Boolean)
      )
    );

    const librariesParam = uniqueLibraries.length
      ? `&libraries=${encodeURIComponent(uniqueLibraries.join(','))}`
      : '';

    mapsScriptPromise = loadScriptOnce({
      id: 'apex-google-maps-api',
      src: `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        mapsApiKey
      )}${librariesParam}`
    })
      .then(() => true)
      .catch((error) => {
        console.error('[GoogleIntegrations] Failed to load Google Maps API script.', error);
        return false;
      });
  }

  return mapsScriptPromise;
};

export const buildGoogleMapsEmbedUrl = ({
  query,
  placeId,
  zoom,
  mapType,
  language,
  region
}: GoogleMapsEmbedOptions) => {
  const apiKey = GOOGLE_INTEGRATIONS.maps.apiKey;
  if (!apiKey) return null;
  if (!query && !placeId) return null;

  const params = new URLSearchParams({
    key: apiKey
  });

  if (placeId) {
    params.set('q', `place_id:${placeId}`);
  } else if (query) {
    params.set('q', query);
  }

  if (typeof zoom === 'number') {
    params.set('zoom', String(Math.max(0, Math.min(21, Math.round(zoom)))));
  }

  if (mapType) {
    params.set('maptype', mapType);
  }

  if (language) {
    params.set('language', language);
  }

  if (region) {
    params.set('region', region);
  }

  return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
};

export const getGoogleIntegrationsConfig = () => GOOGLE_INTEGRATIONS;
