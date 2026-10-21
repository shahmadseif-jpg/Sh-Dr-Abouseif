/**
 * Locale helpers with no content data attached, so client components can use
 * them without pulling the article/lecture metadata into their bundle
 * (importing `localize` from lib/articles.ts shipped ~650 kB of metadata to
 * the khawatir and research list pages).
 */

/** Supported site locales. */
export type Loc = 'ar' | 'en' | 'es' | 'ur';

/** A localized string. `es` and `ur` are optional; Arabic is the canonical fallback. */
export type LocalizedText = { ar: string; en: string; es?: string; ur?: string };

/** Pick the value for a locale, gracefully falling back to Arabic then English. */
export function localize(text: LocalizedText | undefined, locale: string): string {
  if (!text) return '';
  const v = (text as Record<string, string | undefined>)[locale];
  return v ?? text.ar ?? text.en;
}
