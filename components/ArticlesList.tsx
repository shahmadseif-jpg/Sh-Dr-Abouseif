'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { articlesMeta, categoryLabels, localize, type ArticleCategory, type Loc, type LocalizedText } from '@/lib/articles';

// Display order of the reading paths (sections)
const ORDER: ArticleCategory[] = [
  'civilization',
  'wisdom-insights',
  'imamship',
  'family',
  'fiqh',
];

const PATH_DESC: Record<ArticleCategory, LocalizedText> = {
  civilization: {
    ar: 'قراءةٌ بنيويّةٌ في سُنن نهوض الأمم وسقوطها كما يعرضها القرآن.',
    en: "A structural reading of the laws of nations' rise and fall in the Qur'an.",
    es: 'Una lectura estructural de las leyes del auge y la caída de las naciones en el Corán.',
  },
  'wisdom-insights': {
    ar: 'تأمّلاتٌ قرآنيّةٌ تربويّةٌ تنقل الآيةَ إلى القلب ومسيرةِ الإنسان إلى الله.',
    en: 'Qur’anic, educational reflections carrying the verse to the heart.',
    es: 'Reflexiones coránicas y educativas que llevan el versículo al corazón.',
  },
  imamship: {
    ar: 'صناعةُ الإمام المعاصر في الغرب، وقضايا بيت الدعوة.',
    en: 'Crafting the contemporary imam in the West, and the daʿwah household.',
    es: 'La formación del imam contemporáneo en Occidente y las cuestiones del hogar de la daʿwa.',
  },
  family: {
    ar: 'فقهُ الأسرة المسلمة وتربيةُ الأبناء في الغرب.',
    en: 'The jurisprudence of the Muslim family and raising children in the West.',
    es: 'La jurisprudencia de la familia musulmana y la crianza de los hijos en Occidente.',
  },
  fiqh: {
    ar: 'مسائلُ الفقه والفكر المعاصر بمنهجٍ مقاصديّ.',
    en: 'Contemporary jurisprudence and thought through a purpose-driven method.',
    es: 'Cuestiones de jurisprudencia y pensamiento contemporáneo con un método orientado a los fines.',
  },
};

export default function ArticlesList() {
  const locale = useLocale() as Loc;
  const readMore = locale === 'ar' ? 'اقرأ المقال' : locale === 'es' ? 'Leer el artículo' : 'Read article';
  const countLabel = locale === 'ar' ? 'مقالة' : locale === 'es' ? 'artículos' : 'articles';

  const live = articlesMeta.filter((a) => !a.draft);

  const groups = ORDER.map((cat) => ({
    cat,
    items: live
      .filter((a) => a.category === cat)
      .sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1)),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-16">
      {groups.map(({ cat, items }) => (
        <section key={cat} id={`cat-${cat}`} className="scroll-mt-24">
          {/* Section heading */}
          <div className="mb-6 pb-4 border-b border-navy-100">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-2xl font-medium text-navy-700">
                {categoryLabels[locale][cat]}
              </h2>
              <span className="text-xs text-navy-400 whitespace-nowrap">
                {items.length} {countLabel}
              </span>
            </div>
            <p className="mt-1 text-sm text-navy-500 leading-relaxed">
              {localize(PATH_DESC[cat], locale)}
            </p>
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((article) => (
              <Link
                href={`/${locale}/articles/${article.slug}`}
                key={article.slug}
                className="bg-white border border-navy-100 rounded-lg p-6 card-hover flex flex-col group"
              >
                {/* Series badge */}
                {article.series && (
                  <div className="text-xs text-navy-500 italic mb-2">
                    {locale === 'ar' ? 'سلسلة:' : locale === 'es' ? 'Serie:' : 'Series:'} {localize(article.series, locale)}
                    {article.episode ? ` · ${locale === 'ar' ? 'الحلقة' : locale === 'es' ? 'Ep.' : 'Ep.'} ${article.episode}` : ''}
                  </div>
                )}

                {/* Title */}
                <h3 className="text-lg font-medium text-navy-700 leading-snug mb-3 group-hover:text-gold-600 transition-colors">
                  {localize(article.title, locale)}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-navy-600 leading-relaxed mb-4 line-clamp-4 flex-1">
                  {localize(article.excerpt, locale)}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-navy-100">
                  <div className="text-xs text-navy-500 flex items-center gap-2">
                    <span>{localize(article.date, locale)}</span>
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
        </section>
      ))}
    </div>
  );
}
