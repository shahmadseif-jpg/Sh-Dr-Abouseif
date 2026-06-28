import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { researchMeta, researchTypeLabels } from '@/lib/research';
import { localize } from '@/lib/articles';
import { siteConfig } from '@/lib/site-config';
import PrintButton from '@/components/PrintButton';

type Loc = 'ar' | 'en' | 'es';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const ar = locale === 'ar';
  return {
    title: `${ar ? 'السيرة الذاتية والعلمية' : locale === 'es' ? 'Biografía y CV académico' : 'Biography & Academic CV'} — ${ar ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}`,
    description: ar
      ? 'السيرة الذاتية والعلمية والمنشورات المحكَّمة للدكتور أحمد أبو سيف'
      : locale === 'es'
      ? 'Biografía, CV académico y publicaciones arbitradas del Dr. Ahmed Abouseif'
      : 'Biography, academic CV, and peer-reviewed publications of Dr. Ahmed Abouseif',
  };
}

const ui: Record<Loc, Record<string, string>> = {
  ar: {
    title: 'السيرة الذاتية والعلمية',
    sub: 'نظرةٌ جامعةٌ على المسيرة الشخصية والعلمية والمنشورات المحكَّمة',
    print: 'تنزيل السيرة (PDF)',
    part1: 'أولاً: السيرة الذاتية',
    part2: 'ثانياً: المسيرة العلمية',
    academicH: 'المؤهّلات العلمية والإجازات',
    scholarlyH: 'الإسهام العلمي والإعلامي',
    leadershipH: 'الخبرات العملية والقيادية',
    pubH: 'المنشورات المحكَّمة',
    viewAllResearch: 'عرض جميع الأبحاث',
    lecturesL: 'محاضرة ودرس',
    yearsL: 'سنةَ خبرة',
    langsL: 'لغات',
  },
  en: {
    title: 'Biography & Academic CV',
    sub: 'A consolidated overview of the personal and academic journey and peer-reviewed work',
    print: 'Download CV (PDF)',
    part1: 'Part One: Biography',
    part2: 'Part Two: Academic Record',
    academicH: 'Academic Qualifications & Ijāzas',
    scholarlyH: 'Scholarly & Media Contributions',
    leadershipH: 'Professional & Leadership Experience',
    pubH: 'Peer-Reviewed Publications',
    viewAllResearch: 'View all research',
    lecturesL: 'lectures & lessons',
    yearsL: 'years of experience',
    langsL: 'languages',
  },
  es: {
    title: 'Biografía y CV académico',
    sub: 'Una visión consolidada de la trayectoria personal y académica y la obra arbitrada',
    print: 'Descargar CV (PDF)',
    part1: 'Primera parte: Biografía',
    part2: 'Segunda parte: Trayectoria académica',
    academicH: 'Titulaciones académicas e iyazas',
    scholarlyH: 'Contribuciones académicas y mediáticas',
    leadershipH: 'Experiencia profesional y de liderazgo',
    pubH: 'Publicaciones arbitradas',
    viewAllResearch: 'Ver todas las investigaciones',
    lecturesL: 'conferencias y lecciones',
    yearsL: 'años de experiencia',
    langsL: 'idiomas',
  },
};

const intro: Record<Loc, string> = {
  ar: 'الإمام د. أحمد محمد علي أبو سيف، حاصلٌ على درجة العالَميّة (الدكتوراه) في التفسير وعلوم القرآن من جامعة الأزهر، وحاملُ إجازةٍ قرآنيّةٍ برواية حفصٍ بالسند المتصل إلى النبي ﷺ. مؤسِّسٌ ورئيسٌ لأكاديمية الأئمة بأمريكا (ببلانو-تكساس) منذ ٢٠١٧م، وإمامُ مسجد الأكاديمية ومديرُ شؤونه الدينية. خبرةٌ تمتدّ لأكثر من خمسةٍ وثلاثين عاماً بين الإمامة والتدريس الجامعي والبحث العلمي والإرشاد الأسري في مصر والولايات المتحدة، مع أكثر من ألفينِ وستِّمئةِ محاضرةٍ ودرسٍ بثلاث لغات.',
  en: 'Imam Dr. Ahmed Muhammad Ali Abouseif holds a doctorate (al-ʿĀlamiyya) in Tafsīr and Qurʾanic Sciences from al-Azhar University and a Qurʾanic ijāza (Hafs) with a connected isnād to the Prophet ﷺ. He is the founder and president of the American Imams Academy (Plano, TX) since 2017, and the imam and director of religious affairs of its mosque. He brings more than thirty-five years of experience across imamship, university teaching, scholarly research, and family counseling in Egypt and the United States, with over 2,600 lectures and lessons delivered in three languages.',
  es: 'El Imam Dr. Ahmed Muhammad Ali Abouseif posee un doctorado (al-ʿĀlamiyya) en Tafsir y Ciencias Coránicas por la Universidad de Al-Azhar y una iyaza coránica (Hafs) con un isnad conectado hasta el Profeta ﷺ. Es fundador y presidente de la Academia Americana de Imames (Plano, Texas) desde 2017, e imam y director de asuntos religiosos de su mezquita. Cuenta con más de treinta y cinco años de experiencia en el imamato, la docencia universitaria, la investigación académica y la orientación familiar en Egipto y los Estados Unidos, con más de 2.600 conferencias y lecciones impartidas en tres idiomas.',
};

const lists: Record<'ar' | 'en', { academic: string[]; scholarly: string[]; leadership: string[] }> = {
  ar: {
    academic: [
      'دكتوراه في التفسير وعلوم القرآن الكريم — جامعة الأزهر، ٢٠٠٨م. عنوان الرسالة: «ترجيحات الإمام ابن جُزَيّ الكلبي في تفسيره التسهيل لعلوم التنزيل — دراسة وتقويم»',
      'ماجستير في التفسير وعلوم القرآن الكريم — جامعة الأزهر، ٢٠٠٣م. عنوان الرسالة: «تفسير الإمام الماتريدي تأويلات أهل السنّة — تحقيق ودراسة لسورة الأعراف»',
      'ليسانس أصول الدين والدعوة الإسلامية (قسم الدعوة والثقافة الإسلامية) — كلية أصول الدين بطنطا، جامعة الأزهر، ١٩٩٦م',
      'تعليم أزهري كامل (ابتدائي / إعدادي / ثانوي) — معهد قُطور الأزهري',
      'إجازة قرآنية برواية حفص من طريقي الشاطبية والطيبة، بالسند المتصل إلى النبي ﷺ',
      'الدورة العلمية للأئمة الروّاد — وزارة الأوقاف المصرية (٢٠٠٤م)',
      'دورات تكوين المفتين — دار الإفتاء المصرية (٢٠٠٧ — ٢٠١٠م)',
      'دورات متخصصة في دراسة وتحليل التراث الإسلامي — مركز الدراسات المعرفية بإشراف أ.د. طه جابر العلواني',
      'دورة متخصصة في الاستشارات وحل النزاعات الأسرية — بإشراف د. محروس شحاتة',
      'دورة علمية متخصصة في فضّ المنازعات — مجمع فقهاء الشريعة بأمريكا (AMJA) — ٢٠١٥م',
      'دورة متخصصة في التعامل مع الشباب في الغرب — ٢٠١٦م',
    ],
    scholarly: [
      'محاضر بجامع الأزهر الشريف وبجامع عمرو بن العاص (٢٠٠٧ — ٢٠١٠م)',
      'مشاركات تلفزيونية متعددة في قنوات: أزهري، اقرأ، عين، الأسرة والطفل، الصحة والجمال، الناس، الرحمة، البركة، الحافظ، الحياة، المحور، Nile TV',
      'مشاركات إذاعية في: إذاعة القرآن الكريم، إذاعة الشرق الأوسط، إذاعة الشباب والرياضة',
      'تمثيل وزارة الأوقاف المصرية في مؤتمرات داخلية وخارجية',
      'مشاركات بحثية وبرامج تأهيل فقهية مع جهات متخصصة بأمريكا الشمالية',
      'أبحاث منشورة: «ذبائح أهل الكتاب في التناول القرآني» — مجلس الفقهاء بأمريكا الشمالية',
      'بحث: «المرأة والدعوة في المجتمع الغربي» — مجلس الفقهاء بأمريكا الشمالية',
      'بحث: «النوازل الدعوية للمسلمين الجُدُد في أمريكا» — مجمع فقهاء الشريعة بأمريكا (AMJA)',
      'بحث: «الفتوى: بين أهلية المفتي وفوضى الإفتاء» — مجمع فقهاء الشريعة بأمريكا (AMJA)',
      'بحث: «واقع الفتوى في الولايات المتحدة الأمريكية في ظل الذكاء الاصطناعي» — دار الإفتاء المصرية، المؤتمر العاشر (٢٠٢٥م)',
    ],
    leadership: [
      'المؤسس والرئيس التنفيذي — أكاديمية الأئمة الأمريكية، بلانو، تكساس (مارس ٢٠١٧م — الآن)',
      'إمام ومدير الشؤون الدينية — مسجد أكاديمية الأئمة (نوفمبر ٢٠٢١م — الآن)',
      'مؤسّس المجلس الأعلى للشؤون الإسلامية بأمريكا الشمالية',
      'عضو مشارك بمجمع فقهاء الشريعة بأمريكا (AMJA)',
      'عضو سابق في اللجنة التنفيذية لاتحاد الأئمة بأمريكا الشمالية (NAIF)',
      'محاضر ببرنامج الدراسات الإسلامية — أكاديمية IANT القرآنية، ريتشاردسون، تكساس (يناير ٢٠١٩ — ٢٠٢١م)',
      'إمام ومدير الشؤون الدينية — المركز الإسلامي بمدينة مسكيت، تكساس (أبريل ٢٠١٦ — أكتوبر ٢٠٢١م)',
      'إمام ومدير معهد القرآن الكريم — المركز الإسلامي بتوليدو، أوهايو (٢٠١١ — ٢٠١٦م)',
      'مدير الإدارة العامة للإرشاد الديني — وزارة الأوقاف المصرية (يوليو ٢٠٠٧ — يناير ٢٠١١م)',
      'محاضر بمعهد إعداد الدعاة — وزارة الأوقاف المصرية (٢٠٠٨ — ٢٠١١م)',
      'إمام ومدير الشؤون الدينية — مسجد سعد، توليدو، أوهايو (سبتمبر ٢٠٠٦ — يونيو ٢٠٠٧م)',
      'إمام وخطيب — وزارة الأوقاف المصرية (١٩٩٧ — ٢٠٠٦م)',
    ],
  },
  en: {
    academic: [
      "Ph.D. in Tafsīr and Qur'anic Sciences — Al-Azhar University, 2008. Dissertation: \"The Preferred Opinions of Imam Ibn Juzayy al-Kalbī in Al-Tashīl li-ʿUlūm al-Tanzīl — Study and Evaluation\"",
      "M.A. in Tafsīr and Qur'anic Sciences — Al-Azhar University, 2003. Thesis: \"Imam al-Māturīdī's Taʾwīlāt Ahl al-Sunnah — Critical Edition and Study of Sūrat al-Aʿrāf\"",
      'B.A. in Uṣūl al-Dīn and Islamic Daʿwah (Department of Daʿwah & Islamic Culture) — Faculty of Uṣūl al-Dīn, Ṭanṭā, Al-Azhar University, 1996',
      'Full Azhar education (Primary / Preparatory / Secondary) — Qutur Azhar Institute',
      "Qur'an Ijazah (Hafs) through the Shāṭibiyyah and Ṭayyibah transmissions with a connected isnād to the Prophet ﷺ",
      'Pioneer Imams Scientific Course — Ministry of Awqāf (Egypt), 2004',
      'Mufti-Formation Courses — Dar al-Iftāʾ al-Miṣriyyah (2007 — 2010)',
      'Specialized Studies in Islamic Heritage (Analysis & Research) — Cognitive Studies Center under Prof. Taha Jabir al-ʿAlwānī',
      'Family Counseling & Conflict-Resolution Program — under Dr. Mahrous Shehata',
      'Dispute-Resolution Training — Assembly of Muslim Jurists of America (AMJA), 2015',
      'Youth Engagement in the West — Specialized Course, 2016',
    ],
    scholarly: [
      'Lecturer at Al-Azhar Mosque and Amr ibn al-ʿĀṣ Mosque (2007 — 2010)',
      'Television contributions on: Azhari, Iqraa, ʿAin, Family & Child, Health & Beauty, Al-Nas, Al-Rahma, Al-Baraka, Al-Hafez, Al-Hayah, Al-Mehwar, Nile TV',
      "Radio contributions on: Qur'an Karim, Middle East, Youth & Sports",
      'Represented the Ministry of Awqāf at national and international conferences',
      'Research presentations and fiqh-training programs with organizations across North America',
      '"People of the Book\'s Sacrificial Rulings in Qur\'anic Discourse" — Council of Islamic Jurists in North America',
      '"Women and Daʿwah in Western Society" — Council of Islamic Jurists in North America',
      '"Daʿwah Issues Pertaining to New Muslims in America" — Assembly of Muslim Jurists in America (AMJA)',
      '"Fatwa: The Mufti\'s Qualification versus the Chaos of Iftāʾ" — Assembly of Muslim Jurists in America (AMJA)',
      '"The Reality of Fatwa in the United States in the Age of Artificial Intelligence" — Dar al-Iftāʾ al-Miṣriyyah, Tenth Conference (2025)',
    ],
    leadership: [
      'Founder & CEO — American Imams Academy, Plano, TX (March 2017 — Present)',
      'Imam & Director of Religious Affairs — Imams Academy Mosque (November 2021 — Present)',
      'Founder — Supreme Council for Islamic Affairs in North America',
      'Associate Member — Assembly of Muslim Jurists of America (AMJA)',
      'Former Executive Committee Member — North American Imams Federation (NAIF)',
      "Lecturer, Islamic Studies Program — IANT Qur'anic Academy, Richardson, TX (January 2019 — 2021)",
      'Imam & Director of Religious Affairs — Mesquite Islamic Center, TX (April 2016 — October 2021)',
      "Imam & Director, Qur'an Institute — Toledo Muslim Community Center (TMCC), OH (2011 — 2016)",
      'Director, General Department of Religious Guidance — Ministry of Awqāf, Egypt (July 2007 — January 2011)',
      'Lecturer, Institute for Imam Preparation — Ministry of Awqāf, Egypt (2008 — 2011)',
      'Imam & Director of Religious Affairs — Saad Mosque, Toledo, OH (September 2006 — June 2007)',
      'Imam & Khatīb — Ministry of Awqāf, Egypt (1997 — 2006)',
    ],
  },
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc: Loc = locale === 'ar' || locale === 'es' ? locale : 'en';
  const t = ui[loc];
  const data = lists[(locale === 'es' ? 'en' : locale) as 'ar' | 'en'];
  const pubs = researchMeta.filter((r) => !r.draft).sort((a, b) => b.year - a.year);

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-3">{t.title}</h1>
              <p className="text-lg text-navy-600 leading-relaxed">{t.sub}</p>
            </div>
            <PrintButton label={t.print} />
          </div>
        </div>

        {/* Intro */}
        <p className="text-base sm:text-lg text-navy-700 leading-loose mb-12">{intro[loc]}</p>

        {/* Part One — Biography */}
        <PartHeading>{t.part1}</PartHeading>
        <Section title={t.academicH}><BulletList items={data.academic} /></Section>
        <Section title={t.scholarlyH}><BulletList items={data.scholarly} /></Section>
        <Section title={t.leadershipH}><BulletList items={data.leadership} /></Section>

        {/* Part Two — Academic Record */}
        <PartHeading>{t.part2}</PartHeading>

        <div className="grid grid-cols-3 gap-4 mb-12">
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
          <div className="mt-5">
            <Link href="/research" className="text-sm font-medium text-navy-600 hover:text-gold-600 no-underline">
              {t.viewAllResearch}
            </Link>
          </div>
        </Section>

      </div>
    </div>
  );
}

function PartHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl font-semibold text-navy-700 mt-16 mb-8 pb-3 border-b-2 border-gold-300 first:mt-0">
      {children}
    </h2>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h3 className="text-xl font-medium text-navy-700 mb-4">{title}</h3>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex gap-3 items-start text-navy-600 leading-relaxed">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
