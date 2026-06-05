import type { ReactNode } from 'react';
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
import { getResearchBody } from '@/lib/research-server';
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

  const author = locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif';
  const title = `${localize(item.title, locale)} — ${author}`;
  const description = localize(item.abstract, locale).substring(0, 200);
  const path = `/research/${slug}`;
  const ogLocale = locale === 'ar' ? 'ar_EG' : locale === 'es' ? 'es_ES' : 'en_US';
  const image = '/dr-ahmed.jpg';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { ar: `/ar${path}`, en: `/en${path}`, es: `/es${path}` },
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/${locale}${path}`,
      siteName: author,
      locale: ogLocale,
      publishedTime: item.isoDate,
      authors: [author],
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
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

  const body = getResearchBody(slug, locale);
  const fullTextLabel = loc === 'ar' ? 'النص الكامل' : loc === 'es' ? 'Texto completo' : 'Full Text';

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

        {/* Full text */}
        {body && (() => {
          const cleanBody = stripFrontmatter(body);
          const toc = extractToc(cleanBody);
          const mins = readingMinutes(cleanBody);
          const minsLabel = loc === 'ar' ? `${mins} دقيقة قراءة` : loc === 'es' ? `${mins} min de lectura` : `${mins} min read`;
          const tocLabel = loc === 'ar' ? 'محتويات' : loc === 'es' ? 'Contenido' : 'Contents';
          return (
            <div className="mt-4 mb-12">
              <div className="flex flex-wrap items-baseline justify-between gap-2 pt-8 border-t border-navy-100">
                <h2 className="text-2xl font-medium text-navy-700 mb-2">{fullTextLabel}</h2>
                <span className="text-xs text-navy-500">⏱ {minsLabel}</span>
              </div>

              {/* In-page table of contents */}
              {toc.length > 2 && (
                <nav
                  aria-label={tocLabel}
                  className={`mb-8 rounded-lg border border-navy-100 bg-navy-50/40 p-5 ${locale === 'ar' ? 'article-rtl' : 'article-ltr'}`}
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

              <div className={`article-prose ${locale === 'ar' ? 'article-rtl' : 'article-ltr'}`}>
                {renderResearchMarkdown(cleanBody, locale)}
              </div>
            </div>
          );
        })()}

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

/* ============================================================
   Full-text markdown rendering for research papers.
   Handles: ## h2, ### h3, #### h4, **bold**, *italic*,
   > blockquote, GFM pipe tables, - / * lists, 1. lists,
   --- hr, and paragraphs.
   ============================================================ */

function stripFrontmatter(md: string): string {
  const lines = md.split('\n');
  if (lines[0]?.trim() === '---') {
    let i = 1;
    while (i < lines.length && lines[i].trim() !== '---') i++;
    if (i < lines.length) i++; // skip closing ---
    while (i < lines.length && lines[i].trim() === '') i++;
    return lines.slice(i).join('\n').trim();
  }
  return md.trim();
}

/** Extract an ordered heading list (levels 1–3) with anchor IDs that match
 *  the IDs assigned by renderResearchMarkdown (both walk the blocks in the
 *  same order and increment a heading counter on every #/##/###/#### block). */
function extractToc(md: string): { level: number; text: string; id: string }[] {
  const out: { level: number; text: string; id: string }[] = [];
  const paragraphs = md.split(/\n\n+/);
  let h = 0;
  for (const p of paragraphs) {
    const para = p.trim();
    if (!para) continue;
    let level = 0;
    if (para.startsWith('#### ')) level = 4;
    else if (para.startsWith('### ')) level = 3;
    else if (para.startsWith('## ')) level = 2;
    else if (para.startsWith('# ')) level = 1;
    if (!level) continue;
    const id = `sec-${h++}`;
    if (level > 3) continue; // counted (to stay in sync) but not listed
    const text = para.split('\n')[0].replace(/^#+\s+/, '').replace(/\*\*/g, '').replace(/★\s*/g, '').trim();
    out.push({ level, text, id });
  }
  return out;
}

/** Estimated reading time in minutes from the body word count. */
function readingMinutes(md: string): number {
  const words = stripFrontmatter(md).replace(/[#>*`|—-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function renderResearchMarkdown(md: string, locale: string): ReactNode {
  const blocks: ReactNode[] = [];
  const paragraphs = md.split(/\n\n+/);
  let h = 0; // heading counter — kept in sync with extractToc for anchor IDs

  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i].trim();
    if (!para) continue;

    if (para === '---') {
      blocks.push(<hr key={`hr-${i}`} className="border-t border-gold-200 my-10" />);
      continue;
    }

    // Pipe table
    if (para.startsWith('|') && para.includes('\n')) {
      const rows = para.split('\n').filter((l) => l.trim().startsWith('|'));
      const parseRow = (l: string) =>
        l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      const isSep = (l: string) => /^\|?[\s:|-]+\|?$/.test(l.trim()) && l.includes('-');
      const header = parseRow(rows[0]);
      const dataRows = rows.slice(1).filter((l) => !isSep(l)).map(parseRow);
      blocks.push(
        <div key={`tbl-${i}`} className="my-8 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-navy-50">
                {header.map((h, hi) => (
                  <th key={hi} className="border border-navy-200 px-3 py-2 font-medium text-navy-800 text-start">
                    {processResearchInline(h, locale)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((r, ri) => (
                <tr key={ri} className={ri % 2 ? 'bg-white' : 'bg-navy-50/30'}>
                  {r.map((c, ci) => (
                    <td key={ci} className="border border-navy-200 px-3 py-2 text-navy-700 align-top leading-relaxed">
                      {processResearchInline(c, locale)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (para.startsWith('#### ')) {
      blocks.push(
        <h4 key={`h4-${i}`} id={`sec-${h++}`} className="scroll-mt-24 text-lg font-medium text-navy-700 mt-8 mb-3">
          {processResearchInline(para.slice(5).trim(), locale)}
        </h4>
      );
      continue;
    }

    if (para.startsWith('### ')) {
      blocks.push(
        <h3 key={`h3-${i}`} id={`sec-${h++}`} className="scroll-mt-24 text-xl sm:text-2xl font-medium text-navy-700 mt-10 mb-3">
          {processResearchInline(para.slice(4).trim(), locale)}
        </h3>
      );
      continue;
    }

    if (para.startsWith('## ')) {
      blocks.push(
        <h2 key={`h2-${i}`} id={`sec-${h++}`} className="scroll-mt-24 text-2xl sm:text-3xl font-medium text-navy-800 mt-12 mb-4 gold-line">
          {processResearchInline(para.slice(3).trim(), locale)}
        </h2>
      );
      continue;
    }

    if (para.startsWith('# ')) {
      blocks.push(
        <h2 key={`h1-${i}`} id={`sec-${h++}`} className="scroll-mt-24 text-2xl sm:text-3xl font-semibold text-navy-900 mt-14 mb-5 pb-2 border-b-2 border-gold-300">
          {processResearchInline(para.slice(2).trim(), locale)}
        </h2>
      );
      continue;
    }

    // Whole-paragraph italic (acknowledgments / signature)
    if (para.startsWith('*') && para.endsWith('*') && !para.startsWith('**')) {
      blocks.push(
        <p key={`it-${i}`} className="text-sm text-navy-500 italic leading-relaxed my-6">
          {processResearchInline(para.replace(/^\*+|\*+$/g, '').trim(), locale)}
        </p>
      );
      continue;
    }

    if (para.startsWith('> ')) {
      const quoteLines = para.split('\n').map((l) => l.replace(/^>\s?/, ''));
      blocks.push(
        <blockquote key={`q-${i}`} className="border-s-4 border-gold-400 ps-5 pe-5 py-3 my-6 bg-gold-50 text-navy-700 text-lg leading-loose">
          {quoteLines.map((line, idx) => (
            <span key={idx} className="block">{processResearchInline(line, locale)}</span>
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
            <li key={idx} className="text-navy-700 leading-relaxed flex gap-3 items-start">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
              <span>{processResearchInline(item, locale)}</span>
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
            <li key={idx} className="text-navy-700 leading-relaxed">{processResearchInline(item, locale)}</li>
          ))}
        </ol>
      );
      continue;
    }

    blocks.push(
      <p key={`p-${i}`} className="text-base sm:text-lg text-navy-700 leading-loose my-5">
        {processResearchInline(para, locale)}
      </p>
    );
  }

  return blocks;
}

function processResearchInline(text: string, _locale: string): ReactNode {
  const working = text.replace(/&nbsp;/g, ' ').replace(/\n/g, ' ').replace(/[ \t]+/g, ' ');
  const out: ReactNode[] = [];
  let key = 0;
  // Match **bold** or *italic* (italic not preceded/followed by *)
  const tokenRegex = /(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = tokenRegex.exec(working)) !== null) {
    if (match.index > lastIndex) out.push(working.slice(lastIndex, match.index));
    if (match[1]) {
      out.push(
        <strong key={`b-${key++}`} className="font-semibold text-navy-800">
          {match[1].slice(2, -2)}
        </strong>
      );
    } else if (match[2]) {
      out.push(
        <em key={`i-${key++}`} className="italic">
          {match[2].slice(1, -1)}
        </em>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < working.length) out.push(working.slice(lastIndex));
  return out;
}
