import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import {
  getResearchItem,
  getPdfUrl,
  researchMeta,
  researchTypeLabels,
  researchCategoryLabels,
} from '@/lib/research';
import { localize } from '@/lib/articles';

export async function generateStaticParams() {
  return researchMeta
    .filter((r) => !r.draft)
    .map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const item = getResearchItem(slug);
  if (!item) return {};

  return {
    title: `${localize(item.title, locale)} — ${locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}`,
    description: localize(item.abstract, locale).substring(0, 160),
  };
}

export default async function ResearchItemPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const item = getResearchItem(slug);
  if (!item || item.draft) {
    notFound();
  }

  const loc = (locale === 'ar' ? 'ar' : locale === 'es' ? 'es' : 'en') as 'ar' | 'en' | 'es';
  const t = await getTranslations({ locale, namespace: 'research' });

  return (
    <article className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/research"
          className="inline-flex items-center text-sm text-navy-600 hover:text-navy-800 mb-8 no-underline"
        >
          ← {t('back_to_list')}
        </Link>

        {/* Header badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-navy-50 text-navy-700">
            {researchTypeLabels[loc][item.type]}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold-50 text-gold-700 border border-gold-200">
            {item.year}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-navy-50/60 text-navy-600">
            {researchCategoryLabels[loc][item.category]}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-medium text-navy-800 leading-tight mb-3">
          {localize(item.title, locale)}
        </h1>

        {/* Subtitle */}
        {item.subtitle && (
          <p className="text-xl text-navy-600 italic mb-6 leading-relaxed">
            {localize(item.subtitle, locale)}
          </p>
        )}

        {/* Metadata box */}
        <div className="bg-navy-50/50 border border-navy-100 rounded-lg p-6 mb-8 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-navy-500">{t('venue')}:</span>
              <p className="text-navy-800 mt-1">{localize(item.venue, locale)}</p>
            </div>

            {item.location && (
              <div>
                <span className="text-navy-500">{t('location')}:</span>
                <p className="text-navy-800 mt-1">{localize(item.location, locale)}</p>
              </div>
            )}

            <div>
              <span className="text-navy-500">{t('date')}:</span>
              <p className="text-navy-800 mt-1">{localize(item.date, locale)}</p>
            </div>

            {item.publisher && (
              <div>
                <span className="text-navy-500">{t('publisher')}:</span>
                <p className="text-navy-800 mt-1">{localize(item.publisher, locale)}</p>
              </div>
            )}

            {item.pages && (
              <div>
                <span className="text-navy-500">{t('pages')}:</span>
                <p className="text-navy-800 mt-1">{item.pages}</p>
              </div>
            )}

            <div>
              <span className="text-navy-500">{t('language')}:</span>
              <p className="text-navy-800 mt-1">
                {item.language === 'ar'
                  ? t('lang_ar')
                  : item.language === 'en'
                  ? t('lang_en')
                  : t('lang_bilingual')}
              </p>
            </div>

            {item.isbn && (
              <div>
                <span className="text-navy-500">ISBN:</span>
                <p className="text-navy-800 mt-1 font-mono">{item.isbn}</p>
              </div>
            )}

            {item.doi && (
              <div>
                <span className="text-navy-500">DOI:</span>
                <p className="text-navy-800 mt-1 font-mono text-xs">{item.doi}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-10">
          {(() => {
            const primary = getPdfUrl(item, locale === 'ar' ? 'ar' : 'en');
            const other = locale === 'ar' ? getPdfUrl(item, 'en') : getPdfUrl(item, 'ar');
            const hasBoth = primary && other && primary !== other;
            return (
              <>
                {primary && (
                  <a
                    href={primary}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-3 bg-navy-700 text-white text-sm rounded-md hover:bg-navy-800 transition-colors no-underline"
                  >
                    📄 {t('download_pdf')}
                  </a>
                )}
                {hasBoth && (
                  <a
                    href={other}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-3 bg-white text-navy-700 text-sm rounded-md border border-navy-200 hover:bg-navy-50 transition-colors no-underline"
                  >
                    📄 {locale === 'ar' ? 'English PDF' : locale === 'es' ? 'PDF en árabe' : 'النّسخة العربيّة'}
                  </a>
                )}
              </>
            );
          })()}
          {item.externalUrl && (
            <a
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-3 bg-white text-navy-700 text-sm rounded-md border border-navy-200 hover:bg-navy-50 transition-colors no-underline"
            >
              🔗 {t('external_link')}
            </a>
          )}
        </div>

        {/* Abstract */}
        <h2 className="text-2xl font-medium text-navy-700 mb-4">{t('abstract')}</h2>
        <div className="prose prose-navy max-w-none text-navy-800 leading-loose mb-10">
          <p>{localize(item.abstract, locale)}</p>
        </div>

        {/* Keywords */}
        {item.keywords && (item.keywords[loc] ?? item.keywords.en).length > 0 && (
          <div className="mt-8 pt-6 border-t border-navy-100">
            <h3 className="text-sm font-medium text-navy-500 mb-3">{t('keywords')}</h3>
            <div className="flex flex-wrap gap-2">
              {(item.keywords[loc] ?? item.keywords.en).map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-navy-50 text-navy-700"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Citation block */}
        <div className="mt-10 pt-8 border-t border-navy-100">
          <h3 className="text-sm font-medium text-navy-500 mb-3">{t('how_to_cite')}</h3>
          <pre className="bg-navy-50 text-navy-800 text-xs p-4 rounded-md overflow-x-auto leading-relaxed whitespace-pre-wrap">
{`${locale === 'ar' ? 'أبو سيف' : 'Abouseif'}, ${locale === 'ar' ? 'أحمد' : 'A.'}. (${item.year}). ${localize(item.title, locale)}. ${localize(item.venue, locale)}.`}
          </pre>
        </div>
      </div>
    </article>
  );
}
