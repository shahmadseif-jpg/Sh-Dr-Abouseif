import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';
import {
  getQAMeta,
  getAllQA,
  qaCategoryLabels,
  localize,
  type Loc,
} from '@/lib/qa';
import { getQABody } from '@/lib/qa-server';
import { SITE_URL, SITE_NAME, SITE_ORG } from '@/lib/site';
import ShareButtons from '@/components/ShareButtons';

export const dynamic = 'force-dynamic';

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
  if (!meta) return { title: locale === 'ar' ? 'سؤال غير موجود' : 'Question not found' };
  const lang = locale as Loc;
  const author = (SITE_NAME as Record<string, string>)[lang] ?? SITE_NAME.ar;
  const title = `${localize(meta.question, lang)} — ${author}`;
  const description = localize(meta.summary, lang);
  const path = `/qa/${slug}`;
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { ar: `/ar${path}`, en: `/en${path}`, es: `/es${path}`, ur: `/ur${path}` },
    },
    openGraph: { type: 'article', title, description, url: `/${locale}${path}`, siteName: author },
  };
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

  const body = getQABody(slug, locale);
  if (!body) notFound();
  const trimmedBody = stripFrontmatter(body);

  const related = getAllQA()
    .filter((q) => q.slug !== slug && q.category === meta.category)
    .slice(0, 3);

  const shareUrl = `${SITE_URL}/${locale}/qa/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: localize(meta.question, lang),
      text: localize(meta.question, lang),
      dateCreated: meta.isoDate,
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: localize(meta.summary, lang),
        author: { '@type': 'Person', name: (SITE_NAME as Record<string, string>)[lang] ?? SITE_NAME.ar },
      },
    },
    inLanguage: lang,
    publisher: { '@type': 'Organization', name: (SITE_ORG as Record<string, string>)[lang] ?? SITE_ORG.ar },
  };

  return (
    <article className="py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/qa`}
          className="inline-flex items-center gap-2 text-sm text-navy-500 hover:text-gold-500 transition-colors mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {locale === 'ar' ? <path d="M5 3l4 4-4 4" /> : <path d="M9 3L5 7l4 4" />}
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
          <span>{locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}</span>
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
        <div className={`article-prose ${locale === 'ar' ? 'article-rtl' : 'article-ltr'}`}>
          {renderMarkdown(trimmedBody, locale)}
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

/* ============================================================
   Markdown rendering — mirrors the article renderer.
   Handles: ## h2, ### h3, #### h4, > quote, - / 1. lists,
   **bold**, [^N] footnotes, --- hr.
   ============================================================ */

function stripFrontmatter(md: string): string {
  const lines = md.split('\n');
  if (lines[0]?.trim() === '---') {
    let i = 1;
    while (i < lines.length && lines[i].trim() !== '---') i++;
    if (i < lines.length) i++;
    while (i < lines.length && lines[i].trim() === '') i++;
    return lines.slice(i).join('\n').trim();
  }
  return md.trim();
}

function renderMarkdown(md: string, locale: string): ReactNode {
  const blocks: ReactNode[] = [];
  const paragraphs = md.split(/\n\n+/);

  const footnoteDefs: { ref: string; content: string }[] = [];
  const filtered: string[] = [];
  for (const p of paragraphs) {
    const trimmed = p.trim();
    const fnMatch = trimmed.match(/^\[\^(\w+)\]:\s*([\s\S]+)$/);
    if (fnMatch) footnoteDefs.push({ ref: fnMatch[1], content: fnMatch[2].trim() });
    else filtered.push(p);
  }

  for (let i = 0; i < filtered.length; i++) {
    const para = filtered[i].trim();
    if (!para) continue;

    if (para === '---') {
      blocks.push(<hr key={`hr-${i}`} className="border-t border-gold-200 my-10" />);
      continue;
    }
    if (para.startsWith('## ') && !para.startsWith('### ')) {
      blocks.push(
        <h2 key={`h2-${i}`} className="text-2xl sm:text-3xl font-semibold text-navy-700 mt-14 mb-5 gold-line">
          {processInline(para.slice(3).trim(), locale)}
        </h2>
      );
      continue;
    }
    if (para.startsWith('### ')) {
      blocks.push(
        <h3 key={`h3-${i}`} className="text-xl sm:text-2xl font-medium text-navy-700 mt-12 mb-4 gold-line">
          {processInline(para.slice(4).trim(), locale)}
        </h3>
      );
      continue;
    }
    if (para.startsWith('#### ')) {
      blocks.push(
        <h4 key={`h4-${i}`} className="text-lg font-medium text-navy-700 mt-8 mb-3">
          {processInline(para.slice(5).trim(), locale)}
        </h4>
      );
      continue;
    }
    if (para.startsWith('> ')) {
      const quoteLines = para.split('\n').map((l) => l.replace(/^>\s?/, ''));
      blocks.push(
        <blockquote key={`q-${i}`} className="border-r-4 border-gold-400 ps-5 pe-5 py-3 my-6 bg-gold-50 text-navy-700 text-lg leading-loose italic">
          {quoteLines.map((line, idx) => (
            <span key={idx} className="block">{processInline(line, locale)}</span>
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
            <li key={idx} className="text-navy-600 leading-relaxed">{processInline(item, locale)}</li>
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
          {locale === 'ar' ? 'الهوامش' : locale === 'es' ? 'Notas' : 'Notes'}
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

function processInline(text: string, _locale: string): ReactNode {
  const working = text
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
    if (match.index > lastIndex) out.push(working.slice(lastIndex, match.index));
    if (match[1]) {
      out.push(
        <strong key={`b-${keyCounter++}`} className="font-semibold text-navy-800">
          {match[1].slice(2, -2)}
        </strong>
      );
    } else if (match[2]) {
      const ref = match[3];
      out.push(
        <sup key={`fn-${keyCounter++}`} id={`fnref-${ref}`} className="mx-0.5">
          <a href={`#fn-${ref}`} className="text-gold-600 hover:text-gold-700 font-medium no-underline text-xs">[{ref}]</a>
        </sup>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < working.length) out.push(working.slice(lastIndex));
  return out;
}
