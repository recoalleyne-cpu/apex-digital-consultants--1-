import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AnalyticsConsentState } from '../utils/cookieConsent';

type CookieConsentBarProps = {
  consentState: AnalyticsConsentState;
  onAccept: () => void;
  onNecessaryOnly: () => void;
};

export const CookieConsentBar = ({
  consentState,
  onAccept,
  onNecessaryOnly
}: CookieConsentBarProps) => {
  const isVisible = consentState === 'unset';

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed inset-x-3 bottom-3 z-[130] rounded-2xl border border-black/10 bg-white/96 p-4 shadow-[0_16px_45px_rgba(4,20,33,0.18)] backdrop-blur-sm sm:inset-x-6 sm:bottom-6 sm:p-5"
          role="region"
          aria-label="Cookie consent"
        >
          <div className="flex flex-col gap-3 sm:gap-4">
            <p className="text-sm leading-6 text-apple-gray-500">
              We use cookies and analytics to improve your experience and understand site
              performance. Learn more in our{' '}
              <a
                href="/privacy"
                className="font-semibold text-[#0b6b8d] underline decoration-[#0b6b8d]/40 underline-offset-4 hover:decoration-[#0b6b8d]"
              >
                Privacy Policy
              </a>
              .
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onNecessaryOnly}
                className="inline-flex items-center justify-center rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-apple-gray-500 transition-colors hover:bg-apple-gray-50"
              >
                Necessary Only
              </button>
              <button
                type="button"
                onClick={onAccept}
                className="inline-flex items-center justify-center rounded-xl bg-apex-yellow px-4 py-2.5 text-sm font-semibold text-apple-gray-500 transition-colors hover:bg-apex-yellow-hover"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
};
