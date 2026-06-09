/**
 * Client-safe unified search index over articles, research, and khawatir.
 * Builds from existing metadata (lib/*.ts) — no fs, no external deps.
 * Arabic-aware normalization tolerates diacritics, tatweel, and letter variants.
 */
import { getAllArticles, localize } from './articles';
import { getAllResearch } from './research';
import { getAllKhawatir } from './khawatir';

export type SearchType = 'article' | 'research' | 'khatra';

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

/** Normalize text for tolerant matching (Arabic + Latin). */
export function normalize(s: string | undefined): string {
  return (s || '')
    .toLowerCase()
    // strip Arabic diacritics (harakat), superscript alif, and tatweel
    .replace(/[ً-ْٰـ]/g, '')
    // unify alif / ya / waw-hamza / ta-marbuta variants
    .replace(/[آأإا]/g, 'ا') // آأإا -> ا
    .replace(/[ىي]/g, 'ي') // ى ي -> ي
    .replace(/ؤ/g, 'و') // ؤ -> و
    .replace(/ئ/g, 'ي') // ئ -> ي
    .replace(/ة/g, 'ه') // ة -> ه
    .replace(/\s+/g, ' ')
    .trim();
}

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

  return [...articles, ...research, ...khawatir];
}

/** Search the index: every term must appear; title matches rank higher. */
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
  return scored.sort((a, b) => b.score - a.score).map((x) => x.h).slice(0, 40);
}
