import { setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/lib/site-config';
import Newsletter from '@/components/Newsletter';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

function ContactContent() {
  const t = useTranslations('contact');
  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-navy-600">{t('subtitle')}</p>
        </div>

        <div className="bg-white border border-navy-100 rounded-lg p-8 space-y-6 mb-8">
          {/* Email */}
          <div>
            <div className="text-xs uppercase tracking-wider text-navy-500 mb-2">{t('email')}</div>
            <a
              href={"mailto:" + siteConfig.contact.email}
              className="text-navy-700 hover:text-navy-900 font-medium no-underline"
            >
              {siteConfig.contact.email}
            </a>
          </div>

          {/* Social */}
          <div className="pt-6 border-t border-navy-100">
            <div className="text-xs uppercase tracking-wider text-navy-500 mb-3">{t('social')}</div>
            <div className="flex gap-3 flex-wrap">
              {siteConfig.social.facebook && (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-navy-200 rounded-md text-sm text-navy-600 hover:bg-navy-50 transition-colors no-underline"
                >
                  Facebook
                </a>
              )}
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

          {/* Academy */}
          <div className="pt-6 border-t border-navy-100">
            <a
              href={siteConfig.contact.academy}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-navy-200 rounded-md text-sm text-navy-600 hover:bg-navy-50 transition-colors no-underline"
            >
              American Imams Academy ↗
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-white border border-navy-100 rounded-lg p-8">
          <Newsletter />
        </div>
      </div>
    </div>
  );
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
