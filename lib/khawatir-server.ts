/**
 * Server-only khatra content loader.
 * Uses Node.js fs — must NOT be imported in client components.
 */
import fs from 'fs';
import path from 'path';

export function getKhatraBody(slug: string, locale: string): string | null {
  // Spanish (and any future locale) falls back to English, then Arabic.
  const order =
    locale === 'ar'
      ? ['ar', 'en']
      : locale === 'es'
      ? ['es', 'en', 'ar']
      : ['en', 'ar'];

  for (const loc of order) {
    try {
      // Khatra transcripts live in the khawatir/ subfolder at the project root
      const filePath = path.join(process.cwd(), 'khawatir', `${slug}.${loc}.md`);
      return fs.readFileSync(filePath, 'utf-8');
    } catch {
      // try next locale in the fallback order
    }
  }
  return null;
}
