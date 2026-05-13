import { setRequestLocale, getTranslations } from 'next-intl/server';
import ConsultationsContent from '@/components/ConsultationsContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: `${locale === 'ar' ? 'الاستشارات الأسرية' : 'Family Consultations'} — ${
      locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'
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
