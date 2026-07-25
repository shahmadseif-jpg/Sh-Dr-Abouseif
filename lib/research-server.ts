import {
  loadLocalizedMarkdown,
  type LocalizedMarkdown,
} from './localized-content-server';

export function getResearchContent(
  slug: string,
  locale: string
): LocalizedMarkdown | null {
  return loadLocalizedMarkdown({
    slug,
    locale,
    directories: ['research'],
  });
}

export function getResearchBody(slug: string, locale: string): string | null {
  return getResearchContent(slug, locale)?.body ?? null;
}
