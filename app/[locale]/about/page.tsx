import { useTranslations, useLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: `${t('title')} — ${locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}` };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations('about');
  const locale = useLocale();

  const content = {
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
        'مدير الإدارة العامة للإرشاد الديني — وزارة الأوقاف المصرية (يوليو ٢٠٠٧م — يناير ٢٠١١م)',
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
        'Radio contributions on: Qur\'an Karim, Middle East, Youth & Sports',
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
        "Imam & Director of Religious Affairs — Imams Academy Mosque (November 2021 — Present)",
        'Founder — Supreme Council for Islamic Affairs in North America',
        'Associate Member — Assembly of Muslim Jurists of America (AMJA)',
        'Former Executive Committee Member — North American Imams Federation (NAIF)',
        "Lecturer, Islamic Studies Program — IANT Qur'anic Academy, Richardson, TX (January 2019 — 2021)",
        "Imam & Director of Religious Affairs — Mesquite Islamic Center, TX (April 2016 — October 2021)",
        "Imam & Director, Qur'an Institute — Toledo Muslim Community Center (TMCC), OH (2011 — 2016)",
        'Director, General Department of Religious Guidance — Ministry of Awqāf, Egypt (July 2007 — January 2011)',
        'Lecturer, Institute for Imam Preparation — Ministry of Awqāf, Egypt (2008 — 2011)',
        'Imam & Director of Religious Affairs — Saad Mosque, Toledo, OH (September 2006 — June 2007)',
        'Imam & Khatīb — Ministry of Awqāf, Egypt (1997 — 2006)',
      ],
    },
  };

  const data = content[locale as 'ar' | 'en'];

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.2em] text-gold-500 mb-3">
            {t('subtitle')}
          </div>
          <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-4">
            {t('title')}
          </h1>
          <p className="text-base sm:text-lg text-navy-600 max-w-3xl mx-auto leading-relaxed">
            {t('intro')}
          </p>
        </div>

        <div className="space-y-12 mt-16">
          <Section title={t('sections.academic')} items={data.academic} />
          <Section title={t('sections.scholarly')} items={data.scholarly} />
          <Section title={t('sections.leadership')} items={data.leadership} />
        </div>
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-2xl font-medium text-navy-700 mb-5 gold-line">
        {title}
      </h2>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-3 items-start text-navy-600 leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
