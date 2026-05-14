/**
 * Articles metadata — safe to import in client components.
 * For file content loading (uses fs), see lib/articles-server.ts
 */

export type ArticleCategory = 'imamship' | 'civilization' | 'family' | 'fiqh';

export interface ArticleMeta {
  slug: string;
  category: ArticleCategory;
  isoDate: string; // YYYY-MM-DD
  date: { ar: string; en: string };
  readingMinutes: number;
  series?: { ar: string; en: string };
  episode?: number;
  title: { ar: string; en: string };
  subtitle?: { ar: string; en: string };
  excerpt: { ar: string; en: string };
  draft?: boolean;
}

export const articlesMeta: ArticleMeta[] = [
  {
    slug: 'hudhud-and-sayl',
    category: 'civilization',
    isoDate: '2026-05-18',
    date: { ar: '١٨ مايو ٢٠٢٦', en: 'May 18, 2026' },
    readingMinutes: 15,
    series: {
      ar: 'القرآن والحضارة',
      en: 'The Qur\'an and Civilization',
    },
    episode: 3,
    title: {
      ar: 'جَناحُ الهُدهُد وَسَيلُ العَرِم — سُنَّةُ الصُّعود والسُّقوط في القُرآن',
      en: "The Hoopoe's Wing and the Flood of al-ʿArim — The Law of Rise and Fall in the Qur'an",
    },
    subtitle: {
      ar: 'الحلقة الثالثة — جدلية سورتي النَّمل وسَبَأ بين تَمَدُّد الحَضارة وانكفائها',
      en: "Episode Three — A Dialectical Reading of Sūrat al-Naml and Sūrat Sabaʾ between Expansion and Withdrawal",
    },
    excerpt: {
      ar: 'في الأَرض ذاتِها مِن جَزيرَة العَرَب نَهَضَت حَضارَتان: حَضارَة سُليمان تَتَمَدَّد وَتَستَكشِف، وَحَضارَة سَبَأ تَنكَفِئ ثُمَّ تَتَفَرَّق. الحَلقَة الثَّالِثَة مِن سِلسلة «القُرآن والحَضارَة» تَستَخرِج مِن سورَتَي النَّمل وسَبَأ ثَلاثَة أَركان تَنظيميَّة (تَوزيع الأَدوار، الاستِكشاف، نَقل التِّقنيَة)، وَتَطرَح جَدَليَّة المَسجِد السُّليماني مُقابِل المَسجِد السَّبَئي في الغَرب اليَوم.',
      en: "In the same Arabian land, two civilizations arose: Sulaymān's expanding and exploring, and Sabaʾ's withdrawing and scattering. Episode Three of the 'Qur'an and Civilization' series extracts from Sūrat al-Naml and Sūrat Sabaʾ three organizational pillars (distribution of roles, exploration, technology transfer), and presents the dialectic of the Sulaymanic vs. the Sabaʾi mosque in the West today.",
    },
  },
  {
    slug: 'yusuf-diaspora-civilization',
    category: 'civilization',
    isoDate: '2026-05-17',
    date: { ar: '١٧ مايو ٢٠٢٦', en: 'May 17, 2026' },
    readingMinutes: 13,
    series: {
      ar: 'القرآن والحضارة',
      en: 'The Qur\'an and Civilization',
    },
    episode: 2,
    title: {
      ar: 'سورة يوسُف ومَنحَنى الصُّعود الحَضاري',
      en: 'Sūrat Yūsuf and the Curve of Civilizational Ascent',
    },
    subtitle: {
      ar: 'الحلقة الثانية — من قاع البئر إلى عَرش الإمبراطورية، ومن الفَرد إلى الأُمَّة',
      en: "Episode Two — From the Pit's Floor to an Imperial Throne, From the Individual to the Ummah",
    },
    excerpt: {
      ar: 'الكَواكِب الإِحدى عَشرَة سَجَدَت لِيوسُف في رُؤياه قَبل أَن تَنحَني له إخوَتُه في مَجلِسه. مَنحَنى الصُّعود يُولَد في البَصيرَة قَبل أَن يَتَجَلَّى في الحَدَث. الحَلَقَة الثَّانيَة مِن سِلسلة «القُرآن والحَضارَة» تَستَخرِج مِن سورَة يوسُف أَربَعَة أَركان لِلصُّعود (العَفاف، العِلم، الاستِنباط، الهِمَّة)، تُشَخِّص ثَلاث أَزَمات لِلجاليَة المُسلِمَة في الغَرب، وَتَطرَح نَموذَج «الزَّرع في أَرض المَهجَر» الَّذي بَين يوسُف وموسى أَربَعَةُ قُرون.',
      en: "The eleven stars bowed to Yūsuf in his dream long before his brothers bowed before his throne. The curve of ascent is born in vision before it manifests in event. Episode Two of the 'Qur'an and Civilization' series extracts from Sūrat Yūsuf four pillars of ascent (chastity, knowledge, foresight, ambition), diagnoses three crises of the Muslim community in the West, and proposes the model of 'sowing in the land of diaspora' — the four centuries that lay between Yūsuf and Mūsā.",
    },
  },
  {
    slug: 'fatwa-and-collective-voice',
    category: 'imamship',
    isoDate: '2026-05-16',
    date: { ar: '١٦ مايو ٢٠٢٦', en: 'May 16, 2026' },
    readingMinutes: 11,
    series: {
      ar: 'الإمام في الغرب — مدرسة في صناعة القائد',
      en: 'The Imam in the West — A School in Crafting the Leader',
    },
    episode: 4,
    title: {
      ar: 'الإمام بين الفتوى الفردية وصوت الجماعة',
      en: 'The Imam Between Individual Fatwa and Collective Voice',
    },
    subtitle: {
      ar: 'الحلقة الرابعة والأخيرة — حين يَفقد الإفتاء بَوصلتَه في عَصر الخوارزميَّات',
      en: 'Episode Four (Final) — When Fatwa Loses Its Compass in the Age of Algorithms',
    },
    excerpt: {
      ar: 'مُسلمٌ واحد يَستفتي أربعة مَصادر — شيخ يوتيوب، إمام محلي، داعية إنستجرام، نموذج ذكاء اصطناعي — فيتلقَّى أربع فتاوى مُتناقضة. هذه أزمة الإفتاء في الغَرب. الحلقة الرابعة والأخيرة تَعرض شُروط الفَتوى الكلاسيكية، تُشَخِّص انهيار المرجعية، وتطرح مَنظومة «صوت الجماعة» بَديلًا، مع تَوظيف بَحث الشيخ لِدار الإفتاء ٢٠٢٥ عن الفَتوى والذكاء الاصطناعي.',
      en: "A single Muslim consults four sources — a YouTube shaykh, a local imam, an Instagram preacher, and an AI model — and receives four contradictory fatwas. This is the crisis of issuing religious rulings in the West. The fourth and final episode of the series presents the classical conditions of fatwa, diagnoses the collapse of religious authority, and proposes a 'collective voice' alternative — drawing on Dr. Ahmed's 2025 paper for Dar al-Iftaa on fatwa in the age of artificial intelligence.",
    },
  },
  {
    slug: 'institutional-mind',
    category: 'imamship',
    isoDate: '2026-05-15',
    date: { ar: '١٥ مايو ٢٠٢٦', en: 'May 15, 2026' },
    readingMinutes: 9,
    series: {
      ar: 'الإمام في الغرب — مدرسة في صناعة القائد',
      en: 'The Imam in the West — A School in Crafting the Leader',
    },
    episode: 3,
    title: {
      ar: 'لماذا تحتاج مساجد الغرب إلى عقل مؤسسي؟',
      en: 'Why Western Mosques Need an Institutional Mind',
    },
    subtitle: {
      ar: 'الحلقة الثالثة — خمس عللٍ وخمسة أركان لبناء المسجد الذي يُورِّث',
      en: 'Episode Three — Five Diseases and Five Pillars for the Mosque That Bequeaths',
    },
    excerpt: {
      ar: 'مَسجدٌ بِلا ذاكرةٍ مؤسَّسية هو شَجرة بلا جذور: مُكتمِلٌ ظاهرًا، هَشٌّ في أوَّل ريح. خمس عِلَل تَنهَش مساجد الغَرب، وخمسة أركان عِلاجية تُحَوِّلها من مَكاتب خِدمات إلى مُؤَسَّسات تُورِّث للأجيال. تَأصيلٌ من فقه الأَوقاف، ونُبوءة ابن خَلدون عن الأَجيال الثلاثة.',
      en: 'A mosque without institutional memory is a tree without roots: complete in appearance, fragile at the first gust. Five diseases plague Western mosques, and five remedial pillars transform them from service desks into institutions that bequeath. A foundation drawn from the fiqh of awqāf and Ibn Khaldūn\'s warning about the three generations.',
    },
  },
  {
    slug: 'crafting-the-modern-imam',
    category: 'imamship',
    isoDate: '2026-05-14',
    date: { ar: '١٤ مايو ٢٠٢٦', en: 'May 14, 2026' },
    readingMinutes: 9,
    series: {
      ar: 'الإمام في الغرب — مدرسة في صناعة القائد',
      en: 'The Imam in the West — A School in Crafting the Leader',
    },
    episode: 2,
    title: {
      ar: 'صناعة الإمام المعاصر: العلم، والإدارة، والاحتواء النفسي',
      en: 'Crafting the Modern Imam: Knowledge, Management, and Pastoral Containment',
    },
    subtitle: {
      ar: 'الحلقة الثانية — من تأسيس العلم إلى احتواء الأزمات والذات',
      en: 'Episode Two — From Building Knowledge to Containing Crises and the Self',
    },
    excerpt: {
      ar: 'لا تُبنى إمامةُ الغرب على عِلمٍ شرعيٍّ خالص ولا على مهارةٍ خَطابية وَحدها. الإمامُ المعاصر يحتاج إلى ثلاثة أركان متلازمة: علمٍ أزهري مُتَّصلٍ بفقه الأقليات، وإدارةٍ مؤسَّسية بأدواتها العملية، واحتواءٍ نفسي للناس وللذات. هذه الحلقة الثانية تقدِّم نموذج التَّأهيل.',
      en: "Imamship in the West cannot be built on Sharia knowledge alone, nor on rhetorical skill. The contemporary imam needs three interlocking pillars: Azhari knowledge anchored in the fiqh of minorities, institutional management with operational tools, and pastoral containment for others and the self. Episode Two of the series presents the formation model.",
    },
  },
  {
    slug: 'imam-in-the-west',
    category: 'imamship',
    isoDate: '2026-05-13',
    date: { ar: '١٣ مايو ٢٠٢٦', en: 'May 13, 2026' },
    readingMinutes: 9,
    series: {
      ar: 'الإمام في الغرب — مدرسة في صناعة القائد',
      en: 'The Imam in the West — A School in Crafting the Leader',
    },
    episode: 1,
    title: {
      ar: 'الإمام في الغرب: من إمامة الصلاة إلى إمامة المجتمع',
      en: 'The Imam in the West: From Leading the Prayer to Leading the Ummah',
    },
    subtitle: {
      ar: 'الحلقة الأولى — التأصيل الفقهي، الواقع العملي، وثَمن القيادة',
      en: 'Episode One — Jurisprudential Foundation, Operational Reality, and the Cost of Leadership',
    },
    excerpt: {
      ar: 'يومُ الإمام في الغرب يبدأ قبل أن تطلع الشمس بسبع دوائر متشابكة: شعائرية، فُتيائية، أُسرية، تربوية، مؤسَّسية، مُجتمعية، نَفسية. كيف انفصلت إمامة الصلاة عن إمامة المجتمع، ولماذا يفرض الواقع الأمريكي إعادة جمعهما؟',
      en: "The Imam's day in the West begins before sunrise across seven interlocking circles: ritual, fatwa, family, education, institutional, civic, and psycho-spiritual. How did prayer leadership separate from community leadership — and why does American reality demand their reunification?",
    },
  },
  {
    slug: 'quran-civilization',
    category: 'civilization',
    isoDate: '2026-05-12',
    date: { ar: '١٢ مايو ٢٠٢٦', en: 'May 12, 2026' },
    readingMinutes: 8,
    series: {
      ar: 'القرآن والحضارة',
      en: 'The Qur\'an and Civilization',
    },
    episode: 1,
    title: {
      ar: 'القرآن والتأصيل الحضاري',
      en: 'The Qur\'an and the Foundations of Civilization',
    },
    subtitle: {
      ar: 'الحلقة الأولى — حين يصنع الوحي الإنسان… تُولد الحضارة',
      en: 'Episode One — When Revelation Shapes the Human, Civilization is Born',
    },
    excerpt: {
      ar: 'سورة الكهف ليست مجرد سورة تُتلى يوم الجمعة طلبًا للبركة، بل هي بناء متكامل لأركان الحضارة الإنسانية: المورد البشري، المال الرشيد، العلم المتجدد، والقيادة العادلة. قراءة جديدة في معجم الكهف وأنبياء الحضارة.',
      en: 'Sūrat al-Kahf is not merely a chapter recited on Fridays in pursuit of blessing — it is a complete blueprint for the pillars of human civilization: the righteous human, rightly stewarded wealth, continuous knowledge, and just leadership. A fresh reading in the Kahf lexicon and the Qur\'anic prophets of civilization.',
    },
  },
];

export function getArticleMeta(slug: string): ArticleMeta | undefined {
  return articlesMeta.find((a) => a.slug === slug);
}

export function getAllArticles(): ArticleMeta[] {
  return [...articlesMeta]
    .filter((a) => !a.draft)
    .sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));
}

export const categoryLabels = {
  ar: {
    imamship: 'الإمامة والقيادة',
    civilization: 'القرآن والحضارة',
    family: 'الأسرة والتربية',
    fiqh: 'فقه وفكر',
  },
  en: {
    imamship: 'Imamship & Leadership',
    civilization: "Qur'an & Civilization",
    family: 'Family & Parenting',
    fiqh: 'Jurisprudence',
  },
};

