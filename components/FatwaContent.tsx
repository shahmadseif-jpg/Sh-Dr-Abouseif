'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export default function FatwaContent() {
  const t = useTranslations('fatwa');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  const topics = t.raw('topics') as string[];
  const answerLangs = t.raw('answerLangs') as string[];
  const defaultAnswerLang =
    answerLangs[locale === 'ar' ? 0 : locale === 'en' ? 1 : 2] ?? answerLangs[0];

  const inputCls =
    'w-full rounded-md border border-navy-200 bg-white px-4 py-3 text-navy-800 ' +
    'placeholder:text-navy-300 transition-colors focus:border-navy-500 focus:outline-none ' +
    'focus:ring-2 focus:ring-navy-500/20';
  const labelCls = 'block text-sm font-medium text-navy-700 mb-1.5 mt-4';
  const req = <span className="text-gold-600">*</span>;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get('_honey')) {
      setStatus('ok');
      return;
    }
    const payload: Record<string, string> = {};
    fd.forEach((v, k) => (payload[k] = String(v)));
    payload.uiLang = locale;
    try {
      const res = await fetch('/api/fatwa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('bad status ' + res.status);
      setStatus('ok');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-navy-600 leading-relaxed">{t('subtitle')}</p>
        </div>

        <div className="bg-white border border-navy-100 rounded-lg p-6 sm:p-8">
          <form onSubmit={onSubmit} noValidate>
            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <div>
                <label className={labelCls}>
                  {t('name')} {req}
                </label>
                <input
                  className={inputCls}
                  name="name"
                  required
                  placeholder={t('namePlaceholder')}
                />
              </div>
              <div>
                <label className={labelCls}>
                  {t('email')} {req}
                </label>
                <input
                  className={inputCls}
                  type="email"
                  name="email"
                  required
                  placeholder={t('emailPlaceholder')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <div>
                <label className={labelCls}>{t('country')}</label>
                <input
                  className={inputCls}
                  name="country"
                  placeholder={t('countryPlaceholder')}
                />
              </div>
              <div>
                <label className={labelCls}>
                  {t('topic')} {req}
                </label>
                <select className={inputCls} name="topic" required defaultValue="">
                  <option value="" disabled>
                    {t('chooseTopic')}
                  </option>
                  {topics.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className={labelCls}>{t('answerLang')}</label>
            <select className={inputCls} name="answerLang" defaultValue={defaultAnswerLang}>
              {answerLangs.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>

            <label className={labelCls}>
              {t('question')} {req}
            </label>
            <textarea
              className={`${inputCls} min-h-[160px] resize-y`}
              name="question"
              required
              placeholder={t('questionPlaceholder')}
            />

            <div className="mt-5 rounded-md border border-gold-200 bg-gold-50 px-4 py-3.5 text-sm text-navy-700 leading-relaxed">
              {t('disclaimer')}
            </div>

            <label className="mt-4 flex items-start gap-2.5 text-sm text-navy-700">
              <input type="checkbox" required className="mt-1" />
              <span>{t('consent')}</span>
            </label>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-6 w-full rounded-md bg-navy-600 px-4 py-3.5 text-base font-medium text-white transition-colors hover:bg-navy-700 disabled:opacity-60"
            >
              {status === 'sending' ? t('sending') : t('submit')}
            </button>

            {status === 'ok' && (
              <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-4 py-3.5 text-sm font-medium text-green-700">
                {t('success')}
              </div>
            )}
            {status === 'error' && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-700">
                {t('error')}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
