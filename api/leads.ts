import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createLead, ensureHybridContentSchemaReady } from '../server/api-shared/contentRepository';
import { getSqlClient, isNeonConfigured } from '../server/api-shared/neonDb';
// nodemailer is imported dynamically inside sendEmailWithRetry to avoid runtime
// module load errors in serverless environments when the package is missing or
// incompatible. See sendEmailWithRetry for the dynamic import.

export const config = {
  runtime: 'nodejs'
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const parseText = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const clip = (value: string | null, maxLength: number) => {
  if (!value) return null;
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength).trim();
};

const toObject = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
};

const splitName = (value: string | null) => {
  if (!value) return { firstName: null as string | null, lastName: null as string | null };
  const parts = value.split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: null as string | null, lastName: null as string | null };
  if (parts.length === 1) return { firstName: parts[0], lastName: null };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
};

const getRequestPayload = (req: VercelRequest) => {
  if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body || '{}');
      return toObject(parsed) ?? {};
    } catch {
      return null;
    }
  }

  if (typeof req.body === 'object') {
    return toObject(req.body) ?? {};
  }

  return {};
};

// Helper: sleep for ms
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type EmailPayload = {
  name: string | null;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  serviceInterest?: string | null;
  projectDetails?: string | null;
  toAddress?: string;
};

async function sendEmailWithRetry(payload: EmailPayload): Promise<boolean> {
  const maxRetries = 3;
  const delayMs = 700; // delay between retries
  const perAttemptTimeoutMs = 10000; // 10s per attempt

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('EMAIL CONFIG MISSING: SMTP_HOST/SMTP_USER/SMTP_PASS');
    return false;
  }

  // Dynamically import nodemailer at runtime to avoid module load failures
  let nodemailerAny: any;
  try {
    // dynamic import keeps module resolution until runtime and avoids fatal
    // errors at module load time in some serverless environments
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = await import('nodemailer');
    nodemailerAny = (mod && (mod.default || mod));
  } catch (importErr) {
    console.error('Failed to import nodemailer dynamically', importErr);
    return false;
  }

  const transporter = nodemailerAny.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : (process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) === 465 : true),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Basic input sanitizers to mitigate header injection and XSS in email body
  const sanitizeHeader = (value: string | null | undefined) => {
    if (!value) return '';
    return String(value).replace(/[\r\n<>]/g, ' ').trim();
  };

  const escapeHtml = (unsafe: string) => {
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Verify transporter is usable (with timeout) to fail fast before attempts
  try {
    // eslint-disable-next-line no-await-in-loop
    await Promise.race([
      transporter.verify(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('SMTP verify timeout')), 5000))
    ]);
  } catch (verifyErr) {
    // Log but continue — send attempts will still run and retry
    // eslint-disable-next-line no-console
    console.warn('SMTP verify failed or timed out, proceeding to send attempts', verifyErr instanceof Error ? verifyErr.message : verifyErr);
  }

  const toAddress = payload.toAddress || process.env.CONTACT_TO || process.env.SMTP_USER || 'info@apexdigitalconsultants.com';
  const rawName = payload.name || null;
  const name = sanitizeHeader(rawName);
  const rawEmail = payload.email || '';
  const safeReplyTo = EMAIL_PATTERN.test(String(rawEmail).trim()) ? String(rawEmail).trim() : undefined;
  const plainText = [
    `Name: ${name || 'N/A'}`,
    `Email: ${rawEmail}`,
    `Phone: ${payload.phone || 'N/A'}`,
    `Company: ${payload.companyName || 'N/A'}`,
    `Service: ${payload.serviceInterest || 'N/A'}`,
    `Message:\n${payload.projectDetails || 'N/A'}`
  ].join('\n\n');

  const safeMessageHtml = escapeHtml(payload.projectDetails || 'N/A').replace(/\n/g, '<br/>');

  const mailOptions: any = {
    from: `Apex Digital Website <${process.env.SMTP_USER}>`,
    to: toAddress,
    subject: `New Lead: ${name || rawEmail}`,
    text: plainText,
    html: `<h2>New Lead</h2><p><strong>Name:</strong> ${escapeHtml(name || 'N/A')}</p><p><strong>Email:</strong> ${escapeHtml(rawEmail)}</p><p><strong>Phone:</strong> ${escapeHtml(payload.phone || 'N/A')}</p><p><strong>Company:</strong> ${escapeHtml(payload.companyName || 'N/A')}</p><p><strong>Service:</strong> ${escapeHtml(payload.serviceInterest || 'N/A')}</p><p><strong>Message:</strong><br/>${safeMessageHtml}</p>`
  };

  if (safeReplyTo) {
    mailOptions.replyTo = safeReplyTo;
  }

  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // per-attempt timeout wrapper
      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Email send timeout')), perAttemptTimeoutMs))
      ]);
      return true;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        // small delay before retry
        // eslint-disable-next-line no-await-in-loop
        await sleep(delayMs);
      }
    }
  }

  // All retries failed — log clearly
  // eslint-disable-next-line no-console
  console.error('EMAIL FAILED AFTER RETRIES', lastError);
  // Also log the lead payload for urgent attention
  // eslint-disable-next-line no-console
  console.error('URGENT: Lead saved but email failed', payload);
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
    }

    if (!isNeonConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'Missing DATABASE_URL (or POSTGRES_URL) environment variable',
        fallback: 'Please email info@apexdigitalconsultants.com to report this issue.'
      });
    }

    const payload = getRequestPayload(req);
    if (!payload) {
      return res.status(400).json({ success: false, error: 'Invalid JSON payload' });
    }

    const email = clip(parseText(payload.email), 320);
    if (!email || !EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ success: false, error: 'A valid email is required.' });
    }

    const combinedName = clip(parseText(payload.name), 200);
    const { firstName: splitFirstName, lastName: splitLastName } = splitName(combinedName);

    const firstName =
      clip(parseText(payload.firstName) || parseText(payload.first_name), 120) ||
      splitFirstName;
    const lastName =
      clip(parseText(payload.lastName) || parseText(payload.last_name), 120) || splitLastName;

    const phone = clip(parseText(payload.phone), 60);
    const companyName = clip(parseText(payload.companyName) || parseText(payload.company_name), 160);
    const serviceInterest = clip(
      parseText(payload.service) || parseText(payload.service_interest),
      200
    );
    const projectDetails = clip(
      parseText(payload.projectDetails) ||
        parseText(payload.project_details) ||
        parseText(payload.message),
      6000
    );
    const budgetRange = clip(parseText(payload.budget) || parseText(payload.budget_range), 120);
    const source = clip(parseText(payload.source), 120) || 'website';

    const sql = getSqlClient();
    await ensureHybridContentSchemaReady(sql);

    const name = [firstName, lastName].filter(Boolean).join(' ').trim() || null;
    const id = await createLead(sql, {
      name,
      email,
      phone,
      company: companyName,
      message:
        [serviceInterest, projectDetails, budgetRange]
          .filter(Boolean)
          .join(' | ') || null,
      source
    });

    // Attempt to send notification email about the new lead, with retries.
    let mailSent = false;
    try {
      mailSent = await sendEmailWithRetry({
        name,
        email,
        phone,
        companyName,
          if (req.method !== 'POST') {
            return res.status(405).json({ success: false, error: 'Method not allowed' });
          }

          if (!isNeonConfigured()) {
            return res.status(503).json({
              success: false,
              error: 'Missing DATABASE_URL (or POSTGRES_URL) environment variable',
              fallback: 'Please email info@apexdigitalconsultants.com to report this issue.'
            });
          }

          const payload = getRequestPayload(req);
          if (!payload) {
            return res.status(400).json({ success: false, error: 'Invalid JSON payload' });
          }

          const email = clip(parseText(payload.email), 320);
          if (!email || !EMAIL_PATTERN.test(email)) {
            return res.status(400).json({ success: false, error: 'A valid email is required.' });
          }
