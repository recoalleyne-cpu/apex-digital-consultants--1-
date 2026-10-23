import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');

  const readEnv = (...keys: string[]) => {
    for (const key of keys) {
      const value = env[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
    }
    return '';
  };

  return {
    plugins: [react(), tailwindcss()],
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      __APEX_GOOGLE_ANALYTICS_ID__: JSON.stringify(
        readEnv(
          'VITE_GOOGLE_ANALYTICS_ID',
          'VITE_GA4_MEASUREMENT_ID',
          'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID',
          'NEXT_PUBLIC_GA4_MEASUREMENT_ID',
          'GOOGLE_ANALYTICS_ID',
          'GA4_MEASUREMENT_ID'
        )
      ),
      __APEX_GOOGLE_TAG_MANAGER_ID__: JSON.stringify(
        readEnv(
          'VITE_GOOGLE_TAG_MANAGER_ID',
          'NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID',
          'GOOGLE_TAG_MANAGER_ID'
        )
      ),
      __APEX_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT__: JSON.stringify(
        readEnv(
          'VITE_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT',
          'NEXT_PUBLIC_GOOGLE_ANALYTICS_USE_GTM_TRANSPORT',
          'GOOGLE_ANALYTICS_USE_GTM_TRANSPORT'
        )
      ),
      __APEX_GOOGLE_SEARCH_CONSOLE_VERIFICATION__: JSON.stringify(
        readEnv(
          'VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION',
          'NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION',
          'GOOGLE_SEARCH_CONSOLE_VERIFICATION'
        )
      ),
      __APEX_GOOGLE_ADS_ID__: JSON.stringify(
        readEnv('VITE_GOOGLE_ADS_ID', 'NEXT_PUBLIC_GOOGLE_ADS_ID', 'GOOGLE_ADS_ID')
      ),
      __APEX_GOOGLE_ADS_CONVERSION_LABEL__: JSON.stringify(
        readEnv(
          'VITE_GOOGLE_ADS_CONVERSION_LABEL',
          'NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL',
          'GOOGLE_ADS_CONVERSION_LABEL'
        )
      ),
      __APEX_GOOGLE_RECAPTCHA_SITE_KEY__: JSON.stringify(
        readEnv(
          'VITE_GOOGLE_RECAPTCHA_SITE_KEY',
          'NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY',
          'GOOGLE_RECAPTCHA_SITE_KEY'
        )
      ),
      __APEX_GOOGLE_MAPS_API_KEY__: JSON.stringify(
        readEnv('VITE_GOOGLE_MAPS_API_KEY', 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', 'GOOGLE_MAPS_API_KEY')
      ),
      __APEX_GOOGLE_FONTS_ENABLED__: JSON.stringify(
        readEnv('VITE_GOOGLE_FONTS_ENABLED', 'NEXT_PUBLIC_GOOGLE_FONTS_ENABLED', 'GOOGLE_FONTS_ENABLED')
      ),
      __APEX_GOOGLE_FONTS_STYLESHEET_URL__: JSON.stringify(
        readEnv(
          'VITE_GOOGLE_FONTS_STYLESHEET_URL',
          'NEXT_PUBLIC_GOOGLE_FONTS_STYLESHEET_URL',
          'GOOGLE_FONTS_STYLESHEET_URL'
        )
      ),
      __APEX_GOOGLE_DEBUG__: JSON.stringify(
        readEnv('VITE_GOOGLE_DEBUG', 'NEXT_PUBLIC_GOOGLE_DEBUG', 'GOOGLE_DEBUG')
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
