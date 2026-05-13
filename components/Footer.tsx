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
            <h3 className="text-sm font-medium text-navy-700 mb-3">
              {t('nav.home')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-navy-600 hover:text-navy-700 no-underline">{t('nav.about')}</Link></li>
              <li><Link href="/lectures" className="text-navy-600 hover:text-navy-700 no-underline">{t('nav.lectures')}</Link></li>
              <li><Link href="/articles" className="text-navy-600 hover:text-navy-700 no-underline">{t('nav.articles')}</Link></li>
              <li><Link href="/events" className="text-navy-600 hover:text-navy-700 no-underline">{t('nav.events')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-navy-700 mb-3">{t('contact.social')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" className="text-navy-600 hover:text-navy-700 no-underline">
                  YouTube
                </a>
              </li>
              {siteConfig.social.telegram && (
                <li>
                  <a href={siteConfig.social.telegram} target="_blank" rel="noopener noreferrer" className="text-navy-600 hover:text-navy-700 no-underline">
                    Telegram
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="text-navy-600 hover:text-navy-700 no-underline">
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
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
