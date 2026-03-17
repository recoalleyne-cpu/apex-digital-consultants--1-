import React from 'react';
import { CheckCircle2, Copy, Settings2, XCircle } from 'lucide-react';
import { GOOGLE_INTEGRATIONS } from '../config/googleIntegrations';

type IntegrationStatus = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  value: string | null;
  envKeys: string[];
};

const maskValue = (value: string | null) => {
  if (!value) return 'Not configured';
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

const ENV_TEMPLATE = [
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

export const AdminGoogleIntegrations = () => {
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
      envKeys: ['VITE_GOOGLE_ANALYTICS_ID']
    },
    {
      id: 'gtm',
      name: 'Google Tag Manager',
      description: 'Loads GTM dataLayer and container script.',
      enabled: GOOGLE_INTEGRATIONS.tagManager.enabled,
      value: GOOGLE_INTEGRATIONS.tagManager.id,
      envKeys: ['VITE_GOOGLE_TAG_MANAGER_ID']
    },
    {
      id: 'search-console',
      name: 'Google Search Console',
      description: 'Adds the verification meta tag to the site head.',
      enabled: GOOGLE_INTEGRATIONS.searchConsole.enabled,
      value: GOOGLE_INTEGRATIONS.searchConsole.verificationToken,
      envKeys: ['VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION']
    },
    {
      id: 'ads',
      name: 'Google Ads',
      description: 'Enables conversion tracking event helpers.',
      enabled: GOOGLE_INTEGRATIONS.ads.enabled,
      value: GOOGLE_INTEGRATIONS.ads.conversionId,
      envKeys: ['VITE_GOOGLE_ADS_ID', 'VITE_GOOGLE_ADS_CONVERSION_LABEL']
    },
    {
      id: 'recaptcha',
      name: 'Google reCAPTCHA',
      description: 'Supports secure token validation for forms.',
      enabled: GOOGLE_INTEGRATIONS.recaptcha.enabled,
      value: GOOGLE_INTEGRATIONS.recaptcha.siteKey,
      envKeys: ['VITE_GOOGLE_RECAPTCHA_SITE_KEY']
    },
    {
      id: 'maps',
      name: 'Google Maps',
      description: 'Supports embeds and API-driven map loading.',
      enabled: GOOGLE_INTEGRATIONS.maps.enabled,
      value: GOOGLE_INTEGRATIONS.maps.apiKey,
      envKeys: ['VITE_GOOGLE_MAPS_API_KEY']
    },
    {
      id: 'fonts',
      name: 'Google Fonts',
      description: 'Injects fonts stylesheet links when enabled.',
      enabled: GOOGLE_INTEGRATIONS.fonts.enabled,
      value: GOOGLE_INTEGRATIONS.fonts.stylesheetUrl,
      envKeys: ['VITE_GOOGLE_FONTS_ENABLED', 'VITE_GOOGLE_FONTS_STYLESHEET_URL']
    }
  ];

  const enabledCount = integrationRows.filter((item) => item.enabled).length;

  const copyEnvTemplate = async () => {
    try {
      await navigator.clipboard.writeText(ENV_TEMPLATE);
      setStatusMessage('Environment template copied. Add values in Vercel and redeploy.');
    } catch {
      setStatusMessage('Clipboard copy failed. Copy the environment template manually.');
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-apple-gray-100 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-apple-gray-500">
              Google Integrations
            </h2>
            <p className="mt-2 max-w-3xl text-sm sm:text-base leading-7 text-apple-gray-300">
              Manage Google service readiness from one place. This panel reflects current environment
              configuration and the centralized runtime integration layer.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-apple-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300">
            <Settings2 size={14} />
            {enabledCount}/{integrationRows.length} Enabled
          </span>
        </div>
      </section>

      <section className="rounded-3xl border border-apple-gray-100 bg-white p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {integrationRows.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-apple-gray-100 bg-white p-5 transition-colors hover:border-apple-gray-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-apple-gray-500">{item.name}</h3>
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
              <p className="mt-4 text-xs font-mono rounded-xl border border-apple-gray-100 bg-apple-gray-50 px-3 py-2 text-apple-gray-400 break-all">
                {maskValue(item.value)}
              </p>
              <p className="mt-3 text-xs text-apple-gray-300">
                Env: <span className="font-mono text-apple-gray-400">{item.envKeys.join(', ')}</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-apple-gray-100 bg-white p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-apple-gray-500">Environment Template</h3>
          <button
            type="button"
            onClick={copyEnvTemplate}
            className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
          >
            <Copy size={14} />
            Copy Template
          </button>
        </div>

        <p className="text-sm leading-7 text-apple-gray-300">
          {statusMessage}
          <br />
          Runtime status updates after deployment with the latest environment values.
        </p>

        <pre className="overflow-x-auto rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-4 text-xs leading-6 text-apple-gray-400">
          {ENV_TEMPLATE}
        </pre>
      </section>
    </div>
  );
};
