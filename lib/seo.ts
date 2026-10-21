/**
 * Canonical, hreflang, Open Graph and JSON-LD helpers.
 *
 * INDEXING POLICY (one place, used by every page's generateMetadata, the
 * sitemap and the RSS feed):
 *
 * 1. Static pages whose interface is fully translated (home, about, lists,
 *    contact, …) exist in all four locales. Each locale URL is canonical to
 *    itself and lists all four locales plus x-default as alternates.
 *
 * 2. Content pages (articles, khawatir, research, Q&A) have a language
 *    version only where a Markdown body exists in that language
 *    (lib/content-availability-server.ts). Research items with no Markdown
 *    body at all are abstract pages; they count as available in a locale
 *    only when their title and abstract are written in that locale.
 *    - Requested locale available  -> canonical = own URL; hreflang = the
 *      available locales only, plus x-default.
 *    - Requested locale NOT available (the page shows the Arabic — or other
 *      fallback — body with a language notice) -> canonical = the URL of the
 *      language actually shown (normally Arabic); no hreflang on the
 *      fallback URL; the fallback URL is left out of the sitemap, of the
 *      feed for that locale and of other pages' hreflang sets.
 *
 * 3. x-default points to the Arabic version (the authoritative master text)
 *    when it exists, otherwise to the first available version.
 *
 * 4. /search (and any query variant) is noindex,follow.
 *
 * Pure module (no fs, no next-intl) so scripts/check-seo.mjs can assert it.
 */
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from './site';

export const SITE_LOCALES = ['ar', 'en', 'es', 'ur'] as const;
export type SiteLocale = (typeof SITE_LOCALES)[number];

export const OG_LOCALE: Record<SiteLocale, string> = {
  ar: 'ar_EG',
  en: 'en_US',
  es: 'es_ES',
  ur: 'ur_PK',
};

export const DEFAULT_OG_IMAGE = '/dr-ahmed.jpg';

export function isSiteLocale(value: string): value is SiteLocale {
  return (SITE_LOCALES as readonly string[]).includes(value);
}

export function localizedPath(locale: string, path: string): string {
  return `/${locale}${path}`;
}

export function absoluteUrl(pathOrUrl: string): string {
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${SITE_URL}${pathOrUrl}`;
}

export function authorName(locale: string): string {
  return (SITE_NAME as Record<string, string>)[locale] ?? SITE_NAME.ar;
}

export interface LanguagePolicy {
  /** Canonical path for the requested URL. */
  canonical: string;
  /** hreflang map (empty when the URL is a fallback that canonicalizes elsewhere). */
  languages: Record<string, string>;
  /** True when the requested locale has its own version of the content. */
  isOwnVersion: boolean;
  /** Locale of the content actually shown at this URL. */
  contentLocale: SiteLocale;
}

/**
 * Apply the policy above. `available` defaults to all locales (static pages).
 * `resolvedLocale` is the language actually rendered at this URL when the
 * requested one is missing (defaults to Arabic, then the first available).
 */
export function languagePolicy(opts: {
  locale: string;
  path: string;
  available?: readonly string[];
  resolvedLocale?: string;
}): LanguagePolicy {
  const available = (opts.available ?? SITE_LOCALES).filter(isSiteLocale);
  const order = SITE_LOCALES.filter((l) => available.includes(l));
  const requested = isSiteLocale(opts.locale) ? opts.locale : 'ar';

  if (order.includes(requested)) {
    const languages: Record<string, string> = {};
    for (const l of order) languages[l] = localizedPath(l, opts.path);
    languages['x-default'] = localizedPath(order.includes('ar') ? 'ar' : order[0], opts.path);
    return { canonical: localizedPath(requested, opts.path), languages, isOwnVersion: true, contentLocale: requested };
  }

  const fallback =
    opts.resolvedLocale && isSiteLocale(opts.resolvedLocale) && order.includes(opts.resolvedLocale)
      ? opts.resolvedLocale
      : order.includes('ar')
        ? 'ar'
        : order[0] ?? 'ar';
  return { canonical: localizedPath(fallback, opts.path), languages: {}, isOwnVersion: false, contentLocale: fallback };
}

export interface PageSeoOptions {
  locale: string;
  /** Path after the locale prefix, e.g. "/articles/slug" ("" for home). */
  path: string;
  title: string;
  description?: string;
  available?: readonly string[];
  resolvedLocale?: string;
  ogType?: 'website' | 'article';
  image?: string;
  publishedTime?: string;
  noindex?: boolean;
}

/** Full per-page metadata: canonical, hreflang, OG and Twitter for this URL. */
export function pageMetadata(opts: PageSeoOptions): Metadata {
  const policy = languagePolicy(opts);
  const image = opts.image || DEFAULT_OG_IMAGE;
  const author = authorName(opts.locale);
  const meta: Metadata = {
    title: opts.title,
    ...(opts.description ? { description: opts.description } : {}),
    alternates: {
      canonical: policy.canonical,
      ...(Object.keys(policy.languages).length ? { languages: policy.languages } : {}),
    },
    openGraph: {
      type: opts.ogType ?? 'website',
      title: opts.title,
      ...(opts.description ? { description: opts.description } : {}),
      url: policy.canonical,
      siteName: author,
      locale: OG_LOCALE[policy.contentLocale],
      images: [{ url: image }],
      ...(opts.ogType === 'article' && opts.publishedTime
        ? { publishedTime: opts.publishedTime, authors: [author] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      ...(opts.description ? { description: opts.description } : {}),
      images: [image],
    },
  };
  if (opts.noindex) meta.robots = { index: false, follow: true };
  return meta;
}

/**
 * Serialize JSON-LD for an inline <script type="application/ld+json">.
 * "<" is escaped as < (also ">" "&" U+2028 U+2029) so no field value
 * can close the script element; the JSON stays equivalent.
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/** RFC 822 date for RSS from a YYYY-MM-DD publication date. Only the day is
 *  known, so the time is 00:00 GMT by convention (no invented precision). */
export function rssDate(isoDate: string | undefined): string | null {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
  const d = new Date(`${isoDate}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d.toUTCString();
}
