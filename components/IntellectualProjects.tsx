'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { articlesMeta, categoryLabels, type ArticleCategory, type Loc } from '@/lib/articles';

// Display order of the reading paths (only those that have articles are shown)
const ORDER: ArticleCategory[] = [
  'prophetic-light',
  'civilization',
  'wisdom-insights',
  'imamship',
  'family',
  'fiqh',
];

export default function IntellectualProjects() {
  const t = useTranslations('projects');
  const locale = useLocale() as Loc;

  const counts = articlesMeta
    .filter((a) => !a.draft)
    .reduce<Record<string, number>>((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    }, {});

  const paths = ORDER.filter((c) => counts[c] > 0);

  return (
    <section className="bg-navy-50/40 border-b border-navy-100">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl mb-10">
          <div className="inline-block text-xs uppercase tracking-[0.2em] text-gold-500 mb-3 font-medium">
            {t('eyebrow')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium text-navy-700 leading-tight mb-3">
            {t('title')}
          </h2>
          <p className="text-base text-navy-600 leading-relaxed">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {paths.map((cat) => (
            <Link
              key={cat}
              href={`/${locale}/articles#cat-${cat}`}
              className="group bg-white border border-navy-100 rounded-lg p-6 card-hover flex flex-col"
            >
              <div className="flex items-baseline justify-between mb-2 gap-3">
                <h3 className="text-lg font-semibold text-navy-700 group-hover:text-gold-600 transition-colors">
                  {categoryLabels[locale][cat]}
                </h3>
                <span className="text-xs text-navy-400 whitespace-nowrap">
                  {counts[cat]} {t('count_label')}
                </span>
              </div>
              <p className="text-sm text-navy-600 leading-relaxed mb-5 flex-1">
                {t(`desc.${cat}`)}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 group-hover:text-gold-500 transition-colors">
                {t('explore')}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  {locale === 'ar' ? <path d="M9 3L5 7l4 4" /> : <path d="M5 3l4 4-4 4" />}
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
