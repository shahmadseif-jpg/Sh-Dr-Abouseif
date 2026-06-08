import { setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { articlesMeta, localize, type Loc } from '@/lib/articles';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'maqasid' });
  return {
    title: `${t('title')} — ${locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}`,
    description: t('subtitle'),
  };
}

export default async function MaqasidPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MaqasidContent />;
}

function MaqasidContent() {
  const t = useTranslations('maqasid');
  const locale = useLocale() as Loc;
  const readMore = locale === 'ar' ? 'اقرأ الجزء' : locale === 'es' ? 'Leer la parte' : 'Read part';
  const partLabel = (n: number) =>
    locale === 'ar' ? `الجزء ${n}` : locale === 'es' ? `Parte ${n}` : `Part ${n}`;

  const items = articlesMeta
    .filter((a) => a.category === 'maqasid-tafsir' && !a.draft)
    .sort((a, b) => (a.episode ?? 0) - (b.episode ?? 0));

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-navy-600 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-5">
          {items.map((a) => (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="card-hover group block bg-white rounded-lg border border-navy-100 p-6 no-underline"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-navy-600 text-white text-sm font-medium shrink-0">
                  {a.episode}
                </span>
                <span className="text-xs text-gold-500 font-medium">
                  {partLabel(a.episode ?? 0)}
                </span>
                <span className="text-gold-300">•</span>
                <span className="text-xs text-navy-500">
                  {a.readingMinutes}{' '}
                  {locale === 'ar' ? 'دقائق قراءة' : locale === 'es' ? 'min de lectura' : 'min read'}
                </span>
              </div>
              <h2 className="text-xl font-medium text-navy-700 mb-2 leading-snug group-hover:text-navy-900">
                {localize(a.title, locale)}
              </h2>
              <p className="text-sm text-navy-600 leading-relaxed line-clamp-3">
                {localize(a.excerpt, locale)}
              </p>
              <span className="inline-block mt-3 text-sm font-medium text-navy-600 group-hover:text-navy-800">
                {readMore} ←
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
