import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { authorName, isSiteLocale } from '@/lib/seo';

// Localized 404 rendered inside app/[locale]/layout.tsx, so the document
// keeps <html lang dir> for the requested locale. Status stays 404.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isSiteLocale(raw) ? raw : 'ar';
  const t = await getTranslations({ locale, namespace: 'not_found' });
  return {
    title: `${t('title')} — ${authorName(locale)}`,
    robots: { index: false, follow: true },
  };
}

export default function NotFound() {
  const t = useTranslations('not_found');
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-medium text-gold-700 mb-3">404</p>
        <h1 className="text-3xl sm:text-4xl font-medium text-navy-700 mb-4">{t('title')}</h1>
        <p className="text-lg text-navy-600 leading-relaxed mb-10">{t('body')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-navy-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-800 transition-colors no-underline"
          >
            {t('home')}
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center rounded-full border border-navy-200 px-6 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors no-underline"
          >
            {t('search')}
          </Link>
        </div>
      </div>
    </div>
  );
}
