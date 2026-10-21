/**
 * Which languages really exist for a content item (server-only: uses fs).
 *
 * A locale is "available" when a Markdown body file exists in that language
 * in the same directories the page loader reads (lib/*-server.ts). Fallback
 * rendering (Arabic shown under /en/…, /es/…, /ur/…) does not make a
 * language available. See the indexing policy in lib/seo.ts.
 */
import fs from 'fs';
import path from 'path';
import { CONTENT_LOCALES, type ContentLocale } from './localized-content-server';

export const CONTENT_DIRECTORIES = {
  articles: ['', 'content/articles'],
  khawatir: ['khawatir'],
  qa: ['qa'],
  research: ['research'],
} as const;

export type ContentKind = keyof typeof CONTENT_DIRECTORIES;

const cache = new Map<string, ContentLocale[]>();

/** Locales with a physical Markdown body for this slug, in site order. */
export function bodyLocales(kind: ContentKind, slug: string): ContentLocale[] {
  const key = `${kind}:${slug}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const found = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    ? CONTENT_LOCALES.filter((locale) =>
        CONTENT_DIRECTORIES[kind].some((dir) =>
          fs.existsSync(path.join(process.cwd(), dir, `${slug}.${locale}.md`))
        )
      )
    : [];
  cache.set(key, found);
  return found;
}

type Localized = Partial<Record<ContentLocale, string>> | undefined;

/**
 * Locales in which the item can be indexed. Normally the body locales.
 * A research item with no Markdown body at all is an abstract page: it is
 * available where both its title and abstract are written in that locale.
 */
export function availableLocales(
  kind: ContentKind,
  slug: string,
  meta?: { title?: Localized; abstract?: Localized }
): ContentLocale[] {
  const bodies = bodyLocales(kind, slug);
  if (bodies.length || kind !== 'research' || !meta) return bodies;
  return CONTENT_LOCALES.filter((l) => Boolean(meta.title?.[l]) && Boolean(meta.abstract?.[l]));
}
