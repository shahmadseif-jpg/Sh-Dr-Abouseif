import { useTranslations } from 'next-intl';
import { siteConfig } from '@/lib/site-config';

export default function CTASection() {
  const t = useTranslations('cta');

  return (
    <section className="py-20 sm:py-24 bg-navy-700 text-white">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto h-1 w-12 bg-gold-400 mb-8" />
        <h2 className="text-3xl sm:text-4xl font-medium mb-4 text-white">
          {t('title')}
        </h2>
        <p className="text-base sm:text-lg text-navy-100 max-w-2xl mx-auto mb-8 leading-relaxed">
          {t('description')}
        </p>
        <a
          href={siteConfig.contact.academy}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gold-400 text-navy-900 text-sm font-medium rounded-md hover:bg-gold-300 transition-colors no-underline"
        >
          {t('button')}
        </a>
      </div>
    </section>
  );
}
