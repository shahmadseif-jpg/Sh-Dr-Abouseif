'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { YouTubeVideo, VideoType, formatDate } from '@/lib/youtube';

type LangFilter = 'all' | 'ar' | 'en';
type TypeFilter = 'all' | VideoType;

export default function LectureFilters({
  videos,
  locale,
}: {
  videos: YouTubeVideo[];
  locale: 'ar' | 'en' | 'es';
}) {
  const t = useTranslations('lectures');
  const [langFilter, setLangFilter] = useState<LangFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      const matchesLang = langFilter === 'all' || v.language === langFilter;
      const matchesType = typeFilter === 'all' || v.type === typeFilter;
      const matchesSearch =
        !search || v.title.toLowerCase().includes(search.toLowerCase());
      return matchesLang && matchesType && matchesSearch;
    });
  }, [videos, langFilter, typeFilter, search]);

  const buttonStyle = (active: boolean) =>
    `px-4 py-2 text-sm rounded-md transition-colors ${
      active
        ? 'bg-navy-600 text-white'
        : 'bg-white text-navy-600 border border-navy-200 hover:bg-navy-50'
    }`;

  // Badge color per video type — matches the visual taxonomy:
  // lecture → green, khutbah → blue, khatira → amber.
  const typeBadgeStyle = (type?: VideoType) => {
    switch (type) {
      case 'khutbah':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'khatira':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'lecture':
      default:
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    }
  };

  const typeLabel = (type?: VideoType): string => {
    switch (type) {
      case 'khutbah':
        return t('type_khutbah');
      case 'khatira':
        return t('type_khatira');
      case 'lecture':
      default:
        return t('type_lecture');
    }
  };

  return (
    <>
      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('search_placeholder')}
          className="w-full px-4 py-2 text-sm border border-navy-200 rounded-md focus:outline-none focus:border-navy-400"
        />
      </div>

      {/* Type filter row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs text-navy-500 me-1">{t('label_type')}:</span>
        <button
          onClick={() => setTypeFilter('all')}
          className={buttonStyle(typeFilter === 'all')}
        >
          {t('type_all')}
        </button>
        <button
          onClick={() => setTypeFilter('lecture')}
          className={buttonStyle(typeFilter === 'lecture')}
        >
          {t('type_lecture')}
        </button>
        <button
          onClick={() => setTypeFilter('khutbah')}
          className={buttonStyle(typeFilter === 'khutbah')}
        >
          {t('type_khutbah')}
        </button>
        <button
          onClick={() => setTypeFilter('khatira')}
          className={buttonStyle(typeFilter === 'khatira')}
        >
          {t('type_khatira')}
        </button>
      </div>

      {/* Language filter row */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs text-navy-500 me-1">{t('label_language')}:</span>
        <button
          onClick={() => setLangFilter('all')}
          className={buttonStyle(langFilter === 'all')}
        >
          {t('filter_all')}
        </button>
        <button
          onClick={() => setLangFilter('ar')}
          className={buttonStyle(langFilter === 'ar')}
        >
          {t('filter_arabic')}
        </button>
        <button
          onClick={() => setLangFilter('en')}
          className={buttonStyle(langFilter === 'en')}
        >
          {t('filter_english')}
        </button>
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
            <div
              className="aspect-video bg-navy-100 overflow-hidden relative bg-cover bg-center"
              style={{ backgroundImage: `url(${video.thumbnailFallback})` }}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 end-2 px-2 py-1 bg-black/60 text-white text-[10px] rounded">
                {video.language === 'ar' ? (locale === 'ar' ? 'عربي' : locale === 'es' ? 'Árabe' : 'Arabic') : (locale === 'ar' ? 'إنجليزي' : locale === 'es' ? 'Inglés' : 'English')}
              </div>
            </div>
            <div className="p-5">
              <div className="mb-2">
                <span
                  className={`inline-block px-2 py-0.5 text-[11px] rounded-full ${typeBadgeStyle(
                    video.type
                  )}`}
                >
                  {typeLabel(video.type)}
                </span>
              </div>
              <h3 className="text-base font-medium text-navy-700 line-clamp-2 mb-2 leading-snug">
                {video.title}
              </h3>
              <div className="text-xs text-navy-500">
                {formatDate(video.publishedAt, locale === 'es' ? 'en' : locale)}
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-navy-500">
          {locale === 'ar' ? 'لا توجد نتائج مطابقة' : locale === 'es' ? 'No hay resultados coincidentes' : 'No matching results'}
        </div>
      )}
    </>
  );
}
