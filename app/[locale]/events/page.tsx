import { setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { siteConfig } from '@/lib/site-config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'events' });
  return { title: `${t('title')} — ${locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}` };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EventsContent />;
}

function EventsContent() {
  const t = useTranslations('events');
  const locale = useLocale();

  // Placeholder events. Replace with real data when ready.
  const events = [
    {
      title: locale === 'ar' ? 'خاطرة الفجر — جامع العلوم والحكم' : 'Fajr Khatira — Jami\' Al-Ulum wal-Hikam',
      date: locale === 'ar' ? 'يومياً بعد صلاة الفجر' : 'Daily after Fajr prayer',
      location: 'AIA',
      type: locale === 'ar' ? 'درس يومي' : 'Daily class',
    },
    {
      title: locale === 'ar' ? 'خطبة الجمعة' : 'Jumu\'ah Khutbah',
      date: locale === 'ar' ? 'كل جمعة' : 'Every Friday',
      location: 'Bayt Al-Karim Islamic Center',
      type: locale === 'ar' ? 'خطبة أسبوعية' : 'Weekly khutbah',
    },
    {
      title: locale === 'ar' ? 'محاضرة العشاء — نداءات الإيمان' : 'Isha Lecture — Calls to Faith',
      date: locale === 'ar' ? 'كل سبت بعد العشاء' : 'Every Saturday after Isha',
      location: 'AIA',
      type: locale === 'ar' ? 'محاضرة أسبوعية' : 'Weekly lecture',
    },
  ];

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="bg-white border border-navy-100 rounded-lg p-6 card-hover"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-gold-500 mb-1">
                    {event.type}
                  </div>
                  <h3 className="text-lg font-medium text-navy-700 mb-2">{event.title}</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-navy-600">
                    <div className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {event.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
