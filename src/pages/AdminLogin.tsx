import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import {
  loginAdmin,
  requestAdminPasswordReset,
  verifyAdminSession
} from '../utils/adminApi';

type LoginLocationState = {
  from?: string;
};

export const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state || {}) as LoginLocationState;
  const redirectTo = locationState.from?.startsWith('/admin')
    ? locationState.from
    : '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [sendingResetLink, setSendingResetLink] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetMessageIsError, setResetMessageIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkExistingSession = async () => {
      const isValid = await verifyAdminSession();
      if (!isMounted) return;
      if (isValid) {
        navigate(redirectTo, { replace: true });
        return;
      }
      setCheckingSession(false);
    };

    void checkExistingSession();

    return () => {
      isMounted = false;
    };
  }, [navigate, redirectTo]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const nextEmail = email.trim();
    if (!nextEmail || !password.trim()) {
      setErrorMessage('Enter both email and password.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setResetMessage(null);
    setResetMessageIsError(false);

    try {
      await loginAdmin(nextEmail, password);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to log in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendResetLink = async () => {
    if (sendingResetLink) return;

    const nextEmail = email.trim();
    if (!nextEmail) {
      setResetMessageIsError(true);
      setResetMessage('Enter your admin email to send a reset link.');
      return;
    }

    setSendingResetLink(true);
    setResetMessage(null);
    setResetMessageIsError(false);

    try {
      await requestAdminPasswordReset(nextEmail);
      setResetMessageIsError(false);
      setResetMessage('If this email is registered, a password reset link has been sent.');
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.toLowerCase().includes('firebase is not configured')) {
        setResetMessageIsError(true);
        setResetMessage(message);
      } else {
        setResetMessageIsError(false);
        setResetMessage('If this email is registered, a password reset link has been sent.');
      }
    } finally {
      setSendingResetLink(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-apple-gray-50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-apple-gray-100 bg-white p-8 text-center sm:p-10">
          <h1 className="text-2xl font-semibold tracking-tight text-apple-gray-500 sm:text-3xl">
            Preparing Admin Login
          </h1>
          <p className="mt-3 text-sm leading-7 text-apple-gray-300 sm:text-base">
            Checking for an active admin session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9fc] via-white to-[#eef3f8] px-6 py-16 sm:px-8 md:py-24">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <section className="rounded-[2.5rem] border border-apple-gray-100 bg-white/90 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10 md:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-apple-gray-100 bg-apple-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300">
            <Lock size={14} />
            Admin Access
          </div>

          <h1 className="mt-7 text-3xl font-semibold tracking-tight text-apple-gray-500 sm:text-4xl">
            Sign in to Apex CMS
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-apple-gray-300 sm:text-base">
            Use your admin email and password to access protected content tools and publishing workflows.
          </p>

          <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-apple-gray-100 bg-white px-4 py-3 text-sm text-apple-gray-500 outline-none transition-colors focus:border-apex-yellow"
                placeholder="admin@apexdigitalconsultants.com"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-apple-gray-100 bg-white px-4 py-3 text-sm text-apple-gray-500 outline-none transition-colors focus:border-apex-yellow"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-apple-gray-300">
                  Forgot your password? Reset it securely.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword((previous) => !previous);
                    setResetMessage(null);
                    setResetMessageIsError(false);
                  }}
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-500 transition-colors hover:text-apex-yellow"
                >
                  {showForgotPassword ? 'Hide Reset' : 'Forgot Password?'}
                </button>
              </div>
            </div>

            {showForgotPassword ? (
              <div className="rounded-2xl border border-apple-gray-100 bg-apple-gray-50/70 p-4 sm:p-5">
                <p className="text-sm leading-7 text-apple-gray-300">
                  Enter your admin email and we will send a secure password reset link.
                </p>
                <div className="mt-4 space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        void handleSendResetLink();
                      }
                    }}
                    className="w-full rounded-2xl border border-apple-gray-100 bg-white px-4 py-3 text-sm text-apple-gray-500 outline-none transition-colors focus:border-apex-yellow"
                    placeholder="admin@apexdigitalconsultants.com"
                    autoComplete="email"
                  />
                  <button
                    type="button"
                    onClick={handleSendResetLink}
                    className="apple-button apple-button-secondary inline-flex w-full items-center justify-center"
                    disabled={sendingResetLink}
                  >
                    {sendingResetLink ? 'Sending Reset Link...' : 'Send Reset Link'}
                  </button>
                </div>

                {resetMessage ? (
                  <p
                    className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                      resetMessageIsError
                        ? 'border border-red-200 bg-red-50 text-red-700'
                        : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {resetMessage}
                  </p>
                ) : null}
              </div>
            ) : null}

            {errorMessage ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              className="apple-button apple-button-primary inline-flex w-full items-center justify-center gap-2"
              disabled={submitting}
            >
              {submitting ? 'Signing In...' : 'Sign In'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 text-sm text-apple-gray-300">
            Need the main site?{' '}
            <Link to="/" className="font-medium text-apple-gray-500 hover:text-apex-yellow">
              Return Home
            </Link>
          </div>
        </section>

        <aside className="rounded-[2.5rem] border border-apple-gray-100 bg-[radial-gradient(circle_at_top,#dff1ff,transparent_60%),linear-gradient(160deg,#ffffff,#f1f7ff)] p-8 sm:p-10">
          <h2 className="text-xl font-semibold text-apple-gray-500">Security Notice</h2>
          <p className="mt-4 text-sm leading-8 text-apple-gray-300">
            Admin identity is handled by Firebase Authentication. Server routes validate your Firebase ID token before allowing admin data access.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-apple-gray-300">
            <li>• Unauthenticated users are redirected to this page.</li>
            <li>• Admin API writes require a valid Firebase-authenticated token.</li>
            <li>• Session validation runs before loading dashboard tools.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
};
