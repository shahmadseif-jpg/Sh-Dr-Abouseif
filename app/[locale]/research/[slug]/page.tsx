import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import {
  getResearchItem,
  getAllResearch,
  getPdfUrl,
  researchTypeLabels,
  researchCategoryLabels,
} from '@/lib/research';
import { getResearchContent } from '@/lib/research-server';
import { localize, type Loc } from '@/lib/articles';
import { SITE_URL } from '@/lib/site';
import ReadingTools from '@/components/ReadingTools';
import CiteThis from '@/components/CiteThis';
import ContentLanguageNotice from '@/components/ContentLanguageNotice';
import { availableLocales } from '@/lib/content-availability-server';
import { authorName, pageMetadata } from '@/lib/seo';
import { extractToc, parseMarkdown, prepareMarkdownBody, renderMarkdown } from '@/lib/markdown';

export async function generateStaticParams() {
  return getAllResearch().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = getResearchItem(slug);
  if (!item) return {};
  const content = getResearchContent(slug, locale);
  return pageMetadata({
    locale,
    path: `/research/${slug}`,
    title: `${localize(item.title, locale)} — ${authorName(locale)}`,
    description: localize(item.abstract, locale).substring(0, 200),
    available: availableLocales('research', slug, item),
    resolvedLocale: content?.resolvedLocale,
    ogType: 'article',
    publishedTime: item.isoDate,
  });
}

export default async function ResearchItemPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const item = getResearchItem(slug);
  if (!item) notFound();

  const loc = locale as Loc;
  const t = await getTranslations({ locale, namespace: 'research' });

  const content = getResearchContent(slug, locale);
  const body = content?.body;
  const bodyIsRtl =
    content?.resolvedLocale === 'ar' || content?.resolvedLocale === 'ur';
  const fullTextLabel = loc === 'ar' ? 'النص الكامل' : loc === 'es' ? 'Texto completo' : loc === 'ur' ? 'مکمل متن' : 'Full Text';

  const related = getAllResearch()
    .filter((r) => r.slug !== slug && r.category === item.category)
    .slice(0, 3);
  const relatedLabel = loc === 'ar' ? 'أبحاثٌ ذات صلة' : loc === 'es' ? 'Investigaciones relacionadas' : loc === 'ur' ? 'متعلقہ تحقیقات' : 'Related research';

  return (
    <article className="py-12 sm:py-16">
      <ReadingTools />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/research"
          className="inline-flex items-center text-sm text-navy-600 hover:text-navy-800 mb-8 no-underline"
        >
          {locale === 'ar' || locale === 'ur' ? '→' : '←'} {t('back_to_list')}
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

        {/* Cover image (books / theses) */}
        {item.coverImage && (
          <div className="mb-8 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.coverImage}
              alt={localize(item.title, locale)}
              className="rounded-lg shadow-lg border border-navy-100 max-h-[32rem] w-auto"
            />
          </div>
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

        {/* Full text */}
        {body && content && (() => {
          const cleanBody = prepareMarkdownBody(body, 'research');
          // Heading ids (sec-N) are assigned once by the parser, so the
          // table of contents and the rendered headings always agree.
          const doc = parseMarkdown(cleanBody, { headingIds: true });
          const toc = extractToc(doc);
          const mins = readingMinutes(cleanBody);
          const minsLabel = loc === 'ar' ? `${mins} دقيقة قراءة` : loc === 'es' ? `${mins} min de lectura` : loc === 'ur' ? `${mins} منٹ مطالعہ` : `${mins} min read`;
          const tocLabel = loc === 'ar' ? 'محتويات' : loc === 'es' ? 'Contenido' : loc === 'ur' ? 'فہرست' : 'Contents';
          return (
            <div className="mt-4 mb-12">
              <div className="flex flex-wrap items-baseline justify-between gap-2 pt-8 border-t border-navy-100">
                <h2 className="text-2xl font-medium text-navy-700 mb-2">{fullTextLabel}</h2>
                <span className="text-xs text-navy-500">⏱ {minsLabel}</span>
              </div>

              <ContentLanguageNotice
                requestedLocale={content.requestedLocale}
                resolvedLocale={content.resolvedLocale}
              />

              {/* In-page table of contents */}
              {toc.length > 2 && (
                <nav
                  aria-label={tocLabel}
                  className={`mb-8 rounded-lg border border-navy-100 bg-navy-50/40 p-5 ${bodyIsRtl ? 'article-rtl' : 'article-ltr'}`}
                >
                  <div className="text-xs font-medium uppercase tracking-wider text-navy-500 mb-3">{tocLabel}</div>
                  <ul className="space-y-1.5">
                    {toc.map((it) => (
                      <li key={it.id} style={{ marginInlineStart: `${(it.level - 1) * 14}px` }}>
                        <a
                          href={`#${it.id}`}
                          className={`no-underline hover:text-gold-700 hover:underline ${it.level === 1 ? 'text-navy-800 font-medium' : 'text-navy-600'} ${it.level === 3 ? 'text-sm' : ''}`}
                        >
                          {it.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              <div className={`article-prose ${bodyIsRtl ? 'article-rtl' : 'article-ltr'}`}>
                {renderMarkdown(doc, { variant: 'research', locale: content.resolvedLocale })}
              </div>
            </div>
          );
        })()}

        {/* Keywords */}
        {item.keywords && (item.keywords[loc] ?? item.keywords.ar ?? item.keywords.en).length > 0 && (
          <div className="mt-8 pt-6 border-t border-navy-100">
            <h3 className="text-sm font-medium text-navy-500 mb-3">{t('keywords')}</h3>
            <div className="flex flex-wrap gap-2">
              {(item.keywords[loc] ?? item.keywords.ar ?? item.keywords.en).map((kw) => (
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

        {/* Citation block — APA / Chicago / BibTeX + Google Scholar */}
        <CiteThis
          citeKey={`abouseif${item.year}-${slug}`}
          title={localize(item.title, locale)}
          year={item.year}
          venue={localize(item.venue, locale)}
          publisher={item.publisher ? localize(item.publisher, locale) : undefined}
          pages={item.pages}
          doi={item.doi}
          url={`${SITE_URL}/${locale}/research/${slug}`}
          locale={locale}
        />

        {/* Related research */}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-navy-100">
            <h3 className="text-lg font-medium text-navy-700 mb-5">{relatedLabel}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/research/${r.slug}`}
                  className="block bg-white border border-navy-100 rounded-lg p-5 card-hover no-underline"
                >
                  <div className="text-xs uppercase tracking-wider text-gold-500 mb-2">
                    {researchCategoryLabels[loc][r.category]}
                  </div>
                  <div className="text-base font-medium text-navy-700 leading-snug">
                    {localize(r.title, locale)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

/** Estimated reading time in minutes from the body word count. */
function readingMinutes(md: string): number {
  const words = md.replace(/[#>*`|—-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
