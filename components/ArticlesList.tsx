'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { articlesMeta, categoryLabels, localize, type ArticleCategory, type Loc, type LocalizedText } from '@/lib/articles';

type Article = (typeof articlesMeta)[number];

// Display order of the reading paths (sections)
const ORDER: ArticleCategory[] = [
  'maqasid-tafsir',
  'civilization',
  'quranic-concepts',
  'wisdom-insights',
  'imamship',
  'family',
  'fiqh',
  'prophetic-light',
];

const PATH_DESC: Record<ArticleCategory, LocalizedText> = {
  civilization: {
    ar: 'قراءةٌ بنيويّةٌ في سُنن نهوض الأمم وسقوطها كما يعرضها القرآن.',
    en: "A structural reading of the laws of nations' rise and fall in the Qur'an.",
    es: 'Una lectura estructural de las leyes del auge y la caída de las naciones en el Corán.',
    ur: 'قرآن میں امتوں کے عروج و زوال کی سنتوں کی بنیادی قراءت۔',
  },
  'quranic-concepts': {
    ar: 'دراسةُ المفاهيم الإيمانية الكبرى بين دلالتها في اللغة والوحي وتطبيقها في حياة الإنسان.',
    en: 'A study of the major concepts of faith between their meaning in language and revelation and their application in life.',
    es: 'Un estudio de los grandes conceptos de la fe entre su significado en la lengua y la revelación y su aplicación en la vida.',
    ur: 'بڑے ایمانی مفاہیم کا مطالعہ — لغت و وحی میں اُن کے معنیٰ اور انسان کی زندگی میں اُن کے اطلاق کے درمیان۔',
  },
  'wisdom-insights': {
    ar: 'تأمّلاتٌ قرآنيّةٌ تربويّةٌ تنقل الآيةَ إلى القلب ومسيرةِ الإنسان إلى الله.',
    en: "Qur'anic, educational reflections carrying the verse to the heart.",
    es: 'Reflexiones coránicas y educativas que llevan el versículo al corazón.',
    ur: 'قرآنی تربیتی تأملات جو آیت کو دل اور اللہ کی طرف انسان کے سفر تک پہنچاتے ہیں۔',
  },
  imamship: {
    ar: 'صناعةُ الإمام والداعية، وقضايا بيت الدعوة، وفقهُ الإصلاح والثبات.',
    en: 'Crafting the imam and the caller, the daʿwah household, and the fiqh of reform and steadfastness.',
    es: 'La formación del imam y del predicador, las cuestiones del hogar de la daʿwa y el fiqh de la reforma.',
    ur: 'امام اور داعی کی تعمیر، دعوتی گھر کے مسائل، اور اصلاح و ثبات کا فقہ۔',
  },
  family: {
    ar: 'فقهُ الأسرة المسلمة وتربيةُ الأبناء في الغرب.',
    en: 'The jurisprudence of the Muslim family and raising children in the West.',
    es: 'La jurisprudencia de la familia musulmana y la crianza de los hijos en Occidente.',
    ur: 'مسلم خاندان کا فقہ اور مغرب میں بچوں کی تربیت۔',
  },
  fiqh: {
    ar: 'مسائلُ المسلم في الغرب بين الفقه المعاصر والمقاصد الشرعية — حضور، هوية، تكيُّف وتميُّز.',
    en: 'Islamic jurisprudence for Muslim minorities in the West — identity, civic presence, and navigating modernity.',
    es: 'Jurisprudencia islámica para las minorías musulmanas en Occidente — identidad, presencia cívica y modernidad.',
    ur: 'مغرب میں مسلم اقلیتوں کے لیے اسلامی فقہ — شناخت، شہری حضور، اور جدیدیت میں راستہ۔',
  },
  'maqasid-tafsir': {
    ar: 'سلسلةٌ في قراءة القرآن على أساس مقاصده وغاياته.',
    en: "A series on reading the Qur'an in light of its higher objectives.",
    es: 'Una serie sobre la lectura del Corán a la luz de sus fines superiores.',
    ur: 'قرآن کریم کو اس کے مقاصد اور غایات کی روشنی میں پڑھنے کا سلسلہ۔',
  },
  'prophetic-light': {
    ar: 'قبساتٌ من الهَدْي النبويّ في فقه الإصلاح والثبات وطول النفس في الدعوة.',
    en: 'Glimmers from the Prophetic guidance on reform, steadfastness, and perseverance in daʿwah.',
    es: 'Destellos de la guía profética sobre la reforma, la constancia y la perseverancia en la daʿwa.',
    ur: 'نبوی ہدایت سے اصلاح، ثبات اور دعوت میں طولِ نفس کے فقہ پر جھلکیاں۔',
  },
};

function ArticleCard({
  article,
  locale,
  readMore,
  epLabel,
  inSeries,
}: {
  article: Article;
  locale: Loc;
  readMore: string;
  epLabel: string;
  inSeries: boolean;
}) {
  return (
    <Link
      href={`/${locale}/articles/${article.slug}`}
      className="bg-white border border-navy-100 rounded-lg p-6 card-hover flex flex-col group"
    >
      {inSeries && article.episode != null && (
        <div className="text-xs font-medium text-gold-600 mb-2">
          {epLabel} {article.episode}
        </div>
      )}

      <h3 className="text-lg font-medium text-navy-700 leading-snug mb-3 group-hover:text-gold-600 transition-colors">
        {localize(article.title, locale)}
      </h3>

      <p className="text-sm text-navy-600 leading-relaxed mb-4 line-clamp-4 flex-1">
        {localize(article.excerpt, locale)}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-navy-100">
        <div className="text-xs text-navy-500 flex items-center gap-2">
          <span>{localize(article.date, locale)}</span>
          <span className="text-gold-300">•</span>
          <span>{article.readingMinutes} {locale === 'ar' ? 'دقائق' : locale === 'ur' ? 'منٹ' : 'min'}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 group-hover:text-gold-500 transition-colors">
          {readMore}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {locale === 'ar' ? <path d="M9 3L5 7l4 4" /> : <path d="M5 3l4 4-4 4" />}
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function ArticlesList() {
  const locale = useLocale() as Loc;
  const readMore = locale === 'ar' ? 'اقرأ المقال' : locale === 'es' ? 'Leer el artículo' : locale === 'ur' ? 'مضمون پڑھیں' : 'Read article';
  const countLabel = locale === 'ar' ? 'مقالة' : locale === 'es' ? 'artículos' : locale === 'ur' ? 'مضامین' : 'articles';
  const epLabel = locale === 'ar' ? 'الحلقة' : locale === 'es' ? 'Ep.' : locale === 'ur' ? 'قسط' : 'Ep.';

  const live = articlesMeta.filter((a) => !a.draft);

  const groups = ORDER.map((cat) => {
    const items = live.filter((a) => a.category === cat);

    const seriesMap = new Map<string, Article[]>();
    const standalone: Article[] = [];
    for (const a of items) {
      if (a.series) {
        const key = a.series.ar;
        if (!seriesMap.has(key)) seriesMap.set(key, []);
        seriesMap.get(key)!.push(a);
      } else {
        standalone.push(a);
      }
    }

    const seriesGroups = Array.from(seriesMap.values())
      .map((arr) => {
        const sorted = [...arr].sort((a, b) => (a.episode ?? 0) - (b.episode ?? 0));
        const latest = arr.reduce((m, a) => (a.isoDate > m ? a.isoDate : m), '');
        return { key: arr[0].series!.ar, series: arr[0].series!, items: sorted, latest };
      })
      .sort((a, b) => (a.latest < b.latest ? 1 : -1));

    const standaloneSorted = [...standalone].sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));

    return { cat, seriesGroups, standalone: standaloneSorted, total: items.length };
  }).filter((g) => g.total > 0);

  return (
    <div className="space-y-16">
      {groups.map(({ cat, seriesGroups, standalone, total }) => (
        <section key={cat} id={`cat-${cat}`} className="scroll-mt-24">
          {/* Section heading */}
          {cat === 'fiqh' ? (
            <div className="mb-6 px-5 py-4 bg-gold-50 border border-gold-200 rounded-lg">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-medium text-navy-700">
                    {categoryLabels[locale][cat]}
                  </h2>
                  <span className="text-xs font-semibold bg-gold-400 text-navy-900 px-3 py-1 rounded-full whitespace-nowrap">
                    {locale === 'ar' ? 'مسلمو الغرب' : locale === 'es' ? 'Islam en Occidente' : locale === 'ur' ? 'مغرب میں اسلام' : 'Muslims in the West'}
                  </span>
                </div>
                <span className="text-xs text-navy-400 whitespace-nowrap">
                  {total} {countLabel}
                </span>
              </div>
              <p className="mt-2 text-sm text-navy-600 leading-relaxed">
                {localize(PATH_DESC[cat], locale)}
              </p>
            </div>
          ) : (
            <div className="mb-6 pb-4 border-b border-navy-100">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-2xl font-medium text-navy-700">
                  {categoryLabels[locale][cat]}
                </h2>
                <span className="text-xs text-navy-400 whitespace-nowrap">
                  {total} {countLabel}
                </span>
              </div>
              <p className="mt-1 text-sm text-navy-500 leading-relaxed">
                {localize(PATH_DESC[cat], locale)}
              </p>
            </div>
          )}

          <div className="space-y-10">
            {/* Series sub-groups */}
            {seriesGroups.map((sg) => (
              <div key={sg.key}>
                <h3 className="text-base font-semibold text-gold-700 mb-4 flex items-center gap-2">
                  <span className="inline-block w-6 h-px bg-gold-300" aria-hidden="true" />
                  {localize(sg.series, locale)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sg.items.map((article) => (
                    <ArticleCard
                      key={article.slug}
                      article={article}
                      locale={locale}
                      readMore={readMore}
                      epLabel={epLabel}
                      inSeries={true}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Standalone articles */}
            {standalone.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {standalone.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    locale={locale}
                    readMore={readMore}
                    epLabel={epLabel}
                    inSeries={false}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
