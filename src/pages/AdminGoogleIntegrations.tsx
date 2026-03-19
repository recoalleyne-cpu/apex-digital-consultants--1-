import React from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Copy, Settings2, XCircle } from 'lucide-react';
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

const maskValue = (value: string | null) => {
  if (!value) return 'Not configured';
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

const formatBooleanSetting = (value: boolean) => (value ? 'Enabled' : 'Disabled');

const ENV_TEMPLATE = [
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

type SectionKey = 'overview' | 'integrations' | 'template';

export const AdminGoogleIntegrations = () => {
  const [expandedSections, setExpandedSections] = React.useState<Record<SectionKey, boolean>>({
    overview: true,
    integrations: true,
    template: false
  });
  const [expandedIntegrations, setExpandedIntegrations] = React.useState<Record<string, boolean>>({});
  const [statusMessage, setStatusMessage] = React.useState(
    'Google integrations are controlled via environment variables and loaded safely at runtime.'
  );

  const integrationRows: IntegrationStatus[] = [
    {
      id: 'analytics',
      name: 'Google Analytics 4',
      description: 'Tracks page views and custom events.',
      enabled: GOOGLE_INTEGRATIONS.analytics.enabled,
      value: GOOGLE_INTEGRATIONS.analytics.measurementId,
      envKeys: ['VITE_GOOGLE_ANALYTICS_ID', 'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID', 'GOOGLE_ANALYTICS_ID'],
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
      envKeys: ['VITE_GOOGLE_TAG_MANAGER_ID', 'NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID', 'GOOGLE_TAG_MANAGER_ID'],
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
      description: 'Injects fonts stylesheet links when enabled.',
      enabled: GOOGLE_INTEGRATIONS.fonts.enabled,
      value: GOOGLE_INTEGRATIONS.fonts.stylesheetUrl,
      envKeys: ['VITE_GOOGLE_FONTS_ENABLED', 'NEXT_PUBLIC_GOOGLE_FONTS_ENABLED', 'GOOGLE_FONTS_ENABLED'],
      source: GOOGLE_INTEGRATIONS_DIAGNOSTICS.envSources.fontsEnabled
    }
  ];

  const enabledCount = integrationRows.filter((item) => item.enabled).length;
  const isIntegrationExpanded = (integrationId: string, defaultExpanded: boolean) =>
    expandedIntegrations[integrationId] ?? defaultExpanded;
  const integrationOpenStates = integrationRows.map((item) =>
    isIntegrationExpanded(item.id, item.enabled)
  );
  const hasCollapsedIntegrations = integrationOpenStates.some((open) => !open);
  const hasExpandedIntegrations = integrationOpenStates.some((open) => open);

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((current) => ({
      ...current,
      [section]: !current[section]
    }));
  };

  const toggleIntegration = (integrationId: string, defaultExpanded: boolean) => {
    setExpandedIntegrations((current) => ({
      ...current,
      [integrationId]: !(current[integrationId] ?? defaultExpanded)
    }));
  };

  const setAllIntegrationsExpanded = (expanded: boolean) => {
    setExpandedIntegrations(
      integrationRows.reduce<Record<string, boolean>>((allRows, item) => {
        allRows[item.id] = expanded;
        return allRows;
      }, {})
    );
  };

  const copyText = async (text: string, successMessage: string, errorMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatusMessage(successMessage);
    } catch {
      setStatusMessage(errorMessage);
    }
  };

  const copyEnvTemplate = async () => {
    await copyText(
      ENV_TEMPLATE,
      'Environment template copied. Add values in Vercel and redeploy.',
      'Clipboard copy failed. Copy the environment template manually.'
    );
  };

  const copyEnvKeys = async (item: IntegrationStatus) => {
    await copyText(
      item.envKeys.join('\n'),
      `${item.name} env keys copied.`,
      `Clipboard copy failed for ${item.name} env keys.`
    );
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-apple-gray-100 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-apple-gray-500">
              Google Integrations
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-apple-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300">
              <Settings2 size={14} />
              {enabledCount}/{integrationRows.length} Enabled
            </span>
            <button
              type="button"
              onClick={() => toggleSection('overview')}
              className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
            >
              {expandedSections.overview ? 'Collapse' : 'Expand'}
              {expandedSections.overview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {expandedSections.overview ? (
          <div className="mt-3 space-y-3">
            <p className="max-w-3xl text-sm sm:text-base leading-7 text-apple-gray-300">
              Manage Google service readiness from one place. This panel reflects current environment
              configuration and the centralized runtime integration layer.
            </p>
            <p className="text-xs font-mono text-apple-gray-300">
              Build mode: {GOOGLE_INTEGRATIONS_DIAGNOSTICS.mode}
            </p>
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-apple-gray-100 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-apple-gray-500">Integration Status</h3>
          <div className="flex flex-wrap items-center gap-2">
            {expandedSections.integrations && hasCollapsedIntegrations ? (
              <button
                type="button"
                onClick={() => setAllIntegrationsExpanded(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
              >
                Expand All
              </button>
            ) : null}
            {expandedSections.integrations && hasExpandedIntegrations ? (
              <button
                type="button"
                onClick={() => setAllIntegrationsExpanded(false)}
                className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
              >
                Collapse All
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => toggleSection('integrations')}
              className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
            >
              {expandedSections.integrations ? 'Hide Section' : 'Show Section'}
              {expandedSections.integrations ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {expandedSections.integrations ? (
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {integrationRows.map((item) => {
              const isExpanded = isIntegrationExpanded(item.id, item.enabled);
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

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p
                      className={`text-xs font-medium uppercase tracking-[0.12em] ${
                        item.enabled ? 'text-green-700' : 'text-apple-gray-300'
                      }`}
                    >
                      {item.enabled ? 'Configured' : 'Awaiting configuration'}
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleIntegration(item.id, item.enabled)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-apple-gray-100 bg-white px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
                    >
                      {isExpanded ? 'Hide Details' : 'Show Details'}
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>

                  {isExpanded ? (
                    <div className="mt-4 space-y-3">
                      <p className="text-xs font-mono break-all rounded-xl border border-apple-gray-100 bg-apple-gray-50 px-3 py-2 text-apple-gray-400">
                        {maskValue(item.value)}
                      </p>

                      {visibleDetails.length ? (
                        <dl className="space-y-2 rounded-xl border border-apple-gray-100 bg-white p-3">
                          {visibleDetails.map((detail) => (
                            <div
                              key={detail.id}
                              className="flex flex-wrap items-center justify-between gap-2 text-xs"
                            >
                              <dt className="font-medium text-apple-gray-300">{detail.label}</dt>
                              <dd className="font-mono text-apple-gray-400">{detail.value}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}

                      <div className="space-y-2">
                        <p className="text-xs text-apple-gray-300">
                          Resolved from:{' '}
                          <span className="font-mono text-apple-gray-400">
                            {item.source || 'Not detected'}
                          </span>
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
                          void copyEnvKeys(item);
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
        ) : null}
      </section>

      <section className="rounded-3xl border border-apple-gray-100 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-apple-gray-500">Environment Template</h3>
          <div className="flex flex-wrap items-center gap-2">
            {expandedSections.template ? (
              <button
                type="button"
                onClick={() => {
                  void copyEnvTemplate();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
              >
                <Copy size={14} />
                Copy Template
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => toggleSection('template')}
              className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
            >
              {expandedSections.template ? 'Hide Template' : 'Show Template'}
              {expandedSections.template ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {expandedSections.template ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm leading-7 text-apple-gray-300">
              {statusMessage}
              <br />
              Runtime status updates after deployment with the latest environment values.
            </p>

            <pre className="overflow-x-auto rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-4 text-xs leading-6 text-apple-gray-400">
              {ENV_TEMPLATE}
            </pre>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-7 text-apple-gray-300">
            Expand to review and copy the full Vercel-ready environment template.
          </p>
        )}
      </section>
    </div>
  );
};
