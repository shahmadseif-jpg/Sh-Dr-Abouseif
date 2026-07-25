/**
 * Shared server-only loader for localized Markdown content.
 *
 * The requested locale is always tried first. Arabic is the canonical source
 * and therefore the first fallback. English is retained only as a final,
 * explicit availability fallback for legacy items whose Arabic source file is
 * not yet present.
 */
import fs from 'fs';
import path from 'path';

export const CONTENT_LOCALES = ['ar', 'en', 'es', 'ur'] as const;

export type ContentLocale = (typeof CONTENT_LOCALES)[number];

export interface LocalizedMarkdown {
  body: string;
  requestedLocale: ContentLocale;
  resolvedLocale: ContentLocale;
  isFallback: boolean;
}

interface LoadLocalizedMarkdownOptions {
  slug: string;
  locale: string;
  directories: string[];
}

function normalizeLocale(locale: string): ContentLocale {
  return CONTENT_LOCALES.includes(locale as ContentLocale)
    ? (locale as ContentLocale)
    : 'ar';
}

export function getContentLocaleOrder(locale: string): ContentLocale[] {
  const requestedLocale = normalizeLocale(locale);
  return [...new Set<ContentLocale>([requestedLocale, 'ar', 'en'])];
}

export function loadLocalizedMarkdown({
  slug,
  locale,
  directories,
}: LoadLocalizedMarkdownOptions): LocalizedMarkdown | null {
  // Route slugs are deliberately restricted before they reach the filesystem.
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;

  const requestedLocale = normalizeLocale(locale);

  for (const resolvedLocale of getContentLocaleOrder(requestedLocale)) {
    for (const directory of directories) {
      const filePath = path.join(
        process.cwd(),
        directory,
        `${slug}.${resolvedLocale}.md`
      );

      try {
        return {
          body: fs.readFileSync(filePath, 'utf-8'),
          requestedLocale,
          resolvedLocale,
          isFallback: requestedLocale !== resolvedLocale,
        };
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      }
    }
  }

  return null;
}
