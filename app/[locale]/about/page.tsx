import { useTranslations, useLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { researchMeta, researchTypeLabels } from '@/lib/research';
import { articlesMeta, localize, type ArticleCategory } from '@/lib/articles';
import { siteConfig } from '@/lib/site-config';
import PrintButton from '@/components/PrintButton';

type Loc = 'ar' | 'en' | 'es' | 'ur';

const ui: Record<Loc, Record<string, string>> = {
  ar: {
    eyebrow: 'التعريف العلمي والدعوي',
    print: 'تنزيل السيرة (PDF)',
    currentH: 'المناصب والمهام الحالية',
    eduH: 'التكوين والمؤهلات العلمية',
    formationH: 'الإجازات والتكوين التخصصي',
    pubH: 'الأبحاث والمنشورات المحكَّمة',
    teachingH: 'التدريس والدعوة والإعلام',
    leadershipH: 'الخبرات العملية والقيادية',
    membershipH: 'العضويات والمبادرات المؤسسية',
    articlesH: 'المقالات والسلاسل العلمية',
    viewAll: 'عرض جميع المقالات',
    lecturesL: 'محاضرة ودرس',
    yearsL: 'سنةَ خبرة',
    langsL: 'لغات',
    thesisL: 'موضوع الرسالة:',
  },
  en: {
    eyebrow: 'Scholarly & Daʿwah Profile',
    print: 'Download CV (PDF)',
    currentH: 'Current Roles',
    eduH: 'Education & Academic Qualifications',
    formationH: 'Ijāzas & Specialized Formation',
    pubH: 'Peer-Reviewed Research & Publications',
    teachingH: 'Teaching, Daʿwah & Media',
    leadershipH: 'Professional & Leadership Experience',
    membershipH: 'Memberships & Institutional Initiatives',
    articlesH: 'Articles & Scholarly Series',
    viewAll: 'View all articles',
    lecturesL: 'lectures & lessons',
    yearsL: 'years of experience',
    langsL: 'languages',
    thesisL: 'Thesis:',
  },
  es: {
    eyebrow: 'Perfil académico y de daʿwa',
    print: 'Descargar CV (PDF)',
    currentH: 'Cargos actuales',
    eduH: 'Formación y titulaciones académicas',
    formationH: 'Iŷāzas y formación especializada',
    pubH: 'Investigaciones y publicaciones arbitradas',
    teachingH: 'Docencia, daʿwa y medios',
    leadershipH: 'Experiencia profesional y de liderazgo',
    membershipH: 'Membresías e iniciativas institucionales',
    articlesH: 'Artículos y series académicas',
    viewAll: 'Ver todos los artículos',
    lecturesL: 'conferencias y lecciones',
    yearsL: 'años de experiencia',
    langsL: 'idiomas',
    thesisL: 'Tesis:',
  },
  ur: {
    eyebrow: 'علمی و دعوتی تعارف',
    print: 'سوانح ڈاؤن لوڈ کریں (PDF)',
    currentH: 'موجودہ مناصب و ذمہ داریاں',
    eduH: 'تعلیم اور علمی اسناد',
    formationH: 'اجازات اور تخصصی تربیت',
    pubH: 'ہم مرتبہ جائزہ شدہ تحقیقات و مطبوعات',
    teachingH: 'تدریس، دعوت اور ذرائع ابلاغ',
    leadershipH: 'عملی و قائدانہ تجربات',
    membershipH: 'رکنیتیں اور ادارہ جاتی اقدامات',
    articlesH: 'مقالات اور علمی سلسلے',
    viewAll: 'تمام مقالات دیکھیں',
    lecturesL: 'لیکچر و دروس',
    yearsL: 'سالِ خدمت',
    langsL: 'زبانیں',
    thesisL: 'مقالے کا عنوان:',
  },
};

const articleCategoryLabels: Record<ArticleCategory, Record<Loc, string>> = {
  'maqasid-tafsir': { ar: 'التفسير المقاصدي', en: 'Maqāṣid-Based Tafsīr', es: 'Tafsir basado en los objetivos', ur: 'مقاصدی تفسیر' },
  'quranic-concepts': { ar: 'المفاهيم الإيمانية', en: 'Concepts of Faith', es: 'Conceptos de la Fe', ur: 'ایمانی مفاہیم' },
  'wisdom-insights': { ar: 'حِكَمٌ وبصائر', en: 'Wisdom & Insights', es: 'Sabiduría y perspicacias', ur: 'حکمتیں اور بصیرتیں' },
  'prophetic-light': { ar: 'قبسٌ من نور النبوّة', en: 'Glimmers of Prophetic Light', es: 'Destellos de la Luz Profética', ur: 'نورِ نبوّت کی کرنیں' },
  imamship: { ar: 'الإمامة والقيادة', en: 'Imamship & Leadership', es: 'Imamato y liderazgo', ur: 'امامت و قیادت' },
  civilization: { ar: 'القرآن والحضارة', en: "Qur'an & Civilization", es: 'El Corán y la Civilización', ur: 'قرآن اور تہذیب' },
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
    es: {
      academic: [
        'Doctorado en Tafsīr y Ciencias Coránicas — Universidad de Al-Azhar, 2008. Tesis doctoral: «Las opiniones preferidas del Imam Ibn Ŷuzayy al-Kalbī en Al-Tashīl li-ʿUlūm al-Tanzīl — Estudio y evaluación»',
        'Máster en Tafsīr y Ciencias Coránicas — Universidad de Al-Azhar, 2003. Tesis: «Las Taʾwīlāt Ahl al-Sunnah del Imam al-Māturīdī — Edición crítica y estudio de la sura de Al-Aʿrāf»',
        'Licenciatura en Uṣūl al-Dīn y Daʿwa Islámica (Departamento de Daʿwa y Cultura Islámica) — Facultad de Uṣūl al-Dīn, Ṭanṭā, Universidad de Al-Azhar, 1996',
        'Educación azharí completa (Primaria / Preparatoria / Secundaria) — Instituto Azharí de Qutur',
        'Iŷāza coránica (Ḥafṣ) por las transmisiones Shāṭibiyya y Ṭayyiba, con isnād conectado hasta el Profeta ﷺ',
        'Curso científico de los Imames Pioneros — Ministerio de Awqāf (Egipto), 2004',
        'Cursos de formación de muftíes — Dar al-Iftāʾ de Egipto (2007 — 2010)',
        'Estudios especializados en el legado islámico (análisis e investigación) — Centro de Estudios Cognitivos bajo la supervisión del Prof. Taha Yabir al-ʿAlwānī',
        'Programa de asesoramiento familiar y resolución de conflictos — bajo la supervisión del Dr. Mahrous Shehata',
        'Formación en resolución de disputas — Asamblea de Juristas Musulmanes de América (AMJA), 2015',
        'Curso especializado sobre el trato con los jóvenes en Occidente — 2016',
      ],
      scholarly: [
        'Conferenciante en la Mezquita de Al-Azhar y en la Mezquita de ʿAmr ibn al-ʿĀṣ (2007 — 2010)',
        'Múltiples participaciones televisivas en los canales: Azhari, Iqraa, ʿAin, Familia e Infancia, Salud y Belleza, Al-Nas, Al-Rahma, Al-Baraka, Al-Hafez, Al-Hayah, Al-Mehwar, Nile TV',
        'Participaciones radiofónicas en: Radio del Sagrado Corán, Radio de Oriente Medio, Radio de la Juventud y el Deporte',
        'Representación del Ministerio de Awqāf de Egipto en conferencias nacionales e internacionales',
        'Participaciones de investigación y programas de formación jurídica con entidades especializadas en Norteamérica',
        'Investigación publicada: «Las reses sacrificadas por las Gentes del Libro en el enfoque coránico» — Consejo de Juristas Islámicos en Norteamérica',
        'Investigación: «La mujer y la daʿwa en la sociedad occidental» — Consejo de Juristas Islámicos en Norteamérica',
        'Investigación: «Las nuevas circunstancias (nawāzil) de la daʿwa para los nuevos musulmanes en América» — Asamblea de Juristas Musulmanes de América (AMJA)',
        'Investigación: «La fatwa: entre la idoneidad del muftí y el caos de la emisión de dictámenes» — Asamblea de Juristas Musulmanes de América (AMJA)',
        'Investigación: «La realidad de la fatwa en los Estados Unidos en la era de la inteligencia artificial» — Dar al-Iftāʾ de Egipto, Décima Conferencia (2025)',
      ],
      leadership: [
        'Fundador y Director Ejecutivo — Academia Americana de Imames, Plano, Texas (marzo de 2017 — Presente)',
        'Imam y Director de Asuntos Religiosos — Mezquita de la Academia de Imames (noviembre de 2021 — Presente)',
        'Fundador — Consejo Supremo de Asuntos Islámicos en Norteamérica',
        'Miembro asociado — Asamblea de Juristas Musulmanes de América (AMJA)',
        'Antiguo miembro del Comité Ejecutivo — Federación de Imames de Norteamérica (NAIF)',
        'Conferenciante, Programa de Estudios Islámicos — Academia Coránica IANT, Richardson, Texas (enero de 2019 — 2021)',
        'Imam y Director de Asuntos Religiosos — Centro Islámico de Mesquite, Texas (abril de 2016 — octubre de 2021)',
        'Imam y Director del Instituto del Corán — Centro Comunitario Musulmán de Toledo (TMCC), Ohio (2011 — 2016)',
        'Director del Departamento General de Orientación Religiosa — Ministerio de Awqāf de Egipto (julio de 2007 — enero de 2011)',
        'Conferenciante, Instituto para la Preparación de Imames — Ministerio de Awqāf de Egipto (2008 — 2011)',
        'Imam y Director de Asuntos Religiosos — Mezquita Saad, Toledo, Ohio (septiembre de 2006 — junio de 2007)',
        'Imam y Jaṭīb — Ministerio de Awqāf de Egipto (1997 — 2006)',
      ],
    },
    ur: {
      academic: [
        'پی ایچ ڈی (درجۂ عالَمیّت) — تفسیر اور علوم القرآن — جامعہ ازہر، ۲۰۰۸ء۔ مقالے کا عنوان: «امام ابن جُزَیّ الکلبی کے تفسیر التسہیل لعلوم التنزیل میں ترجیحات — دراسۃ وتقویم»',
        "ماجستیر (درجۂ تخصّص) — تفسیر اور علوم القرآن — جامعہ ازہر، ۲۰۰۳ء۔ مقالے کا عنوان: «امام ماتریدی کی تفسیر 'تأویلات أہل السنّۃ' — سورۃ الأعراف کی تحقیق و دراسۃ»",
        'لیسانس (بی اے) — اصول الدین اور دعوۂ اسلامی، شعبۂ دعوۃ و ثقافتِ اسلامی — کلیۂ اصول الدین، طنطا، جامعہ ازہر، ۱۹۹۶ء',
        'مکمّل ازہری تعلیم (ابتدائی / اعدادی / ثانوی) — معہد قُطور الازہری',
        'اجازۂ قرآنیہ بروایتِ حفص از طریق الشاطبیۃ والطیبۃ، سندِ متصل کے ساتھ نبی کریم ﷺ تک',
        'دورۂ علمیہ برائے پیش رو ائمہ — وزارتِ اوقاف مصر، ۲۰۰۴ء',
        'دوراتِ تکوین المفتین — دارالافتاء المصریہ (۲۰۰۷ — ۲۰۱۰ء)',
        'اسلامی ورثے کے تجزیے و تحقیق میں تخصصی دورات — مرکز الدراسات المعرفیۃ بزیر نگرانی پروفیسر طہ جابر العلوانی',
        'خاندانی مشاورت اور تنازعات کے حل کا تخصصی پروگرام — بزیر نگرانی ڈاکٹر محروس شحاتۃ',
        'تصفیۂ نزاعات کا تخصصی دورہ — مجمع فقہاء الشریعۃ بأمریکا (AMJA)، ۲۰۱۵ء',
        'مغرب میں نوجوانوں کے ساتھ تعامل — تخصصی دورہ، ۲۰۱۶ء',
      ],
      scholarly: [
        'جامعۂ ازہر اور مسجد عمرو بن العاص میں محاضر (۲۰۰۷ — ۲۰۱۰ء)',
        'متعدد ٹیلی ویژن چینلوں میں شراکتیں: ازہری، اقرأ، عین، الأسرۃ والطفل، الصحۃ والجمال، الناس، الرحمۃ، البرکۃ، الحافظ، الحیاۃ، المحور، Nile TV',
        'ریڈیو پروگراموں میں شراکتیں: اذاعۃ القرآن الکریم، اذاعۃ الشرق الأوسط، اذاعۃ الشباب والریاضۃ',
        'قومی اور بین الاقوامی کانفرنسوں میں وزارتِ اوقاف مصر کی نمائندگی',
        'شمالی امریکہ کے تخصصی اداروں کے ساتھ تحقیقی شراکتیں اور فقہی تأہیل کے پروگرام',
        'شائع شدہ تحقیق: «اہل کتاب کے ذبائح قرآنی تناول میں» — مجلس فقہاء شمالی امریکہ',
        'تحقیق: «مغربی معاشرے میں خاتون اور دعوہ» — مجلس فقہاء شمالی امریکہ',
        'تحقیق: «امریکہ میں نومسلموں کے دعوتی نوازل» — مجمع فقہاء الشریعۃ بأمریکا (AMJA)',
        'تحقیق: «فتویٰ: مفتی کی اہلیت اور فتویٰ دینے کی افراتفری کے درمیان» — مجمع فقہاء الشریعۃ بأمریکا (AMJA)',
        'تحقیق: «مصنوعی ذہانت کے دور میں ریاست ہائے متحدہ امریکہ میں فتویٰ کی واقعیت» — دارالافتاء المصریہ، دسواں بین الاقوامی کانفرنس (۲۰۲۵ء)',
      ],
      leadership: [
        'بانی اور چیف ایگزیکٹیو آفیسر — امریکن امامز اکیڈمی، پلانو، ٹیکساس (مارچ ۲۰۱۷ء — حال)',
        'امام اور ڈائریکٹر برائے دینی امور — مسجد امامز اکیڈمی (نومبر ۲۰۲۱ء — حال)',
        'بانی — المجلس الأعلیٰ للشؤون الاسلامیۃ فی أمریکا الشمالیۃ',
        'رکن — مجمع فقہاء الشریعۃ بأمریکا (AMJA)',
        'سابق رکن، ایگزیکٹیو کمیٹی — North American Imams Federation (NAIF)',
        'محاضر، اسلامی علوم پروگرام — IANT قرآنی اکیڈمی، ریچرڈسن، ٹیکساس (جنوری ۲۰۱۹ — ۲۰۲۱ء)',
        'امام اور ڈائریکٹر برائے دینی امور — مسکوئی اسلامک سینٹر، ٹیکساس (اپریل ۲۰۱۶ — اکتوبر ۲۰۲۱ء)',
        'امام اور ڈائریکٹر، قرآن انسٹی ٹیوٹ — ٹولیڈو مسلم کمیونٹی سینٹر (TMCC)، اوہایو (۲۰۱۱ — ۲۰۱۶ء)',
        'ڈائریکٹر، جنرل ڈیپارٹمنٹ برائے دینی رہنمائی — وزارتِ اوقاف مصر (جولائی ۲۰۰۷ — جنوری ۲۰۱۱ء)',
        'محاضر، معہدِ اعداد الدعاۃ — وزارتِ اوقاف مصر (۲۰۰۸ — ۲۰۱۱ء)',
        'امام اور ڈائریکٹر برائے دینی امور — مسجد سعد، ٹولیڈو، اوہایو (ستمبر ۲۰۰۶ — جون ۲۰۰۷ء)',
        'امام اور خطیب — وزارتِ اوقاف مصر (۱۹۹۷ — ۲۰۰۶ء)',
      ],
    },
  };

  const loc: Loc =
    locale === 'ar' || locale === 'es' || locale === 'ur'
      ? (locale as Loc)
      : 'en';
  const data = content[loc];
  const labels = ui[loc];
  const pubs = researchMeta
    .filter((item) => !item.draft)
    .sort((a, b) => b.year - a.year);
  const orderedCats: ArticleCategory[] = [
    'maqasid-tafsir',
    'quranic-concepts',
    'wisdom-insights',
    'prophetic-light',
    'imamship',
    'civilization',
    'family',
    'fiqh',
  ];
  const articlesByCat = orderedCats
    .map((cat) => ({
      cat,
      items: articlesMeta
        .filter((item) => !item.draft && item.category === cat)
        .sort((a, b) => b.isoDate.localeCompare(a.isoDate)),
    }))
    .filter((group) => group.items.length > 0);

  const currentRoles = data.leadership.slice(0, 2);
  const memberships = data.leadership.slice(2, 5);
  const leadershipExperience = data.leadership.slice(5);
  const additionalEducation = data.academic.slice(2, 4);
  const specializedFormation = data.academic.slice(4);
  const teachingAndMedia = data.scholarly.slice(0, 5);

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 text-xs uppercase tracking-[0.2em] text-gold-500">
                {labels.eyebrow}
              </div>
              <h1 className="mb-3 text-4xl font-medium text-navy-700 sm:text-5xl">
                {t('title')}
              </h1>
              <p className="text-lg leading-relaxed text-navy-600">
                {t('subtitle')}
              </p>
            </div>
            <PrintButton label={labels.print} />
          </div>
        </div>

        <p className="mb-10 text-base leading-loose text-navy-700 sm:text-lg">
          {t('intro')}
        </p>

        <div className="mb-14 grid grid-cols-3 gap-4">
          {[
            {
              n: `+${siteConfig.stats.lectures.toLocaleString(
                loc === 'ar' ? 'ar-EG' : 'en-US'
              )}`,
              l: labels.lecturesL,
            },
            { n: `+${siteConfig.stats.years}`, l: labels.yearsL },
            { n: `${siteConfig.stats.languages}`, l: labels.langsL },
          ].map((stat) => (
            <div
              key={stat.l}
              className="rounded-lg border border-navy-100 bg-navy-50/40 p-4 text-center"
            >
              <div className="text-2xl font-semibold text-navy-700 sm:text-3xl">
                {stat.n}
              </div>
              <div className="mt-1 text-xs text-navy-500 sm:text-sm">
                {stat.l}
              </div>
            </div>
          ))}
        </div>

        <Section title={labels.currentH}>
          <div className="grid gap-4 sm:grid-cols-2">
            {currentRoles.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-navy-100 bg-navy-50/30 p-5 leading-relaxed text-navy-700"
              >
                {item}
              </div>
            ))}
          </div>
        </Section>

        <Section title={labels.eduH}>
          <div className="space-y-6">
            {educationDegrees.map(({ slug, degree }) => {
              const item = researchMeta.find((entry) => entry.slug === slug);
              if (!item) return null;
              return (
                <div key={slug} className="border-s-2 border-gold-300 ps-4">
                  <div className="font-medium text-navy-700">{degree[loc]}</div>
                  <div className="mt-0.5 text-sm text-navy-500">
                    {localize(item.venue, locale)} · {item.year}
                  </div>
                  <div className="mt-1 text-sm text-navy-600">
                    <span className="text-navy-400">{labels.thesisL} </span>
                    <Link
                      href={`/research/${slug}`}
                      className="text-navy-700 no-underline hover:text-gold-600"
                    >
                      {localize(item.title, locale)}
                    </Link>
                  </div>
                </div>
              );
            })}
            <BulletList items={additionalEducation} />
          </div>
        </Section>

        <Section title={labels.formationH}>
          <BulletList items={specializedFormation} />
        </Section>

        <Section title={`${labels.pubH} (${pubs.length})`}>
          <ol className="space-y-5">
            {pubs.map((item) => (
              <li
                key={item.slug}
                className="border-b border-navy-50 pb-5 last:border-0"
              >
                <Link
                  href={`/research/${item.slug}`}
                  className="font-medium leading-snug text-navy-700 no-underline hover:text-gold-600"
                >
                  {localize(item.title, locale)}
                </Link>
                <div className="mt-1 text-sm text-navy-500">
                  <span className="text-gold-600">
                    {researchTypeLabels[loc][item.type]}
                  </span>
                  {' · '}
                  {localize(item.venue, locale)}
                  {' · '}
                  {item.year}
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section title={labels.teachingH}>
          <BulletList items={teachingAndMedia} />
        </Section>

        <Section title={labels.leadershipH}>
          <BulletList items={leadershipExperience} />
        </Section>

        <Section title={labels.membershipH}>
          <BulletList items={memberships} />
        </Section>

        <Section title={labels.articlesH}>
          <div className="space-y-7">
            {articlesByCat.map(({ cat, items }) => (
              <div key={cat}>
                <h3 className="mb-3 text-sm font-semibold text-gold-600">
                  {articleCategoryLabels[cat][loc]}
                </h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/articles/${item.slug}`}
                        className="text-[15px] text-navy-700 no-underline hover:text-gold-600"
                      >
                        {localize(item.title, locale)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <Link
              href="/articles"
              className="text-sm font-medium text-navy-600 no-underline hover:text-gold-600"
            >
              {labels.viewAll}
            </Link>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-5 border-b-2 border-gold-200 pb-2 text-2xl font-semibold text-navy-700">
        {title}
      </h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 leading-relaxed text-navy-600"
        >
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
