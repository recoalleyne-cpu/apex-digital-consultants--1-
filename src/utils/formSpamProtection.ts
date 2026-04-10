export const FORM_SPAM_MIN_COMPLETION_MS = 1200;
export const FORM_SPAM_HONEYPOT_FIELD_NAME = 'company_website';

type FormSpamPayloadInput = {
  honeypotValue: string;
  startedAtMs: number;
  submittedAtMs?: number;
};

export const buildFormSpamPayload = ({
  honeypotValue,
  startedAtMs,
  submittedAtMs = Date.now()
}: FormSpamPayloadInput) => {
  const normalizedStart = Number.isFinite(startedAtMs)
    ? Math.max(0, Math.trunc(startedAtMs))
    : submittedAtMs;
  const normalizedSubmit = Number.isFinite(submittedAtMs)
    ? Math.max(0, Math.trunc(submittedAtMs))
    : Date.now();
  const elapsed = Math.max(0, normalizedSubmit - normalizedStart);

  return {
    [FORM_SPAM_HONEYPOT_FIELD_NAME]: honeypotValue.trim(),
    form_started_at: normalizedStart,
    submitted_at: normalizedSubmit,
    form_fill_duration_ms: elapsed
  };
};
