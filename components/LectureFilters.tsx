'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { YouTubeVideo, formatDate } from '@/lib/youtube';

export default function LectureFilters({
  videos,
  locale,
}: {
  videos: YouTubeVideo[];
  locale: 'ar' | 'en';
}) {
  const t = useTranslations('lectures');
  const tVideo = useTranslations('latest_videos');
  const [filter, setFilter] = useState<'all' | 'ar' | 'en'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      const matchesFilter = filter === 'all' || v.language === filter;
      const matchesSearch =
        !search || v.title.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [videos, filter, search]);

  const buttonStyle = (active: boolean) =>
    `px-4 py-2 text-sm rounded-md transition-colors ${
      active
        ? 'bg-navy-600 text-white'
        : 'bg-white text-navy-600 border border-navy-200 hover:bg-navy-50'
    }`;

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('search_placeholder')}
          className="flex-1 px-4 py-2 text-sm border border-navy-200 rounded-md focus:outline-none focus:border-navy-400"
        />
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className={buttonStyle(filter === 'all')}>
            {t('filter_all')}
          </button>
          <button onClick={() => setFilter('ar')} className={buttonStyle(filter === 'ar')}>
            {t('filter_arabic')}
          </button>
          <button onClick={() => setFilter('en')} className={buttonStyle(filter === 'en')}>
            {t('filter_english')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((video) => (
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
                {formatDate(video.publishedAt, locale)}
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-navy-500">
          {locale === 'ar' ? 'لا توجد نتائج مطابقة' : 'No matching results'}
        </div>
      )}
    </>
  );
}
