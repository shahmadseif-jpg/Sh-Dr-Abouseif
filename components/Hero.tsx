'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="relative bg-gradient-to-b from-navy-50/40 to-white border-b border-navy-100">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-3">
            <div className="inline-block text-xs uppercase tracking-[0.2em] text-gold-500 mb-4 font-medium">
              {t('role')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-navy-700 leading-tight mb-6">
              {t('name')}
            </h1>
            <p className="text-base sm:text-lg text-navy-600 leading-relaxed max-w-xl mb-8">
              {t('description')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/lectures"
                className="inline-flex items-center gap-2 px-6 py-3 bg-navy-600 text-white text-sm font-medium rounded-md hover:bg-navy-700 transition-colors no-underline"
              >
                {t('cta_primary')}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  {locale === 'ar' ? (
                    <path d="M10 4L6 8l4 4" />
                  ) : (
                    <path d="M6 4l4 4-4 4" />
                  )}
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3 border border-navy-200 text-navy-600 text-sm font-medium rounded-md hover:bg-navy-50 transition-colors no-underline"
              >
                {t('cta_secondary')}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="relative">
              <div className="aspect-[4/5] rounded-lg overflow-hidden bg-navy-100 border border-navy-200">
                <img
                  src="/dr-ahmed.jpg"
                  alt={locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute -bottom-3 -end-3 w-24 h-1 bg-gold-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
