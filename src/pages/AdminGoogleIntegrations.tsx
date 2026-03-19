import React from 'react';
import { CheckCircle2, Copy, Link2, Mail, Settings2, XCircle } from 'lucide-react';
import { AdminSettingsAccordion } from '../components/admin/AdminSettingsAccordion';
import {
  GOOGLE_INTEGRATIONS,
  GOOGLE_INTEGRATIONS_DIAGNOSTICS
} from '../config/googleIntegrations';

type IntegrationDetail = {
  id: string;
  label: string;
  value: string | null;
};

type IntegrationStatus = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  value: string | null;
  envKeys: string[];
  source: string | null;
  details?: IntegrationDetail[];
};

type SectionKey = 'overview' | 'googleIntegrations' | 'emailIntegrations' | 'template';

type EmailProviderId = 'mailchimp' | 'brevo' | 'convertkit' | 'klaviyo' | 'activecampaign';

type EmailProviderFieldKey = 'apiKey' | 'accountId' | 'listId';

type EmailProviderConfig = {
  enabled: boolean;
  apiKey: string;
  accountId: string;
  listId: string;
};

type EmailProviderMeta = {
  id: EmailProviderId;
  name: string;
  description: string;
  helperText: string;
  envKeys: string[];
  fields: Array<{
    key: EmailProviderFieldKey;
    label: string;
    placeholder: string;
    inputType?: 'text' | 'password' | 'url';
  }>;
};

const GOOGLE_ENV_TEMPLATE = [
  '# Preferred in Vercel (client-visible):',
  'VITE_GOOGLE_ANALYTICS_ID=',
  'VITE_GOOGLE_TAG_MANAGER_ID=',
  'VITE_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT=true',
  'VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION=',
  'VITE_GOOGLE_ADS_ID=',
  'VITE_GOOGLE_ADS_CONVERSION_LABEL=',
  'VITE_GOOGLE_RECAPTCHA_SITE_KEY=',
  'VITE_GOOGLE_MAPS_API_KEY=',
  'VITE_GOOGLE_FONTS_ENABLED=true',
  'VITE_GOOGLE_FONTS_STYLESHEET_URL=',
  'VITE_GOOGLE_DEBUG=false'
].join('\n');

const DEFAULT_EMAIL_PROVIDER_CONFIG: EmailProviderConfig = {
  enabled: false,
  apiKey: '',
  accountId: '',
  listId: ''
};

const EMAIL_MARKETING_PROVIDERS: EmailProviderMeta[] = [
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Sync audiences and campaign events for lifecycle email marketing.',
    helperText: 'Use this integration for audience syncing and campaign hand-off workflows.',
    envKeys: [
      'VITE_EMAIL_MAILCHIMP_API_KEY',
      'VITE_EMAIL_MAILCHIMP_SERVER_PREFIX',
      'VITE_EMAIL_MAILCHIMP_AUDIENCE_ID'
    ],
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'xxxxxxxx-us1', inputType: 'password' },
      { key: 'accountId', label: 'Server Prefix', placeholder: 'us1' },
      { key: 'listId', label: 'Audience / List ID', placeholder: 'audience-id' }
    ]
  },
  {
    id: 'brevo',
    name: 'Brevo / Sendinblue',
    description: 'Connect transactional and bulk campaign lists from Brevo.',
    helperText: 'Use this integration when list growth and automation are managed in Brevo.',
    envKeys: [
      'VITE_EMAIL_BREVO_API_KEY',
      'VITE_EMAIL_BREVO_ACCOUNT_ID',
      'VITE_EMAIL_BREVO_LIST_ID'
    ],
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'xkeysib-...', inputType: 'password' },
      { key: 'accountId', label: 'Account / Sender ID', placeholder: 'account-id' },
      { key: 'listId', label: 'List ID', placeholder: 'list-id' }
    ]
  },
  {
    id: 'convertkit',
    name: 'ConvertKit',
    description: 'Capture leads into forms and tags for creator-focused automations.',
    helperText: 'Use this integration when funnels depend on ConvertKit forms or tags.',
    envKeys: [
      'VITE_EMAIL_CONVERTKIT_API_SECRET',
      'VITE_EMAIL_CONVERTKIT_API_KEY',
      'VITE_EMAIL_CONVERTKIT_FORM_OR_TAG_ID'
    ],
    fields: [
      { key: 'apiKey', label: 'API Secret', placeholder: 'secret', inputType: 'password' },
      { key: 'accountId', label: 'API Key', placeholder: 'public-api-key', inputType: 'password' },
      { key: 'listId', label: 'Form / Tag ID', placeholder: 'form-or-tag-id' }
    ]
  },
  {
    id: 'klaviyo',
    name: 'Klaviyo',
    description: 'Map lead capture events to Klaviyo lists and lifecycle segments.',
    helperText: 'Use this integration for ecommerce-oriented list and segment automation.',
    envKeys: ['VITE_EMAIL_KLAVIYO_PRIVATE_KEY', 'VITE_EMAIL_KLAVIYO_SITE_ID', 'VITE_EMAIL_KLAVIYO_LIST_ID'],
    fields: [
      { key: 'apiKey', label: 'Private API Key', placeholder: 'pk_...', inputType: 'password' },
      { key: 'accountId', label: 'Site ID', placeholder: 'site-id' },
      { key: 'listId', label: 'List ID', placeholder: 'list-id' }
    ]
  },
  {
    id: 'activecampaign',
    name: 'ActiveCampaign',
    description: 'Support CRM-linked contact sync and automation list workflows.',
    helperText: 'Use this integration when sales and nurture automations run in ActiveCampaign.',
    envKeys: [
      'VITE_EMAIL_ACTIVECAMPAIGN_API_KEY',
      'VITE_EMAIL_ACTIVECAMPAIGN_ACCOUNT_URL',
      'VITE_EMAIL_ACTIVECAMPAIGN_LIST_ID'
    ],
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'api-key', inputType: 'password' },
      { key: 'accountId', label: 'Account URL', placeholder: 'https://youraccount.api-us1.com', inputType: 'url' },
      { key: 'listId', label: 'List ID', placeholder: 'list-id' }
    ]
  }
];

const maskValue = (value: string | null) => {
  if (!value) return 'Not configured';
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

const formatBooleanSetting = (value: boolean) => (value ? 'Enabled' : 'Disabled');

const buildDefaultEmailConfigs = (): Record<EmailProviderId, EmailProviderConfig> => {
  return EMAIL_MARKETING_PROVIDERS.reduce(
    (allProviders, provider) => ({
      ...allProviders,
      [provider.id]: { ...DEFAULT_EMAIL_PROVIDER_CONFIG }
    }),
    {} as Record<EmailProviderId, EmailProviderConfig>
  );
};

const buildDefaultEmailExpansionState = (): Record<EmailProviderId, boolean> => {
  return EMAIL_MARKETING_PROVIDERS.reduce(
    (allProviders, provider, index) => ({
      ...allProviders,
      [provider.id]: index === 0
    }),
    {} as Record<EmailProviderId, boolean>
  );
};

const normalizeText = (value: unknown) => (typeof value === 'string' ? value : '');

const normalizeBoolean = (value: unknown) => (typeof value === 'boolean' ? value : false);

const toObject = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
};

const parseEmailSettingsItem = (itemValue: unknown) => {
  const item = toObject(itemValue);
  const providers = toObject(item?.providers);
  const configs = buildDefaultEmailConfigs();

  if (providers) {
    EMAIL_MARKETING_PROVIDERS.forEach((provider) => {
      const providerPayload = toObject(providers[provider.id]);
      configs[provider.id] = {
        enabled: normalizeBoolean(providerPayload?.enabled),
        apiKey: normalizeText(providerPayload?.apiKey),
        accountId: normalizeText(providerPayload?.accountId),
        listId: normalizeText(providerPayload?.listId)
      };
    });
  }

  return {
    configs,
    updatedAt:
      typeof item?.updated_at === 'string'
        ? item.updated_at
        : item?.updated_at instanceof Date
          ? item.updated_at.toISOString()
          : null
  };
};

const formatSavedTimestamp = (value: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
};

export const AdminGoogleIntegrations = () => {
  const [expandedSections, setExpandedSections] = React.useState<Record<SectionKey, boolean>>({
    overview: true,
    googleIntegrations: true,
    emailIntegrations: true,
    template: false
  });
  const [expandedIntegrations, setExpandedIntegrations] = React.useState<Record<string, boolean>>({});
  const [expandedEmailProviders, setExpandedEmailProviders] = React.useState<
    Record<EmailProviderId, boolean>
  >(buildDefaultEmailExpansionState);
  const [googleStatusMessage, setGoogleStatusMessage] = React.useState(
    'Google integrations are controlled via environment variables and loaded safely at runtime.'
  );
  const [emailStatusMessage, setEmailStatusMessage] = React.useState(
    'Loading email marketing integration settings from backend...'
  );
  const [emailSettingsLoading, setEmailSettingsLoading] = React.useState(true);
  const [emailSavingProvider, setEmailSavingProvider] = React.useState<EmailProviderId | null>(null);
  const [emailSettingsUpdatedAt, setEmailSettingsUpdatedAt] = React.useState<string | null>(null);
  const [emailConfigs, setEmailConfigs] = React.useState<Record<EmailProviderId, EmailProviderConfig>>(
    buildDefaultEmailConfigs
  );

  React.useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadEmailSettings = async () => {
      try {
        const response = await fetch('/api/email-integrations', {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          },
          signal: controller.signal
        });

        if (!response.ok) {
          const responseText = await response.text();
          throw new Error(
            `Email integrations API failed (${response.status}): ${
              responseText.slice(0, 220) || 'No response body'
            }`
          );
        }

        const data = await response.json();
        const parsedSettings = parseEmailSettingsItem(data?.item);

        if (isMounted) {
          setEmailConfigs(parsedSettings.configs);
          setEmailSettingsUpdatedAt(parsedSettings.updatedAt);
          setEmailStatusMessage(
            'Email marketing integration settings loaded from backend.'
          );
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Failed to load email marketing integration settings:', error);
        setEmailStatusMessage(
          'Unable to load email marketing settings from backend. Showing unsaved defaults.'
        );
      } finally {
        if (isMounted) {
          setEmailSettingsLoading(false);
        }
      }
    };

    loadEmailSettings();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const integrationRows: IntegrationStatus[] = [
    {
      id: 'analytics',
      name: 'Google Analytics 4',
      description: 'Tracks page views and custom events.',
      enabled: GOOGLE_INTEGRATIONS.analytics.enabled,
      value: GOOGLE_INTEGRATIONS.analytics.measurementId,
      envKeys: [
        'VITE_GOOGLE_ANALYTICS_ID',
        'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID',
        'GOOGLE_ANALYTICS_ID',
        'VITE_GA4_MEASUREMENT_ID',
        'NEXT_PUBLIC_GA4_MEASUREMENT_ID'
      ],
      source: GOOGLE_INTEGRATIONS_DIAGNOSTICS.envSources.analyticsMeasurementId,
      details: [
        {
          id: 'analytics-transport',
          label: 'GTM Transport',
          value: GOOGLE_INTEGRATIONS.analytics.enabled
            ? formatBooleanSetting(GOOGLE_INTEGRATIONS.analytics.useTagManagerTransport)
            : null
        },
        {
          id: 'analytics-debug',
          label: 'Debug Mode',
          value: GOOGLE_INTEGRATIONS.analytics.enabled
            ? formatBooleanSetting(GOOGLE_INTEGRATIONS.analytics.debugMode)
            : null
        }
      ]
    },
    {
      id: 'gtm',
      name: 'Google Tag Manager',
      description: 'Loads GTM dataLayer and container script.',
      enabled: GOOGLE_INTEGRATIONS.tagManager.enabled,
      value: GOOGLE_INTEGRATIONS.tagManager.id,
      envKeys: [
        'VITE_GOOGLE_TAG_MANAGER_ID',
        'NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID',
        'GOOGLE_TAG_MANAGER_ID'
      ],
      source: GOOGLE_INTEGRATIONS_DIAGNOSTICS.envSources.tagManagerId
    },
    {
      id: 'search-console',
      name: 'Google Search Console',
      description: 'Adds the verification meta tag to the site head.',
      enabled: GOOGLE_INTEGRATIONS.searchConsole.enabled,
      value: GOOGLE_INTEGRATIONS.searchConsole.verificationToken,
      envKeys: [
        'VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION',
        'NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION',
        'GOOGLE_SEARCH_CONSOLE_VERIFICATION'
      ],
      source: GOOGLE_INTEGRATIONS_DIAGNOSTICS.envSources.searchConsoleVerificationToken
    },
    {
      id: 'ads',
      name: 'Google Ads',
      description: 'Enables conversion tracking event helpers.',
      enabled: GOOGLE_INTEGRATIONS.ads.enabled,
      value: GOOGLE_INTEGRATIONS.ads.conversionId,
      envKeys: [
        'VITE_GOOGLE_ADS_ID',
        'NEXT_PUBLIC_GOOGLE_ADS_ID',
        'GOOGLE_ADS_ID',
        'VITE_GOOGLE_ADS_CONVERSION_LABEL',
        'NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL',
        'GOOGLE_ADS_CONVERSION_LABEL'
      ],
      source: GOOGLE_INTEGRATIONS_DIAGNOSTICS.envSources.adsConversionId,
      details: [
        {
          id: 'ads-conversion-label',
          label: 'Conversion Label',
          value: GOOGLE_INTEGRATIONS.ads.conversionLabel
        }
      ]
    },
    {
      id: 'recaptcha',
      name: 'Google reCAPTCHA',
      description: 'Supports secure token validation for forms.',
      enabled: GOOGLE_INTEGRATIONS.recaptcha.enabled,
      value: GOOGLE_INTEGRATIONS.recaptcha.siteKey,
      envKeys: [
        'VITE_GOOGLE_RECAPTCHA_SITE_KEY',
        'NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY',
        'GOOGLE_RECAPTCHA_SITE_KEY'
      ],
      source: GOOGLE_INTEGRATIONS_DIAGNOSTICS.envSources.recaptchaSiteKey
    },
    {
      id: 'maps',
      name: 'Google Maps',
      description: 'Supports embeds and API-driven map loading.',
      enabled: GOOGLE_INTEGRATIONS.maps.enabled,
      value: GOOGLE_INTEGRATIONS.maps.apiKey,
      envKeys: ['VITE_GOOGLE_MAPS_API_KEY', 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', 'GOOGLE_MAPS_API_KEY'],
      source: GOOGLE_INTEGRATIONS_DIAGNOSTICS.envSources.mapsApiKey
    },
    {
      id: 'fonts',
      name: 'Google Fonts',
      description: 'Injects font stylesheet links when enabled.',
      enabled: GOOGLE_INTEGRATIONS.fonts.enabled,
      value: GOOGLE_INTEGRATIONS.fonts.stylesheetUrl,
      envKeys: [
        'VITE_GOOGLE_FONTS_ENABLED',
        'VITE_GOOGLE_FONTS_STYLESHEET_URL',
        'NEXT_PUBLIC_GOOGLE_FONTS_ENABLED',
        'GOOGLE_FONTS_ENABLED'
      ],
      source: GOOGLE_INTEGRATIONS_DIAGNOSTICS.envSources.fontsEnabled
    }
  ];

  const copyText = async (
    text: string,
    setStatus: React.Dispatch<React.SetStateAction<string>>,
    successMessage: string,
    errorMessage: string
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(successMessage);
    } catch {
      setStatus(errorMessage);
    }
  };

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((current) => ({
      ...current,
      [section]: !current[section]
    }));
  };

  const enabledGoogleCount = integrationRows.filter((item) => item.enabled).length;
  const enabledEmailCount = EMAIL_MARKETING_PROVIDERS.filter((provider) => emailConfigs[provider.id].enabled)
    .length;
  const formattedEmailUpdatedAt = formatSavedTimestamp(emailSettingsUpdatedAt);

  const isGoogleIntegrationExpanded = (integrationId: string, defaultExpanded: boolean) =>
    expandedIntegrations[integrationId] ?? defaultExpanded;
  const googleIntegrationOpenStates = integrationRows.map((item) =>
    isGoogleIntegrationExpanded(item.id, item.enabled)
  );
  const hasCollapsedGoogleIntegrations = googleIntegrationOpenStates.some((open) => !open);
  const hasExpandedGoogleIntegrations = googleIntegrationOpenStates.some((open) => open);

  const toggleGoogleIntegration = (integrationId: string, defaultExpanded: boolean) => {
    setExpandedIntegrations((current) => ({
      ...current,
      [integrationId]: !(current[integrationId] ?? defaultExpanded)
    }));
  };

  const setAllGoogleIntegrationsExpanded = (expanded: boolean) => {
    setExpandedIntegrations(
      integrationRows.reduce<Record<string, boolean>>((allRows, item) => {
        allRows[item.id] = expanded;
        return allRows;
      }, {})
    );
  };

  const copyGoogleTemplate = async () => {
    await copyText(
      GOOGLE_ENV_TEMPLATE,
      setGoogleStatusMessage,
      'Google environment template copied. Add values in Vercel and redeploy.',
      'Clipboard copy failed. Copy the environment template manually.'
    );
  };

  const copyGoogleEnvKeys = async (item: IntegrationStatus) => {
    await copyText(
      item.envKeys.join('\n'),
      setGoogleStatusMessage,
      `${item.name} env keys copied.`,
      `Clipboard copy failed for ${item.name} env keys.`
    );
  };

  const isEmailProviderExpanded = (providerId: EmailProviderId, defaultExpanded: boolean) =>
    expandedEmailProviders[providerId] ?? defaultExpanded;
  const emailProviderOpenStates = EMAIL_MARKETING_PROVIDERS.map((provider) =>
    isEmailProviderExpanded(provider.id, emailConfigs[provider.id].enabled)
  );
  const hasCollapsedEmailProviders = emailProviderOpenStates.some((open) => !open);
  const hasExpandedEmailProviders = emailProviderOpenStates.some((open) => open);

  const setAllEmailProvidersExpanded = (expanded: boolean) => {
    setExpandedEmailProviders(
      EMAIL_MARKETING_PROVIDERS.reduce<Record<EmailProviderId, boolean>>((allRows, provider) => {
        allRows[provider.id] = expanded;
        return allRows;
      }, {} as Record<EmailProviderId, boolean>)
    );
  };

  const toggleEmailProvider = (providerId: EmailProviderId, defaultExpanded: boolean) => {
    setExpandedEmailProviders((current) => ({
      ...current,
      [providerId]: !(current[providerId] ?? defaultExpanded)
    }));
  };

  const updateEmailConfig = <K extends keyof EmailProviderConfig>(
    providerId: EmailProviderId,
    field: K,
    value: EmailProviderConfig[K]
  ) => {
    setEmailConfigs((current) => ({
      ...current,
      [providerId]: {
        ...current[providerId],
        [field]: value
      }
    }));
  };

  const setEmailProviderEnabled = (providerId: EmailProviderId, enabled: boolean) => {
    const provider = EMAIL_MARKETING_PROVIDERS.find((item) => item.id === providerId);

    setEmailConfigs((current) => ({
      ...current,
      [providerId]: {
        ...current[providerId],
        enabled
      }
    }));

    if (enabled) {
      setExpandedEmailProviders((current) => ({
        ...current,
        [providerId]: true
      }));
    }

    if (provider) {
      setEmailStatusMessage(
        enabled
          ? `${provider.name} marked as connected. Save settings to persist in backend.`
          : `${provider.name} marked as disconnected. Save settings to persist in backend.`
      );
    }
  };

  const saveEmailProviderSettings = async (providerId: EmailProviderId) => {
    const provider = EMAIL_MARKETING_PROVIDERS.find((item) => item.id === providerId);
    if (!provider) return false;

    try {
      setEmailSavingProvider(providerId);

      const response = await fetch('/api/email-integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          providers: emailConfigs
        })
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(
          `Email integrations save failed (${response.status}): ${
            responseText.slice(0, 220) || 'No response body'
          }`
        );
      }

      const data = await response.json();
      const parsedSettings = parseEmailSettingsItem(data?.item);
      setEmailConfigs(parsedSettings.configs);
      setEmailSettingsUpdatedAt(parsedSettings.updatedAt);
      setEmailStatusMessage(`${provider.name} settings saved to backend.`);
      return true;
    } catch (error) {
      console.error('Failed to save email integration settings:', error);
      setEmailStatusMessage(
        `Unable to save ${provider.name} settings to backend. Please try again.`
      );
      return false;
    } finally {
      setEmailSavingProvider(null);
    }
  };

  const runEmailProviderAction = async (providerId: EmailProviderId, action: 'save' | 'test') => {
    const provider = EMAIL_MARKETING_PROVIDERS.find((item) => item.id === providerId);
    if (!provider) return;

    if (action === 'save') {
      await saveEmailProviderSettings(providerId);
      return;
    }

    setEmailStatusMessage(
      `${provider.name} test connection is a safe placeholder. Wire this button to a server route when credentials are ready.`
    );
  };

  const copyEmailEnvKeys = async (provider: EmailProviderMeta) => {
    await copyText(
      provider.envKeys.join('\n'),
      setEmailStatusMessage,
      `${provider.name} env key template copied.`,
      `Clipboard copy failed for ${provider.name} env key template.`
    );
  };

  return (
    <div className="space-y-6">
      <AdminSettingsAccordion
        title="Integration Settings"
        description="Manage analytics, tracking, and lifecycle integrations in one place. Sections stay collapsed until needed to keep the admin dashboard clean."
        isOpen={expandedSections.overview}
        onToggle={() => toggleSection('overview')}
        badge={
          <span className="inline-flex items-center gap-2 rounded-full border border-apple-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300">
            <Settings2 size={14} />
            {enabledGoogleCount + enabledEmailCount}/
            {integrationRows.length + EMAIL_MARKETING_PROVIDERS.length} Active
          </span>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300">
              Build Mode
            </p>
            <p className="mt-2 text-sm font-mono text-apple-gray-400">{GOOGLE_INTEGRATIONS_DIAGNOSTICS.mode}</p>
          </article>
          <article className="rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300">
              Readiness Snapshot
            </p>
            <p className="mt-2 text-sm text-apple-gray-400">
              Google integrations are env-driven and email providers are draft-ready with conditional controls.
            </p>
          </article>
        </div>
      </AdminSettingsAccordion>

      <AdminSettingsAccordion
        title="Google Integrations"
        description="Review Google Analytics, GTM, Ads, Search Console, reCAPTCHA, Maps, and Fonts with conditional details."
        isOpen={expandedSections.googleIntegrations}
        onToggle={() => toggleSection('googleIntegrations')}
        badge={
          <span className="inline-flex items-center gap-2 rounded-full border border-apple-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300">
            <Settings2 size={14} />
            {enabledGoogleCount}/{integrationRows.length} Enabled
          </span>
        }
        actions={
          expandedSections.googleIntegrations ? (
            <>
              {hasCollapsedGoogleIntegrations ? (
                <button
                  type="button"
                  onClick={() => setAllGoogleIntegrationsExpanded(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                >
                  Expand All
                </button>
              ) : null}
              {hasExpandedGoogleIntegrations ? (
                <button
                  type="button"
                  onClick={() => setAllGoogleIntegrationsExpanded(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                >
                  Collapse All
                </button>
              ) : null}
            </>
          ) : null
        }
        collapsedSummary={
          <p className="text-sm text-apple-gray-300">Expand to review integration-specific fields and actions.</p>
        }
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {integrationRows.map((item) => {
            const isExpanded = isGoogleIntegrationExpanded(item.id, item.enabled);
            const visibleDetails = (item.details ?? []).filter((detail) => Boolean(detail.value));

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-apple-gray-100 bg-white p-5 transition-colors hover:border-apple-gray-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold text-apple-gray-500">{item.name}</h4>
                    <p className="mt-1 text-sm leading-6 text-apple-gray-300">{item.description}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                      item.enabled
                        ? 'border border-green-200 bg-green-50 text-green-700'
                        : 'border border-apple-gray-100 bg-apple-gray-50 text-apple-gray-300'
                    }`}
                  >
                    {item.enabled ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {item.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <p
                    className={`text-xs font-medium uppercase tracking-[0.12em] ${
                      item.enabled ? 'text-green-700' : 'text-apple-gray-300'
                    }`}
                  >
                    {item.enabled ? 'Configured' : 'Awaiting configuration'}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleGoogleIntegration(item.id, item.enabled)}
                    className="inline-flex items-center rounded-xl border border-apple-gray-100 bg-white px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                  >
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>

                {isExpanded ? (
                  <div className="mt-4 space-y-3">
                    <p className="break-all rounded-xl border border-apple-gray-100 bg-apple-gray-50 px-3 py-2 text-xs font-mono text-apple-gray-400">
                      {maskValue(item.value)}
                    </p>

                    {visibleDetails.length ? (
                      <dl className="space-y-2 rounded-xl border border-apple-gray-100 bg-white p-3">
                        {visibleDetails.map((detail) => (
                          <div key={detail.id} className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <dt className="font-medium text-apple-gray-300">{detail.label}</dt>
                            <dd className="font-mono text-apple-gray-400">{detail.value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}

                    <div className="space-y-2">
                      <p className="text-xs text-apple-gray-300">
                        Resolved from:{' '}
                        <span className="font-mono text-apple-gray-400">{item.source || 'Not detected'}</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.envKeys.map((envKey) => (
                          <span
                            key={`${item.id}-${envKey}`}
                            className="inline-flex rounded-full border border-apple-gray-100 bg-apple-gray-50 px-2.5 py-1 text-[11px] font-mono text-apple-gray-400"
                          >
                            {envKey}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        void copyGoogleEnvKeys(item);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                    >
                      <Copy size={13} />
                      Copy Env Keys
                    </button>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </AdminSettingsAccordion>

      <AdminSettingsAccordion
        title="Email Marketing Integrations"
        description="Configure provider settings and persist them in backend storage for reliable reload across admin sessions."
        isOpen={expandedSections.emailIntegrations}
        onToggle={() => toggleSection('emailIntegrations')}
        badge={
          <span className="inline-flex items-center gap-2 rounded-full border border-apple-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300">
            <Mail size={14} />
            {enabledEmailCount}/{EMAIL_MARKETING_PROVIDERS.length} Enabled
          </span>
        }
        actions={
          expandedSections.emailIntegrations ? (
            <>
              {hasCollapsedEmailProviders ? (
                <button
                  type="button"
                  onClick={() => setAllEmailProvidersExpanded(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                >
                  Expand All
                </button>
              ) : null}
              {hasExpandedEmailProviders ? (
                <button
                  type="button"
                  onClick={() => setAllEmailProvidersExpanded(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                >
                  Collapse All
                </button>
              ) : null}
            </>
          ) : null
        }
        collapsedSummary={
          <p className="text-sm text-apple-gray-300">
            Expand to configure Mailchimp, Brevo, ConvertKit, Klaviyo, and ActiveCampaign drafts.
          </p>
        }
      >
        <div className="mb-4 space-y-1">
          <p className="text-sm leading-7 text-apple-gray-300">{emailStatusMessage}</p>
          {formattedEmailUpdatedAt ? (
            <p className="text-xs text-apple-gray-300">
              Last saved: <span className="font-medium text-apple-gray-400">{formattedEmailUpdatedAt}</span>
            </p>
          ) : null}
          {emailSettingsLoading ? (
            <p className="text-xs text-apple-gray-300">Loading backend settings...</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {EMAIL_MARKETING_PROVIDERS.map((provider) => {
            const config = emailConfigs[provider.id];
            const providerExpanded = isEmailProviderExpanded(provider.id, config.enabled);
            const isSavingThisProvider = emailSavingProvider === provider.id;

            return (
              <article
                key={provider.id}
                className="rounded-2xl border border-apple-gray-100 bg-white p-5 transition-colors hover:border-apple-gray-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold text-apple-gray-500">{provider.name}</h4>
                    <p className="mt-1 text-sm leading-6 text-apple-gray-300">{provider.description}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                      config.enabled
                        ? 'border border-green-200 bg-green-50 text-green-700'
                        : 'border border-apple-gray-100 bg-apple-gray-50 text-apple-gray-300'
                    }`}
                  >
                    {config.enabled ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {config.enabled ? 'Connected' : 'Not Connected'}
                  </span>
                </div>

                <p className="mt-3 text-xs text-apple-gray-300">{provider.helperText}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {config.enabled ? (
                    <button
                      type="button"
                      onClick={() => setEmailProviderEnabled(provider.id, false)}
                      disabled={emailSettingsLoading || isSavingThisProvider}
                      className="inline-flex items-center rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEmailProviderEnabled(provider.id, true)}
                      disabled={emailSettingsLoading || isSavingThisProvider}
                      className="inline-flex items-center rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                    >
                      Connect
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      void runEmailProviderAction(provider.id, 'save');
                    }}
                    disabled={emailSettingsLoading || isSavingThisProvider}
                    className="inline-flex items-center rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                  >
                    {isSavingThisProvider ? 'Saving...' : 'Save Settings'}
                  </button>

                  {config.enabled ? (
                    <button
                      type="button"
                      onClick={() => toggleEmailProvider(provider.id, config.enabled)}
                      disabled={emailSettingsLoading}
                      className="inline-flex items-center rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                    >
                      {providerExpanded ? 'Hide Settings' : 'Show Settings'}
                    </button>
                  ) : null}
                </div>

                {config.enabled && providerExpanded ? (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      {provider.fields.map((field) => (
                        <label
                          key={`${provider.id}-${field.key}`}
                          className="rounded-xl border border-apple-gray-100 bg-white px-3 py-2"
                        >
                          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300">
                            {field.label}
                          </span>
                          <input
                            type={field.inputType || 'text'}
                            value={config[field.key]}
                            onChange={(event) =>
                              updateEmailConfig(provider.id, field.key, event.target.value)
                            }
                            disabled={emailSettingsLoading || isSavingThisProvider}
                            placeholder={field.placeholder}
                            className="mt-2 w-full rounded-lg border border-apple-gray-100 px-3 py-2 text-sm text-apple-gray-500"
                          />
                        </label>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-apple-gray-300">Suggested environment variables</p>
                      <div className="flex flex-wrap gap-2">
                        {provider.envKeys.map((envKey) => (
                          <span
                            key={`${provider.id}-${envKey}`}
                            className="inline-flex rounded-full border border-apple-gray-100 bg-apple-gray-50 px-2.5 py-1 text-[11px] font-mono text-apple-gray-400"
                          >
                            {envKey}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          void runEmailProviderAction(provider.id, 'test');
                        }}
                        disabled={emailSettingsLoading || isSavingThisProvider}
                        className="inline-flex items-center rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                      >
                        Test Connection
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void copyEmailEnvKeys(provider);
                        }}
                        disabled={emailSettingsLoading || isSavingThisProvider}
                        className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                      >
                        <Copy size={13} />
                        Copy Env Keys
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </AdminSettingsAccordion>

      <AdminSettingsAccordion
        title="Google Environment Template"
        description="Copy the exact variables required to enable Google integrations in Vercel."
        isOpen={expandedSections.template}
        onToggle={() => toggleSection('template')}
        actions={
          expandedSections.template ? (
            <button
              type="button"
              onClick={() => {
                void copyGoogleTemplate();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
            >
              <Copy size={14} />
              Copy Template
            </button>
          ) : null
        }
        toggleLabels={{
          open: 'Hide Template',
          closed: 'Show Template'
        }}
        collapsedSummary={
          <p className="text-sm text-apple-gray-300">
            Expand to review and copy the full Vercel-ready Google integration template.
          </p>
        }
      >
        <p className="text-sm leading-7 text-apple-gray-300">
          {googleStatusMessage}
          <br />
          Runtime status updates after deployment with the latest environment values.
        </p>

        <pre className="mt-4 overflow-x-auto rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-4 text-xs leading-6 text-apple-gray-400">
          {GOOGLE_ENV_TEMPLATE}
        </pre>
      </AdminSettingsAccordion>

      <section className="rounded-3xl border border-apple-gray-100 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-apple-gray-300">
            Backend persistence is active. Next step is wiring real provider connect/test/disconnect server actions
            with credential validation and secure auth controls.
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-apple-gray-100 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-apple-gray-300">
            <Link2 size={13} />
            Backend Save/Load Ready
          </span>
        </div>
      </section>
    </div>
  );
};
