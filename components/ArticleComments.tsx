'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ArticleComment } from '@/lib/comments';
import {
  FIELD_LIMITS,
  HONEYPOT_STYLE,
  submitToFormSubmit,
  validateFields,
  type FieldError,
  type SubmitOutcome,
} from '@/lib/forms';

interface Props {
  slug: string;
  locale: string;
  articleTitle: string;
  comments: ArticleComment[];
}

type Status = 'idle' | 'sending' | SubmitOutcome['kind'];

export default function ArticleComments({ slug, locale, articleTitle, comments }: Props) {
  const t = useTranslations('comments');
  // Urdu is RTL too; previously only Arabic was (LANG-105).
  const isRTL = locale === 'ar' || locale === 'ur';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [honey, setHoney] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, FieldError>>({});

  const errText = (e: FieldError) =>
    e === 'email' ? t('errEmail') : e === 'tooLong' ? t('errTooLong') : t('errRequired');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    const found = validateFields(
      { name, email, comment },
      {
        name: { required: true, maxLength: FIELD_LIMITS.name },
        email: { email: true },
        comment: { required: true, maxLength: FIELD_LIMITS.comment },
      }
    );
    setErrors(found);
    if (Object.keys(found).length) {
      const first = (['name', 'email', 'comment'] as const).find((f) => found[f]);
      if (first) e.currentTarget.querySelector<HTMLElement>(`#comment-${first}`)?.focus();
      return;
    }
    if (honey) return; // bot: silently drop

    setStatus('sending');
    const outcome = await submitToFormSubmit({
      name: name.trim(),
      email: email.trim(),
      comment: comment.trim(),
      slug,
      articleTitle,
      uiLang: locale,
      _captcha: 'false',
      _subject: 'تعليق جديد على مقال — ' + (articleTitle || slug),
    });
    setStatus(outcome.kind);
    if (outcome.kind === 'ok') {
      setName('');
      setEmail('');
      setComment('');
    }
  }

  const fieldA11y = (f: string) => ({
    id: `comment-${f}`,
    'aria-invalid': errors[f] ? (true as const) : undefined,
    'aria-describedby': errors[f] ? `comment-${f}-err` : undefined,
  });
  const fieldErr = (f: string) =>
    errors[f] ? (
      <p id={`comment-${f}-err`} className="mt-1 text-sm text-red-700">
        {errText(errors[f])}
      </p>
    ) : null;
  const inputCls =
    'w-full rounded-md border border-navy-200 px-3 py-2 text-navy-800 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300 aria-[invalid=true]:border-red-600';

  return (
    <section
      className="mt-20 pt-10 border-t border-navy-100 print:hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={locale}
      style={{ textAlign: isRTL ? 'right' : 'left' }}
      aria-labelledby="comments-heading"
    >
      <h2 id="comments-heading" className="text-xl font-medium text-navy-700 mb-1">
        {t('title')}
        {comments.length > 0 && (
          <span className="text-navy-500 text-base font-normal"> ({comments.length})</span>
        )}
      </h2>
      <p className="text-sm text-navy-500 mb-8">{t('subtitle')}</p>

      {/* Approved comments (each keeps the reader's own text direction) */}
      {comments.length > 0 ? (
        <ul className="space-y-5 mb-12">
          {comments.map((c, idx) => (
            <li key={c.id || idx} className="bg-white border border-navy-100 rounded-lg p-5">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-medium text-navy-700" dir="auto">
                  {c.name}
                </span>
                {c.date && <span className="text-xs text-navy-500">{c.date}</span>}
              </div>
              <p className="text-navy-600 leading-relaxed whitespace-pre-wrap" dir="auto">
                {c.body}
              </p>
              {c.reply && (
                <div className="mt-4 ps-4 border-s-2 border-gold-400 bg-gold-50 rounded p-3">
                  <div className="text-xs font-semibold text-gold-700 mb-1">{t('replyLabel')}</div>
                  <p className="text-navy-700 leading-relaxed whitespace-pre-wrap" dir="auto">
                    {c.reply}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-navy-500 italic mb-10">{t('empty')}</p>
      )}

      {/* Form */}
      <div role="status" aria-live="polite">
        {status === 'ok' && (
          <div className="bg-gold-50 border border-gold-200 rounded-lg p-5 text-navy-700 mb-6">
            {t('success')}
          </div>
        )}
      </div>
      {status !== 'ok' && (
        <form
          onSubmit={onSubmit}
          noValidate
          aria-busy={status === 'sending'}
          className="relative bg-white border border-navy-100 rounded-lg p-6 space-y-4"
        >
          <p className="text-xs text-navy-500">{t('moderationNote')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="comment-name" className="block text-sm text-navy-600 mb-1">
                {t('name')} <span aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                {...fieldA11y('name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                required
                aria-required="true"
                autoComplete="name"
                maxLength={FIELD_LIMITS.name}
                className={inputCls}
              />
              {fieldErr('name')}
            </div>
            <div>
              <label htmlFor="comment-email" className="block text-sm text-navy-600 mb-1">
                {t('email')}
              </label>
              <input
                type="email"
                dir="ltr"
                {...fieldA11y('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                autoComplete="email"
                maxLength={FIELD_LIMITS.email}
                className={inputCls}
              />
              {fieldErr('email')}
            </div>
          </div>

          <div>
            <label htmlFor="comment-comment" className="block text-sm text-navy-600 mb-1">
              {t('comment')} <span aria-hidden="true">*</span>
            </label>
            <textarea
              {...fieldA11y('comment')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('commentPlaceholder')}
              required
              aria-required="true"
              rows={4}
              maxLength={FIELD_LIMITS.comment}
              dir="auto"
              className={inputCls + ' leading-relaxed'}
            />
            {fieldErr('comment')}
          </div>

          {/* honeypot: clipped in place so it cannot widen the RTL page (LAYOUT-01) */}
          <input
            type="text"
            name="_honey"
            value={honey}
            onChange={(e) => setHoney(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={HONEYPOT_STYLE}
          />

          <div role="alert">
            {status === 'activation' && <p className="text-sm text-amber-900">{t('activation')}</p>}
            {status === 'timeout' && <p className="text-sm text-red-700">{t('timeout')}</p>}
            {(status === 'rejected' || status === 'network') && (
              <p className="text-sm text-red-700">{t('error')}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex min-h-[44px] items-center rounded-md bg-navy-700 px-6 py-2.5 text-white font-medium hover:bg-navy-800 transition-colors disabled:opacity-60"
          >
            {status === 'sending' ? t('sending') : t('submit')}
          </button>
        </form>
      )}
    </section>
  );
}
