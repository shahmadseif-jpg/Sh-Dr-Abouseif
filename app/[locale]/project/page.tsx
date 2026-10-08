import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getResearchItem } from '@/lib/research';
import { articlesMeta, localize } from '@/lib/articles';

type Locale = 'ar' | 'en' | 'es' | 'ur';

interface Txt {
  startTitle: string;
  start: string;
  methodTitle: string;
  method: string;
  fieldsTitle: string;
  tracksTitle: string;
  tracksIntro: string;
  tracks: { title: string; body: string }[];
  seriesTitle: string;
  articles: (n: string) => string;
  siteName: string;
}

const TRACK_SLUGS = [
  ['maturidi-tawilat-al-araf', 'ibn-juzayy-tarjihat', 'tafsir-renewal-and-ai'],
  ['fatwa-mufti-eligibility-2018', 'fatwa-us-ai-2025', 'fatwa-digital-transformation'],
  ['women-and-dawah-west', 'dhabaih-ahl-al-kitab', 'farewell-tawaf'],
];

/** Pillar → article category (anchors on the articles page). */
const PILLAR_CATS = ['maqasid-tafsir', 'wisdom-insights', 'civilization'];

/** Major series, identified by their Arabic name in lib/articles.ts. */
const SERIES_AR = [
  'المفاهيم الإيمانية',
  'حِكَمٌ وبصائر',
  'التفسير المقاصدي',
  'القرآن والحضارة',
  'الإمام في الغرب — مدرسة في صناعة القائد',
];

const TXT: Record<Locale, Txt> = {
  ar: {
    startTitle: 'المنطلق',
    start:
      'ينطلق هذا المشروع من سؤالٍ واحد: كيف يعود القرآنُ مصدرَ بصيرةٍ يقرأ به المسلمُ حياته، لا نصًّا يُتلى للبركة وحدها؟ ويشتدّ هذا السؤال على المسلم الذي يعيش في الغرب، حيث يواجه أسئلة الهويّة والأسرة والمجتمع بعيدًا عن البيئة التي نشأ فيها الفقه والتفسير. ومن هنا كان الجمعُ بين البحث العلمي والعمل الدعوي اليومي: فالبحثُ يضبط المنهج، والمنبرُ والاستشارةُ يختبران المعنى في واقع الناس.',
    methodTitle: 'المنهج: القراءة المقاصدية',
    method:
      'لا تقف القراءة المقاصدية عند ظاهر الآية وحده، بل تسأل عن مقصدها: ماذا تريد أن تبني في الإنسان والمجتمع؟ فتجمع الآيةَ إلى نظائرها، وتستخرج السُّننَ التي تحكم الأفراد والأمم، ثم تنقل المعنى من النصّ إلى القلب، ومن القلب إلى السلوك. وهي قراءة تحتكم إلى أصول التفسير وتراث المفسّرين، وتُحسن في الوقت نفسه الإصغاء إلى أسئلة العصر.',
    fieldsTitle: 'مجالات الاشتغال',
    tracksTitle: 'المسارات البحثية',
    tracksIntro: 'أبحاثٌ يتّصل بعضها ببعض، يدور كلُّ مسارٍ منها حول سؤالٍ واحد عبر السنين.',
    tracks: [
      { title: 'مسار التفسير', body: 'من تحقيق التراث، إلى نقد مناهج المفسّرين، إلى سؤال التفسير في عصر الذكاء الاصطناعي.' },
      { title: 'مسار الفتوى', body: 'ثماني سنوات حول قضيّة واحدة: من يحقّ له أن يفتي، وكيف تُضبط الفتوى في الواقع الأمريكي وفي العصر الرقمي.' },
      { title: 'فقه المسلم في الغرب ونوازله', body: 'مسائل يعيشها المسلم في المجتمعات الغربية، تُدرس بمنهج يجمع بين التأصيل ومراعاة الواقع.' },
    ],
    seriesTitle: 'السلاسل الكبرى',
    articles: (n) => `${n} مقالًا`,
    siteName: 'د. أحمد أبو سيف',
  },
  en: {
    startTitle: 'Where it starts',
    start:
      'This project begins with one question: how can the Qur’an become, once again, a source of insight that Muslims use to make sense of their lives — not just a text recited for blessing? That question is sharpest for Muslims living in the West, who face questions of identity, family, and community far from the setting in which Islamic law and Qur’anic interpretation first took shape. That is why this work brings scholarship and everyday community work together: research keeps the method sound, while the pulpit and the counseling room test the meaning against people’s real lives.',
    methodTitle: 'The method: reading for purpose',
    method:
      'A purpose-driven reading doesn’t stop at the surface of a verse. It asks what the verse is meant to build in a person and in a community. It reads each verse alongside related verses, draws out the patterns (sunan) that shape individuals and nations, and then carries the meaning from the text to the heart, and from the heart into how we live. It stays anchored in the principles of tafsīr and the legacy of the classical commentators, while listening closely to the questions of our time.',
    fieldsTitle: 'Areas of work',
    tracksTitle: 'Lines of research',
    tracksIntro: 'Studies that build on one another — each line follows a single question over the years.',
    tracks: [
      { title: 'Qur’anic interpretation', body: 'From editing classical manuscripts, to critically assessing the methods of the commentators, to asking what tafsīr looks like in the age of AI.' },
      { title: 'Religious rulings (fatwa)', body: 'Eight years on one issue: who is qualified to issue a fatwa, and how fatwa can be kept sound in the American context and the digital age.' },
      { title: 'Muslim life in the West', body: 'Real questions Muslims face in Western societies, studied with an approach that is both rooted in the sources and attentive to reality.' },
    ],
    seriesTitle: 'Major series',
    articles: (n) => `${n} articles`,
    siteName: 'Dr. Ahmed Abouseif',
  },
  es: {
    startTitle: 'El punto de partida',
    start:
      'Este proyecto parte de una sola pregunta: ¿cómo puede el Corán volver a ser una fuente de lucidez con la que el musulmán lea su propia vida, y no solo un texto que se recita para obtener bendición? La pregunta se vuelve más urgente para el musulmán que vive en Occidente, que afronta cuestiones de identidad, familia y sociedad lejos del entorno en que nacieron la jurisprudencia y la exégesis. De ahí la unión entre la investigación académica y la labor diaria de predicación: la investigación da rigor al método, y el púlpito y la orientación ponen a prueba el sentido en la realidad de la gente.',
    methodTitle: 'El método: la lectura orientada a los fines',
    method:
      'La lectura orientada a los fines no se detiene en el sentido aparente de la aleya, sino que pregunta por su propósito: ¿qué quiere construir en la persona y en la sociedad? Reúne cada aleya con sus semejantes, extrae las leyes (sunan) que rigen a individuos y naciones, y lleva el sentido del texto al corazón, y del corazón a la conducta. Es una lectura fiel a los fundamentos del tafsīr y al legado de los exegetas, y a la vez atenta a las preguntas de nuestro tiempo.',
    fieldsTitle: 'Campos de trabajo',
    tracksTitle: 'Líneas de investigación',
    tracksIntro: 'Investigaciones que se enlazan entre sí; cada línea gira en torno a una misma pregunta a lo largo de los años.',
    tracks: [
      { title: 'Exégesis coránica', body: 'De la edición crítica del legado clásico, al examen de los métodos de los exegetas, hasta la pregunta por el tafsīr en la era de la inteligencia artificial.' },
      { title: 'La fatwa', body: 'Ocho años en torno a una sola cuestión: quién está capacitado para emitir una fatwa y cómo regularla en el contexto estadounidense y en la era digital.' },
      { title: 'El musulmán en Occidente y sus cuestiones', body: 'Cuestiones que vive el musulmán en las sociedades occidentales, estudiadas con un método que une la fundamentación en las fuentes y la atención a la realidad.' },
    ],
    seriesTitle: 'Grandes series',
    articles: (n) => `${n} artículos`,
    siteName: 'Dr. Ahmed Abouseif',
  },
  ur: {
    startTitle: 'نقطۂ آغاز',
    start:
      'یہ منصوبہ ایک ہی سوال سے شروع ہوتا ہے: قرآن دوبارہ کیسے بصیرت کا وہ سرچشمہ بنے جس کی روشنی میں مسلمان اپنی زندگی کو سمجھے، نہ کہ صرف برکت کے لیے پڑھا جانے والا متن؟ یہ سوال مغرب میں رہنے والے مسلمان کے لیے اور بھی شدید ہے، جو شناخت، خاندان اور معاشرے کے سوالات کا سامنا اُس ماحول سے دور کرتا ہے جس میں فقہ اور تفسیر پروان چڑھے۔ اسی لیے یہ کام علمی تحقیق اور روزمرہ دعوتی سرگرمی کو یکجا کرتا ہے: تحقیق منہج کو منضبط رکھتی ہے، اور منبر و مشاورت معنی کو لوگوں کی حقیقی زندگی میں پرکھتے ہیں۔',
    methodTitle: 'منہج: مقاصدی قراءت',
    method:
      'مقاصدی قراءت آیت کے ظاہری مفہوم پر نہیں رُکتی، بلکہ اس کا مقصد پوچھتی ہے: یہ آیت انسان اور معاشرے میں کیا تعمیر کرنا چاہتی ہے؟ وہ آیت کو اس کی ہم معنی آیات کے ساتھ جمع کرتی ہے، افراد اور قوموں پر حاکم سنتیں نکالتی ہے، اور پھر معنی کو متن سے دل تک، اور دل سے عمل تک پہنچاتی ہے۔ یہ قراءت اصولِ تفسیر اور مفسرین کے ورثے کی پابند ہے، اور ساتھ ہی عصرِ حاضر کے سوالات کو غور سے سنتی ہے۔',
    fieldsTitle: 'میدانِ کار',
    tracksTitle: 'تحقیقی سلسلے',
    tracksIntro: 'ایک دوسرے سے جڑی تحقیقات؛ ہر سلسلہ برسوں تک ایک ہی سوال کے گرد گھومتا ہے۔',
    tracks: [
      { title: 'تفسیر', body: 'تراث کی تحقیق سے، مفسرین کے مناہج کے تنقیدی جائزے تک، اور پھر مصنوعی ذہانت کے دور میں تفسیر کے سوال تک۔' },
      { title: 'فتویٰ', body: 'ایک ہی مسئلے پر آٹھ سال: فتویٰ دینے کا اہل کون ہے، اور امریکی تناظر اور ڈیجیٹل دور میں فتویٰ کو کیسے منضبط رکھا جائے۔' },
      { title: 'مغرب میں مسلمان کی فقہ اور نوازل', body: 'وہ مسائل جن سے مغربی معاشروں میں مسلمان دوچار ہے، ایسے منہج سے جو نصوص میں جڑ اور حالات کی رعایت دونوں کو جمع کرتا ہے۔' },
    ],
    seriesTitle: 'بڑے سلسلے',
    articles: (n) => `${n} مضامین`,
    siteName: 'ڈاکٹر احمد ابو سیف',
  },
};

const NUM_LOCALE: Record<Locale, string> = { ar: 'ar-EG', en: 'en-US', es: 'es-ES', ur: 'ur-PK' };

function locOf(locale: string): Locale {
  return (TXT[locale as Locale] ? locale : 'ar') as Locale;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locOf(locale);
  const m = await getTranslations({ locale: loc, namespace: 'mission' });
  return { title: `${m('eyebrow')} — ${TXT[loc].siteName}`, description: m('body') };
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locOf(locale);
  const t = TXT[loc];
  const m = await getTranslations({ locale: loc, namespace: 'mission' });
  const fmt = (n: number) => n.toLocaleString(NUM_LOCALE[loc], { useGrouping: false });

  const pillars = [1, 2, 3].map((i) => ({
    title: m(`pillar_${i}_title`),
    body: m(`pillar_${i}_desc`),
    cat: PILLAR_CATS[i - 1],
  }));

  const series = SERIES_AR.map((ar) => {
    const items = articlesMeta.filter((a) => a.series?.ar === ar);
    if (!items.length) return null;
    return { key: ar, title: localize(items[0].series, loc), count: items.length, cat: items[0].category };
  }).filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="text-xs uppercase tracking-[0.2em] text-gold-500 mb-3 font-medium">{m('eyebrow')}</div>
          <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-4">{m('title')}</h1>
          <p className="text-lg text-navy-600 leading-relaxed">{m('body')}</p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-medium text-navy-700 mb-3">{t.startTitle}</h2>
          <p className="text-navy-700 leading-loose">{t.start}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-medium text-navy-700 mb-3">{t.methodTitle}</h2>
          <p className="text-navy-700 leading-loose">{t.method}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-medium text-navy-700 mb-4">{t.fieldsTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {pillars.map((p) => (
              <Link
                key={p.cat}
                href={`/articles#cat-${p.cat}`}
                className="block bg-white border border-navy-100 rounded-lg p-5 no-underline hover:border-gold-300"
              >
                <div className="text-lg font-medium text-navy-700 mb-1">{p.title}</div>
                <p className="text-sm text-navy-600 leading-relaxed">{p.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-medium text-navy-700 mb-2">{t.tracksTitle}</h2>
          <p className="text-navy-600 leading-relaxed mb-5">{t.tracksIntro}</p>
          <div className="space-y-5">
            {t.tracks.map((tr, i) => (
              <div key={tr.title} className="rounded-lg border border-navy-100 bg-white p-6">
                <h3 className="text-lg font-medium text-navy-700 mb-1">{tr.title}</h3>
                <p className="text-sm text-navy-600 leading-relaxed mb-4">{tr.body}</p>
                <ol className="relative border-s border-gold-200 ms-2 space-y-3">
                  {TRACK_SLUGS[i]
                    .map((s) => getResearchItem(s))
                    .filter((r): r is NonNullable<typeof r> => Boolean(r))
                    .sort((a, b) => a.year - b.year)
                    .map((r) => (
                      <li key={r.slug} className="ms-4">
                        <span className="absolute -start-1.5 mt-2 h-3 w-3 rounded-full bg-gold-400" />
                        <span className="text-sm text-gold-600 font-medium">{fmt(r.year)}</span>{' '}
                        <Link href={`/research/${r.slug}`} className="text-navy-700 hover:text-gold-600">
                          {(r.title as Record<string, string | undefined>)[loc] ?? r.title.ar}
                        </Link>
                      </li>
                    ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-medium text-navy-700 mb-4">{t.seriesTitle}</h2>
          <ul className="divide-y divide-navy-100 rounded-lg border border-navy-100 bg-white">
            {series.map((s) => (
              <li key={s.key}>
                <Link
                  href={`/articles#cat-${s.cat}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 no-underline hover:bg-navy-50"
                >
                  <span className="text-navy-700 font-medium">{s.title}</span>
                  <span className="shrink-0 text-sm text-navy-500">{t.articles(fmt(s.count))}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
