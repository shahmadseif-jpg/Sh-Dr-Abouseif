'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ArticleComment } from '@/lib/comments';

interface Props {
  slug: string;
  locale: string;
  articleTitle: string;
  comments: ArticleComment[];
}

export default function ArticleComments({ slug, locale, articleTitle, comments }: Props) {
  const t = useTranslations('comments');
  const isRTL = locale === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [honey, setHoney] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch('https://formsubmit.co/ajax/shahmadseif@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          comment,
          slug,
          articleTitle,
          uiLang: locale,
          _honey: honey,
          _captcha: 'false',
          _subject: 'تعليق جديد على مقال — ' + (articleTitle || slug),
        }),
      });
      const data = await res.json();
      if (res.ok && (data.success === 'true' || data.success === true)) {
        setStatus('ok');
        setName('');
        setEmail('');
        setComment('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      className="mt-20 pt-10 border-t border-navy-100"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ textAlign: isRTL ? 'right' : 'left' }}
    >
      <h2 className="text-xl font-medium text-navy-700 mb-1">
        {t('title')}
        {comments.length > 0 && (
          <span className="text-navy-400 text-base font-normal"> ({comments.length})</span>
        )}
      </h2>
      <p className="text-sm text-navy-500 mb-8">{t('subtitle')}</p>

      {/* Approved comments */}
      {comments.length > 0 ? (
        <ul className="space-y-5 mb-12">
          {comments.map((c, idx) => (
            <li key={c.id || idx} className="bg-white border border-navy-100 rounded-lg p-5">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-medium text-navy-700">{c.name}</span>
                {c.date && <span className="text-xs text-navy-400">{c.date}</span>}
              </div>
              <p className="text-navy-600 leading-relaxed whitespace-pre-wrap">{c.body}</p>
              {c.reply && (
                <div className="mt-4 ps-4 border-s-2 border-gold-400 bg-gold-50 rounded p-3">
                  <div className="text-xs font-semibold text-gold-700 mb-1">{t('replyLabel')}</div>
                  <p className="text-navy-700 leading-relaxed whitespace-pre-wrap">{c.reply}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-navy-400 italic mb-10">{t('empty')}</p>
      )}

      {/* Form */}
      {status === 'ok' ? (
        <div className="bg-gold-50 border border-gold-200 rounded-lg p-5 text-navy-700">
          {t('success')}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="bg-white border border-navy-100 rounded-lg p-6 space-y-4">
          <p className="text-xs text-navy-400">{t('moderationNote')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-navy-600 mb-1">{t('name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                required
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-navy-800 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-300"
              />
            </div>
            <div>
              <label className="block text-sm text-navy-600 mb-1">{t('email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-navy-800 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-navy-600 mb-1">{t('comment')}</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('commentPlaceholder')}
              required
              rows={4}
              className="w-full rounded-md border border-navy-200 px-3 py-2 text-navy-800 leading-relaxed focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-300"
            />
          </div>

          {/* honeypot */}
          <input
            type="text"
            value={honey}
            onChange={(e) => setHoney(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
          />

          {status === 'error' && (
            <p className="text-sm text-red-600">{t('error')}</p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex items-center rounded-md bg-navy-700 px-6 py-2.5 text-white font-medium hover:bg-navy-800 transition-colors disabled:opacity-60"
          >
            {status === 'sending' ? t('sending') : t('submit')}
          </button>
        </form>
      )}
    </section>
  );
}
