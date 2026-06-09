import { setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import SearchBox from '@/components/SearchBox';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'search' });
  return {
    title: `${t('title')} — ${locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}`,
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);
  return <SearchContent initialQuery={q ?? ''} />;
}

function SearchContent({ initialQuery }: { initialQuery: string }) {
  const t = useTranslations('search');

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-4">{t('title')}</h1>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto leading-relaxed">{t('subtitle')}</p>
        </div>

        <SearchBox initialQuery={initialQuery} />
      </div>
    </div>
  );
}
