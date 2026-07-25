import { setRequestLocale, getTranslations } from 'next-intl/server';
import ConsultationsContent from '@/components/ConsultationsContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: `${locale === 'ar' ? 'الاستشارات الأسرية' : locale === 'es' ? 'Consultas familiares' : locale === 'ur' ? 'خاندانی مشاورت' : 'Family Consultations'} — ${
      locale === 'ar' ? 'د. أحمد أبو سيف' : locale === 'ur' ? 'ڈاکٹر احمد ابو سیف' : 'Dr. Ahmed Abouseif'
    }`,
  };
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
