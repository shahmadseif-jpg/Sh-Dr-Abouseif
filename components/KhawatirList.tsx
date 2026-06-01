'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { khawatirMeta, prayerLabels, type Prayer } from '@/lib/khawatir';

type Filter = 'all' | Prayer;

export default function KhawatirList() {
  const _loc = useLocale();
  const locale = (_loc === 'es' ? 'en' : _loc) as 'ar' | 'en';
  const t = useTranslations('khawatir');
  const [filter, setFilter] = useState<Filter>('all');

  const readMore = locale === 'ar' ? 'اقرأ الخاطرة' : 'Read reflection';

  // Sort by date descending
  const sorted = useMemo(
    () =>
      [...khawatirMeta]
        .filter((k) => !k.draft)
        .sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1)),
    []
  );

  const filtered = useMemo(
    () => (filter === 'all' ? sorted : sorted.filter((k) => k.prayer === filter)),
    [filter, sorted]
  );

  const filterButtons: { value: Filter; label: string }[] = [
    { value: 'all', label: t('filter_all') },
    { value: 'fajr', label: prayerLabels[locale].fajr },
    { value: 'isha', label: prayerLabels[locale].isha },
  ];

  if (sorted.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-navy-500 leading-relaxed">{t('no_khawatir')}</p>
      </div>
    );
  }

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`px-4 py-2 text-sm rounded-md transition-colors border ${
              filter === btn.value
                ? 'bg-navy-600 text-white border-navy-600'
                : 'bg-white text-navy-600 border-navy-200 hover:bg-navy-50'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((k) => {
          const isFajr = k.prayer === 'fajr';
          return (
            <Link
              href={`/${locale}/khawatir/${k.slug}`}
              key={k.slug}
              className="bg-white border border-navy-100 rounded-lg p-6 card-hover flex flex-col group"
            >
              {/* Prayer badge */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                    isFajr
                      ? 'bg-gold-50 text-gold-700 border border-gold-200'
                      : 'bg-navy-50 text-navy-700 border border-navy-200'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                  {prayerLabels[locale][k.prayer]}
                </span>
                {k.videoUrl && (
                  <span
                    className="text-navy-400 group-hover:text-gold-500 transition-colors"
                    aria-label={locale === 'ar' ? 'يحوي فيديو' : 'Contains video'}
                    title={locale === 'ar' ? 'يحوي فيديو' : 'Contains video'}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-medium text-navy-700 leading-snug mb-3 group-hover:text-gold-600 transition-colors">
                {k.title[locale]}
              </h3>

              {/* Excerpt */}
              <p className="text-sm text-navy-600 leading-relaxed mb-4 line-clamp-4 flex-1">
                {k.excerpt[locale]}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-navy-100">
                <div className="text-xs text-navy-500 flex items-center gap-2">
                  <span>{k.date[locale]}</span>
                  <span className="text-gold-300">•</span>
                  <span>{k.readingMinutes} {locale === 'ar' ? 'دقائق' : 'min'}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 group-hover:text-gold-500 transition-colors">
                  {readMore}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    {locale === 'ar' ? <path d="M9 3L5 7l4 4" /> : <path d="M5 3l4 4-4 4" />}
                  </svg>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-navy-500">{t('no_khawatir_in_filter')}</p>
        </div>
      )}
    </>
  );
}
