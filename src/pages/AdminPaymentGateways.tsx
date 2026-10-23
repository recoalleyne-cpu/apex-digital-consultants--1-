import React from 'react';
import { CheckCircle2, Copy, CreditCard, ExternalLink, RefreshCcw, ShieldCheck } from 'lucide-react';

type ProviderId = 'fygaro' | 'powertranz' | 'plugnpay' | 'firstatlantic';

type GatewayMode = 'sandbox' | 'live';

type GatewayConfig = {
  enabled: boolean;
  mode: GatewayMode;
  merchantId: string;
  terminalId: string;
  apiKey: string;
  secretKey: string;
  publicKey: string;
  webhookSecret: string;
  callbackUrl: string;
  successUrl: string;
  cancelUrl: string;
  currency: string;
  supportEmail: string;
  notes: string;
};

type ProviderMeta = {
  id: ProviderId;
  name: string;
  badge: string;
  description: string;
  docsUrl: string;
  websiteUrl: string;
  tips: string[];
};

const PROVIDERS: ProviderMeta[] = [
  {
    id: 'fygaro',
    name: 'Fygaro',
    badge: 'Caribbean Payments',
    description:
      'Configure Fygaro merchant credentials, callbacks, and environment mode for card acceptance.',
    docsUrl: 'https://www.fygaro.com/',
    websiteUrl: 'https://www.fygaro.com/',
    tips: [
      'Use sandbox keys first and run low-value test transactions.',
      'Confirm callback URLs match exactly with your Vercel domain.',
      'Keep API secrets in Vercel environment variables only.'
    ]
  },
  {
    id: 'powertranz',
    name: 'PowerTranz',
    badge: 'Gateway API',
    description:
      'Set PowerTranz identifiers and secure secrets to support hosted or API-driven checkout flows.',
    docsUrl: 'https://docs.powertranz.com/',
    websiteUrl: 'https://powertranz.com/',
    tips: [
      'Verify terminal profile supports your intended card brands.',
      'Store webhook signatures and validate events server-side.',
      'Switch from sandbox to live only after end-to-end QA.'
    ]
  },
  {
    id: 'plugnpay',
    name: 'Plug N Pay',
    badge: 'Merchant Processing',
    description:
      'Prepare Plug N Pay merchant credentials and callback mappings for secure card processing.',
    docsUrl: 'https://developer.plugnpay.com/',
    websiteUrl: 'https://www.plugnpay.com/',
    tips: [
      'Limit API key scope where possible.',
      'Validate AVS/CVV rules before launch.',
      'Track failed payment responses in your order logs.'
    ]
  },
  {
    id: 'firstatlantic',
    name: 'First Atlantic Commerce',
    badge: 'FAC',
    description:
      'Configure FAC merchant IDs, security values, and return endpoints for production-ready checkout.',
    docsUrl: 'https://www.firstatlanticcommerce.com/',
    websiteUrl: 'https://www.firstatlanticcommerce.com/',
    tips: [
      'Confirm your merchant account is enabled for the currencies you need.',
      'Whitelist production callback domains before go-live.',
      'Document decline code handling for support operations.'
    ]
  }
];

const STORAGE_KEY = 'apex-payment-gateway-config-v1';

const BASE_GATEWAY_CONFIG: GatewayConfig = {
  enabled: false,
  mode: 'sandbox',
  merchantId: '',
  terminalId: '',
  apiKey: '',
  secretKey: '',
  publicKey: '',
  webhookSecret: '',
  callbackUrl: '',
  successUrl: '',
  cancelUrl: '',
  currency: 'USD',
  supportEmail: 'info@apexdigitalconsultants.com',
  notes: ''
};

const buildDefaultConfigMap = (): Record<ProviderId, GatewayConfig> => {
  return PROVIDERS.reduce(
    (acc, provider) => ({
      ...acc,
      [provider.id]: { ...BASE_GATEWAY_CONFIG }
    }),
    {} as Record<ProviderId, GatewayConfig>
  );
};

const buildEnvKeyPrefix = (providerId: ProviderId) => {
  if (providerId === 'plugnpay') return 'PLUGNPAY';
  if (providerId === 'firstatlantic') return 'FIRSTATLANTIC';
  return providerId.toUpperCase();
};

export const AdminPaymentGateways = () => {
  const [selectedProvider, setSelectedProvider] = React.useState<ProviderId>('fygaro');
  const [configs, setConfigs] = React.useState<Record<ProviderId, GatewayConfig>>(
    buildDefaultConfigMap
  );
  const [statusMessage, setStatusMessage] = React.useState('Draft settings are saved locally.');

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as Partial<Record<ProviderId, Partial<GatewayConfig>>>;
      setConfigs((prev) => {
        const next = { ...prev };
        PROVIDERS.forEach((provider) => {
          const storedProviderConfig = parsed?.[provider.id];
          if (storedProviderConfig && typeof storedProviderConfig === 'object') {
            next[provider.id] = {
              ...BASE_GATEWAY_CONFIG,
              ...prev[provider.id],
              ...storedProviderConfig
            };
          }
        });
        return next;
      });
    } catch {
      setStatusMessage('Could not load saved gateway draft settings.');
    }
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
    } catch {
      setStatusMessage('Unable to persist gateway drafts in local storage.');
    }
  }, [configs]);

  const provider = PROVIDERS.find((item) => item.id === selectedProvider) || PROVIDERS[0];
  const activeConfig = configs[selectedProvider];
  const envPrefix = buildEnvKeyPrefix(selectedProvider);
  const readinessChecks = [
    {
      label: 'Merchant credentials added',
      done: Boolean(activeConfig.merchantId.trim() && activeConfig.apiKey.trim())
    },
    {
      label: 'Webhook and callback URLs configured',
      done: Boolean(activeConfig.callbackUrl.trim() && activeConfig.webhookSecret.trim())
    },
    {
      label: 'Success and cancel redirects set',
      done: Boolean(activeConfig.successUrl.trim() && activeConfig.cancelUrl.trim())
    },
    {
      label: 'Gateway enabled for checkout',
      done: activeConfig.enabled
    }
  ];
  const readinessScore = readinessChecks.filter((check) => check.done).length;

  const updateConfig = <K extends keyof GatewayConfig>(field: K, value: GatewayConfig[K]) => {
    setConfigs((prev) => ({
      ...prev,
      [selectedProvider]: {
        ...prev[selectedProvider],
        [field]: value
      }
    }));
  };

  const resetProviderConfig = () => {
    setConfigs((prev) => ({
      ...prev,
      [selectedProvider]: { ...BASE_GATEWAY_CONFIG }
    }));
    setStatusMessage(`${provider.name} draft settings reset.`);
  };

  const envPreview = [
    `PAYMENT_PROVIDER=${selectedProvider}`,
    `${envPrefix}_ENABLED=${activeConfig.enabled ? 'true' : 'false'}`,
    `${envPrefix}_MODE=${activeConfig.mode}`,
    `${envPrefix}_MERCHANT_ID=${activeConfig.merchantId || '<merchant-id>'}`,
    `${envPrefix}_TERMINAL_ID=${activeConfig.terminalId || '<terminal-id>'}`,
    `${envPrefix}_API_KEY=${activeConfig.apiKey || '<api-key>'}`,
    `${envPrefix}_SECRET_KEY=${activeConfig.secretKey || '<secret-key>'}`,
    `${envPrefix}_PUBLIC_KEY=${activeConfig.publicKey || '<public-key>'}`,
    `${envPrefix}_WEBHOOK_SECRET=${activeConfig.webhookSecret || '<webhook-secret>'}`,
    `${envPrefix}_CALLBACK_URL=${activeConfig.callbackUrl || '<callback-url>'}`,
    `${envPrefix}_SUCCESS_URL=${activeConfig.successUrl || '<success-url>'}`,
    `${envPrefix}_CANCEL_URL=${activeConfig.cancelUrl || '<cancel-url>'}`,
    `${envPrefix}_CURRENCY=${activeConfig.currency || 'USD'}`
  ].join('\n');

  const copyEnvPreview = async () => {
    try {
      await navigator.clipboard.writeText(envPreview);
      setStatusMessage(`${provider.name} environment template copied.`);
    } catch {
      setStatusMessage('Clipboard copy failed. Copy manually from the preview area.');
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-apple-gray-100 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-apple-gray-500">
              Payment Gateway Setup
            </h2>
            <p className="mt-2 text-sm sm:text-base text-apple-gray-300 max-w-3xl leading-7">
              Configure card processing providers with a guided workflow. This panel prepares credentials,
              callback URLs, and environment values so implementation can be completed quickly and safely.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-apple-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300">
            <ShieldCheck size={14} />
            Vercel + Serverless Ready
          </span>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
        <aside className="rounded-3xl border border-apple-gray-100 bg-white p-4 sm:p-5 space-y-3 h-fit">
          {PROVIDERS.map((item) => {
            const selected = item.id === selectedProvider;
            const itemConfig = configs[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedProvider(item.id)}
                className={[
                  'w-full rounded-2xl border px-4 py-3 text-left transition-all',
                  selected
                    ? 'border-apex-yellow/40 bg-apex-yellow/5'
                    : 'border-apple-gray-100 bg-white hover:bg-apple-gray-50'
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-apple-gray-500">{item.name}</p>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-apple-gray-300">
                    {item.badge}
                  </span>
                </div>
                <p className="mt-2 text-xs text-apple-gray-300 leading-6">{item.description}</p>
                <p className="mt-2 text-[11px] font-medium text-apple-gray-300">
                  {itemConfig.enabled ? 'Enabled' : 'Disabled'} • {itemConfig.mode}
                </p>
              </button>
            );
          })}
        </aside>

        <div className="space-y-6">
          <section className="rounded-3xl border border-apple-gray-100 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-apple-gray-500">
                  {provider.name} Integration Details
                </h3>
                <p className="text-sm text-apple-gray-300 mt-1">
                  Complete each field, then copy the environment template for deployment.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={provider.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300 hover:text-apple-gray-500 transition-colors"
                >
                  Provider Docs
                  <ExternalLink size={13} />
                </a>
                <button
                  type="button"
                  onClick={resetProviderConfig}
                  className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300 hover:text-apple-gray-500 transition-colors"
                >
                  Reset
                  <RefreshCcw size={13} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="rounded-2xl border border-apple-gray-100 p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-apple-gray-500">Enable Gateway</span>
                <input
                  type="checkbox"
                  checked={activeConfig.enabled}
                  onChange={(e) => updateConfig('enabled', e.target.checked)}
                />
              </label>

              <label className="rounded-2xl border border-apple-gray-100 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300 mb-2">
                  Mode
                </p>
                <select
                  value={activeConfig.mode}
                  onChange={(e) => updateConfig('mode', e.target.value as GatewayMode)}
                  className="w-full rounded-xl border border-apple-gray-100 px-3 py-2 text-sm bg-white"
                >
                  <option value="sandbox">Sandbox</option>
                  <option value="live">Live</option>
                </select>
              </label>

              <input
                value={activeConfig.merchantId}
                onChange={(e) => updateConfig('merchantId', e.target.value)}
                placeholder="Merchant ID"
                className="w-full rounded-xl border border-apple-gray-100 px-4 py-3 text-sm"
              />
              <input
                value={activeConfig.terminalId}
                onChange={(e) => updateConfig('terminalId', e.target.value)}
                placeholder="Terminal ID"
                className="w-full rounded-xl border border-apple-gray-100 px-4 py-3 text-sm"
              />
              <input
                value={activeConfig.apiKey}
                onChange={(e) => updateConfig('apiKey', e.target.value)}
                placeholder="API Key"
                className="w-full rounded-xl border border-apple-gray-100 px-4 py-3 text-sm"
              />
              <input
                value={activeConfig.secretKey}
                onChange={(e) => updateConfig('secretKey', e.target.value)}
                placeholder="Secret Key"
                className="w-full rounded-xl border border-apple-gray-100 px-4 py-3 text-sm"
              />
              <input
                value={activeConfig.publicKey}
                onChange={(e) => updateConfig('publicKey', e.target.value)}
                placeholder="Public Key (if required)"
                className="w-full rounded-xl border border-apple-gray-100 px-4 py-3 text-sm"
              />
              <input
                value={activeConfig.webhookSecret}
                onChange={(e) => updateConfig('webhookSecret', e.target.value)}
                placeholder="Webhook Secret"
                className="w-full rounded-xl border border-apple-gray-100 px-4 py-3 text-sm"
              />
              <input
                value={activeConfig.callbackUrl}
                onChange={(e) => updateConfig('callbackUrl', e.target.value)}
                placeholder="Callback URL"
                className="w-full rounded-xl border border-apple-gray-100 px-4 py-3 text-sm md:col-span-2"
              />
              <input
                value={activeConfig.successUrl}
                onChange={(e) => updateConfig('successUrl', e.target.value)}
                placeholder="Success Redirect URL"
                className="w-full rounded-xl border border-apple-gray-100 px-4 py-3 text-sm"
              />
              <input
                value={activeConfig.cancelUrl}
                onChange={(e) => updateConfig('cancelUrl', e.target.value)}
                placeholder="Cancel Redirect URL"
                className="w-full rounded-xl border border-apple-gray-100 px-4 py-3 text-sm"
              />
              <input
                value={activeConfig.currency}
                onChange={(e) => updateConfig('currency', e.target.value)}
                placeholder="Currency (example: USD)"
                className="w-full rounded-xl border border-apple-gray-100 px-4 py-3 text-sm"
              />
              <input
                value={activeConfig.supportEmail}
                onChange={(e) => updateConfig('supportEmail', e.target.value)}
                placeholder="Support Email"
                className="w-full rounded-xl border border-apple-gray-100 px-4 py-3 text-sm"
              />
              <textarea
                value={activeConfig.notes}
                onChange={(e) => updateConfig('notes', e.target.value)}
                placeholder="Internal implementation notes"
                className="w-full rounded-xl border border-apple-gray-100 px-4 py-3 text-sm min-h-[120px] md:col-span-2"
              />
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-apple-gray-100 bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-lg font-semibold text-apple-gray-500">Integration Checklist</h4>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300">
                  {readinessScore}/{readinessChecks.length} Complete
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {readinessChecks.map((item) => (
                  <li key={item.label} className="flex items-start gap-3 text-sm">
                    <CheckCircle2
                      size={16}
                      className={item.done ? 'text-apex-yellow mt-0.5' : 'text-apple-gray-200 mt-0.5'}
                    />
                    <span className={item.done ? 'text-apple-gray-500' : 'text-apple-gray-300'}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300 mb-2">
                  Provider Tips
                </p>
                <ul className="space-y-2 text-sm text-apple-gray-300">
                  {provider.tips.map((tip) => (
                    <li key={tip} className="leading-6">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-apple-gray-100 bg-white p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h4 className="text-lg font-semibold text-apple-gray-500">Environment Template</h4>
                <button
                  type="button"
                  onClick={copyEnvPreview}
                  className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300 hover:text-apple-gray-500 transition-colors"
                >
                  Copy
                  <Copy size={13} />
                </button>
              </div>
              <pre className="rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-4 text-xs leading-6 text-apple-gray-400 overflow-auto">
                {envPreview}
              </pre>
              <p className="mt-4 text-xs text-apple-gray-300 leading-6">
                This module is a setup assistant. Final credentials should be stored in Vercel environment
                variables and connected to your server-side checkout handlers.
              </p>
            </div>
          </section>
        </div>
      </section>

      <section className="rounded-3xl border border-apple-gray-100 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300">
          <CreditCard size={14} />
          <span>{statusMessage}</span>
        </div>
      </section>
    </div>
  );
};
