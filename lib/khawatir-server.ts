import {
  loadLocalizedMarkdown,
  type LocalizedMarkdown,
} from './localized-content-server';

export function getKhatraContent(
  slug: string,
  locale: string
): LocalizedMarkdown | null {
  return loadLocalizedMarkdown({
    slug,
    locale,
    directories: ['khawatir'],
  });
}

export function getKhatraBody(slug: string, locale: string): string | null {
  return getKhatraContent(slug, locale)?.body ?? null;
}
