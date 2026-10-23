import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { DIGITAL_SOLUTIONS } from '../constants';
import { PageHeader } from '../components/PageHeader';
import {
  FORM_SPAM_HONEYPOT_FIELD_NAME,
  FORM_SPAM_MIN_COMPLETION_MS
} from '../utils/formSpamProtection';

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  websiteUrl: string;
  country: string;
  stateRegion: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  licenseType: string;
  quantity: number;
  businessGoals: string;
  technicalNotes: string;
  termsAccepted: boolean;
  marketingOptIn: boolean;
};

type FieldErrorMap = Partial<Record<keyof CheckoutForm, string>>;

const DEFAULT_FORM: CheckoutForm = {
  fullName: '',
  email: '',
  phone: '',
  companyName: '',
  websiteUrl: '',
  country: '',
  stateRegion: '',
  city: '',
  addressLine1: '',
  addressLine2: '',
  postalCode: '',
  licenseType: 'single-site',
  quantity: 1,
  businessGoals: '',
  technicalNotes: '',
  termsAccepted: false,
  marketingOptIn: false
};

const LICENSE_OPTIONS = [
  { value: 'single-site', label: 'Single Site', multiplier: 1 },
  { value: 'multi-site', label: 'Multi Site', multiplier: 1.75 },
  { value: 'agency', label: 'Agency', multiplier: 2.5 }
] as const;

const parsePrice = (value: string) => {
  const parsed = Number.parseFloat(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatUSD = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);

const buildMailtoLink = (subject: string, body: string) =>
  `mailto:info@apexdigitalconsultants.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const DigitalSolutionCheckout = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = DIGITAL_SOLUTIONS.find((item) => item.id === productId);
  const [formData, setFormData] = React.useState<CheckoutForm>(DEFAULT_FORM);
  const [errors, setErrors] = React.useState<FieldErrorMap>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<string | null>(null);
  const [honeypotValue, setHoneypotValue] = React.useState('');
  const [formStartedAt, setFormStartedAt] = React.useState(() => Date.now());

  if (!product) {
    return (
      <div className="pt-20 pb-24">
        <div className="container-wide max-w-3xl">
          <div className="rounded-[2rem] border border-apple-gray-100 bg-white p-8 sm:p-10 text-center">
            <h1 className="heading-lg mb-4">Checkout Not Available</h1>
            <p className="text-apple-gray-300 mb-8">
              We couldn’t locate the selected solution. Please return and choose a valid digital solution.
            </p>
            <Link to="/digital-solutions" className="apple-button apple-button-primary">
              Back to Digital Solutions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const basePrice = parsePrice(product.price);
  const selectedLicense =
    LICENSE_OPTIONS.find((option) => option.value === formData.licenseType) || LICENSE_OPTIONS[0];
  const unitPrice = basePrice * selectedLicense.multiplier;
  const subtotal = unitPrice * Math.max(formData.quantity, 1);
  const serviceFee = 0;
  const total = subtotal + serviceFee;

  const setField = <K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const nextErrors: FieldErrorMap = {};
    const requiredTextFields: (keyof CheckoutForm)[] = [
      'fullName',
      'email',
      'phone',
      'websiteUrl',
      'country',
      'stateRegion',
      'city',
      'addressLine1',
      'postalCode',
      'businessGoals'
    ];

    requiredTextFields.forEach((field) => {
      const value = formData[field];
      if (typeof value === 'string' && !value.trim()) {
        nextErrors[field] = 'This field is required.';
      }
    });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (formData.quantity < 1) {
      nextErrors.quantity = 'Quantity must be at least 1.';
    }

    if (!formData.termsAccepted) {
      nextErrors.termsAccepted = 'You must accept the terms to continue.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus(null);

    const now = Date.now();
    if (honeypotValue.trim()) {
      setSubmitted(true);
      setSubmitStatus('Purchase request prepared. Your email client has been opened with your request details.');
      setHoneypotValue('');
      setFormStartedAt(Date.now());
      return;
    }

    if (now - formStartedAt < FORM_SPAM_MIN_COMPLETION_MS) {
      setSubmitStatus('Please review your details for a moment before submitting.');
      return;
    }

    if (!validate()) return;

    const subject = `Purchase Request - ${product.name}`;
    const body = [
      `Product: ${product.name}`,
      `Category: ${product.category}`,
      `Base Price: ${formatUSD(basePrice)}`,
      `License Type: ${selectedLicense.label} (x${selectedLicense.multiplier})`,
      `Adjusted Unit Price: ${formatUSD(unitPrice)}`,
      `Quantity: ${formData.quantity}`,
      `Order Total: ${formatUSD(total)}`,
      '',
      'Customer Information',
      `Name: ${formData.fullName}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Company: ${formData.companyName || 'N/A'}`,
      `Website URL: ${formData.websiteUrl}`,
      '',
      'Billing Address',
      `Country: ${formData.country}`,
      `State/Region: ${formData.stateRegion}`,
      `City: ${formData.city}`,
      `Address Line 1: ${formData.addressLine1}`,
      `Address Line 2: ${formData.addressLine2 || 'N/A'}`,
      `Postal Code: ${formData.postalCode}`,
      '',
      'Request Preferences',
      `License Type: ${selectedLicense.label}`,
      '',
      'Business Goals',
      formData.businessGoals,
      '',
      'Technical Notes',
      formData.technicalNotes || 'N/A',
      '',
      `Marketing Opt-In: ${formData.marketingOptIn ? 'Yes' : 'No'}`
    ].join('\n');

    window.location.href = buildMailtoLink(subject, body);
    setSubmitted(true);
    setSubmitStatus('Purchase request prepared. Your email client has been opened with your request details.');
    setHoneypotValue('');
    setFormStartedAt(Date.now());
  };

  return (
    <div className="pt-12">
      <PageHeader
        title={`Checkout - ${product.name}`}
        subtitle="Purchase Request Intake"
        description="Complete this form to submit your request scope, billing details, and implementation requirements."
      />

      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-8 lg:gap-10">
            <form
              onSubmit={handleSubmit}
              className="relative rounded-[2.5rem] border border-apple-gray-100 bg-white p-7 sm:p-10 space-y-8"
            >
              <div>
                <h2 className="text-3xl font-semibold mb-2">Customer & Billing Details</h2>
                <p className="text-apple-gray-300">
                  Provide complete request details so our team can prepare your implementation plan.
                </p>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  value={formData.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                  placeholder="Full Name *"
                  className="w-full border border-apple-gray-100 rounded-xl p-4"
                />
                <input
                  value={formData.email}
                  onChange={(e) => setField('email', e.target.value)}
                  placeholder="Email Address *"
                  className="w-full border border-apple-gray-100 rounded-xl p-4"
                />
                <input
                  value={formData.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  placeholder="Phone Number *"
                  className="w-full border border-apple-gray-100 rounded-xl p-4"
                />
                <input
                  value={formData.companyName}
                  onChange={(e) => setField('companyName', e.target.value)}
                  placeholder="Company Name"
                  className="w-full border border-apple-gray-100 rounded-xl p-4"
                />
                <input
                  value={formData.websiteUrl}
                  onChange={(e) => setField('websiteUrl', e.target.value)}
                  placeholder="Website URL *"
                  className="w-full border border-apple-gray-100 rounded-xl p-4 md:col-span-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  value={formData.country}
                  onChange={(e) => setField('country', e.target.value)}
                  placeholder="Country *"
                  className="w-full border border-apple-gray-100 rounded-xl p-4"
                />
                <input
                  value={formData.stateRegion}
                  onChange={(e) => setField('stateRegion', e.target.value)}
                  placeholder="State / Region *"
                  className="w-full border border-apple-gray-100 rounded-xl p-4"
                />
                <input
                  value={formData.city}
                  onChange={(e) => setField('city', e.target.value)}
                  placeholder="City *"
                  className="w-full border border-apple-gray-100 rounded-xl p-4"
                />
                <input
                  value={formData.postalCode}
                  onChange={(e) => setField('postalCode', e.target.value)}
                  placeholder="Postal Code *"
                  className="w-full border border-apple-gray-100 rounded-xl p-4"
                />
                <input
                  value={formData.addressLine1}
                  onChange={(e) => setField('addressLine1', e.target.value)}
                  placeholder="Billing Address Line 1 *"
                  className="w-full border border-apple-gray-100 rounded-xl p-4 md:col-span-2"
                />
                <input
                  value={formData.addressLine2}
                  onChange={(e) => setField('addressLine2', e.target.value)}
                  placeholder="Billing Address Line 2"
                  className="w-full border border-apple-gray-100 rounded-xl p-4 md:col-span-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <select
                  value={formData.licenseType}
                  onChange={(e) => setField('licenseType', e.target.value)}
                  className="w-full border border-apple-gray-100 rounded-xl p-4 bg-white"
                >
                  {LICENSE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {`License: ${option.label} (${formatUSD(basePrice * option.multiplier)} each)`}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={formData.quantity}
                  onChange={(e) => setField('quantity', Number.parseInt(e.target.value || '1', 10))}
                  className="w-full border border-apple-gray-100 rounded-xl p-4"
                />
              </div>

              <textarea
                value={formData.businessGoals}
                onChange={(e) => setField('businessGoals', e.target.value)}
                placeholder="Business Goals & Expected Outcome *"
                className="w-full border border-apple-gray-100 rounded-xl p-4 min-h-[130px]"
              />
              <textarea
                value={formData.technicalNotes}
                onChange={(e) => setField('technicalNotes', e.target.value)}
                placeholder="Technical Notes (plugins, integrations, constraints)"
                className="w-full border border-apple-gray-100 rounded-xl p-4 min-h-[110px]"
              />

              <div className="space-y-3">
                <label className="flex items-start gap-3 text-sm text-apple-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setField('termsAccepted', e.target.checked)}
                    className="mt-1"
                  />
                  I confirm the details are accurate and agree to proceed with this order request.
                </label>
                <label className="flex items-start gap-3 text-sm text-apple-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.marketingOptIn}
                    onChange={(e) => setField('marketingOptIn', e.target.checked)}
                    className="mt-1"
                  />
                  I want occasional updates on new digital solutions and improvements.
                </label>
              </div>

              {Object.keys(errors).length > 0 ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  Please complete all required checkout fields before submitting.
                </div>
              ) : null}

              {submitted ? (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  {submitStatus || 'Purchase request prepared. Your email client has been opened with your request details.'}
                </div>
              ) : null}

              {!submitted && submitStatus ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  {submitStatus}
                </div>
              ) : null}

              <button type="submit" className="apple-button apple-button-primary w-full">
                Submit Purchase Request
              </button>
            </form>

            <aside className="rounded-[2.5rem] border border-apple-gray-100 bg-white p-7 sm:p-8 h-fit xl:sticky xl:top-28">
              <h3 className="text-2xl font-semibold mb-5">Order Summary</h3>
              <div className="rounded-2xl border border-apple-gray-100 p-5 mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-apex-yellow mb-2">
                  Selected Product
                </p>
                <p className="font-semibold text-apple-gray-500">{product.name}</p>
                <p className="text-sm text-apple-gray-300 mt-2">{product.category}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-apple-gray-300">
                  <span>Base Price</span>
                  <span>{formatUSD(basePrice)}</span>
                </div>
                <div className="flex items-center justify-between text-apple-gray-300">
                  <span>License</span>
                  <span>{`${selectedLicense.label} (x${selectedLicense.multiplier})`}</span>
                </div>
                <div className="flex items-center justify-between text-apple-gray-300">
                  <span>Adjusted Unit Price</span>
                  <span>{formatUSD(unitPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-apple-gray-300">
                  <span>Quantity</span>
                  <span>{Math.max(formData.quantity, 1)}</span>
                </div>
                <div className="flex items-center justify-between text-apple-gray-300">
                  <span>Service Fee</span>
                  <span>{formatUSD(serviceFee)}</span>
                </div>
                <div className="border-t border-apple-gray-100 pt-3 mt-3 flex items-center justify-between text-base font-semibold text-apple-gray-500">
                  <span>Total</span>
                  <span>{formatUSD(total)}</span>
                </div>
              </div>

              <div className="mt-7 space-y-3 text-sm text-apple-gray-300">
                <p className="flex items-start gap-2">
                  <Lock size={16} className="text-apex-yellow mt-0.5 shrink-0" />
                  Your request details are handled securely for intake and planning.
                </p>
                <p className="flex items-start gap-2">
                  <ShieldCheck size={16} className="text-apex-yellow mt-0.5 shrink-0" />
                  Final delivery scope, timelines, and payment steps are confirmed after review.
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-apex-yellow mt-0.5 shrink-0" />
                  Implementation starts after requirements and project approval are confirmed.
                </p>
              </div>

              <Link to={`/digital-solutions/${product.id}`} className="apple-button apple-button-secondary w-full mt-8 text-center">
                Back to Solution Details
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};
