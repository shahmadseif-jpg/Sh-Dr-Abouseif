import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { authorName, isSiteLocale } from '@/lib/seo';

/**
 * Any unknown path under a locale (/ar/whatever) renders the localized
 * app/[locale]/not-found.tsx inside the locale layout (so <html lang dir>
 * match the locale), with HTTP 404 and noindex — instead of Next's root
 * English 404. notFound() is thrown from the component, not from
 * generateMetadata: a metadata-time notFound() is handled by the root
 * boundary, outside the locale layout.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isSiteLocale(raw) ? raw : 'ar';
  const t = await getTranslations({ locale, namespace: 'not_found' });
  return {
    title: `${t('title')} — ${authorName(locale)}`,
    robots: { index: false, follow: true },
  };
}

export default function UnknownPath() {
  notFound();
}
