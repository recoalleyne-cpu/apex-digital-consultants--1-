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
          className="fixed inset-x-3 bottom-3 z-[130] rounded-xl border border-black/10 bg-white/95 px-3 py-2.5 shadow-[0_10px_30px_rgba(8,25,40,0.14)] backdrop-blur-sm sm:inset-x-6 sm:bottom-5 sm:px-4 sm:py-3"
          role="region"
          aria-label="Cookie consent"
        >
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="text-[13px] leading-5 text-apple-gray-500 sm:max-w-3xl sm:pr-2">
              We use cookies and analytics to improve your experience and understand site performance. Learn more in our{' '}
              <a
                href="/privacy"
                className="font-semibold text-[#0b6b8d] underline decoration-[#0b6b8d]/35 underline-offset-3 hover:decoration-[#0b6b8d]"
              >
                Privacy Policy
              </a>
              .
            </p>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0 sm:items-center">
              <button
                type="button"
                onClick={onNecessaryOnly}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black/15 bg-white px-3.5 text-xs font-semibold text-apple-gray-500 transition-colors hover:bg-apple-gray-50 sm:h-9 sm:text-sm"
              >
                Necessary Only
              </button>
              <button
                type="button"
                onClick={onAccept}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-apex-yellow px-3.5 text-xs font-semibold text-apple-gray-500 transition-colors hover:bg-apex-yellow-hover sm:h-9 sm:text-sm"
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
