import { setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/lib/site-config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: `${t('title')} — ${locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}` };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactContent />;
}

function ContactContent() {
  const t = useTranslations('contact');

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-navy-600 leading-relaxed">{t('subtitle')}</p>
        </div>

        <div className="bg-white border border-navy-100 rounded-lg p-8 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-navy-500 mb-2">
              {t('email')}
            </div>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-lg text-navy-700 hover:text-gold-500 transition-colors no-underline"
            >
              {siteConfig.contact.email}
            </a>
          </div>

          <div className="pt-6 border-t border-navy-100">
            <div className="text-xs uppercase tracking-wider text-navy-500 mb-3">
              {t('social')}
            </div>
            <div className="flex gap-3 flex-wrap">
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-navy-200 rounded-md text-sm text-navy-600 hover:bg-navy-50 transition-colors no-underline"
              >
                YouTube
              </a>
              {siteConfig.social.telegram && (
                <a
                  href={siteConfig.social.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-navy-200 rounded-md text-sm text-navy-600 hover:bg-navy-50 transition-colors no-underline"
                >
                  Telegram
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
