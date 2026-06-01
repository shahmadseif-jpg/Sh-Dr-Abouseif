'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useState, useMemo } from 'react';
import {
  getAllResearch,
  getPdfUrl,
  researchTypeLabels,
  researchCategoryLabels,
  type ResearchType,
} from '@/lib/research';

export default function ResearchList() {
  const t = useTranslations('research');
  const _loc = useLocale();
  const locale = (_loc === 'es' ? 'en' : _loc) as 'ar' | 'en';
  const [filter, setFilter] = useState<'all' | ResearchType>('all');

  const allItems = useMemo(() => getAllResearch(), []);
  const items = useMemo(
    () => (filter === 'all' ? allItems : allItems.filter((r) => r.type === filter)),
    [allItems, filter]
  );

  const types: ResearchType[] = ['book', 'conference-paper', 'journal-paper', 'book-chapter', 'monograph'];
  const availableTypes = types.filter((tp) => allItems.some((r) => r.type === tp));

  return (
    <div>
      {/* Filters */}
      <div className="mb-10 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm rounded-md transition-colors ${
            filter === 'all'
              ? 'bg-navy-700 text-white'
              : 'bg-white text-navy-700 border border-navy-200 hover:bg-navy-50'
          }`}
        >
          {t('filter_all')}
        </button>
        {availableTypes.map((tp) => (
          <button
            key={tp}
            onClick={() => setFilter(tp)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              filter === tp
                ? 'bg-navy-700 text-white'
                : 'bg-white text-navy-700 border border-navy-200 hover:bg-navy-50'
            }`}
          >
            {researchTypeLabels[locale][tp]}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-6">
        {items.map((r) => (
          <article
            key={r.slug}
            className="group bg-white border border-navy-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6 sm:p-8">
              {/* Type & Year badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-navy-50 text-navy-700">
                  {researchTypeLabels[locale][r.type]}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold-50 text-gold-700 border border-gold-200">
                  {r.year}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-navy-50/60 text-navy-600">
                  {researchCategoryLabels[locale][r.category]}
                </span>
                {r.featured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-800 border border-gold-300">
                    ★ {t('featured')}
                  </span>
                )}
              </div>

              {/* Title */}
              <Link href={`/research/${r.slug}` as any} className="no-underline">
                <h2 className="text-xl sm:text-2xl font-medium text-navy-700 group-hover:text-navy-900 leading-snug mb-2">
                  {r.title[locale]}
                </h2>
              </Link>

              {/* Subtitle */}
              {r.subtitle && (
                <p className="text-base sm:text-lg text-navy-600 italic mb-4 leading-relaxed">
                  {r.subtitle[locale]}
                </p>
              )}

              {/* Venue */}
              <div className="text-sm text-navy-600 mb-4 leading-relaxed">
                <strong className="text-navy-800">{t('venue')}:</strong>{' '}
                {r.venue[locale]}
                {r.location && (
                  <>
                    {' — '}
                    <span className="text-navy-500">{r.location[locale]}</span>
                  </>
                )}
              </div>

              {/* Abstract */}
              <p className="text-sm sm:text-base text-navy-700 leading-relaxed mb-5">
                {r.abstract[locale].length > 350
                  ? r.abstract[locale].substring(0, 350) + '…'
                  : r.abstract[locale]}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-navy-500 mb-5">
                {r.pages && (
                  <span>
                    <strong>{t('pages')}:</strong> {r.pages}
                  </span>
                )}
                <span>
                  <strong>{t('language')}:</strong>{' '}
                  {r.language === 'ar'
                    ? t('lang_ar')
                    : r.language === 'en'
                    ? t('lang_en')
                    : t('lang_bilingual')}
                </span>
                {r.doi && (
                  <span>
                    <strong>DOI:</strong> {r.doi}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/research/${r.slug}` as any}
                  className="inline-flex items-center px-4 py-2 bg-navy-700 text-white text-sm rounded-md hover:bg-navy-800 transition-colors no-underline"
                >
                  {t('read_more')} ←
                </Link>
                {getPdfUrl(r, locale) && (
                  <a
                    href={getPdfUrl(r, locale)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-white text-navy-700 text-sm rounded-md border border-navy-200 hover:bg-navy-50 transition-colors no-underline"
                  >
                    📄 {t('download_pdf')}
                  </a>
                )}
                {r.externalUrl && (
                  <a
                    href={r.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-white text-navy-700 text-sm rounded-md border border-navy-200 hover:bg-navy-50 transition-colors no-underline"
                  >
                    🔗 {t('external_link')}
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 text-navy-500">
            {t('no_results')}
          </div>
        )}
      </div>
    </div>
  );
}
