/**
 * Single publication gate for every content type (articles, khawatir,
 * research, Q&A).
 *
 * An item is public only when it is not marked `draft: true`. Every public
 * surface — per-slug lookups used by detail pages and their metadata, list
 * pages, the RSS feed, client search and the sitemap — goes through these
 * helpers (directly or via the get* functions in lib/articles.ts,
 * lib/khawatir.ts, lib/research.ts and lib/qa.ts), so a draft can never be
 * rendered just because its slug is known.
 *
 * Client-safe: no fs / server imports.
 */
export interface Publishable {
  slug: string;
  draft?: boolean;
}

export function isPublished<T extends Publishable>(item: T | null | undefined): item is T {
  return !!item && item.draft !== true;
}

/** Published items only, preserving order. */
export function published<T extends Publishable>(items: readonly T[]): T[] {
  return items.filter((item) => isPublished(item));
}

/** Look up a published item by slug; drafts resolve to undefined. */
export function findPublished<T extends Publishable>(items: readonly T[], slug: string): T | undefined {
  const item = items.find((entry) => entry.slug === slug);
  return isPublished(item) ? item : undefined;
}
