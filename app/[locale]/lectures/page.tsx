import { setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { fetchLatestVideos, formatDate, YouTubeVideo } from '@/lib/youtube';
import LectureFilters from '@/components/LectureFilters';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'lectures' });
  return { title: `${t('title')} — ${locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}` };
}

export default async function LecturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const videos = await fetchLatestVideos(15);

  return <LecturesContent videos={videos} />;
}

function LecturesContent({ videos }: { videos: YouTubeVideo[] }) {
  const t = useTranslations('lectures');
  const locale = useLocale();

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <LectureFilters videos={videos} locale={locale as 'ar' | 'en'} />
      </div>
    </div>
  );
}
