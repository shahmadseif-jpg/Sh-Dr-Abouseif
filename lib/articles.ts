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
    title: {
      ar: 'القرآن والتأصيل الحضاري',
      en: 'The Qur\'an and the Foundations of Civilization',
    },
    subtitle: {
      ar: 'حين يصنع الوحي الإنسان… تُولد الحضارة',
      en: 'When Revelation Shapes the Human, Civilization is Born',
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
