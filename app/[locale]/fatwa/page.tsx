import { setRequestLocale, getTranslations } from 'next-intl/server';
import FatwaContent from '@/components/FatwaContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'fatwa' });
  return {
    title: `${t('title')} — ${locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}`,
    description: t('subtitle'),
  };
}

export default async function FatwaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FatwaContent />;
}
