import { setRequestLocale, getTranslations } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import ConsultationsContent from '@/components/ConsultationsContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const site = await getTranslations({ locale, namespace: 'site' });
  return pageMetadata({
    locale,
    path: '/consultations',
    description: site('description'),
    title: `${locale === 'ar' ? 'الاستشارات الأسرية' : locale === 'es' ? 'Consultas familiares' : locale === 'ur' ? 'خاندانی مشاورت' : 'Family Consultations'} — ${
      locale === 'ar' ? 'د. أحمد أبو سيف' : locale === 'ur' ? 'ڈاکٹر احمد ابو سیف' : 'Dr. Ahmed Abouseif'
    }`,
  });
}

export default async function ConsultationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ConsultationsContent />;
}
