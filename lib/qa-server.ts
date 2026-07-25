import {
  loadLocalizedMarkdown,
  type LocalizedMarkdown,
} from './localized-content-server';

export function getQAContent(
  slug: string,
  locale: string
): LocalizedMarkdown | null {
  return loadLocalizedMarkdown({
    slug,
    locale,
    directories: ['qa'],
  });
}

export function getQABody(slug: string, locale: string): string | null {
  return getQAContent(slug, locale)?.body ?? null;
}
