/**
 * Client-safe unified search index over articles, research, khawatir and
 * Q&A. Builds from existing metadata (lib/*.ts) — titles, subtitles,
 * excerpts/abstracts/summaries and keywords; NOT the full Markdown text and
 * NOT the video library (the search page states this scope).
 * No fs, no external deps. Arabic-aware normalization tolerates diacritics,
 * tatweel, and letter variants.
 *
 * This module pulls in all content metadata, so components/SearchBox.tsx
 * imports it dynamically on the first search interaction only.
 */
import { getAllArticles, localize } from './articles';
import { getAllResearch } from './research';
import { getAllKhawatir } from './khawatir';
import { getAllQA } from './qa';

export type SearchType = 'article' | 'research' | 'khatra' | 'qa';

export interface Hit {
  type: SearchType;
  slug: string;
  url: string;
  title: string;
  subtitle: string;
  snippet: string;
  /** normalized searchable blob */
  blob: string;
}

import { normalize } from './search-normalize';
export { normalize } from './search-normalize';

function clip(s: string, n = 180): string {
  if (!s) return '';
  return s.length > n ? s.slice(0, n).trim() + '…' : s;
}

/** Build the full index for a given locale. Cheap; safe to memoize in a component. */
export function buildIndex(locale: string): Hit[] {
  const articles: Hit[] = getAllArticles().map((a) => {
    const title = localize(a.title, locale);
    const subtitle = localize(a.subtitle, locale);
    const excerpt = localize(a.excerpt, locale);
    const series = localize(a.series, locale);
    return {
      type: 'article',
      slug: a.slug,
      url: `/articles/${a.slug}`,
      title,
      subtitle,
      snippet: clip(excerpt),
      blob: normalize([title, subtitle, excerpt, series].join(' ')),
    };
  });

  const research: Hit[] = getAllResearch().map((r) => {
    const title = localize(r.title, locale);
    const subtitle = localize(r.subtitle, locale);
    const abstract = localize(r.abstract, locale);
    const kwMap = r.keywords as Record<string, string[] | undefined> | undefined;
    const kw = (kwMap && (kwMap[locale] || kwMap.en)) || [];
    return {
      type: 'research',
      slug: r.slug,
      url: `/research/${r.slug}`,
      title,
      subtitle,
      snippet: clip(abstract),
      blob: normalize([title, subtitle, abstract, kw.join(' ')].join(' ')),
    };
  });

  const khawatir: Hit[] = getAllKhawatir().map((k) => {
    const title = localize(k.title, locale);
    const subtitle = localize(k.subtitle, locale);
    const excerpt = localize(k.excerpt, locale);
    return {
      type: 'khatra',
      slug: k.slug,
      url: `/khawatir/${k.slug}`,
      title,
      subtitle,
      snippet: clip(excerpt),
      blob: normalize([title, subtitle, excerpt].join(' ')),
    };
  });

  const qa: Hit[] = getAllQA().map((q) => {
    const title = localize(q.question, locale);
    const summary = localize(q.summary, locale);
    return {
      type: 'qa',
      slug: q.slug,
      url: `/qa/${q.slug}`,
      title,
      subtitle: '',
      snippet: clip(summary),
      blob: normalize([title, summary, (q.tags ?? []).join(' ')].join(' ')),
    };
  });

  return [...articles, ...research, ...khawatir, ...qa];
}

/**
 * Search the index: every term must appear; title matches rank higher.
 * Returns ALL matches (ranked); the caller decides how many to display and
 * shows the total, so results are never silently truncated.
 */
export function searchIndex(index: Hit[], q: string): Hit[] {
  const terms = normalize(q).split(' ').filter(Boolean);
  if (!terms.length) return [];
  const scored: { h: Hit; score: number }[] = [];
  for (const h of index) {
    let score = 0;
    let ok = true;
    const nTitle = normalize(h.title);
    for (const t of terms) {
      if (!h.blob.includes(t)) {
        ok = false;
        break;
      }
      score += nTitle.includes(t) ? 3 : 1;
    }
    if (ok) scored.push({ h, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((x) => x.h);
}
