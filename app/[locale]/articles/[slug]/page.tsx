import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleMeta, getArticleBody, getAllArticles, categoryLabels } from '@/lib/articles';
import { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const meta = getArticleMeta(slug);
  if (!meta) return { title: locale === 'ar' ? 'مقال غير موجود' : 'Article not found' };
  const lang = locale as 'ar' | 'en';
  return {
    title: `${meta.title[lang]} — ${locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}`,
    description: meta.excerpt[lang],
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const lang = locale as 'ar' | 'en';
  const meta = getArticleMeta(slug);
  if (!meta) notFound();

  const body = getArticleBody(slug, lang);
  if (!body) notFound();

  const trimmedBody = stripDuplicateHeaderFromMarkdown(body);

  const t = await getTranslations({ locale, namespace: 'articles_page' });

  const otherArticles = getAllArticles().filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <article className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/articles`}
          className="inline-flex items-center gap-2 text-sm text-navy-500 hover:text-gold-500 transition-colors mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {locale === 'ar' ? <path d="M5 3l4 4-4 4" /> : <path d="M9 3L5 7l4 4" />}
          </svg>
          {t('back_to_articles')}
        </Link>

        {meta.series && (
          <div className="mb-4">
            <div className="text-xs uppercase tracking-[0.2em] text-gold-500 mb-1">
              {locale === 'ar' ? 'سلسلة' : 'Series'} {meta.episode ? `· ${locale === 'ar' ? 'الحلقة' : 'Episode'} ${meta.episode}` : ''}
            </div>
            <div className="text-sm text-navy-500 italic">{meta.series[lang]}</div>
          </div>
        )}

        <div className="text-xs uppercase tracking-wider text-gold-500 mb-3">
          {categoryLabels[lang][meta.category]}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-navy-700 leading-tight mb-3">
          {meta.title[lang]}
        </h1>
        {meta.subtitle && (
          <p className="text-lg sm:text-xl text-navy-500 leading-relaxed mb-6 font-light">
            {meta.subtitle[lang]}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-navy-500 pb-6 mb-10 border-b border-navy-100">
          <span>{locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}</span>
          <span className="text-gold-300">•</span>
          <span>{meta.date[lang]}</span>
          <span className="text-gold-300">•</span>
          <span>{meta.readingMinutes} {locale === 'ar' ? 'دقائق قراءة' : 'min read'}</span>
        </div>

        <div className={`article-prose ${locale === 'ar' ? 'article-rtl' : 'article-ltr'}`}>
          {renderMarkdown(trimmedBody, locale as 'ar' | 'en')}
        </div>

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
                    {a.title[lang]}
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

function stripDuplicateHeaderFromMarkdown(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let strippedHeader = false;
  let seenHr = false;
  for (const line of lines) {
    if (!seenHr && !strippedHeader) {
      if (line.match(/^#\s/) || line.match(/^##\s/) || line.match(/^###\s/) || line.trim() === '') {
        continue;
      }
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
      const text = para.split('\n').map((l) => l.replace(/^>\s?/, '')).join(' ');
      blocks.push(
        <blockquote key={`q-${i}`} className="border-r-4 border-gold-400 ps-5 pe-5 py-3 my-6 bg-gold-50 text-navy-700 text-lg leading-loose italic">
          {processInline(text, locale)}
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
              <a href={`#fnref-${fn.ref}`} className="text-gold-500 hover:text-gold-700 ms-2 text-xs no-underline">
                ↩
              </a>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return blocks;
}

function processInline(text: string, locale: 'ar' | 'en'): ReactNode {
  let working = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');

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
          <a
            href={`#fn-${ref}`}
            className="text-gold-600 hover:text-gold-700 font-medium no-underline text-xs"
          >
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
