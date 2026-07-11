/**
 * Server-only Q&A answer-body loader.
 * Uses Node.js fs — must NOT be imported in client components.
 * Answer markdown files live under `qa/<slug>.{ar,en,es}.md`.
 */
import fs from 'fs';
import path from 'path';

export function getQABody(slug: string, locale: string): string | null {
  const order =
    locale === 'ar'
      ? ['ar', 'en']
      : locale === 'es'
      ? ['es', 'en', 'ar']
      : locale === 'ur'
      ? ['ur', 'en', 'ar']
      : ['en', 'ar'];

  for (const loc of order) {
    try {
      const filePath = path.join(process.cwd(), 'qa', `${slug}.${loc}.md`);
      return fs.readFileSync(filePath, 'utf-8');
    } catch {
      // try next locale in the fallback order
    }
  }
  return null;
}
