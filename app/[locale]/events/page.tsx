import { setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { authorName, pageMetadata } from '@/lib/seo';
import { recurringEvents, EVENTS_LAST_CONFIRMED, type Loc } from '@/lib/events';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'events' });
  return pageMetadata({
    locale,
    path: '/events',
    title: `${t('title')} — ${authorName(locale)}`,
  });
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
  const ui = useTranslations('ui');
  const locale = useLocale() as Loc;
  const L = (x: Record<Loc, string>) => x[locale] ?? x.ar;
  const unconfirmed = recurringEvents.filter((e) => !e.confirmed).length;
  const dateFmt =
    locale === 'ar' ? 'ar-EG' : locale === 'es' ? 'es-ES' : locale === 'ur' ? 'ur-PK' : 'en-US';

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

        {unconfirmed > 0 && (
          <div
            role="note"
            className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-950 leading-relaxed"
          >
            <p className="font-medium mb-1">{t('scheduleNoteTitle')}</p>
            <p>{t('scheduleNote')}</p>
            <p className="mt-2 text-xs text-amber-900">
              {EVENTS_LAST_CONFIRMED
                ? t('lastConfirmed', {
                    date: new Date(EVENTS_LAST_CONFIRMED + 'T12:00:00Z').toLocaleDateString(dateFmt, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }),
                  })
                : t('lastConfirmedNone')}
            </p>
          </div>
        )}

        <ul className="space-y-4">
          {recurringEvents.map((event) => (
            <li
              key={event.id}
              className="bg-white border border-navy-100 rounded-lg p-6 card-hover"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs uppercase tracking-wider text-gold-500">{L(event.type)}</span>
                    <span
                      className={
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs ' +
                        (event.confirmed
                          ? 'border-green-300 bg-green-50 text-green-800'
                          : 'border-amber-300 bg-amber-50 text-amber-900')
                      }
                    >
                      {event.confirmed ? t('statusConfirmed') : t('statusUnconfirmed')}
                    </span>
                  </div>
                  <h2 className="text-lg font-medium text-navy-700 mb-2">{L(event.title)}</h2>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-navy-600">
                    <div className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="sr-only">{ui('when')}: </span>
                      {L(event.when)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="sr-only">{ui('where')}: </span>
                      <span lang="en" dir="ltr">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
