import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../integrations/google';
import {
  buildFormSpamPayload,
  FORM_SPAM_HONEYPOT_FIELD_NAME,
  FORM_SPAM_MIN_COMPLETION_MS
} from '../utils/formSpamProtection';

type NewsletterModalState = {
  subscribed: boolean;
  subscribedAt: number | null;
  subscribedEmail: string;
  impressions: number[];
  dismissals: number[];
};

type StateUpdater = (
  previous: NewsletterModalState,
  now: number
) => NewsletterModalState;

const STORAGE_KEY = 'apex_newsletter_modal_v1';
const SHOW_DELAY_MS = 10_000;
const WINDOW_MS = 30 * 60 * 1000;
const MAX_IMPRESSIONS_PER_WINDOW = 2;
const DISMISS_COOLDOWN_MS = 8 * 60 * 1000;
const NEWSLETTER_SIGNUP_ENDPOINT =
  (import.meta.env.VITE_NEWSLETTER_SIGNUP_ENDPOINT as string | undefined)?.trim() ||
  '/api/email-integrations';

const EXCLUDED_ROUTE_PREFIXES = ['/admin', '/checkout'];
const EXCLUDED_ROUTE_PATHS = new Set(['/terms', '/privacy']);

const DEFAULT_STATE: NewsletterModalState = {
  subscribed: false,
  subscribedAt: null,
  subscribedEmail: '',
  impressions: [],
  dismissals: []
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isBrowser = () => typeof window !== 'undefined';

const toNumberArray = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item));
};

const cleanTimestamps = (timestamps: number[], now: number) =>
  timestamps.filter((timestamp) => timestamp > now - WINDOW_MS);

const normalizeState = (value: unknown): NewsletterModalState => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return DEFAULT_STATE;
  }

  const candidate = value as Record<string, unknown>;
  const now = Date.now();

  return {
    subscribed: Boolean(candidate.subscribed),
    subscribedAt:
      typeof candidate.subscribedAt === 'number' && Number.isFinite(candidate.subscribedAt)
        ? candidate.subscribedAt
        : null,
    subscribedEmail:
      typeof candidate.subscribedEmail === 'string' ? candidate.subscribedEmail : '',
    impressions: cleanTimestamps(toNumberArray(candidate.impressions), now),
    dismissals: cleanTimestamps(toNumberArray(candidate.dismissals), now)
  };
};

const readState = (): NewsletterModalState => {
  if (!isBrowser()) return DEFAULT_STATE;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return normalizeState(JSON.parse(raw));
  } catch {
    return DEFAULT_STATE;
  }
};

const persistState = (state: NewsletterModalState) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const isExcludedPath = (pathname: string) =>
  EXCLUDED_ROUTE_PATHS.has(pathname) ||
  EXCLUDED_ROUTE_PREFIXES.some((routePrefix) => pathname.startsWith(routePrefix));

const canShowModal = (state: NewsletterModalState, now: number) => {
  if (state.subscribed) return false;

  const recentImpressions = cleanTimestamps(state.impressions, now);
  if (recentImpressions.length >= MAX_IMPRESSIONS_PER_WINDOW) {
    return false;
  }

  const recentDismissals = cleanTimestamps(state.dismissals, now);
  const lastDismissal = recentDismissals[recentDismissals.length - 1];
  if (lastDismissal && now - lastDismissal < DISMISS_COOLDOWN_MS) {
    return false;
  }

  return true;
};

const splitName = (value: string) => {
  const parts = value.split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return { firstName: null as string | null, lastName: null as string | null };
  }
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: null };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
};

export const NewsletterSignupModal = () => {
  const { pathname } = useLocation();
  const [state, setState] = useState<NewsletterModalState>(readState);
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypotValue, setHoneypotValue] = useState('');
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());

  const shouldIgnorePath = useMemo(() => isExcludedPath(pathname), [pathname]);

  const updateStoredState = useCallback((updater: StateUpdater) => {
    setState((previous) => {
      const now = Date.now();
      const previousNormalized = normalizeState(previous);
      const nextRaw = updater(previousNormalized, now);
      const nextState = normalizeState(nextRaw);
      persistState(nextState);
      return nextState;
    });
  }, []);

  const handleDismiss = useCallback(() => {
    setIsOpen(false);
    setErrorMessage('');

    updateStoredState((previous, now) => ({
      ...previous,
      dismissals: [...cleanTimestamps(previous.dismissals, now), now]
    }));
  }, [updateStoredState]);

  useEffect(() => {
    if (shouldIgnorePath && isOpen) {
      setIsOpen(false);
    }
  }, [shouldIgnorePath, isOpen]);

  useEffect(() => {
    if (shouldIgnorePath || isOpen) return undefined;

    const now = Date.now();
    if (!canShowModal(state, now)) return undefined;

    const timerId = window.setTimeout(() => {
      setIsOpen(true);
      setFormStartedAt(Date.now());
      updateStoredState((previous, timestamp) => ({
        ...previous,
        impressions: [...cleanTimestamps(previous.impressions, timestamp), timestamp]
      }));
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [shouldIgnorePath, isOpen, state, updateStoredState]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [handleDismiss, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const now = Date.now();
    if (honeypotValue.trim()) {
      updateStoredState((previous, timestamp) => ({
        ...previous,
        subscribed: true,
        subscribedAt: timestamp,
        subscribedEmail: previous.subscribedEmail
      }));
      setIsOpen(false);
      setFullName('');
      setEmail('');
      setHoneypotValue('');
      setFormStartedAt(Date.now());
      return;
    }

    if (now - formStartedAt < FORM_SPAM_MIN_COMPLETION_MS) {
      setErrorMessage('Please wait a moment before submitting.');
      return;
    }

    const normalizedFullName = fullName.replace(/\s+/g, ' ').trim();
    if (!normalizedFullName) {
      setErrorMessage('Enter your full name to join the newsletter.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setErrorMessage('Enter a valid email address to join the newsletter.');
      return;
    }

    const { firstName, lastName } = splitName(normalizedFullName);

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch(NEWSLETTER_SIGNUP_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          intent: 'newsletter-subscribe',
          fullName: normalizedFullName,
          firstName,
          lastName,
          email: normalizedEmail,
          source: 'homepage-newsletter-modal',
          pagePath: pathname,
          ...buildFormSpamPayload({
            honeypotValue,
            startedAtMs: formStartedAt,
            submittedAtMs: now
          })
        })
      });

      const responseJson = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string; status?: string }
        | null;
      if (!response.ok || !responseJson?.success) {
        const errorText =
          typeof responseJson?.message === 'string'
            ? responseJson.message
            : 'Unable to subscribe right now. Please try again shortly.';
        throw new Error(errorText);
      }

      updateStoredState((previous, now) => ({
        ...previous,
        subscribed: true,
        subscribedAt: now,
        subscribedEmail: normalizedEmail
      }));
      trackEvent('newsletter_signup_success', {
        source: 'homepage-newsletter-modal',
        status: responseJson?.status || 'subscribed',
        page_path: pathname
      });
      setIsOpen(false);
      setFullName('');
      setEmail('');
      setHoneypotValue('');
      setFormStartedAt(Date.now());
    } catch (error) {
      console.error('Newsletter modal subscription error:', error);
      setErrorMessage('Unable to subscribe right now. Please try again shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[120] flex items-start justify-center px-3 py-3 sm:items-center sm:px-5 sm:py-5">
          <motion.button
            aria-label="Dismiss newsletter modal backdrop"
            className="absolute inset-0 bg-apple-gray-500/62 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-modal-heading"
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-5xl max-h-[calc(100dvh-1.5rem)] overflow-y-auto overflow-x-hidden rounded-[1.5rem] border border-white/45 bg-white shadow-[0_30px_70px_rgba(7,23,37,0.35)] sm:max-h-[calc(100dvh-2.5rem)] sm:rounded-[2rem]"
          >
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-white/90 text-apple-gray-500 transition-colors hover:bg-white sm:right-4 sm:top-4"
              aria-label="Close newsletter modal"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative overflow-hidden bg-gradient-to-br from-[#0f7ea6] via-[#0a6f93] to-[#084b6d] px-5 py-7 text-white sm:px-8 sm:py-9 md:px-10 md:py-11 lg:px-12 lg:py-14">
                <div className="absolute -left-14 top-12 hidden h-40 w-40 rounded-full bg-white/14 blur-3xl sm:block" />
                <div className="absolute bottom-4 right-2 hidden h-28 w-28 rounded-full bg-apex-yellow/25 blur-3xl sm:block" />

                <div className="relative pr-11 sm:pr-12">
                  <p className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/95 sm:px-4 sm:text-xs sm:tracking-[0.14em]">
                    <Sparkles size={14} />
                    Apex Growth Brief
                  </p>

                  <h2
                    id="newsletter-modal-heading"
                    className="mt-4 text-2xl font-semibold leading-tight sm:mt-5 sm:text-3xl lg:text-4xl"
                  >
                    Stay Ahead with Digital Insights
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/90 sm:mt-4 sm:leading-7 sm:text-base">
                    Join our newsletter for practical website growth strategies, marketing
                    insights, and actionable updates for Barbados and Caribbean businesses.
                  </p>

                  <form onSubmit={handleSubscribe} className="relative mt-6 space-y-3 sm:mt-7">
                    <input
                      type="text"
                      name={FORM_SPAM_HONEYPOT_FIELD_NAME}
                      value={honeypotValue}
                      onChange={(event) => setHoneypotValue(event.target.value)}
                      autoComplete="off"
                      tabIndex={-1}
                      aria-hidden="true"
                      className="pointer-events-none absolute -left-[9999px] top-auto h-px w-px opacity-0"
                    />
                    <label htmlFor="newsletter-full-name" className="sr-only">
                      Full name
                    </label>
                    <input
                      id="newsletter-full-name"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Your full name"
                      className="w-full rounded-2xl border border-white/30 bg-white/95 px-4 py-3 text-sm font-medium text-apple-gray-500 outline-none transition focus:border-apex-yellow focus:ring-2 focus:ring-apex-yellow/35 sm:text-base"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@company.com"
                      className="w-full rounded-2xl border border-white/30 bg-white/95 px-4 py-3 text-sm font-medium text-apple-gray-500 outline-none transition focus:border-apex-yellow focus:ring-2 focus:ring-apex-yellow/35 sm:text-base"
                      disabled={isSubmitting}
                    />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-apex-yellow px-5 py-3 text-sm font-semibold text-apple-gray-500 transition-colors hover:bg-apex-yellow-hover disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                      >
                        {isSubmitting ? 'Joining...' : 'Join the Newsletter'}
                      </button>
                      <button
                        type="button"
                        onClick={handleDismiss}
                        className="inline-flex w-full items-center justify-center rounded-2xl border border-white/35 bg-white/14 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/22 sm:w-auto"
                      >
                        Not Right Now
                      </button>
                    </div>

                    {errorMessage ? (
                      <p className="text-sm font-medium text-apex-yellow">{errorMessage}</p>
                    ) : null}
                  </form>
                </div>
              </div>

              <div className="relative hidden bg-[linear-gradient(180deg,#f7fcff_0%,#e9f3fb_100%)] px-7 py-8 sm:block sm:px-8 sm:py-9 md:px-9 md:py-10 lg:px-10 lg:py-12">
                <div className="absolute -right-12 top-0 h-36 w-36 rounded-full bg-[#b2def4]/65 blur-3xl" />
                <div className="relative space-y-4">
                  <div className="rounded-3xl border border-[#d5e7f3] bg-white/95 p-5 shadow-[0_15px_35px_rgba(26,65,92,0.14)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#21739a]">
                      Newsletter Benefits
                    </p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-apple-gray-400">
                      <li>Website performance and conversion tips</li>
                      <li>Barbados and Caribbean digital growth updates</li>
                      <li>Actionable insights for marketing and SEO planning</li>
                    </ul>
                  </div>

                  <div className="rounded-3xl border border-[#cae2f2] bg-[#0d5f83] p-5 text-white shadow-[0_14px_30px_rgba(4,34,56,0.3)]">
                    <p className="text-sm font-semibold text-white/95">
                      Strategic updates. No noise.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/80">
                      Get concise insights built for decision-makers who need a stronger digital
                      presence.
                    </p>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
                      <div className="h-full w-3/4 rounded-full bg-apex-yellow" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      ) : null}
    </AnimatePresence>
  );
};
