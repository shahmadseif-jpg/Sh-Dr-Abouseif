/**
 * Server-only khatra content loader.
 * Uses Node.js fs — must NOT be imported in client components.
 */
import fs from 'fs';
import path from 'path';

export function getKhatraBody(slug: string, locale: 'ar' | 'en'): string | null {
  try {
    // Khatra transcripts live in the khawatir/ subfolder at the project root
    const filePath = path.join(process.cwd(), 'khawatir', `${slug}.${locale}.md`);
    return fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    return null;
  }
}
