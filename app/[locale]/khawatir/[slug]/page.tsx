import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getKhatraMeta,
  getAllKhawatir,
  prayerLabels,
  getYoutubeEmbedUrl,
} from '@/lib/khawatir';
import { getKhatraContent } from '@/lib/khawatir-server';
import { localize } from '@/lib/articles';
import { availableLocales } from '@/lib/content-availability-server';
import { authorName, pageMetadata } from '@/lib/seo';
import { parseMarkdown, prepareMarkdownBody, renderMarkdown } from '@/lib/markdown';
import ContentLanguageNotice from '@/components/ContentLanguageNotice';

// Bodies are files shipped with each deployment, so pages need not be
// rendered on every request: they are generated on first request, cached,
// and kept until the next deployment (no timed ISR rewrites). Unknown or draft slugs still 404.
export const revalidate = false;
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const meta = getKhatraMeta(slug);
  if (!meta) return { title: locale === 'ar' ? 'خاطرة غير موجودة' : locale === 'es' ? 'Reflexión no encontrada' : locale === 'ur' ? 'خاطرہ نہیں ملا' : 'Reflection not found' };
  const content = getKhatraContent(slug, locale);
  return pageMetadata({
    locale,
    path: `/khawatir/${slug}`,
    title: `${localize(meta.title, locale)} — ${authorName(locale)}`,
    description: localize(meta.excerpt, locale),
    available: availableLocales('khawatir', slug),
    resolvedLocale: content?.resolvedLocale,
    ogType: 'article',
    publishedTime: meta.isoDate,
  });
}

export default async function KhatraPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const meta = getKhatraMeta(slug);
  if (!meta) notFound();

  const content = getKhatraContent(slug, locale);
  if (!content) notFound();
  const body = content.body;
  const isRtl = locale === 'ar' || locale === 'ur';
  const bodyIsRtl =
    content.resolvedLocale === 'ar' || content.resolvedLocale === 'ur';

  const doc = parseMarkdown(prepareMarkdownBody(body, 'khawatir'));
  const pl = prayerLabels[locale as keyof typeof prayerLabels] ?? prayerLabels.ar;

  const t = await getTranslations({ locale, namespace: 'khawatir_page' });

  const embedUrl = meta.videoUrl ? getYoutubeEmbedUrl(meta.videoUrl) : null;
  const isFajr = meta.prayer === 'fajr';

  const others = getAllKhawatir().filter((k) => k.slug !== slug).slice(0, 3);

  return (
    <article className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href={`/${locale}/khawatir`}
          className="inline-flex items-center gap-2 text-sm text-navy-500 hover:text-gold-500 transition-colors mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {isRtl ? <path d="M5 3l4 4-4 4" /> : <path d="M9 3L5 7l4 4" />}
          </svg>
          {t('back_to_khawatir')}
        </Link>

        {/* Prayer badge */}
        <div className="mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
              isFajr
                ? 'bg-gold-50 text-gold-700 border border-gold-200'
                : 'bg-navy-50 text-navy-700 border border-navy-200'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
            {locale === 'ar' ? 'خاطرة' : locale === 'es' ? 'Reflexión' : locale === 'ur' ? 'خاطرہ' : 'Reflection'} · {pl[meta.prayer]}
          </span>
        </div>

        {/* Title + subtitle */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-navy-700 leading-tight mb-3">
          {localize(meta.title, locale)}
        </h1>
        {meta.subtitle && (
          <p className="text-lg sm:text-xl text-navy-500 leading-relaxed mb-6 font-light">
            {localize(meta.subtitle, locale)}
          </p>
        )}

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-navy-500 pb-6 mb-10 border-b border-navy-100">
          <span>{locale === 'ar' ? 'د. أحمد أبو سيف' : locale === 'ur' ? 'ڈاکٹر احمد ابو سیف' : 'Dr. Ahmed Abouseif'}</span>
          <span className="text-gold-300">•</span>
          <span>{localize(meta.date, locale)}</span>
          <span className="text-gold-300">•</span>
          <span>{meta.readingMinutes} {locale === 'ar' ? 'دقائق قراءة' : locale === 'es' ? 'min de lectura' : locale === 'ur' ? 'منٹ مطالعہ' : 'min read'}</span>
        </div>

        {/* Embedded video */}
        {embedUrl && (
          <figure className="mb-12">
            <div className="relative w-full overflow-hidden rounded-lg shadow-md bg-black aspect-video">
              <iframe
                src={embedUrl}
                title={localize(meta.title, locale)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <figcaption className="mt-3 text-xs text-navy-500 text-center">
              {locale === 'ar' ? 'الفيديو الأصلي للخاطرة' : locale === 'es' ? 'Vídeo original de la reflexión' : locale === 'ur' ? 'خاطرے کی اصل ویڈیو' : 'Original video of the reflection'}
            </figcaption>
          </figure>
        )}

        {/* Body */}
        <ContentLanguageNotice
          requestedLocale={content.requestedLocale}
          resolvedLocale={content.resolvedLocale}
        />
        <div className={`article-prose ${bodyIsRtl ? 'article-rtl' : 'article-ltr'}`}>
          {renderMarkdown(doc, { locale: content.resolvedLocale })}
        </div>

        {/* More khawatir */}
        {others.length > 0 && (
          <div className="mt-20 pt-10 border-t border-navy-100">
            <h2 className="text-xl font-medium text-navy-700 mb-6">
              {t('more_khawatir')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {others.map((k) => (
                <Link
                  key={k.slug}
                  href={`/${locale}/khawatir/${k.slug}`}
                  className="block bg-white border border-navy-100 rounded-lg p-5 card-hover"
                >
                  <div className="text-xs uppercase tracking-wider text-gold-500 mb-2">
                    {pl[k.prayer]}
                  </div>
                  <div className="text-base font-medium text-navy-700 leading-snug">
                    {localize(k.title, locale)}
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
