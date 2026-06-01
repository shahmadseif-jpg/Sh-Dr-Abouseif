import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getKhatraMeta,
  getAllKhawatir,
  prayerLabels,
  getYoutubeEmbedUrl,
} from '@/lib/khawatir';
import { getKhatraBody } from '@/lib/khawatir-server';
import { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const meta = getKhatraMeta(slug);
  if (!meta) return { title: locale === 'ar' ? 'خاطرة غير موجودة' : 'Reflection not found' };
  const lang = (locale === 'es' ? 'en' : locale) as 'ar' | 'en';
  return {
    title: `${meta.title[lang]} — ${locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}`,
    description: meta.excerpt[lang],
  };
}

export default async function KhatraPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const lang = (locale === 'es' ? 'en' : locale) as 'ar' | 'en';
  const meta = getKhatraMeta(slug);
  if (!meta) notFound();

  const body = getKhatraBody(slug, lang);
  if (!body) notFound();

  const trimmedBody = stripDuplicateHeaderFromMarkdown(body);

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
            {locale === 'ar' ? <path d="M5 3l4 4-4 4" /> : <path d="M9 3L5 7l4 4" />}
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
            {locale === 'ar' ? 'خاطرة' : 'Reflection'} · {prayerLabels[lang][meta.prayer]}
          </span>
        </div>

        {/* Title + subtitle */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-navy-700 leading-tight mb-3">
          {meta.title[lang]}
        </h1>
        {meta.subtitle && (
          <p className="text-lg sm:text-xl text-navy-500 leading-relaxed mb-6 font-light">
            {meta.subtitle[lang]}
          </p>
        )}

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-navy-500 pb-6 mb-10 border-b border-navy-100">
          <span>{locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}</span>
          <span className="text-gold-300">•</span>
          <span>{meta.date[lang]}</span>
          <span className="text-gold-300">•</span>
          <span>{meta.readingMinutes} {locale === 'ar' ? 'دقائق قراءة' : 'min read'}</span>
        </div>

        {/* Embedded video */}
        {embedUrl && (
          <figure className="mb-12">
            <div className="relative w-full overflow-hidden rounded-lg shadow-md bg-black aspect-video">
              <iframe
                src={embedUrl}
                title={meta.title[lang]}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <figcaption className="mt-3 text-xs text-navy-500 text-center">
              {locale === 'ar' ? 'الفيديو الأصلي للخاطرة' : 'Original video of the reflection'}
            </figcaption>
          </figure>
        )}

        {/* Body */}
        <div className={`article-prose ${locale === 'ar' ? 'article-rtl' : 'article-ltr'}`}>
          {renderMarkdown(trimmedBody, (locale === 'es' ? 'en' : locale) as 'ar' | 'en')}
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
                    {prayerLabels[lang][k.prayer]}
                  </div>
                  <div className="text-base font-medium text-navy-700 leading-snug">
                    {k.title[lang]}
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

/* ============================================================
   Markdown rendering — same minimal parser used for articles.
   Handles: ### h3, **bold**, > quote, - list, 1. list, [^N], ---
   ============================================================ */

function stripDuplicateHeaderFromMarkdown(md: string): string {
  const lines = md.split('\n');
  let i = 0;
  if (lines[0]?.trim() === '---') {
    i = 1;
    while (i < lines.length && lines[i].trim() !== '---') i++;
    if (i < lines.length) i++;
    while (i < lines.length && lines[i].trim() === '') i++;
    return lines.slice(i).join('\n').trim();
  }
  const out: string[] = [];
  let strippedHeader = false;
  let seenHr = false;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (!seenHr && !strippedHeader) {
      if (/^#{1,3}\s/.test(line) || line.trim() === '') continue;
      if (line.trim() === '---') {
        seenHr = true;
        strippedHeader = true;
        continue;
      }
      strippedHeader = true;
    }
    out.push(line);
  }
  return out.join('\n').trim();
}

function renderMarkdown(md: string, locale: 'ar' | 'en'): ReactNode {
  const blocks: ReactNode[] = [];
  const paragraphs = md.split(/\n\n+/);

  const footnoteDefs: { ref: string; content: string }[] = [];
  const filteredParagraphs: string[] = [];
  for (const p of paragraphs) {
    const trimmed = p.trim();
    const fnMatch = trimmed.match(/^\[\^(\w+)\]:\s*([\s\S]+)$/);
    if (fnMatch) {
      footnoteDefs.push({ ref: fnMatch[1], content: fnMatch[2].trim() });
    } else {
      filteredParagraphs.push(p);
    }
  }

  for (let i = 0; i < filteredParagraphs.length; i++) {
    const para = filteredParagraphs[i].trim();
    if (!para) continue;

    if (para === '---') {
      blocks.push(<hr key={`hr-${i}`} className="border-t border-gold-200 my-10" />);
      continue;
    }

    if (para.startsWith('### ')) {
      const text = para.slice(4).trim();
      blocks.push(
        <h3 key={`h3-${i}`} className="text-xl sm:text-2xl font-medium text-navy-700 mt-12 mb-4 gold-line">
          {processInline(text, locale)}
        </h3>
      );
      continue;
    }

    if (para.startsWith('#### ')) {
      const text = para.slice(5).trim();
      blocks.push(
        <h4 key={`h4-${i}`} className="text-lg font-medium text-navy-700 mt-8 mb-3">
          {processInline(text, locale)}
        </h4>
      );
      continue;
    }

    if (para.startsWith('*') && para.endsWith('*') && !para.startsWith('**')) {
      const text = para.replace(/^\*+|\*+$/g, '').trim();
      blocks.push(
        <p key={`sig-${i}`} className="text-sm text-navy-500 italic leading-relaxed mt-6">
          {processInline(text, locale)}
        </p>
      );
      continue;
    }

    if (para.startsWith('> ')) {
      const quoteLines = para.split('\n').map((l) => l.replace(/^>\s?/, ''));
      blocks.push(
        <blockquote key={`q-${i}`} className="border-r-4 border-gold-400 ps-5 pe-5 py-3 my-6 bg-gold-50 text-navy-700 text-lg leading-loose italic">
          {quoteLines.map((line, idx) => (
            <span key={idx} className="block">
              {processInline(line, locale)}
            </span>
          ))}
        </blockquote>
      );
      continue;
    }

    if (/^[\-*]\s/.test(para)) {
      const items = para.split('\n').filter((l) => /^[\-*]\s/.test(l)).map((l) => l.replace(/^[\-*]\s+/, ''));
      blocks.push(
        <ul key={`ul-${i}`} className="my-5 space-y-2 ps-5">
          {items.map((item, idx) => (
            <li key={idx} className="text-navy-600 leading-relaxed flex gap-3 items-start">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
              <span>{processInline(item, locale)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s/.test(para)) {
      const items = para.split('\n').filter((l) => /^\d+\.\s/.test(l)).map((l) => l.replace(/^\d+\.\s+/, ''));
      blocks.push(
        <ol key={`ol-${i}`} className="my-5 space-y-2 ps-5 list-decimal list-inside">
          {items.map((item, idx) => (
            <li key={idx} className="text-navy-600 leading-relaxed">
              {processInline(item, locale)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    blocks.push(
      <p key={`p-${i}`} className="text-base sm:text-lg text-navy-700 leading-loose my-5">
        {processInline(para, locale)}
      </p>
    );
  }

  if (footnoteDefs.length > 0) {
    blocks.push(
      <div key="footnotes" className="mt-16 pt-8 border-t border-navy-100">
        <h3 className="text-base font-medium text-navy-700 mb-4 uppercase tracking-wider">
          {locale === 'ar' ? 'الهوامش' : 'Notes'}
        </h3>
        <ol className="space-y-3 text-sm text-navy-600 leading-relaxed list-decimal list-inside">
          {footnoteDefs.map((fn) => (
            <li key={fn.ref} id={`fn-${fn.ref}`} className="ps-2">
              <span>{processInline(fn.content, locale)}</span>
              <a href={`#fnref-${fn.ref}`} className="text-gold-500 hover:text-gold-700 ms-2 text-xs no-underline">↩</a>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return blocks;
}

function processInline(text: string, locale: 'ar' | 'en'): ReactNode {
  let working = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\n/g, ' ')
    .replace(/[ \t]+/g, ' ');

  const out: ReactNode[] = [];
  let keyCounter = 0;

  const tokenRegex = /(\*\*[^*]+\*\*)|(\[\^(\w+)\])/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = tokenRegex.exec(working)) !== null) {
    if (match.index > lastIndex) {
      out.push(working.slice(lastIndex, match.index));
    }
    if (match[1]) {
      const inner = match[1].slice(2, -2);
      out.push(
        <strong key={`b-${keyCounter++}`} className="font-semibold text-navy-800">
          {inner}
        </strong>
      );
    } else if (match[2]) {
      const ref = match[3];
      out.push(
        <sup key={`fn-${keyCounter++}`} id={`fnref-${ref}`} className="mx-0.5">
          <a href={`#fn-${ref}`} className="text-gold-600 hover:text-gold-700 font-medium no-underline text-xs">
            [{ref}]
          </a>
        </sup>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < working.length) {
    out.push(working.slice(lastIndex));
  }
  return out;
}
