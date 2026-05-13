import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { fetchLatestVideos, formatDate } from '@/lib/youtube';

export default async function LatestVideos() {
  const t = await getTranslations('latest_videos');
  const locale = await getLocale();
  const videos = await fetchLatestVideos(6);

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 bg-navy-50/30">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-medium text-navy-700 mb-2 gold-line">
              {t('title')}
            </h2>
            <p className="text-base text-navy-600">{t('subtitle')}</p>
          </div>
          <Link
            href="/lectures"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy-600 hover:text-navy-700 no-underline whitespace-nowrap"
          >
            {t('watch_all')}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              {locale === 'ar' ? <path d="M9 3L5 7l4 4" /> : <path d="M5 3l4 4-4 4" />}
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover group bg-white rounded-lg overflow-hidden border border-navy-100 no-underline"
            >
              <div className="aspect-video bg-navy-100 overflow-hidden relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 end-2 px-2 py-1 bg-black/60 text-white text-[10px] rounded">
                  {video.language === 'ar' ? 'عربي' : 'English'}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-medium text-navy-700 line-clamp-2 mb-2 leading-snug">
                  {video.title}
                </h3>
                <div className="text-xs text-navy-500">
                  {formatDate(video.publishedAt, locale as 'ar' | 'en')}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
