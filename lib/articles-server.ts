/**
 * Server-only article content loader.
 * Uses Node.js fs — must NOT be imported in client components.
 */
import fs from 'fs';
import path from 'path';

export function getArticleBody(slug: string, locale: string): string | null {
  // Markdown files live at the repository root (uploaded directly).
  // Spanish (and any future locale) falls back to English, then Arabic,
  // so a page never 404s while a translation is still in progress.
  const order =
    locale === 'ar'
      ? ['ar', 'en']
      : locale === 'es'
      ? ['es', 'en', 'ar']
      : ['en', 'ar'];

  for (const loc of order) {
    try {
      const filePath = path.join(process.cwd(), `${slug}.${loc}.md`);
      return fs.readFileSync(filePath, 'utf-8');
    } catch {
      // try next locale in the fallback order
    }
  }
  return null;
}
