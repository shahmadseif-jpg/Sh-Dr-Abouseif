import {
  loadLocalizedMarkdown,
  type LocalizedMarkdown,
} from './localized-content-server';

export function getArticleContent(
  slug: string,
  locale: string
): LocalizedMarkdown | null {
  return loadLocalizedMarkdown({
    slug,
    locale,
    // Most legacy articles live at the repository root. Newer imports may
    // live under content/articles; both locations are part of the same store.
    directories: ['', 'content/articles'],
  });
}

export function getArticleBody(slug: string, locale: string): string | null {
  return getArticleContent(slug, locale)?.body ?? null;
}
