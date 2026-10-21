'use client';

import { useTranslations, useLocale } from 'next-intl';
import { siteConfig } from '@/lib/site-config';

export default function FacebookEmbed() {
  const locale = useLocale();
  const fbUrl = encodeURIComponent(siteConfig.social.facebook);
  const fbPluginSrc = `https://www.facebook.com/plugins/page.php?href=${fbUrl}&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&locale=${
    locale === 'ar' ? 'ar_AR' : locale === 'es' ? 'es_ES' : locale === 'ur' ? 'ur_PK' : 'en_US'
  }`;

  const t = useTranslations('ui');
  const title = t('fbTitle');
  const subtitle = t('fbSubtitle');
  const points = [t('fbPoint1'), t('fbPoint2'), t('fbPoint3')];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-navy-100">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-12 h-1 bg-gold-400 mb-5" />
            <h2 className="text-3xl sm:text-4xl font-medium text-navy-700 mb-3">
              {title}
            </h2>
            <p className="text-base text-navy-600 leading-relaxed mb-6">
              {subtitle}
            </p>
            <ul className="space-y-3 text-navy-600 mb-8">
              {points.map((p) => (
                <li key={p} className="flex gap-3 items-start">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white text-sm font-medium rounded-md hover:bg-[#1565D8] transition-colors no-underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              {t('fbVisit')}
            </a>
          </div>

          <div className="rounded-lg overflow-hidden border border-navy-100 shadow-sm bg-navy-50/30 flex justify-center">
            <iframe
              src={fbPluginSrc}
              width="500"
              height="600"
              style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title={t('fbFrameTitle')}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
