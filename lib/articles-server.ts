/**
 * Server-only article content loader.
 * Uses Node.js fs — must NOT be imported in client components.
 */
import fs from 'fs';
import path from 'path';

export function getArticleBody(slug: string, locale: 'ar' | 'en'): string | null {
  try {
    // Markdown files live at the repository root (uploaded directly)
    const filePath = path.join(process.cwd(), `${slug}.${locale}.md`);
    return fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    return null;
  }
}
