'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { Hit, SearchType } from '@/lib/search';

type SearchModule = typeof import('@/lib/search');

const PAGE_SIZE = 40;

export default function SearchBox({ initialQuery = '' }: { initialQuery?: string }) {
  const locale = useLocale();
  const t = useTranslations('search');
  const [q, setQ] = useState(initialQuery);
  const [limit, setLimit] = useState(PAGE_SIZE);
  // The index (all content metadata) is loaded and built lazily on the first
  // search interaction — not on mount — so visiting the page stays light.
  const [engine, setEngine] = useState<{ mod: SearchModule; index: Hit[] } | null>(null);
  const [wanted, setWanted] = useState(initialQuery.trim() !== '');

  useEffect(() => {
    if (!wanted || engine) return;
    let alive = true;
    import('@/lib/search').then((mod) => {
      if (alive) setEngine({ mod, index: mod.buildIndex(locale) });
    });
    return () => {
      alive = false;
    };
  }, [wanted, engine, locale]);

  const results = useMemo(
    () => (engine && q.trim() ? engine.mod.searchIndex(engine.index, q) : []),
    [engine, q]
  );
  const shown = results.slice(0, limit);

  const typeLabel = (type: SearchType) =>
    type === 'article'
      ? t('type_article')
      : type === 'research'
      ? t('type_research')
      : type === 'qa'
      ? t('type_qa')
      : t('type_khatra');

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-sm text-navy-500 text-center mb-4">{t('scope')}</p>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-navy-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </span>
        <input
          autoFocus
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setLimit(PAGE_SIZE);
            setWanted(true);
          }}
          placeholder={t('placeholder')}
          aria-label={t('placeholder')}
          className="w-full rounded-lg border border-navy-200 bg-white ps-10 pe-4 py-3 text-navy-800 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
        />
      </div>

      <div className="mt-6" aria-live="polite">
        {q.trim() === '' ? (
          <p className="text-navy-500 text-center">{t('prompt')}</p>
        ) : !engine ? null : results.length === 0 ? (
          <p className="text-navy-500 text-center">{t('noResults')}</p>
        ) : (
          <>
            <p className="text-sm text-navy-500 mb-4">
              {results.length > shown.length
                ? t('showing', { shown: shown.length, total: results.length })
                : t('results', { count: results.length })}
            </p>
            <ul className="flex flex-col gap-3">
              {shown.map((h) => (
                <li key={`${h.type}-${h.slug}`}>
                  <Link
                    href={h.url}
                    className="block rounded-lg border border-navy-100 p-4 no-underline hover:border-navy-300 hover:bg-navy-50/40 transition-colors"
                  >
                    <span className="inline-block text-xs font-medium text-gold-700 bg-gold-50 border border-gold-200 rounded px-2 py-0.5 mb-2">
                      {typeLabel(h.type)}
                    </span>
                    <div className="text-navy-800 font-medium">{h.title}</div>
                    {h.subtitle && <div className="text-sm text-navy-500 mt-0.5">{h.subtitle}</div>}
                    {h.snippet && (
                      <div className="text-sm text-navy-600 mt-2 leading-relaxed">{h.snippet}</div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            {results.length > shown.length && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setLimit((n) => n + PAGE_SIZE)}
                  className="inline-flex items-center rounded-full border border-navy-200 px-5 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors"
                >
                  {t('more')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
