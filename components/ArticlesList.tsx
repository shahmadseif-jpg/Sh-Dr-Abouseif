import { bodyLocales } from '@/lib/content-availability-server';
// Server component (PERF-02). Groups and localizes the article metadata on the
// server and passes only the current locale's strings to ArticlesListView.
//
// Measured alternatives (Lighthouse 12.8.2, mobile, local next start):
//  - whole list as a client component importing lib/articles: the ~650 kB
//    (208 kB gzip) metadata chunk is also attached to every article detail
//    page (Next 14 includes the articles/page client chunks in
//    articles/[slug]), which cost those pages ~170 ms TBT and ~1.5 s LCP;
//  - whole list as a server component: the 461 cards are serialized twice
//    (HTML + inline RSC element tree, HTML 0.67 -> 1.49 MB) and list-page TBT
//    rose 231 -> 391 ms.
// Slim props keep the RSC payload to the visible text only.
import { useLocale, useTranslations } from 'next-intl';
import { articlesMeta, categoryLabels, type ArticleCategory, type ArticleMeta } from '@/lib/articles';
import { localize, localizedTextLocale, type Loc, type LocalizedText } from '@/lib/localize';
import { published } from '@/lib/publish';
import ArticlesListView, { type ArticleCardData, type ArticleGroup } from './ArticlesListView';

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

export default function ArticlesList() {
  const locale = useLocale() as Loc;
  const ui = useTranslations('ui');
  // Plural-aware labels (Arabic: 1 / 2 / 3–10 / 11+ forms; EN/ES singular) — LANG-110/111.
  const countLabel = (n: number) => ui('articleCount', { count: n, n: String(n) });
  const minutesLabel = (n: number) => ui('readingMinutes', { count: n, n: String(n) });

  const card = (a: ArticleMeta, inSeries: boolean): ArticleCardData => ({
    slug: a.slug,
    titleLocale: localizedTextLocale(a.title, locale),
    excerptLocale: localizedTextLocale(a.excerpt, locale),
    arabicFallback: !bodyLocales('articles', a.slug).includes(locale) && bodyLocales('articles', a.slug).includes('ar'),
    title: localize(a.title, locale),
    excerpt: localize(a.excerpt, locale),
    date: localize(a.date, locale),
    minutes: minutesLabel(a.readingMinutes),
    episode: inSeries && a.episode != null ? a.episode : null,
  });

  const live = published(articlesMeta);

  const groups: ArticleGroup[] = ORDER.map((cat) => {
    const items = live.filter((a) => a.category === cat);

    const seriesMap = new Map<string, ArticleMeta[]>();
    const standalone: ArticleMeta[] = [];
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
        return { key: arr[0].series!.ar, title: localize(arr[0].series!, locale), items: sorted.map((a) => card(a, true)), latest };
      })
      .sort((a, b) => (a.latest < b.latest ? 1 : -1))
      .map(({ key, title, items }) => ({ key, title, items }));

    const standaloneSorted = [...standalone].sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));

    return {
      cat,
      label: categoryLabels[locale][cat],
      desc: localize(PATH_DESC[cat], locale),
      countText: countLabel(items.length),
      seriesGroups,
      standalone: standaloneSorted.map((a) => card(a, false)),
      total: items.length,
    };
  }).filter((g) => g.total > 0);

  return <ArticlesListView groups={groups} />;
}
