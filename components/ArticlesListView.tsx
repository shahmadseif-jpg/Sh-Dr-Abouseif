'use client';

// Rendering half of ArticlesList (see that file for why the split exists).
// Receives already-localized strings only; markup is unchanged.
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

export interface ArticleCardData {
  slug: string;
  titleLocale: string;
  excerptLocale: string;
  arabicFallback: boolean;
  title: string;
  excerpt: string;
  date: string;
  /** Formatted reading time. */
  minutes: string;
  /** Episode number when shown inside a series group. */
  episode: number | null;
}

export interface ArticleGroup {
  cat: string;
  label: string;
  desc: string;
  countText: string;
  seriesGroups: { key: string; title: string; items: ArticleCardData[] }[];
  standalone: ArticleCardData[];
  total: number;
}

function ArticleCard({
  article,
  locale,
  readMore,
  epLabel,
}: {
  article: ArticleCardData;
  locale: string;
  readMore: string;
  epLabel: string;
}) {
  return (
    <Link
      href={`/${locale}/articles/${article.slug}`}
      className="bg-white border border-navy-100 rounded-lg p-6 card-hover flex flex-col group"
    >
      {article.arabicFallback && (
        <span className="text-xs text-navy-600 bg-navy-50 rounded px-2 py-1 mb-3 self-start" lang={locale}>
          {locale === 'es' ? 'Original árabe; traducción no disponible' : locale === 'ur' ? 'عربی اصل؛ ترجمہ دستیاب نہیں' : locale === 'en' ? 'Arabic original; translation unavailable' : 'الأصل العربي؛ الترجمة غير متاحة'}
        </span>
      )}
      {article.episode != null && (
        <div className="text-xs font-medium text-gold-700 mb-2">
          {epLabel} {article.episode}
        </div>
      )}

      <h3 lang={article.titleLocale} dir={['ar', 'ur'].includes(article.titleLocale) ? 'rtl' : 'ltr'} className="text-lg font-medium text-navy-700 leading-snug mb-3 group-hover:text-gold-600 transition-colors">
        {article.title}
      </h3>

      <p lang={article.excerptLocale} dir={['ar', 'ur'].includes(article.excerptLocale) ? 'rtl' : 'ltr'} className="text-sm text-navy-600 leading-relaxed mb-4 line-clamp-4 flex-1">
        {article.excerpt}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-navy-100">
        <div className="text-xs text-navy-500 flex items-center gap-2">
          <span>{article.date}</span>
          <span className="text-gold-300" aria-hidden="true">•</span>
          <span>{article.minutes}</span>
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
}

export default function ArticlesListView({ groups }: { groups: ArticleGroup[] }) {
  const locale = useLocale();
  const ui = useTranslations('ui');
  const readMore = ui('readArticle');
  const epLabel = ui('episode');

  return (
    <div className="space-y-16">
      {groups.map(({ cat, label, desc, countText, seriesGroups, standalone }) => (
        <section key={cat} id={`cat-${cat}`} className="scroll-mt-24">
          {/* Section heading */}
          {cat === 'fiqh' ? (
            <div className="mb-6 px-5 py-4 bg-gold-50 border border-gold-200 rounded-lg">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-medium text-navy-700">
                    {label}
                  </h2>
                  <span className="text-xs font-semibold bg-gold-400 text-navy-900 px-3 py-1 rounded-full whitespace-nowrap">
                    {ui('muslimsWest')}
                  </span>
                </div>
                <span className="text-xs text-navy-500 whitespace-nowrap">
                  {countText}
                </span>
              </div>
              <p className="mt-2 text-sm text-navy-600 leading-relaxed">
                {desc}
              </p>
            </div>
          ) : (
            <div className="mb-6 pb-4 border-b border-navy-100">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-2xl font-medium text-navy-700">
                  {label}
                </h2>
                <span className="text-xs text-navy-500 whitespace-nowrap">
                  {countText}
                </span>
              </div>
              <p className="mt-1 text-sm text-navy-500 leading-relaxed">
                {desc}
              </p>
            </div>
          )}

          <div className="space-y-10">
            {/* Series sub-groups */}
            {seriesGroups.map((sg) => (
              <div key={sg.key}>
                <h3 className="text-base font-semibold text-gold-700 mb-4 flex items-center gap-2">
                  <span className="inline-block w-6 h-px bg-gold-300" aria-hidden="true" />
                  {sg.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sg.items.map((article) => (
                    <ArticleCard key={article.slug} article={article} locale={locale} readMore={readMore} epLabel={epLabel} />
                  ))}
                </div>
              </div>
            ))}

            {/* Standalone articles */}
            {standalone.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {standalone.map((article) => (
                  <ArticleCard key={article.slug} article={article} locale={locale} readMore={readMore} epLabel={epLabel} />
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
