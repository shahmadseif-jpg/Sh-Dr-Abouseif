'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { isValidEmail, submitToFormSubmit, type SubmitOutcome } from '@/lib/forms';

type Status = 'idle' | 'invalid' | 'sending' | SubmitOutcome['kind'];

/**
 * Newsletter *request*. There is no mailing-list provider behind this form:
 * the address is e-mailed to the Imam's inbox through FormSubmit. The copy
 * therefore says "request sent", never "subscribed" (LANG-122 / PRIV-03);
 * a real list with double opt-in and unsubscribe is an owner decision.
 */
export default function Newsletter() {
  const t = useTranslations('newsletter');
  const uid = useId();
  const inputId = `nl-email-${uid}`;
  const errId = `nl-err-${uid}`;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    if (!isValidEmail(email)) {
      setStatus('invalid');
      document.getElementById(inputId)?.focus();
      return;
    }
    setStatus('sending');
    const outcome = await submitToFormSubmit({
      'البريد / Email': email.trim(),
      'نوع الطلب / Request': 'newsletter request (manual list)',
      _subject: 'طلب اشتراك في النشرة البريديّة',
      _template: 'table',
      _captcha: 'false',
    });
    setStatus(outcome.kind);
    if (outcome.kind === 'ok') setEmail('');
  }

  const message =
    status === 'invalid'
      ? t('errEmail')
      : status === 'activation'
      ? t('activation')
      : status === 'timeout'
      ? t('timeout')
      : status === 'rejected' || status === 'network'
      ? t('error')
      : '';

  return (
    <div className="max-w-md">
      <h3 className="text-sm font-medium text-navy-700 mb-1">{t('title')}</h3>
      <p className="text-xs text-navy-500 mb-3 leading-relaxed">{t('desc')}</p>
      {status === 'ok' ? (
        <p className="text-sm text-gold-700" role="status">
          {t('ok')}
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="flex gap-2" aria-busy={status === 'sending'}>
          <label htmlFor={inputId} className="sr-only">
            {t('label')}
          </label>
          <input
            id={inputId}
            type="email"
            dir="ltr"
            required
            aria-required="true"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'invalid') setStatus('idle');
            }}
            placeholder={t('ph')}
            aria-invalid={status === 'invalid' ? true : undefined}
            aria-describedby={message ? errId : undefined}
            className="min-w-0 flex-1 min-h-[44px] rounded-md border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="shrink-0 min-h-[44px] rounded-md bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60"
          >
            {status === 'sending' ? t('sending') : t('btn')}
          </button>
        </form>
      )}
      <p id={errId} role="alert" className="mt-2 text-xs text-red-700">
        {message}
      </p>
    </div>
  );
}
