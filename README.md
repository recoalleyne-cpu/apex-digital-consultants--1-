<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/536a6e66-2dea-406f-b6e8-6983c217b583

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Firebase

Firebase and Neon now run in a hybrid pattern:

- Firebase Authentication = login + identity
- Neon Postgres = primary content/business data
- Firestore helpers remain optional scaffolding only

- Central config: `src/lib/firebase.ts`
- Auth helpers: `src/lib/auth.ts`
- Firestore helpers: `src/lib/firestore.ts`
- Neon repositories: `api/_utils/contentRepository.ts`
- Setup guide: `FIREBASE_SETUP.md`

Initialize Neon schema + seed data:

```bash
npm run db:init:neon
```

## Google Integrations

Google services are centralized through:

- Config: `src/config/googleIntegrations.ts`
- Runtime + helpers: `src/integrations/google.ts`
- App wiring: `src/components/GoogleIntegrationRuntime.tsx`

### Environment variables

Set these in your deployment environment or `.env.local`:

- `VITE_GOOGLE_ANALYTICS_ID` (GA4 Measurement ID, for example `G-XXXXXXX`)
- `VITE_GOOGLE_TAG_MANAGER_ID` (GTM container ID, for example `GTM-XXXXXXX`)
- `VITE_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT` (`true` or `false`)
- `VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION` (Search Console verification token)
- `VITE_GOOGLE_ADS_ID` (Google Ads conversion ID, for example `AW-XXXXXXX`)
- `VITE_GOOGLE_ADS_CONVERSION_LABEL` (default conversion label)
- `VITE_GOOGLE_RECAPTCHA_SITE_KEY` (reCAPTCHA site key)
- `VITE_GOOGLE_MAPS_API_KEY` (Maps API key)
- `VITE_GOOGLE_FONTS_ENABLED` (`true` or `false`)
- `VITE_GOOGLE_FONTS_STYLESHEET_URL` (optional Google Fonts stylesheet URL override)
- `VITE_GOOGLE_DEBUG` (`true` enables GA debug mode)

Supported aliases (for Vercel compatibility): `NEXT_PUBLIC_GOOGLE_*` and `GOOGLE_*`.
Preferred naming remains `VITE_GOOGLE_*`.

### Vercel deployment checklist

1. Add required env vars in Vercel Project Settings:
   - Environment scopes: `Production`, `Preview`, and/or `Development` as needed.
   - Use `VITE_GOOGLE_*` names to avoid client exposure mismatches.
2. Redeploy after env changes:
   - Vite reads these at build time, so changing env vars without redeploy keeps stale values.
3. Verify in production:
   - Visit `/admin/google-integrations` and confirm each service shows `Enabled`.
   - Check `Resolved from` to confirm the env source key used by the deployed build.

### Behavior

- Every integration is optional and conditionally loaded.
- Scripts/tags are injected once and guarded against duplicates.
- SPA pageviews are tracked on route changes.
- If GA4 and GTM are both configured, GA4 defaults to GTM transport mode to reduce duplicate instrumentation risk.
- Search Console verification meta is injected into `head` from centralized config.
- If no integrations are detected, a one-time console info message is emitted with setup guidance.

### Usage helpers

Import from `src/integrations/google.ts`:

```ts
import {
  trackEvent,
  trackConversion,
  loadRecaptchaScript,
  getRecaptchaSiteKey,
  loadGoogleMapsApi,
  buildGoogleMapsEmbedUrl
} from '../integrations/google';
```

Examples:

```ts
trackEvent('form_submit', { form_name: 'contact' });

trackConversion({
  value: 250,
  currency: 'USD',
  transactionId: 'lead-123'
});
```

```ts
await loadRecaptchaScript();
const siteKey = getRecaptchaSiteKey();
```

```ts
const src = buildGoogleMapsEmbedUrl({ query: 'Bridgetown, Barbados', zoom: 13 });
```
