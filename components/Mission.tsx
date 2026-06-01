'use client';

import { useTranslations } from 'next-intl';

export default function Mission() {
  const t = useTranslations('mission');

  const pillars = [
    { title: t('pillar_1_title'), desc: t('pillar_1_desc') },
    { title: t('pillar_2_title'), desc: t('pillar_2_desc') },
    { title: t('pillar_3_title'), desc: t('pillar_3_desc') },
  ];

  return (
    <section className="bg-white border-b border-navy-100">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-3xl">
          <div className="inline-block text-xs uppercase tracking-[0.2em] text-gold-500 mb-4 font-medium">
            {t('eyebrow')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-medium text-navy-700 leading-tight mb-5">
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg text-navy-600 leading-relaxed">
            {t('body')}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <div key={i} className="relative ps-5 border-s-2 border-gold-300">
              <div className="text-lg font-semibold text-navy-700 mb-1">{p.title}</div>
              <div className="text-sm text-navy-500 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
