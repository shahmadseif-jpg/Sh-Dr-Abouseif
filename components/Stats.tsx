'use client';

import { useTranslations, useLocale } from 'next-intl';
import { siteConfig } from '@/lib/site-config';

export default function Stats() {
  const t = useTranslations('stats');
  const locale = useLocale();

  const formatNumber = (n: number) => {
    if (locale === 'ar') {
      return new Intl.NumberFormat('ar-EG').format(n);
    }
    return n.toLocaleString('en-US');
  };

  const stats = [
    { value: `${formatNumber(siteConfig.stats.lectures)}+`, label: t('lectures') },
    { value: `${formatNumber(siteConfig.stats.years)}+`, label: t('years') },
    { value: formatNumber(siteConfig.stats.subscribers), label: t('subscribers') },
    { value: formatNumber(siteConfig.stats.languages), label: t('languages') },
  ];

  return (
    <section className="py-12 sm:py-16 border-b border-navy-100">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center lg:text-start"
            >
              <div className="text-3xl sm:text-4xl font-medium text-navy-700 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-navy-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
