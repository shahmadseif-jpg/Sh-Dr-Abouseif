'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  getGalleryItems,
  galleryCategories,
  type GalleryCategory,
  type GalleryItem,
} from '@/lib/gallery';

type Filter = 'all' | GalleryCategory;

export default function GalleryGrid() {
  const t = useTranslations('gallery');
  const ui = useTranslations('ui');
  const uiLocale = useLocale();
  // Gallery metadata (alt/caption/location) exists only in Arabic and English
  // (LANG-116, content gap for the owner). Spanish readers get the English
  // text, Urdu readers the Arabic text, and the fragment is tagged with its
  // real language so assistive tech pronounces it correctly.
  const locale = (uiLocale === 'en' || uiLocale === 'es' ? 'en' : 'ar') as 'ar' | 'en';
  const metaLang = locale;
  const metaDir = locale === 'ar' ? 'rtl' : 'ltr';
  const dateLocale =
    uiLocale === 'ar' ? 'ar-EG' : uiLocale === 'es' ? 'es-ES' : uiLocale === 'ur' ? 'ur-PK' : 'en-US';
  const [filter, setFilter] = useState<Filter>('all');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const open = (item: GalleryItem, trigger: HTMLElement) => {
    returnFocusRef.current = trigger;
    setLightbox(item);
  };
  const close = () => setLightbox(null);

  // Dialog focus management: focus the close button on open, keep Tab inside
  // the dialog, close on Escape, and give focus back to the thumbnail.
  useEffect(() => {
    if (!lightbox) {
      returnFocusRef.current?.focus();
      return;
    }
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setLightbox(null);
      } else if (e.key === 'Tab') {
        // The close button is the only focusable control in the dialog.
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox]);

  const all = useMemo(() => getGalleryItems(), []);
  const filtered = useMemo(
    () => (filter === 'all' ? all : all.filter((g) => g.category === filter)),
    [all, filter]
  );

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            label={t('all')}
          />
          {galleryCategories.map((cat) => (
            <FilterButton
              key={cat}
              active={filter === cat}
              onClick={() => setFilter(cat)}
              label={t(`categories.${cat}`)}
            />
          ))}
        </div>

        {/* Grid or empty state */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 mb-6 text-navy-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <p className="text-navy-500 text-lg">{t('empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((item, idx) => (
              <button
                type="button"
                key={`${item.src}-${idx}`}
                onClick={(e) => open(item, e.currentTarget)}
                aria-haspopup="dialog"
                className="group relative aspect-square overflow-hidden rounded-lg bg-navy-50 border border-navy-100 transition-shadow hover:shadow-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.alt[locale]}
                  lang={metaLang}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {item.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900/90 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p lang={metaLang} dir={metaDir} className="text-white text-sm font-medium text-start leading-snug">
                      {item.caption[locale]}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightbox && (
          <div
            onClick={close}
            className="dark-surface fixed inset-0 z-50 flex items-center justify-center bg-navy-900/90 p-4 cursor-pointer"
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.caption?.[locale] || lightbox.alt[locale] || ui('imageViewer')}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="absolute top-4 end-4 h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
              aria-label={ui('close')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full bg-navy-900 rounded-xl overflow-hidden cursor-default"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightbox.src}
                alt={lightbox.alt[locale]}
                lang={metaLang}
                className="w-full max-h-[75vh] object-contain bg-black"
              />
              {(lightbox.caption || lightbox.location || lightbox.isoDate) && (
                <div className="p-5 text-white">
                  {lightbox.caption && (
                    <p lang={metaLang} dir={metaDir} className="text-base sm:text-lg leading-relaxed mb-2">
                      {lightbox.caption[locale]}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/70">
                    {lightbox.location?.[locale] && (
                      <span lang={metaLang}>{lightbox.location[locale]}</span>
                    )}
                    {lightbox.isoDate && (
                      <span>
                        {new Date(lightbox.isoDate).toLocaleDateString(
                          dateLocale,
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[44px] px-4 py-1.5 text-sm rounded-full border transition-colors ${
        active
          ? 'bg-navy-700 text-white border-navy-700'
          : 'bg-white text-navy-600 border-navy-200 hover:bg-navy-50'
      }`}
    >
      {label}
    </button>
  );
}
