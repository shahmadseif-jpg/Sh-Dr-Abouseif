'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import {
  getAllQA,
  qaCategoryLabels,
  localize,
  type Loc,
  type QACategory,
} from '@/lib/qa';

const CATEGORY_ORDER: QACategory[] = [
  'worship',
  'family',
  'transactions',
  'creed',
  'west-nawazil',
  'general',
];

const UI = {
  ar: {
    search: 'ابحث في الأسئلة…',
    all: 'كلّ الأبواب',
    none: 'لا توجد أسئلة مطابقة لبحثك.',
    read: 'اقرأ الجواب',
    count: 'سؤالًا',
    ask_title: 'لم تجد سؤالك؟',
    ask_body: 'أرسل سؤالك الشرعيّ وسيصل مباشرةً إلى الشيخ، ويُنشَر جوابه هنا إن شاء الله.',
    ask_cta: 'أرسل سؤالك',
  },
  en: {
    search: 'Search questions…',
    all: 'All categories',
    none: 'No questions match your search.',
    read: 'Read the answer',
    count: 'questions',
    ask_title: 'Didn’t find your question?',
    ask_body: 'Send your question; it reaches the Shaykh directly, and the answer may be published here.',
    ask_cta: 'Ask your question',
  },
  es: {
    search: 'Buscar preguntas…',
    all: 'Todas las categorías',
    none: 'Ninguna pregunta coincide con tu búsqueda.',
    read: 'Leer la respuesta',
    count: 'preguntas',
    ask_title: '¿No encontraste tu pregunta?',
    ask_body: 'Envía tu pregunta; llega directamente al Shaykh, y la respuesta puede publicarse aquí.',
    ask_cta: 'Envía tu pregunta',
  },
};

export default function QAList() {
  const locale = useLocale() as Loc;
  const t = UI[locale] ?? UI.ar;
  const all = getAllQA();

  const [query, setQuery] = useState('');
  const [active, setActive] = useState<QACategory | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all
      .filter((item) => active === 'all' || item.category === active)
      .filter((item) => {
        if (!q) return true;
        const haystack = [
          localize(item.question, locale),
          localize(item.summary, locale),
          ...(item.tags ?? []),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));
  }, [all, query, active, locale]);

  const categoriesWithItems = CATEGORY_ORDER.filter((c) =>
    all.some((q) => q.category === c)
  );

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative max-w-xl mx-auto">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search}
          className="w-full rounded-full border border-navy-200 bg-white px-5 py-3 text-navy-700 placeholder:text-navy-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-100"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActive('all')}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            active === 'all'
              ? 'bg-navy-700 text-white'
              : 'bg-white text-navy-600 border border-navy-100 hover:border-gold-300'
          }`}
        >
          {t.all}
        </button>
        {categoriesWithItems.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              active === c
                ? 'bg-navy-700 text-white'
                : 'bg-white text-navy-600 border border-navy-100 hover:border-gold-300'
            }`}
          >
            {qaCategoryLabels[locale][c]}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="text-center text-xs text-navy-400">
        {filtered.length} {t.count}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-center text-navy-500 py-10">{t.none}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <Link
              key={item.slug}
              href={`/${locale}/qa/${item.slug}`}
              className="bg-white border border-navy-100 rounded-lg p-6 card-hover flex flex-col group"
            >
              <div className="text-xs uppercase tracking-wider text-gold-500 mb-3">
                {qaCategoryLabels[locale][item.category]}
              </div>
              <h3 className="text-lg font-medium text-navy-700 leading-snug mb-3 group-hover:text-gold-600 transition-colors">
                {localize(item.question, locale)}
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed mb-4 line-clamp-3 flex-1">
                {localize(item.summary, locale)}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-navy-100">
                <span className="text-xs text-navy-500">{localize(item.date, locale)}</span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 group-hover:text-gold-500 transition-colors">
                  {t.read}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    {locale === 'ar' ? <path d="M9 3L5 7l4 4" /> : <path d="M5 3l4 4-4 4" />}
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Ask CTA */}
      <div className="mt-12 rounded-xl border border-gold-200 bg-gold-50 p-8 text-center">
        <h3 className="text-xl font-medium text-navy-700 mb-2">{t.ask_title}</h3>
        <p className="text-navy-600 leading-relaxed mb-5 max-w-xl mx-auto">{t.ask_body}</p>
        <Link
          href={`/${locale}/fatwa`}
          className="inline-flex items-center gap-2 rounded-full bg-navy-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-800 transition-colors no-underline"
        >
          {t.ask_cta}
        </Link>
      </div>
    </div>
  );
}
