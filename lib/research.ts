/**
 * Research & publications metadata — safe to import in client components.
 * For full content loading (server-side), see lib/research-server.ts
 */

export type ResearchType =
  | 'book'
  | 'conference-paper'
  | 'journal-paper'
  | 'book-chapter'
  | 'monograph';

export type ResearchCategory =
  | 'fiqh-and-fatwa'
  | 'imamship'
  | 'minorities'
  | 'quranic-studies'
  | 'civilization';

export interface ResearchMeta {
  slug: string;
  type: ResearchType;
  category: ResearchCategory;

  // Year & date
  year: number;
  isoDate: string; // YYYY-MM-DD
  date: { ar: string; en: string };

  // Titles & description
  title: { ar: string; en: string };
  subtitle?: { ar: string; en: string };
  abstract: { ar: string; en: string };

  // Venue / Publication info
  venue: { ar: string; en: string };
  location?: { ar: string; en: string }; // City, Country
  publisher?: { ar: string; en: string };

  // Document metadata
  pages?: number;
  language: 'ar' | 'en' | 'bilingual';
  isbn?: string;
  doi?: string;

  // Files & links
  // pdfUrl can be a single path (legacy) or a bilingual { ar, en } map.
  pdfUrl?: string | { ar?: string; en?: string };
  externalUrl?: string; // link to publisher / arxiv / etc.
  coverImage?: string; // for books primarily

  // Keywords
  keywords?: { ar: string[]; en: string[] };

  // Display options
  featured?: boolean;
  draft?: boolean;
}

export const researchMeta: ResearchMeta[] = [
  // الكتاب الجديد ـ 2026
  {
    slug: 'fatwa-digital-transformation',
    type: 'book',
    category: 'fiqh-and-fatwa',
    year: 2026,
    isoDate: '2026-05-17',
    date: { ar: 'مايو ٢٠٢٦', en: 'May 2026' },
    title: {
      ar: 'الفتوى في زمن التَّحوّل الرَّقميّ',
      en: 'Fatwa in the Age of Digital Transformation',
    },
    subtitle: {
      ar: 'من أَهليّة المُفتي إلى مَنظومة الإفتاء',
      en: 'From the Eligibility of the Mufti to the Fatwa Ecosystem',
    },
    abstract: {
      ar: 'كتابٌ يُطوِّر ويُوسِّع بحثاً محكَّماً قُدِّم لمؤتمر الأَئمّة الخامس عشر لمَجمع فقهاء الشَّريعة بأمريكا (AMJA) عام 2018، ليُجيب على أَسئلة عَصرنا الجَديدة: كيف نَتعامل مع الإفتاء في عَصر الفيديو القَصير والذَّكاء الاصطناعيّ التَّوليديّ؟ يَتكوَّن الكتاب من عَشرة فصول في ثَلاثة أَقسام (التَّأصيل، التَّحوّل، المقترحات)، يَطرح فيها المؤلّف خَمسة مَفاهيم أَصيلة لم تَكن مَعهودة: تَعريف «الفوضى الرَّقميّة»، «المؤهّلات المركّبة للمُفتي المعاصر»، «المرتبة السابعة المعاصرة (المُجتهد الجَماعيّ المؤسّسيّ)»، «فقه المآلات الرَّقميّة»، ومدوّنة استخدام الذَّكاء الاصطناعيّ للمُفتي. ويَختم الكتاب بـ«خارطة طريق» بعَشر مَبادرات عمليّة قابلة للتَّنفيذ.',
      en: 'A book that develops and expands a peer-reviewed paper originally presented at the 15th Annual Imams\' Conference of the Assembly of Muslim Jurists of America (AMJA) in 2018, to address our era\'s new questions: How do we approach fatwa in the age of short-form video and generative AI? Organized in ten chapters across three sections (Foundations, Transformation, Proposals), the book introduces five original concepts not previously articulated: a definition of "digital chaos in fatwa," the "Compound Qualifications of the Contemporary Mufti," the "Seventh Contemporary Rank: The Collective Institutional Mujtahid," the "Jurisprudence of Digital Consequences," and a proposed Code of Conduct for the Mufti\'s use of AI. The book concludes with a practical roadmap of ten actionable initiatives.',
    },
    venue: {
      ar: 'تَطوير لبَحث محكَّم — مَجمع فقهاء الشَّريعة بأمريكا (AMJA)',
      en: 'Expansion of a peer-reviewed paper — Assembly of Muslim Jurists of America (AMJA)',
    },
    publisher: {
      ar: 'مَشروع نَشر متعدّد الطَّبقات',
      en: 'Multi-layer Publication Project',
    },
    pages: 164,
    language: 'bilingual',
    pdfUrl: {
      ar: '/research/fatwa-digital-transformation/book.pdf',
      en: '/research/fatwa-digital-transformation/book-en.pdf',
    },
    keywords: {
      ar: ['فتوى', 'فوضى الإفتاء', 'الذكاء الاصطناعي', 'فقه الأقليات', 'المنظومة الإفتائية', 'AMJA'],
      en: ['fatwa', 'religious authority', 'artificial intelligence', 'minorities fiqh', 'AMJA', 'institutional ijtihad'],
    },
    featured: true,
  },

  // البحث الأصلي 2018
  {
    slug: 'fatwa-mufti-eligibility-2018',
    type: 'conference-paper',
    category: 'fiqh-and-fatwa',
    year: 2018,
    isoDate: '2018-02-25',
    date: { ar: 'فبراير ٢٠١٨', en: 'February 2018' },
    title: {
      ar: 'الفتوى بين أَهليّة المُفتي وفوضى الإفتاء',
      en: 'Fatwa Between the Mufti\'s Eligibility and the Chaos of Fatwa-Issuance',
    },
    abstract: {
      ar: 'بَحثٌ محكَّم قُدِّم في مؤتمر الأَئمّة الخامس عشر لمَجمع فقهاء الشَّريعة بأمريكا (AMJA) في هيوستن، فبراير 2018. يَطرح البحث تَعريفاً دَقيقاً للفتوى والمُفتي والمستفتي والأَهليّة والفَوضى، ثمّ يُعرّج على شُروط المُفتي في ثلاثة أَقسام (تَكليفيّة، عِلميّة، شَخصيّة)، ويُقدّم تَفصيلاً للصفات الشَّخصيّة الثَّمان للمُفتي. كما يُحلّل ظاهرة فَوضى الإفتاء في زَمنها (الفضائيّات والوسائط الناشئة)، ويَختم بستّ مقترحاتٍ لإصلاح المشهد الإفتائيّ.',
      en: 'A peer-reviewed paper presented at the 15th Annual Imams\' Conference of the Assembly of Muslim Jurists of America (AMJA) in Houston, February 2018. The paper offers precise definitions of fatwa, mufti, mustafti (questioner), eligibility, and chaos. It then examines the conditions of the mufti across three categories (legal capacity, scholarly, and personal), with detailed elaboration of eight personal qualities. The paper diagnoses the chaos of fatwa in its era (satellite channels and emerging media) and concludes with six proposals for reforming the fatwa landscape.',
    },
    venue: {
      ar: 'مؤتمر الأَئمّة الخامس عشر — مَجمع فقهاء الشَّريعة بأمريكا (AMJA)',
      en: '15th Annual Imams\' Conference — Assembly of Muslim Jurists of America (AMJA)',
    },
    location: {
      ar: 'هيوستن، تكساس — الولايات المتّحدة الأمريكيّة',
      en: 'Houston, Texas — United States',
    },
    pages: 34,
    language: 'ar',
    pdfUrl: '/research/fatwa-mufti-eligibility-2018/paper.pdf',
    keywords: {
      ar: ['فتوى', 'أهلية المفتي', 'فوضى الإفتاء', 'AMJA', 'فقه الأقليات'],
      en: ['fatwa', 'mufti eligibility', 'fatwa chaos', 'AMJA', 'minority fiqh'],
    },
    featured: true,
  },
];

export function getResearchItem(slug: string): ResearchMeta | undefined {
  return researchMeta.find((r) => r.slug === slug);
}

export function getAllResearch(): ResearchMeta[] {
  return [...researchMeta]
    .filter((r) => !r.draft)
    .sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));
}

export function getFeaturedResearch(): ResearchMeta[] {
  return getAllResearch().filter((r) => r.featured);
}

export function getResearchByType(type: ResearchType): ResearchMeta[] {
  return getAllResearch().filter((r) => r.type === type);
}

/**
 * Resolve the PDF URL appropriate to the requested locale.
 * - If pdfUrl is a string, returns it unchanged.
 * - If pdfUrl is an { ar, en } map, returns the requested locale; falls back to the other if missing.
 */
export function getPdfUrl(item: ResearchMeta, locale: 'ar' | 'en'): string | undefined {
  const p = item.pdfUrl;
  if (!p) return undefined;
  if (typeof p === 'string') return p;
  return p[locale] || p.ar || p.en;
}

export const researchTypeLabels = {
  ar: {
    book: 'كتاب',
    'conference-paper': 'بحث محكَّم في مؤتمر',
    'journal-paper': 'بحث محكَّم في دوريّة',
    'book-chapter': 'فصل في كتاب',
    monograph: 'دراسة',
  },
  en: {
    book: 'Book',
    'conference-paper': 'Peer-Reviewed Conference Paper',
    'journal-paper': 'Peer-Reviewed Journal Article',
    'book-chapter': 'Book Chapter',
    monograph: 'Monograph',
  },
};

export const researchCategoryLabels = {
  ar: {
    'fiqh-and-fatwa': 'الفقه والإفتاء',
    imamship: 'الإمامة والقيادة',
    minorities: 'فقه الأقلّيّات',
    'quranic-studies': 'الدّراسات القرآنيّة',
    civilization: 'القرآن والحَضارة',
  },
  en: {
    'fiqh-and-fatwa': 'Fiqh & Fatwa',
    imamship: 'Imamship & Leadership',
    minorities: 'Minorities Fiqh',
    'quranic-studies': 'Quranic Studies',
    civilization: 'Quran & Civilization',
  },
};
