import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getArticleMeta, getAllArticles, categoryLabels } from '@/lib/articles';
import { getArticleBody } from '@/lib/articles-server';
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

  // Strip the YAML-like top metadata (lines we already store in articlesMeta)
  // The .md file currently has its own title/subtitle in the first 3 lines (# / ## / ###)
  // We render those from `meta` for consistent styling, so trim them from body.
  const trimmedBody = stripDuplicateHeaderFromMarkdown(body);

  const t = await getTranslations({ locale, namespace: 'articles_page' });

  // Get other articles for "more articles" section
  const otherArticles = getAllArticles().filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <article className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href={`/${locale}/articles`}
          className="inline-flex items-center gap-2 text-sm text-navy-500 hover:text-gold-500 transition-colors mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {locale === 'ar' ? <path d="M5 3l4 4-4 4" /> : <path d="M9 3L5 7l4 4" />}
          </svg>
          {t('back_to_articles')}
        </Link>

        {/* Series badge */}
        {meta.series && (
          <div className="mb-4">
            <div className="text-xs uppercase tracking-[0.2em] text-gold-500 mb-1">
              {locale === 'ar' ? 'سلسلة' : 'Series'} {meta.episode ? `· ${locale === 'ar' ? 'الحلقة' : 'Episode'} ${meta.episode}` : ''}
            </div>
            <div className="text-sm text-navy-500 italic">{meta.series[lang]}</div>
          </div>
        )}

        {/* Category */}
        <div className="text-xs uppercase tracking-wider text-gold-500 mb-3">
          {categoryLabels[lang][meta.category]}
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

        {/* Cover image (optional) */}
        {meta.coverImage && (
          <figure className="mb-12">
            <div className="relative w-full overflow-hidden rounded-lg shadow-md bg-navy-50">
              <Image
                src={meta.coverImage}
                alt={meta.title[lang]}
                width={1600}
                height={1000}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            {meta.coverCaption && (
              <figcaption className={`mt-4 text-sm text-navy-500 italic leading-relaxed text-center px-2 ${locale === 'ar' ? 'article-rtl' : 'article-ltr'}`}>
                {meta.coverCaption[lang]}
              </figcaption>
            )}
          </figure>
        )}

        {/* Article body */}
        <div className={`article-prose ${locale === 'ar' ? 'article-rtl' : 'article-ltr'}`}>
          {renderMarkdown(trimmedBody, locale as 'ar' | 'en')}
        </div>

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

/* ============================================================
   Markdown rendering — minimal custom parser
   Handles: ## h2, ### h3, **bold**, > quote, - list, 1. list,
   [^N] footnote refs, --- hr, *italic*, _italic_
   ============================================================ */

function stripDuplicateHeaderFromMarkdown(md: string): string {
  const lines = md.split('\n');
  let i = 0;

  // 1) Strip YAML frontmatter at the top: everything between an opening
  //    `---` line and the matching closing `---` line. We render the
  //    metadata (title, date, series, …) from articlesMeta, so the
  //    frontmatter must never appear in the body.
  if (lines[0]?.trim() === '---') {
    i = 1;
    while (i < lines.length && lines[i].trim() !== '---') i++;
    if (i < lines.length) i++; // skip the closing ---
    while (i < lines.length && lines[i].trim() === '') i++; // skip blank lines after
    return lines.slice(i).join('\n').trim();
  }

  // 2) Legacy fallback (no frontmatter): strip the first H1/H2/H3 lines
  //    that appear before the first horizontal rule (---), where the
  //    title used to be duplicated at the top of the markdown body.
  const out: string[] = [];
  let strippedHeader = false;
  let seenHr = false;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (!seenHr && !strippedHeader) {
      if (/^#{1,3}\s/.test(line) || line.trim() === '') {
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
  let footnoteIndex = 0;

  // Find footnote definitions ([^N]: content)
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

    // Horizontal rule
    if (para === '---') {
      blocks.push(<hr key={`hr-${i}`} className="border-t border-gold-200 my-10" />);
      continue;
    }

    // H2 (### Heading on its own line)
    if (para.startsWith('### ')) {
      const text = para.slice(4).trim();
      blocks.push(
        <h3 key={`h3-${i}`} className="text-xl sm:text-2xl font-medium text-navy-700 mt-12 mb-4 gold-line">
          {processInline(text, locale)}
        </h3>
      );
      continue;
    }

    // H4 (#### Heading)
    if (para.startsWith('#### ')) {
      const text = para.slice(5).trim();
      blocks.push(
        <h4 key={`h4-${i}`} className="text-lg font-medium text-navy-700 mt-8 mb-3">
          {processInline(text, locale)}
        </h4>
      );
      continue;
    }

    // Author italic signature (lines starting with single *)
    if (para.startsWith('*') && para.endsWith('*') && !para.startsWith('**')) {
      const text = para.replace(/^\*+|\*+$/g, '').trim();
      blocks.push(
        <p key={`sig-${i}`} className="text-sm text-navy-500 italic leading-relaxed mt-6">
          {processInline(text, locale)}
        </p>
      );
      continue;
    }

    // Blockquote
    if (para.startsWith('> ')) {
      const text = para.split('\n').map((l) => l.replace(/^>\s?/, '')).join(' ');
      blocks.push(
        <blockquote key={`q-${i}`} className="border-r-4 border-gold-400 ps-5 pe-5 py-3 my-6 bg-gold-50 text-navy-700 text-lg leading-loose italic">
          {processInline(text, locale)}
        </blockquote>
      );
      continue;
    }

    // List (unordered with - or *)
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

    // Numbered list
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

    // Regular paragraph
    blocks.push(
      <p key={`p-${i}`} className="text-base sm:text-lg text-navy-700 leading-loose my-5">
        {processInline(para, locale)}
      </p>
    );
  }

  // Footnotes section
  if (footnoteDefs.length > 0) {
    blocks.push(
      <div key="footnotes" className="mt-16 pt-8 border-t border-navy-100">
        <h3 className="text-base font-medium text-navy-700 mb-4 uppercase tracking-wider">
          {locale === 'ar' ? 'الهوامش' : 'Notes'}
        </h3>
        <ol className="space-y-3 text-sm text-navy-600 leading-relaxed list-decimal list-inside">
          {footnoteDefs.map((fn, idx) => (
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
  // Process inline: **bold**, *italic*, [^N] footnote refs, line breaks within paragraphs
  // Replace inline newlines (single \n within a paragraph) with spaces
  let working = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');

  const out: ReactNode[] = [];
  let keyCounter = 0;
  let remaining = working;

  // Regex to match: **bold**, [^N] footnote ref
  const tokenRegex = /(\*\*[^*]+\*\*)|(\[\^(\w+)\])|(\([^)]*?٢٠[0-9]+م?\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = tokenRegex.exec(working)) !== null) {
    // Push text before the match
    if (match.index > lastIndex) {
      out.push(working.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // **bold**
      const inner = match[1].slice(2, -2);
      out.push(
        <strong key={`b-${keyCounter++}`} className="font-semibold text-navy-800">
          {inner}
        </strong>
      );
    } else if (match[2]) {
      // [^N] footnote ref
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
    } else if (match[4]) {
      // parenthesized year - just keep as text
      out.push(match[4]);
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining text after last match
  if (lastIndex < working.length) {
    out.push(working.slice(lastIndex));
  }

  return out;
}
