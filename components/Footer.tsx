'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { siteConfig } from '@/lib/site-config';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-navy-100 bg-navy-50/30 mt-16">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-navy-600 text-white text-sm font-medium">
                {locale === 'ar' ? 'أ' : 'A'}
              </div>
              <div>
                <div className="text-base font-medium text-navy-700">
                  {locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}
                </div>
                <div className="text-xs text-navy-500">{t('site.tagline')}</div>
              </div>
            </div>
            <p className="text-sm text-navy-600 leading-relaxed max-w-md">
              {t('site.description')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-navy-700 mb-3">{t('nav.home')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-navy-600 hover:text-navy-700 no-underline">{t('nav.about')}</Link></li>
              <li><Link href="/lectures" className="text-navy-600 hover:text-navy-700 no-underline">{t('nav.lectures')}</Link></li>
              <li><Link href="/articles" className="text-navy-600 hover:text-navy-700 no-underline">{t('nav.articles')}</Link></li>
              <li><Link href="/events" className="text-navy-600 hover:text-navy-700 no-underline">{t('nav.events')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-navy-700 mb-3">{t('contact.social')}</h3>
            <div className="flex gap-2 mb-4 flex-wrap">
              {siteConfig.social.facebook && (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-navy-200 text-navy-600 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors no-underline"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-navy-200 text-navy-600 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-colors no-underline"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              {siteConfig.social.telegram && (
                <a
                  href={siteConfig.social.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-navy-200 text-navy-600 hover:bg-[#0088cc] hover:text-white hover:border-[#0088cc] transition-colors no-underline"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                  </svg>
                </a>
              )}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-navy-200 text-navy-600 hover:bg-navy-600 hover:text-white hover:border-navy-600 transition-colors no-underline"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
            <div className="text-xs text-navy-500 break-all">
              {siteConfig.contact.email}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-navy-100 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-navy-500">
          <div>
            © {year} {locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'} · {t('footer.rights')}
          </div>
          <div>{t('footer.made_with')}</div>
        </div>
      </div>
    </footer>
  );
}
