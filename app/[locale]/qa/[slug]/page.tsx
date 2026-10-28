import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getQAMeta,
  getAllQA,
  qaCategoryLabels,
  localize,
  type Loc,
} from '@/lib/qa';
import { getQAContent } from '@/lib/qa-server';
import { SITE_URL, SITE_NAME, SITE_ORG } from '@/lib/site';
import ShareButtons from '@/components/ShareButtons';
import ContentLanguageNotice from '@/components/ContentLanguageNotice';
import { availableLocales } from '@/lib/content-availability-server';
import { absoluteUrl, authorName, jsonLdString, languagePolicy, pageMetadata } from '@/lib/seo';
import { parseMarkdown, prepareMarkdownBody, renderMarkdown } from '@/lib/markdown';

// Content and approved comments ship with the deployment. Build every
// published slug up front instead of generating it on the first visit.
// New content becomes available on the next deployment; unknown/draft
// slugs return 404 without on-demand page generation.
export const revalidate = false;
export const dynamicParams = false;
export function generateStaticParams() {
  return getAllQA().map(({ slug }) => ({ slug }));
}

const TXT = {
  ar: { back: 'العودة إلى سؤال وجواب', question: 'السؤال', answer: 'إجابة الشيخ', more: 'أسئلةٌ ذاتُ صلة', ask: 'أرسل سؤالك' },
  en: { back: 'Back to Q&A', question: 'The question', answer: 'The Shaykh’s answer', more: 'Related questions', ask: 'Ask your question' },
  es: { back: 'Volver a Preguntas y Respuestas', question: 'La pregunta', answer: 'La respuesta del Shaykh', more: 'Preguntas relacionadas', ask: 'Envía tu pregunta' },
  ur: { back: 'سوال و جواب کی طرف واپس', question: 'سوال', answer: 'شیخ کا جواب', more: 'متعلقہ سوالات', ask: 'اپنا سوال بھیجیے' },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const meta = getQAMeta(slug);
  if (!meta) return { title: locale === 'ar' ? 'سؤال غير موجود' : locale === 'es' ? 'Pregunta no encontrada' : locale === 'ur' ? 'سوال نہیں ملا' : 'Question not found' };
  const content = getQAContent(slug, locale);
  return pageMetadata({
    locale,
    path: `/qa/${slug}`,
    title: `${localize(meta.question, locale)} — ${authorName(locale)}`,
    description: localize(meta.summary, locale),
    available: availableLocales('qa', slug),
    resolvedLocale: content?.resolvedLocale,
    ogType: 'article',
    publishedTime: meta.isoDate,
  });
}

export default async function QADetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const lang = locale as Loc;
  const t = TXT[lang] ?? TXT.ar;

  const meta = getQAMeta(slug);
  if (!meta) notFound();

  const content = getQAContent(slug, locale);
  if (!content) notFound();
  const body = content.body;
  const isRtl = locale === 'ar' || locale === 'ur';
  const bodyIsRtl =
    content.resolvedLocale === 'ar' || content.resolvedLocale === 'ur';
  const doc = parseMarkdown(prepareMarkdownBody(body, 'qa'));

  const related = getAllQA()
    .filter((q) => q.slug !== slug && q.category === meta.category)
    .slice(0, 3);

  const shareUrl = `${SITE_URL}/${locale}/qa/${slug}`;
  // Schema choice: this is a single editorial answer by the Shaykh with no
  // way for readers to submit competing answers, so QAPage (which Google
  // reserves for pages where users can post answers) does not fit, and
  // FAQPage is meant for site-authored lists of several Q&As. The page is
  // described conservatively as an Article whose headline is the question;
  // the summary stays a description and is never presented as the answer.
  const bodyLang = content.resolvedLocale;
  const canonical = languagePolicy({
    locale,
    path: `/qa/${slug}`,
    available: availableLocales('qa', slug),
    resolvedLocale: bodyLang,
  }).canonical;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: localize(meta.question, bodyLang),
    description: localize(meta.summary, bodyLang),
    inLanguage: bodyLang,
    datePublished: meta.isoDate,
    author: { '@type': 'Person', name: (SITE_NAME as Record<string, string>)[bodyLang] ?? SITE_NAME.ar, url: SITE_URL },
    publisher: { '@type': 'Organization', name: (SITE_ORG as Record<string, string>)[bodyLang] ?? SITE_ORG.ar },
    mainEntityOfPage: absoluteUrl(canonical),
  };

  return (
    <article className="py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/qa`}
          className="inline-flex items-center gap-2 text-sm text-navy-500 hover:text-gold-500 transition-colors mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {isRtl ? <path d="M5 3l4 4-4 4" /> : <path d="M9 3L5 7l4 4" />}
          </svg>
          {t.back}
        </Link>

        <div className="text-xs uppercase tracking-wider text-gold-500 mb-3">
          {qaCategoryLabels[lang][meta.category]}
        </div>

        {/* The question */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-navy-700 leading-snug mb-4">
          {localize(meta.question, lang)}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs text-navy-500 pb-6 mb-10 border-b border-navy-100">
          <span>{locale === 'ar' ? 'د. أحمد أبو سيف' : locale === 'ur' ? 'ڈاکٹر احمد ابو سیف' : 'Dr. Ahmed Abouseif'}</span>
          <span className="text-gold-300">•</span>
          <span>{localize(meta.date, lang)}</span>
          {meta.origin && (
            <>
              <span className="text-gold-300">•</span>
              <span>{localize(meta.origin, lang)}</span>
            </>
          )}
        </div>

        {/* The question (as asked) */}
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-navy-50 border border-navy-200 px-4 py-1.5 text-sm font-medium text-navy-700">
            {t.question}
          </div>
          <div className="rounded-xl border border-navy-100 bg-navy-50/40 p-5 text-base sm:text-lg text-navy-700 leading-loose whitespace-pre-line">
            {localize(meta.questionFull ?? meta.question, lang)}
          </div>
        </div>

        {/* Answer label */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gold-50 border border-gold-200 px-4 py-1.5 text-sm font-medium text-gold-700">
          {t.answer}
        </div>

        {/* Answer body */}
        <ContentLanguageNotice
          requestedLocale={content.requestedLocale}
          resolvedLocale={content.resolvedLocale}
        />
        <div className={`article-prose ${bodyIsRtl ? 'article-rtl' : 'article-ltr'}`}>
          {renderMarkdown(doc, { locale: content.resolvedLocale })}
        </div>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-navy-100">
          <ShareButtons url={shareUrl} title={localize(meta.question, lang)} locale={lang} />
        </div>

        {/* Ask CTA */}
        <div className="mt-10 rounded-xl border border-navy-100 bg-navy-50/50 p-6 text-center">
          <Link
            href={`/${locale}/qa#ask`}
            className="inline-flex items-center gap-2 rounded-full bg-navy-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-800 transition-colors no-underline"
          >
            {t.ask}
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-navy-100">
            <h2 className="text-xl font-medium text-navy-700 mb-6">{t.more}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((q) => (
                <Link
                  key={q.slug}
                  href={`/${locale}/qa/${q.slug}`}
                  className="block bg-white border border-navy-100 rounded-lg p-5 card-hover"
                >
                  <div className="text-xs uppercase tracking-wider text-gold-500 mb-2">
                    {qaCategoryLabels[lang][q.category]}
                  </div>
                  <div className="text-base font-medium text-navy-700 leading-snug">
                    {localize(q.question, lang)}
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
