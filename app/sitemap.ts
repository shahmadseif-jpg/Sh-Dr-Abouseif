import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { getAllKhawatir } from '@/lib/khawatir';
import { getAllResearch } from '@/lib/research';
import { SITE_URL } from '@/lib/site';

const LOCALES = ['ar', 'en', 'es'] as const;

// Static, indexable pages (relative to /{locale})
const STATIC_PATHS = [
  '',
  '/about',
  '/articles',
  '/khawatir',
  '/research',
  '/lectures',
  '/events',
  '/gallery',
  '/consultations',
  '/contact',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const locale of LOCALES) {
    // Static pages
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: path === '' ? 1 : 0.7,
      });
    }

    // Articles
    for (const a of getAllArticles()) {
      entries.push({
        url: `${SITE_URL}/${locale}/articles/${a.slug}`,
        lastModified: a.isoDate ? new Date(a.isoDate) : now,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    // Khawatir
    for (const k of getAllKhawatir()) {
      entries.push({
        url: `${SITE_URL}/${locale}/khawatir/${k.slug}`,
        lastModified: k.isoDate ? new Date(k.isoDate) : now,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    // Research
    for (const r of getAllResearch()) {
      entries.push({
        url: `${SITE_URL}/${locale}/research/${r.slug}`,
        lastModified: r.isoDate ? new Date(r.isoDate) : now,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
