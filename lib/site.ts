/**
 * Central site configuration (URL, identity).
 * Override the canonical URL by setting NEXT_PUBLIC_SITE_URL in the environment
 * (e.g. a custom domain). Falls back to the Vercel production URL.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://sh-dr-abouseif.vercel.app';

export const SITE_NAME = {
  ar: 'د. أحمد أبو سيف',
  en: 'Dr. Ahmed Abouseif',
} as const;
