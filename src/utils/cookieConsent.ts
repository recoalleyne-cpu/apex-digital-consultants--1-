export type AnalyticsConsentDecision = 'granted' | 'denied';
export type AnalyticsConsentState = AnalyticsConsentDecision | 'unset';

export const ANALYTICS_CONSENT_STORAGE_KEY = 'apex_analytics_consent_v1';
export const ANALYTICS_CONSENT_EVENT = 'apex-analytics-consent-updated';

const canUseDom = () => typeof window !== 'undefined';

const normalizeConsentValue = (value: string | null): AnalyticsConsentState => {
  if (!value) return 'unset';
  if (value === 'granted' || value === 'denied') return value;
  return 'unset';
};

export const readAnalyticsConsent = (): AnalyticsConsentState => {
  if (!canUseDom()) return 'unset';
  return normalizeConsentValue(window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY));
};

export const hasAnalyticsConsent = () => readAnalyticsConsent() === 'granted';

export const writeAnalyticsConsent = (decision: AnalyticsConsentDecision) => {
  if (!canUseDom()) return;

  window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, decision);
  window.dispatchEvent(
    new CustomEvent<AnalyticsConsentDecision>(ANALYTICS_CONSENT_EVENT, {
      detail: decision
    })
  );
};

export const onAnalyticsConsentChange = (
  listener: (nextValue: AnalyticsConsentState) => void
) => {
  if (!canUseDom()) {
    return () => undefined;
  }

  const handleConsentEvent = (event: Event) => {
    const customEvent = event as CustomEvent<AnalyticsConsentDecision>;
    listener(normalizeConsentValue(customEvent.detail || null));
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== ANALYTICS_CONSENT_STORAGE_KEY) return;
    listener(normalizeConsentValue(event.newValue));
  };

  window.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsentEvent);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsentEvent);
    window.removeEventListener('storage', handleStorage);
  };
};
