import { setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { fetchLatestOwnVideos, YouTubeVideo } from '@/lib/youtube';
import LectureFilters from '@/components/LectureFilters';
import { pageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

// Force dynamic rendering so YouTube fetch happens at request-time.
export const dynamic = 'force-dynamic';
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'lectures' });
  return pageMetadata({
    locale,
    path: '/lectures',
    title: `${t('title')} — ${locale === 'ar' ? 'د. أحمد أبو سيف' : locale === 'ur' ? 'ڈاکٹر احمد ابو سیف' : 'Dr. Ahmed Abouseif'}`,
    description: t('subtitle'),
  });
}

export default async function LecturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Fetch up to the RSS maximum (15) — guest-speaker videos are filtered out
  const videos = await fetchLatestOwnVideos(15);

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
          {/* Honest scope: the YouTube RSS feed exposes only the latest 15
              entries, so filtering/search below cover that window only. */}
          <p className="mt-4 text-sm text-navy-500 max-w-2xl mx-auto leading-relaxed">
            {t('window_note')}{' '}
            <a
              href={`${siteConfig.youtube.url}/videos`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-700 hover:text-gold-800 underline"
            >
              {t('archive_link')}
            </a>
          </p>
        </div>

        <LectureFilters videos={videos} locale={locale as 'ar' | 'en' | 'es' | 'ur'} />
      </div>
    </div>
  );
}
