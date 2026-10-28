import { setRequestLocale, getTranslations } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import ArticlesIndex from '@/components/ArticlesIndex';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'articles' });
  const site = await getTranslations({ locale, namespace: 'site' });
  return pageMetadata({ locale, path: '/articles', title: `${t('title')} — ${locale === 'ar' ? 'د. أحمد أبو سيف' : locale === 'ur' ? 'ڈاکٹر احمد ابو سیف' : 'Dr. Ahmed Abouseif'}`, description: site('description') });
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ArticlesIndex />;
}
