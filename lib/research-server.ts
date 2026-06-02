/**
 * Server-only research full-text loader.
 * Uses Node.js fs — must NOT be imported in client components.
 */
import fs from 'fs';
import path from 'path';

export function getResearchBody(slug: string, locale: string): string | null {
  // Each locale shows its own full text; Spanish falls back to English then
  // Arabic, English falls back to Arabic, so a page is never empty while a
  // translation is still in progress.
  const order =
    locale === 'ar'
      ? ['ar', 'en']
      : locale === 'es'
      ? ['es', 'en', 'ar']
      : ['en', 'ar'];

  for (const loc of order) {
    try {
      // Full-text markdown lives in the research/ subfolder at the project root.
      const filePath = path.join(process.cwd(), 'research', `${slug}.${loc}.md`);
      return fs.readFileSync(filePath, 'utf-8');
    } catch {
      // try next locale in the fallback order
    }
  }
  return null;
}
