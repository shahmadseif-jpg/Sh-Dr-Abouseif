import type { MetadataRoute } from 'next';
import { articlePageCount, articlePagePath } from '@/lib/article-pagination';
import { getAllArticles } from '@/lib/articles';
import { getAllKhawatir } from '@/lib/khawatir';
import { getAllResearch } from '@/lib/research';
import { getAllQA } from '@/lib/qa';
import { SITE_URL } from '@/lib/site';
import { SITE_LOCALES, languagePolicy } from '@/lib/seo';
import { availableLocales, type ContentKind } from '@/lib/content-availability-server';

// Static, indexable pages (relative to /{locale}). /search is deliberately
// absent (noindex); /cv is a redirect to /about.
const STATIC_PATHS = [
  '',
  '/about',
  '/articles',
  '/khawatir',
  '/research',
  '/qa',
  '/fatwa',
  '/how-we-answer',
  '/project',
  '/lectures',
  '/events',
  '/gallery',
  '/consultations',
  '/contact',
];

/**
 * Sitemap policy (see lib/seo.ts):
 * - only published items (get* helpers apply the draft gate);
 * - a content URL is listed only for languages that really have the text;
 *   Arabic-fallback URLs are omitted (they canonicalize to the Arabic page);
 * - each entry carries the same hreflang set as the page itself;
 * - no lastModified: the metadata records publication dates only, and the
 *   build time is not an editorial modification date.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const abs = (p: string) => `${SITE_URL}${p}`;
  const withAbsolute = (languages: Record<string, string>) =>
    Object.fromEntries(Object.entries(languages).map(([k, v]) => [k, abs(v)]));

  const archivePaths = Array.from({ length: articlePageCount(getAllArticles().length) - 1 }, (_, i) => articlePagePath(i + 2));
  for (const path of [...STATIC_PATHS, ...archivePaths]) {
    for (const locale of SITE_LOCALES) {
      const policy = languagePolicy({ locale, path });
      entries.push({
        url: abs(policy.canonical),
        changeFrequency: 'weekly',
        priority: path === '' ? 1 : 0.7,
        alternates: { languages: withAbsolute(policy.languages) },
      });
    }
  }

  const groups: { kind: ContentKind; base: string; priority: number; items: { slug: string; title?: unknown; abstract?: unknown }[] }[] = [
    { kind: 'articles', base: '/articles', priority: 0.8, items: getAllArticles() },
    { kind: 'khawatir', base: '/khawatir', priority: 0.6, items: getAllKhawatir() },
    { kind: 'research', base: '/research', priority: 0.6, items: getAllResearch() },
    { kind: 'qa', base: '/qa', priority: 0.6, items: getAllQA() },
  ];

  for (const group of groups) {
    for (const item of group.items) {
      const available = availableLocales(
        group.kind,
        item.slug,
        item as Parameters<typeof availableLocales>[2]
      );
      for (const locale of available) {
        const policy = languagePolicy({ locale, path: `${group.base}/${item.slug}`, available });
        entries.push({
          url: abs(policy.canonical),
          changeFrequency: 'monthly',
          priority: group.priority,
          alternates: { languages: withAbsolute(policy.languages) },
        });
      }
    }
  }

  return entries;
}
