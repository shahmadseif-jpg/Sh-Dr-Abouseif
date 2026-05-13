'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { articlesMeta, categoryLabels } from '@/lib/articles';

export default function ArticlesList() {
  const locale = useLocale() as 'ar' | 'en';
  const readMore = locale === 'ar' ? 'اقرأ المقال' : 'Read article';

  // Sort by date descending — latest first
  const sorted = [...articlesMeta]
    .filter((a) => !a.draft)
    .sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sorted.map((article) => (
        <Link
          href={`/${locale}/articles/${article.slug}`}
          key={article.slug}
          className="bg-white border border-navy-100 rounded-lg p-6 card-hover flex flex-col group"
        >
          <div className="text-xs uppercase tracking-wider text-gold-500 mb-3">
            {categoryLabels[locale][article.category]}
          </div>

          {article.series && (
            <div className="text-xs text-navy-500 italic mb-2">
              {locale === 'ar' ? 'سلسلة:' : 'Series:'} {article.series[locale]}
              {article.episode ? ` · ${locale === 'ar' ? 'الحلقة' : 'Ep.'} ${article.episode}` : ''}
            </div>
          )}

          <h3 className="text-lg font-medium text-navy-700 leading-snug mb-3 group-hover:text-gold-600 transition-colors">
            {article.title[locale]}
          </h3>

          <p className="text-sm text-navy-600 leading-relaxed mb-4 line-clamp-4 flex-1">
            {article.excerpt[locale]}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-navy-100">
            <div className="text-xs text-navy-500 flex items-center gap-2">
              <span>{article.date[locale]}</span>
              <span className="text-gold-300">•</span>
              <span>{article.readingMinutes} {locale === 'ar' ? 'دقائق' : 'min'}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 group-hover:text-gold-500 transition-colors">
              {readMore}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {locale === 'ar' ? <path d="M9 3L5 7l4 4" /> : <path d="M5 3l4 4-4 4" />}
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
