import { localizedTextLocale } from '@/lib/localize';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getArticleMeta, getAllArticles, categoryLabels, localize, type Loc } from '@/lib/articles';
import { getArticleContent } from '@/lib/articles-server';
import { SITE_URL, SITE_NAME, SITE_ORG } from '@/lib/site';
import { availableLocales } from '@/lib/content-availability-server';
import { absoluteUrl, authorName, jsonLdString, languagePolicy, pageMetadata } from '@/lib/seo';
import { parseMarkdown, prepareMarkdownBody, renderMarkdown } from '@/lib/markdown';
import ShareButtons from '@/components/ShareButtons';
import ReadingTools from '@/components/ReadingTools';
import ArticleComments from '@/components/ArticleComments';
import ContentLanguageNotice from '@/components/ContentLanguageNotice';
import { getApprovedComments } from '@/lib/comments';

// Content and approved comments ship with the deployment. Build every
// published slug up front instead of generating it on the first visit.
// New content becomes available on the next deployment; unknown/draft
// slugs return 404 without on-demand page generation.
export const revalidate = false;
export const dynamicParams = false;
export function generateStaticParams() {
  return getAllArticles().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const meta = getArticleMeta(slug);
  if (!meta) return { title: locale === 'ar' ? 'مقال غير موجود' : locale === 'es' ? 'Artículo no encontrado' : locale === 'ur' ? 'مضمون نہیں ملا' : 'Article not found' };
  const content = getArticleContent(slug, locale);
  return pageMetadata({
    locale,
    path: `/articles/${slug}`,
    title: `${localize(meta.title, locale)} — ${authorName(locale)}`,
    description: localize(meta.excerpt, locale),
    available: availableLocales('articles', slug),
    resolvedLocale: content?.resolvedLocale,
    ogType: 'article',
    image: meta.coverImage,
    publishedTime: meta.isoDate,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const lang = locale as Loc;
  const meta = getArticleMeta(slug);
  if (!meta) notFound();

  const content = getArticleContent(slug, locale);
  if (!content) notFound();
  const body = content.body;
  const isRtl = locale === 'ar' || locale === 'ur';
  const bodyIsRtl =
    content.resolvedLocale === 'ar' || content.resolvedLocale === 'ur';

  // Front matter / duplicated title lines are rendered from `meta`, so the
  // shared renderer strips them from the body (lib/markdown.tsx).
  const doc = parseMarkdown(prepareMarkdownBody(body, 'articles'));

  const t = await getTranslations({ locale, namespace: 'articles_page' });

  // Related articles — prioritise same series, then same path (category), then the rest.
  const pool = getAllArticles().filter((a) => a.slug !== slug);
  const sameSeries = pool.filter(
    (a) => meta.series && a.series && a.series.ar === meta.series.ar
  );
  const sameCategory = pool.filter(
    (a) => a.category === meta.category && !sameSeries.includes(a)
  );
  const rest = pool.filter(
    (a) => !sameSeries.includes(a) && !sameCategory.includes(a)
  );
  const otherArticles = [...sameSeries, ...sameCategory, ...rest].slice(0, 3);

  // Approved reader comments (moderated; stored in content/comments/<slug>.json)
  const approvedComments = getApprovedComments(slug);

  // Sharing + structured data
  const shareUrl = `${SITE_URL}/${locale}/articles/${slug}`;
  const ogImage = absoluteUrl(meta.coverImage || '/dr-ahmed.jpg');
  // Structured data describes the text actually shown: its language is the
  // resolved body language, and its URL is the canonical one. No
  // dateModified: there is no recorded modification date distinct from
  // publication.
  const bodyLang = content.resolvedLocale;
  const canonical = languagePolicy({
    locale,
    path: `/articles/${slug}`,
    available: availableLocales('articles', slug),
    resolvedLocale: bodyLang,
  }).canonical;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: localize(meta.title, bodyLang),
    description: localize(meta.excerpt, bodyLang),
    inLanguage: bodyLang,
    datePublished: meta.isoDate,
    author: { '@type': 'Person', name: (SITE_NAME as Record<string, string>)[bodyLang] ?? SITE_NAME.ar, url: SITE_URL },
    publisher: { '@type': 'Organization', name: (SITE_ORG as Record<string, string>)[bodyLang] ?? SITE_ORG.ar },
    mainEntityOfPage: absoluteUrl(canonical),
    image: ogImage,
  };

  return (
    <article className="py-12 sm:py-16">
      <ReadingTools />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href={`/${locale}/articles`}
          className="inline-flex items-center gap-2 text-sm text-navy-500 hover:text-gold-500 transition-colors mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {isRtl ? <path d="M5 3l4 4-4 4" /> : <path d="M9 3L5 7l4 4" />}
          </svg>
          {t('back_to_articles')}
        </Link>

        {/* Series badge */}
        {meta.series && (
          <div className="mb-4">
            <div className="text-xs uppercase tracking-[0.2em] text-gold-500 mb-1">
              {locale === 'ar' ? 'سلسلة' : locale === 'es' ? 'Serie' : locale === 'ur' ? 'سلسلہ' : 'Series'} {meta.episode ? `· ${locale === 'ar' ? 'الحلقة' : locale === 'es' ? 'Episodio' : locale === 'ur' ? 'قسط' : 'Episode'} ${meta.episode}` : ''}
            </div>
            <div className="text-sm text-navy-500 italic">{localize(meta.series, lang)}</div>
          </div>
        )}

        {/* Category */}
        <div className="text-xs uppercase tracking-wider text-gold-500 mb-3">
          {categoryLabels[lang][meta.category]}
        </div>

        {/* Title + subtitle */}
        <h1 lang={localizedTextLocale(meta.title, locale)} dir={['ar', 'ur'].includes(localizedTextLocale(meta.title, locale)) ? 'rtl' : 'ltr'} className="text-3xl sm:text-4xl lg:text-5xl font-medium text-navy-700 leading-tight mb-3">
          {localize(meta.title, lang)}
        </h1>
        {meta.subtitle && (
          <p className="text-lg sm:text-xl text-navy-500 leading-relaxed mb-6 font-light">
            {localize(meta.subtitle, lang)}
          </p>
        )}

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-navy-500 pb-6 mb-10 border-b border-navy-100">
          <span>{locale === 'ar' ? 'د. أحمد أبو سيف' : locale === 'ur' ? 'ڈاکٹر احمد ابو سیف' : 'Dr. Ahmed Abouseif'}</span>
          <span className="text-gold-300">•</span>
          <span>{localize(meta.date, lang)}</span>
          <span className="text-gold-300">•</span>
          <span>{meta.readingMinutes} {locale === 'ar' ? 'دقائق قراءة' : locale === 'es' ? 'min de lectura' : locale === 'ur' ? 'منٹ مطالعہ' : 'min read'}</span>
        </div>

        {/* Cover image (optional) */}
        {meta.coverImage && (
          <figure className="mb-12">
            <div className="relative w-full overflow-hidden rounded-lg shadow-md bg-navy-50">
              <Image
                src={meta.coverImage}
                alt={localize(meta.title, lang)}
                width={1600}
                height={1000}
                // Column is max-w-3xl (768px) minus padding; without `sizes`
                // the 2x candidate of width=1600 (w=3840) was fetched (PERF-04).
                sizes="(min-width: 768px) 720px, calc(100vw - 32px)"
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            {meta.coverCaption && (
              <figcaption className={`mt-4 text-sm text-navy-500 italic leading-relaxed text-center px-2 ${isRtl ? 'article-rtl' : 'article-ltr'}`}>
                {localize(meta.coverCaption, lang)}
              </figcaption>
            )}
          </figure>
        )}

        {/* Article body */}
        <ContentLanguageNotice
          requestedLocale={content.requestedLocale}
          resolvedLocale={content.resolvedLocale}
        />
        <div lang={content.resolvedLocale} dir={bodyIsRtl ? 'rtl' : 'ltr'} className={`article-prose ${bodyIsRtl ? 'article-rtl' : 'article-ltr'}`}>
          {renderMarkdown(doc, { locale: content.resolvedLocale })}
        </div>

        {/* Share bar */}
        <div className="mt-12 pt-8 border-t border-navy-100">
          <ShareButtons url={shareUrl} title={localize(meta.title, lang)} locale={lang} />
        </div>

        {/* Reader comments (moderated) */}
        <ArticleComments
          slug={slug}
          locale={locale}
          articleTitle={localize(meta.title, lang)}
          comments={approvedComments}
        />

        {/* More articles section */}
        {otherArticles.length > 0 && (
          <div className="mt-20 pt-10 border-t border-navy-100">
            <h2 className="text-xl font-medium text-navy-700 mb-6">
              {t('more_articles')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/${locale}/articles/${a.slug}`}
                  className="block bg-white border border-navy-100 rounded-lg p-5 card-hover"
                >
                  <div className="text-xs uppercase tracking-wider text-gold-500 mb-2">
                    {categoryLabels[lang][a.category]}
                  </div>
                  <div className="text-base font-medium text-navy-700 leading-snug">
                    {localize(a.title, lang)}
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
