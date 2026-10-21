'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Prayer } from '@/lib/khawatir';

export interface KhawatirCard {
  slug: string;
  prayer: Prayer;
  title: string;
  excerpt: string;
  date: string;
  /** Already-formatted reading time ("5 دقائق قراءة"). */
  minutes: string;
  hasVideo: boolean;
}

type Filter = 'all' | Prayer;

/** Cards rendered initially and added per "show more" (PERF-02). */
export const PAGE_SIZE = 24;

export default function KhawatirGrid({
  items,
  prayerLabels,
}: {
  items: KhawatirCard[];
  prayerLabels: Record<Prayer, string>;
}) {
  const locale = useLocale();
  const t = useTranslations('khawatir');
  const ui = useTranslations('ui');
  const [filter, setFilter] = useState<Filter>('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  // Index of the first card revealed by the last "show more", to move focus.
  const focusFrom = useRef<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const readMore = ui('readReflection');
  const containsVideo = ui('containsVideo');

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((k) => k.prayer === filter)),
    [filter, items]
  );
  const shown = filtered.slice(0, visible);

  useEffect(() => {
    if (focusFrom.current == null) return;
    const el = gridRef.current?.children[focusFrom.current] as HTMLElement | undefined;
    focusFrom.current = null;
    el?.focus();
  }, [visible]);

  const allButtons: { value: Filter; label: string }[] = [
    { value: 'all', label: t('filter_all') },
    { value: 'fajr', label: prayerLabels.fajr },
    { value: 'isha', label: prayerLabels.isha },
    { value: 'dhuhr', label: prayerLabels.dhuhr },
    { value: 'other', label: prayerLabels.other },
  ];
  const filterButtons = allButtons.filter(
    (b) => b.value === 'all' || items.some((k) => k.prayer === b.value)
  );

  const reveal = (n: number) => {
    focusFrom.current = shown.length;
    setVisible(n);
  };

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {filterButtons.map((btn) => (
          <button
            type="button"
            key={btn.value}
            onClick={() => {
              setFilter(btn.value);
              setVisible(PAGE_SIZE);
            }}
            aria-pressed={filter === btn.value}
            className={`min-h-[44px] px-4 py-2 text-sm rounded-md transition-colors border ${
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
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shown.map((k) => {
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
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" aria-hidden="true" />
                  {prayerLabels[k.prayer]}
                </span>
                {k.hasVideo && (
                  <span
                    className="text-navy-500 group-hover:text-gold-500 transition-colors"
                    title={containsVideo}
                  >
                    <span className="sr-only">{containsVideo}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-medium text-navy-700 leading-snug mb-3 group-hover:text-gold-600 transition-colors">
                {k.title}
              </h3>

              {/* Excerpt */}
              <p className="text-sm text-navy-600 leading-relaxed mb-4 line-clamp-4 flex-1">
                {k.excerpt}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-navy-100">
                <div className="text-xs text-navy-500 flex items-center gap-2">
                  <span>{k.date}</span>
                  <span className="text-gold-300" aria-hidden="true">•</span>
                  <span>{k.minutes}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 group-hover:text-gold-500 transition-colors">
                  {readMore}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    {locale === 'ar' || locale === 'ur' ? <path d="M9 3L5 7l4 4" /> : <path d="M5 3l4 4-4 4" />}
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

      {filtered.length > 0 && (
        <div className="mt-10 flex flex-col items-center gap-4" data-khawatir-pager>
          <p className="text-sm text-navy-500" aria-live="polite">
            {t('showing', { shown: shown.length, total: filtered.length })}
          </p>
          {shown.length < filtered.length && (
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => reveal(visible + PAGE_SIZE)}
                className="min-h-[44px] px-6 py-2 text-sm font-medium rounded-md bg-navy-600 text-white hover:bg-navy-700 transition-colors"
              >
                {t('show_more')}
              </button>
              <button
                type="button"
                onClick={() => reveal(filtered.length)}
                className="min-h-[44px] px-6 py-2 text-sm font-medium rounded-md border border-navy-200 text-navy-600 hover:bg-navy-50 transition-colors"
              >
                {t('show_all')} ({filtered.length})
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
