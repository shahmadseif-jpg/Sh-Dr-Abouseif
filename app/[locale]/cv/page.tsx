import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { researchMeta, researchTypeLabels } from '@/lib/research';
import { articlesMeta, localize, type ArticleCategory } from '@/lib/articles';
import { siteConfig } from '@/lib/site-config';
import PrintButton from '@/components/PrintButton';

type Loc = 'ar' | 'en' | 'es' | 'ur';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const ar = locale === 'ar';
  return {
    title: `${ar ? 'السيرة العلميّة' : locale === 'es' ? 'CV académico' : locale === 'ur' ? 'علمی سوانح' : 'Academic CV'} — ${ar ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}`,
    description: ar
      ? 'السيرة العلميّة والمنشورات المحكَّمة للدكتور أحمد أبو سيف'
      : locale === 'es'
      ? 'CV académico y publicaciones arbitradas del Dr. Ahmed Abouseif'
      : locale === 'ur'
      ? 'ڈاکٹر احمد ابو سیف کی علمی سوانح اور ہم مرتبہ جائزہ شدہ تحقیقات'
      : 'Academic CV and peer-reviewed publications of Dr. Ahmed Abouseif',
  };
}

const ui: Record<Loc, Record<string, string>> = {
  ar: {
    cv: 'السيرة العلميّة',
    sub: 'نظرةٌ جامعةٌ على المسيرة العلميّة والمنشورات المحكَّمة',
    print: 'تنزيل السيرة (PDF)',
    eduH: 'المؤهّلات العلميّة',
    pubH: 'المنشورات المحكَّمة',
    artH: 'المقالات والسلاسل',
    ijazaH: 'الإجازات العلميّة',
    confH: 'المؤتمرات والمشاركات',
    memH: 'العضويّات واللجان',
    soon: 'يُستكمَل هذا القسم قريبًا بإذن الله.',
    viewAll: 'عرض جميع المقالات',
    lecturesL: 'محاضرة ودرس',
    yearsL: 'سنةَ خبرة',
    langsL: 'لغات',
    thesisL: 'موضوع الرسالة:',
  },
  en: {
    cv: 'Academic CV',
    sub: 'A consolidated overview of the academic record and peer-reviewed work',
    print: 'Download CV (PDF)',
    eduH: 'Academic Qualifications',
    pubH: 'Peer-Reviewed Publications',
    artH: 'Articles & Series',
    ijazaH: 'Scholarly Ijāzas',
    confH: 'Conferences & Participation',
    memH: 'Memberships & Committees',
    soon: 'This section will be completed soon, God willing.',
    viewAll: 'View all articles',
    lecturesL: 'lectures & lessons',
    yearsL: 'years of experience',
    langsL: 'languages',
    thesisL: 'Thesis:',
  },
  es: {
    cv: 'CV académico',
    sub: 'Una visión consolidada de la trayectoria académica y la obra arbitrada',
    print: 'Descargar CV (PDF)',
    eduH: 'Titulaciones académicas',
    pubH: 'Publicaciones arbitradas',
    artH: 'Artículos y series',
    ijazaH: 'Ijazas académicas',
    confH: 'Conferencias y participación',
    memH: 'Membresías y comités',
    soon: 'Esta sección se completará pronto, si Dios quiere.',
    viewAll: 'Ver todos los artículos',
    lecturesL: 'conferencias y lecciones',
    yearsL: 'años de experiencia',
    langsL: 'idiomas',
    thesisL: 'Tesis:',
  },
  ur: {
    cv: 'علمی سوانح',
    sub: 'علمی سفر اور ہم مرتبہ جائزہ شدہ تحقیق کا جامع خاکہ',
    print: 'سوانح ڈاؤن لوڈ کریں (PDF)',
    eduH: 'علمی اسناد',
    pubH: 'ہم مرتبہ جائزہ شدہ تحقیقات',
    artH: 'مقالات اور سلسلے',
    ijazaH: 'علمی اجازات',
    confH: 'کانفرنسیں اور شرکت',
    memH: 'رکنیتیں اور کمیٹیاں',
    soon: 'یہ سیکشن جلد مکمل کیا جائے گا، إن شاء اللہ۔',
    viewAll: 'تمام مقالات دیکھیں',
    lecturesL: 'لیکچر و دروس',
    yearsL: 'سالِ خدمت',
    langsL: 'زبانیں',
    thesisL: 'مقالے کا عنوان:',
  },
};

const bio: Record<Loc, string> = {
  ar: 'الدكتور أحمد أبو سيف حاصلٌ على درجة العالَميّة (الدكتوراه) في التفسير وعلوم القرآن من جامعة الأزهر، ورئيسُ أكاديمية الأئمة بأمريكا (American Imams Academy). له نحوُ خمسةٍ وثلاثين عامًا في الدعوة والتدريس والخطابة منذ عام ١٩٩١م، وأكثرُ من ألفينِ وستِّمئةِ محاضرةٍ ودرسٍ بثلاث لغات، مع إسهاماتٍ بحثيّةٍ محكَّمةٍ في التفسير والفقه وفقه الأقلّيّات.',
  en: 'Dr. Ahmed Abouseif holds a doctorate (al-ʿĀlamiyya) in Tafsīr and Qurʾanic Sciences from al-Azhar University and serves as President of the American Imams Academy (AIA). He has nearly thirty-five years of daʿwah, teaching, and preaching since 1991, with more than 2,600 lectures and lessons delivered in four languages, alongside peer-reviewed research in tafsīr, fiqh, and the jurisprudence of Muslim minorities.',
  es: 'El Dr. Ahmed Abouseif posee un doctorado (al-ʿĀlamiyya) en Tafsir y Ciencias Coránicas por la Universidad de Al-Azhar y es presidente de la Academia Americana de Imames (AIA). Cuenta con casi treinta y cinco años de predicación, enseñanza y oratoria desde 1991, con más de 2.600 conferencias y lecciones impartidas en cuatro idiomas, además de investigaciones arbitradas en tafsir, jurisprudencia y la jurisprudencia de las minorías musulmanas.',
  ur: 'ڈاکٹر احمد ابو سیف جامعہ ازہر سے تفسیر اور علوم القرآن میں العالمیۃ (ڈاکٹریٹ) کے حامل اور امریکن امامز اکیڈمی (AIA) کے بانی و صدر ہیں۔ ۱۹۹۱ء سے اب تک تقریباً پینتیس سال کے دعوت، تعلیم اور خطابت کے تجربے کے ساتھ چار زبانوں میں ڈھائی ہزار سے زائد لیکچرز اور دروس دیے ہیں، اور تفسیر، فقہ اور فقہ الاقلیات میں ہم مرتبہ جائزہ شدہ تحقیقات سپرد قلم کی ہیں۔',
};

const articleCategoryLabels: Record<ArticleCategory, Record<Loc, string>> = {
  'maqasid-tafsir': { ar: 'التفسير المقاصدي', en: 'Maqāṣid-Based Tafsīr', es: 'Tafsir basado en los objetivos', ur: 'مقاصدی تفسیر' },
  'wisdom-insights': { ar: 'حِكَمٌ وبصائر', en: 'Wisdom & Insights', es: 'Sabiduría y perspicacias', ur: 'حکمتیں اور بصیرتیں' },
  'prophetic-light': { ar: 'قبسٌ من نور النبوّة', en: 'Glimmers of Prophetic Light', es: 'Destellos de la Luz Profética', ur: 'نورِ نبوّت کی کرنیں' },
  imamship: { ar: 'الإمامة والقيادة', en: 'Imamship & Leadership', es: 'Imamato y liderazgo', ur: 'امامت و قیادت' },
  civilization: { ar: 'الإسلام والحضارة', en: 'Islam & Civilization', es: 'Islam y civilización', ur: 'قرآن اور تہذیب' },
  'quranic-concepts': { ar: 'المفاهيم الإيمانية', en: 'Concepts of Faith', es: 'Conceptos de la Fe', ur: 'ایمانی مفاہیم' },
  family: { ar: 'الأسرة', en: 'Family', es: 'Familia', ur: 'خاندان' },
  fiqh: { ar: 'الفقه', en: 'Fiqh', es: 'Jurisprudencia', ur: 'فقہ الاقلیات' },
};

const educationDegrees: { slug: string; degree: Record<Loc, string> }[] = [
  {
    slug: 'ibn-juzayy-tarjihat',
    degree: {
      ar: 'العالَميّة (الدكتوراه) في التفسير وعلوم القرآن',
      en: 'Doctorate (al-ʿĀlamiyya) in Tafsīr & Qurʾanic Sciences',
      es: 'Doctorado (al-ʿĀlamiyya) en Tafsir y Ciencias Coránicas',
      ur: 'العالمیۃ (ڈاکٹریٹ) — تفسیر اور علوم القرآن',
    },
  },
  {
    slug: 'maturidi-tawilat-al-araf',
    degree: {
      ar: 'التخصّص (الماجستير) في التفسير وعلوم القرآن',
      en: "Master’s (al-Takhaṣṣuṣ) in Tafsīr & Qurʾanic Sciences",
      es: 'Maestría (al-Takhaṣṣuṣ) en Tafsir y Ciencias Coránicas',
      ur: 'التخصّص (ماجستیر) — تفسیر اور علوم القرآن',
    },
  },
];

export default async function CvPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc: Loc = locale === 'ar' || locale === 'es' || locale === 'ur' ? (locale as Loc) : 'en';
  const t = ui[loc];

  const pubs = researchMeta.filter((r) => !r.draft).sort((a, b) => b.year - a.year);

  const orderedCats: ArticleCategory[] = [
    'maqasid-tafsir', 'quranic-concepts', 'wisdom-insights', 'prophetic-light', 'imamship', 'civilization', 'family', 'fiqh',
  ];
  const articlesByCat = orderedCats
    .map((cat) => ({
      cat,
      items: articlesMeta
        .filter((a) => !a.draft && a.category === cat)
        .sort((a, b) => b.isoDate.localeCompare(a.isoDate)),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-3">{t.cv}</h1>
              <p className="text-lg text-navy-600 leading-relaxed">{t.sub}</p>
            </div>
            <PrintButton label={t.print} />
          </div>
        </div>

        {/* Bio */}
        <p className="text-base sm:text-lg text-navy-700 leading-loose mb-10">{bio[loc]}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-14">
          {[
            { n: `+${siteConfig.stats.lectures.toLocaleString(loc === 'ar' ? 'ar-EG' : 'en-US')}`, l: t.lecturesL },
            { n: `+${siteConfig.stats.years}`, l: t.yearsL },
            { n: `${siteConfig.stats.languages}`, l: t.langsL },
          ].map((s, i) => (
            <div key={i} className="rounded-lg border border-navy-100 bg-navy-50/40 p-4 text-center">
              <div className="text-2xl sm:text-3xl font-semibold text-navy-700">{s.n}</div>
              <div className="text-xs sm:text-sm text-navy-500 mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Education */}
        <Section title={t.eduH}>
          <div className="space-y-6">
            {educationDegrees.map(({ slug, degree }) => {
              const item = researchMeta.find((r) => r.slug === slug);
              if (!item) return null;
              return (
                <div key={slug} className="border-s-2 border-gold-300 ps-4">
                  <div className="text-base font-medium text-navy-700">{degree[loc]}</div>
                  <div className="text-sm text-navy-500 mt-0.5">
                    {localize(item.venue, locale)} · {item.year}
                  </div>
                  <div className="text-sm text-navy-600 mt-1">
                    <span className="text-navy-400">{t.thesisL} </span>
                    <Link href={`/research/${slug}`} className="text-navy-700 hover:text-gold-600 no-underline">
                      {localize(item.title, locale)}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Publications */}
        <Section title={`${t.pubH} (${pubs.length})`}>
          <ol className="space-y-5">
            {pubs.map((r) => (
              <li key={r.slug} className="border-b border-navy-50 pb-5 last:border-0">
                <Link href={`/research/${r.slug}`} className="text-base font-medium text-navy-700 hover:text-gold-600 no-underline leading-snug">
                  {localize(r.title, locale)}
                </Link>
                <div className="text-sm text-navy-500 mt-1">
                  <span className="text-gold-600">{researchTypeLabels[loc][r.type]}</span>
                  {' · '}{localize(r.venue, locale)}{' · '}{r.year}
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* Articles & series */}
        <Section title={t.artH}>
          <div className="space-y-7">
            {articlesByCat.map(({ cat, items }) => (
              <div key={cat}>
                <h3 className="text-sm font-semibold text-gold-600 mb-3">{articleCategoryLabels[cat][loc]}</h3>
                <ul className="space-y-2">
                  {items.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/articles/${a.slug}`} className="text-[15px] text-navy-700 hover:text-gold-600 no-underline">
                        {localize(a.title, locale)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <Link href="/articles" className="text-sm font-medium text-navy-600 hover:text-gold-600 no-underline">
              {t.viewAll}
            </Link>
          </div>
        </Section>

        {/* Manual sections */}
        <Section title={t.ijazaH}>
          <p className="text-sm text-navy-400 italic">{t.soon}</p>
        </Section>
        <Section title={t.confH}>
          <p className="text-sm text-navy-400 italic">{t.soon}</p>
        </Section>
        <Section title={t.memH}>
          <p className="text-sm text-navy-400 italic">{t.soon}</p>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-navy-700 mb-5 pb-2 border-b-2 border-gold-200">{title}</h2>
      {children}
    </section>
  );
}
