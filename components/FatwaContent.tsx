'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  CONSENT_POLICY_VERSION,
  FIELD_LIMITS,
  HONEYPOT_STYLE,
  submitToFormSubmit,
  validateFields,
  type FieldError,
  type SubmitOutcome,
} from '@/lib/forms';

type Status = 'idle' | 'sending' | SubmitOutcome['kind'];

const FIELDS = ['name', 'email', 'topic', 'question', 'consentProcessing'] as const;

// Default answer-language option per UI locale. The option list itself
// (messages fatwa.answerLangs) is Arabic / English / Spanish; Urdu answers
// are not offered until the owner confirms the service (LEDGER LANG-106),
// so the Urdu UI defaults to English rather than falling through to Spanish.
const DEFAULT_ANSWER_LANG_INDEX: Record<string, number> = { ar: 0, en: 1, es: 2, ur: 1 };

export default function FatwaContent({ headingLevel = 'h1' }: { headingLevel?: 'h1' | 'h2' }) {
  const t = useTranslations('fatwa');
  const locale = useLocale();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, FieldError>>({});
  const Heading = headingLevel;

  const topics = t.raw('topics') as string[];
  const answerLangs = t.raw('answerLangs') as string[];
  const defaultAnswerLang = answerLangs[DEFAULT_ANSWER_LANG_INDEX[locale] ?? 0] ?? answerLangs[0];

  const inputCls =
    'w-full rounded-md border border-navy-200 bg-white px-4 py-3 text-navy-800 ' +
    'placeholder:text-navy-400 transition-colors focus:border-navy-500 focus:outline-none ' +
    'focus:ring-2 focus:ring-navy-500/20 aria-[invalid=true]:border-red-600';
  const labelCls = 'block text-sm font-medium text-navy-700 mb-1.5 mt-4';
  const req = (
    <span className="text-gold-700" aria-hidden="true">
      *
    </span>
  );

  const errText = (e: FieldError) =>
    e === 'email' ? t('errEmail') : e === 'tooLong' ? t('errTooLong') : e === 'consent' ? t('errConsent') : t('errRequired');

  const fieldProps = (name: string) => ({
    id: `fatwa-${name}`,
    name,
    'aria-invalid': errors[name] ? (true as const) : undefined,
    'aria-describedby': errors[name] ? `fatwa-${name}-err` : undefined,
  });

  const fieldError = (name: string) =>
    errors[name] ? (
      <p id={`fatwa-${name}-err`} className="mt-1 text-sm text-red-700">
        {errText(errors[name])}
      </p>
    ) : null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return; // no duplicate submissions
    const form = e.currentTarget;
    const fd = new FormData(form);

    const values = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      country: String(fd.get('country') ?? ''),
      topic: String(fd.get('topic') ?? ''),
      answerLang: String(fd.get('answerLang') ?? ''),
      question: String(fd.get('question') ?? ''),
      consentProcessing: fd.get('consentProcessing') === 'yes',
      consentPublish: fd.get('consentPublish') === 'yes',
    };

    const found = validateFields(values, {
      name: { required: true, maxLength: FIELD_LIMITS.name },
      email: { required: true, email: true },
      country: { maxLength: FIELD_LIMITS.country },
      topic: { required: true },
      question: { required: true, maxLength: FIELD_LIMITS.question },
      consentProcessing: { mustBeChecked: true },
    });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('idle');
      const first = FIELDS.find((f) => found[f]);
      if (first) form.querySelector<HTMLElement>(`#fatwa-${first}`)?.focus();
      return;
    }

    // Bots fill the hidden field; pretend nothing happened (do not send).
    if (fd.get('_honey')) {
      setStatus('idle');
      return;
    }

    setStatus('sending');
    // Consent is carried with the submission: what was agreed, which wording
    // version, and when (client clock). Keeping these records server-side and
    // for how long is an owner/ops decision at the receiving inbox/FormSubmit
    // (LEDGER FORM-01, needs_ops_access) — the browser cannot guarantee it.
    const data: Record<string, string> = {
      'الاسم / Name': values.name.trim(),
      'البريد / Email': values.email.trim(),
      'الدولة / Country': values.country.trim() || '—',
      'الموضوع / Topic': values.topic,
      'لغة الإجابة / Answer language': values.answerLang || '—',
      'لغة الواجهة / UI language': locale,
      'السؤال / Question': values.question.trim(),
      'موافقة المعالجة / Consent to handling': 'yes',
      'إذن النشر بعد إخفاء الهوية / Publish after anonymization':
        values.consentPublish ? 'yes' : 'no',
      'إصدار نص الموافقة / Consent wording version': CONSENT_POLICY_VERSION,
      'وقت الموافقة / Consent timestamp (client)': new Date().toISOString(),
      _subject: `سؤال شرعي جديد من الموقع — ${values.topic}`,
      _template: 'table',
      _captcha: 'false',
      _replyto: values.email.trim(),
    };

    const outcome = await submitToFormSubmit(data);
    setStatus(outcome.kind);
    if (outcome.kind === 'ok') {
      form.reset();
      setErrors({});
    }
    // On any other outcome the inputs are left untouched.
  }

  const sending = status === 'sending';

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Heading className="text-4xl sm:text-5xl font-medium text-navy-700 mb-4">
            {t('title')}
          </Heading>
          <p className="text-lg text-navy-600 leading-relaxed">{t('subtitle')}</p>
        </div>

        <div className="bg-white border border-navy-100 rounded-lg p-6 sm:p-8">
          {/* noValidate: the browser bubbles are replaced by the localized,
              announced messages below; `required` is still enforced in onSubmit. */}
          <form onSubmit={onSubmit} noValidate aria-busy={sending}>
            <p className="text-xs text-navy-500">{t('requiredNote')}</p>

            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={HONEYPOT_STYLE}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <div>
                <label htmlFor="fatwa-name" className={labelCls}>
                  {t('name')} {req}
                </label>
                <input
                  className={inputCls}
                  {...fieldProps('name')}
                  required
                  aria-required="true"
                  autoComplete="name"
                  maxLength={FIELD_LIMITS.name}
                  placeholder={t('namePlaceholder')}
                />
                {fieldError('name')}
              </div>
              <div>
                <label htmlFor="fatwa-email" className={labelCls}>
                  {t('email')} {req}
                </label>
                <input
                  className={inputCls}
                  type="email"
                  dir="ltr"
                  {...fieldProps('email')}
                  required
                  aria-required="true"
                  autoComplete="email"
                  maxLength={FIELD_LIMITS.email}
                  placeholder={t('emailPlaceholder')}
                />
                {fieldError('email')}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <div>
                <label htmlFor="fatwa-country" className={labelCls}>
                  {t('country')}
                </label>
                <input
                  className={inputCls}
                  {...fieldProps('country')}
                  autoComplete="country-name"
                  maxLength={FIELD_LIMITS.country}
                  placeholder={t('countryPlaceholder')}
                />
                {fieldError('country')}
              </div>
              <div>
                <label htmlFor="fatwa-topic" className={labelCls}>
                  {t('topic')} {req}
                </label>
                <select
                  className={inputCls}
                  {...fieldProps('topic')}
                  required
                  aria-required="true"
                  defaultValue=""
                >
                  <option value="" disabled>
                    {t('chooseTopic')}
                  </option>
                  {topics.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                {fieldError('topic')}
              </div>
            </div>

            <label htmlFor="fatwa-answerLang" className={labelCls}>
              {t('answerLang')}
            </label>
            <select
              className={inputCls}
              id="fatwa-answerLang"
              name="answerLang"
              defaultValue={defaultAnswerLang}
            >
              {answerLangs.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>

            <label htmlFor="fatwa-question" className={labelCls}>
              {t('question')} {req}
            </label>
            <textarea
              className={`${inputCls} min-h-[160px] resize-y`}
              {...fieldProps('question')}
              required
              aria-required="true"
              maxLength={FIELD_LIMITS.question}
              placeholder={t('questionPlaceholder')}
            />
            {fieldError('question')}

            <div className="mt-5 rounded-md border border-gold-200 bg-gold-50 px-4 py-3.5 text-sm text-navy-700 leading-relaxed">
              {t('disclaimer')}{' '}
              <Link href="/how-we-answer" className="font-medium text-navy-700 underline">
                {t('policyLink')}
              </Link>
            </div>

            <fieldset className="mt-4 space-y-3">
              <legend className="sr-only">{t('consentLegend')}</legend>
              <div>
                <label className="flex items-start gap-2.5 text-sm text-navy-700 min-h-[44px]">
                  <input
                    type="checkbox"
                    {...fieldProps('consentProcessing')}
                    value="yes"
                    required
                    aria-required="true"
                    className="mt-1 h-5 w-5 shrink-0"
                  />
                  <span>
                    {t('consentProcessing')} {req}
                  </span>
                </label>
                {fieldError('consentProcessing')}
              </div>
              <label className="flex items-start gap-2.5 text-sm text-navy-700 min-h-[44px]">
                <input
                  type="checkbox"
                  id="fatwa-consentPublish"
                  name="consentPublish"
                  value="yes"
                  className="mt-1 h-5 w-5 shrink-0"
                />
                <span>{t('consentPublish')}</span>
              </label>
            </fieldset>

            <button
              type="submit"
              disabled={sending}
              className="mt-6 w-full min-h-[44px] rounded-md bg-navy-600 px-4 py-3.5 text-base font-medium text-white transition-colors hover:bg-navy-700 disabled:opacity-60"
            >
              {sending ? t('sending') : t('submit')}
            </button>

            <div role="status" aria-live="polite" className="mt-4">
              {Object.keys(errors).length > 0 && status === 'idle' && (
                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {t('errSummary')}
                </p>
              )}
              {status === 'ok' && (
                <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3.5 text-sm font-medium text-green-800">
                  {t('success')}
                </p>
              )}
              {status === 'activation' && (
                <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm font-medium text-amber-900">
                  {t('activation')}
                </p>
              )}
              {status === 'timeout' && (
                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-800">
                  {t('timeout')}
                </p>
              )}
              {(status === 'rejected' || status === 'network') && (
                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-800">
                  {t('error')}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
