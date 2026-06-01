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
  date: { ar: string; en: string; es?: string };

  // Titles & description
  title: { ar: string; en: string; es?: string };
  subtitle?: { ar: string; en: string; es?: string };
  abstract: { ar: string; en: string; es?: string };

  // Venue / Publication info
  venue: { ar: string; en: string; es?: string };
  location?: { ar: string; en: string; es?: string }; // City, Country
  publisher?: { ar: string; en: string; es?: string };

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
  keywords?: { ar: string[]; en: string[]; es?: string[] };

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
    date: { ar: 'مايو ٢٠٢٦', en: 'May 2026', es: 'Mayo de 2026' },
    title: {
      ar: 'الفتوى في زمن التَّحوّل الرَّقميّ',
      en: 'Fatwa in the Age of Digital Transformation',
      es: 'La fatwa en la era de la transformación digital',
    },
    subtitle: {
      ar: 'من أَهليّة المُفتي إلى مَنظومة الإفتاء',
      en: 'From the Eligibility of the Mufti to the Fatwa Ecosystem',
      es: 'De la idoneidad del muftí al ecosistema del dictamen',
    },
    abstract: {
      ar: 'بحثٌ يُطوِّر ويُوسِّع بحثاً محكَّماً قُدِّم لمؤتمر الأَئمّة الخامس عشر لمَجمع فقهاء الشَّريعة بأمريكا (AMJA) عام 2018، ليُجيب على أَسئلة عَصرنا الجَديدة: كيف نَتعامل مع الإفتاء في عَصر الفيديو القَصير والذَّكاء الاصطناعيّ التَّوليديّ؟ يَتكوَّن البحث من عَشرة فصول في ثَلاثة أَقسام (التَّأصيل، التَّحوّل، المقترحات)، يَطرح فيها المؤلّف خَمسة مَفاهيم أَصيلة لم تَكن مَعهودة: تَعريف «الفوضى الرَّقميّة»، «المؤهّلات المركّبة للمُفتي المعاصر»، «المرتبة السابعة المعاصرة (المُجتهد الجَماعيّ المؤسّسيّ)»، «فقه المآلات الرَّقميّة»، ومدوّنة استخدام الذَّكاء الاصطناعيّ للمُفتي. ويَختم البحث بـ«خارطة طريق» بعَشر مَبادرات عمليّة قابلة للتَّنفيذ مرتَّبة على ثلاثة مدَيات: عاجل، متوسط، بعيد.',
      en: 'A research monograph that develops and expands a peer-reviewed paper originally presented at the 15th Annual Imams\' Conference of the Assembly of Muslim Jurists of America (AMJA) in 2018, to address our era\'s new questions: How do we approach fatwa in the age of short-form video and generative AI? Organized in ten chapters across three sections (Foundations, Transformation, Proposals), the work introduces five original concepts not previously articulated: a definition of "digital chaos in fatwa," the "Compound Qualifications of the Contemporary Mufti," the "Seventh Contemporary Rank: The Collective Institutional Mujtahid," the "Jurisprudence of Digital Consequences," and a proposed Code of Conduct for the Mufti\'s use of AI. The work concludes with a practical roadmap of ten initiatives organized across three timelines: urgent, medium-term, and long-term.',
      es: 'Una monografía de investigación que desarrolla y amplía una ponencia arbitrada presentada originalmente en la Decimoquinta Conferencia Anual de Imames de la Asamblea de Juristas Musulmanes de América (AMJA) en 2018, para responder a las nuevas preguntas de nuestra era: ¿cómo abordamos el dictamen (fatwa) en la era del vídeo de formato corto y la inteligencia artificial generativa? Organizada en diez capítulos a lo largo de tres secciones (Fundamentos, Transformación, Propuestas), la obra introduce cinco conceptos originales no articulados antes: una definición del «caos digital en el dictamen», las «cualificaciones compuestas del muftí contemporáneo», el «séptimo rango contemporáneo: el muytahid colectivo e institucional», la «jurisprudencia de las consecuencias digitales», y un código de conducta propuesto para el uso de la inteligencia artificial por el muftí. La obra concluye con una hoja de ruta práctica de diez iniciativas ejecutables organizadas en tres horizontes: urgente, medio y lejano.',
    },
    venue: {
      ar: 'تَطوير لبَحث محكَّم — مَجمع فقهاء الشَّريعة بأمريكا (AMJA)',
      en: 'Expansion of a peer-reviewed paper — Assembly of Muslim Jurists of America (AMJA)',
      es: 'Ampliación de una ponencia arbitrada — Asamblea de Juristas Musulmanes de América (AMJA)',
    },
    publisher: {
      ar: 'مَشروع نَشر متعدّد الطَّبقات',
      en: 'Multi-layer Publication Project',
      es: 'Proyecto de publicación multicapa',
    },
    pages: 283,
    language: 'bilingual',
    pdfUrl: {
      ar: '/research/fatwa-digital-transformation/book.pdf',
      en: '/research/fatwa-digital-transformation/book-en.pdf',
    },
    keywords: {
      ar: ['فتوى', 'فوضى الإفتاء', 'الذكاء الاصطناعي', 'فقه الأقليات', 'المنظومة الإفتائية', 'AMJA'],
      en: ['fatwa', 'religious authority', 'artificial intelligence', 'minorities fiqh', 'AMJA', 'institutional ijtihad'],
      es: ['fatwa', 'caos del dictamen', 'inteligencia artificial', 'jurisprudencia de las minorías', 'ecosistema del dictamen', 'AMJA'],
    },
    featured: true,
  },

  // بحث المؤتمر العالمي العاشر — القاهرة 2025
  {
    slug: 'fatwa-us-ai-2025',
    type: 'conference-paper',
    category: 'fiqh-and-fatwa',
    year: 2025,
    isoDate: '2025-08-12',
    date: { ar: 'أغسطس ٢٠٢٥', en: 'August 2025', es: 'Agosto de 2025' },
    title: {
      ar: 'واقِع الفَتوى في الوِلايات المُتَّحدة الأَمريكيّة في عَصر الذَّكاء الاصطناعيّ',
      en: 'The Reality of Fatwa in the United States in the Age of Artificial Intelligence',
      es: 'La realidad de la fatwa en los Estados Unidos en la era de la inteligencia artificial',
    },
    subtitle: {
      ar: 'إِشكاليّات وحُلول',
      en: 'Challenges and Solutions',
      es: 'Desafíos y soluciones',
    },
    abstract: {
      ar: 'بَحثٌ محكَّم قُدِّم في المؤتمر العالميّ العاشر للأَمانة العامّة لدُور وهَيئات الإفتاء في العالم — القاهرة، أغسطس 2025، تَحت عُنوان «صِناعة المُفتي الرَّشيد في عَصر الذَّكاء الاصطناعيّ». يَرسم البَحث خارطةً دَقيقة لواقِع الفَتوى الرَّقميّة في الوِلايات المُتَّحدة الأَمريكيّة، مُتتبِّعاً الإِشكاليّات التِّقنيّة واللُّغويّة والثَّقافيّة التي يُواجِهها السّائل والمُفتي على السَّواء، ومُقترِحاً إِطاراً مَنهجيّاً إِصلاحيّاً يَضمَن مُطابقة المُخرَجات الفِقهيّة لمَقاصِد الشَّريعة وسَلامة الخُصوصيّة الثَّقافيّة. يَعتَمد البَحث المَنهَج الاستِقرائيّ التَّحليليّ، ويَستَنِد إلى اثنتي عَشرة مُقابلة شِبه مُهَيكَلة مَع أَئمّة ومُفتين في الواقِع الأَمريكيّ، ويَعرِض في ثَلاثة فُصول: واقِع الفَتوى في أَمريكا، التَّحدّيات المَنهجيّة والشَّرعيّة للفَتوى الرَّقميّة، ومَعالم بِناء مَنظومةٍ إِفتائيّةٍ رَقميّةٍ راشِدة في السِّياق الأَمريكيّ.',
      en: 'A peer-reviewed paper presented at the 10th World Conference of the General Secretariat for Houses and Bodies of Iftaa Worldwide (Cairo, August 2025), held under the theme "Forming the Wise Mufti in the Age of Artificial Intelligence." The paper maps the reality of digital fatwa in the United States, tracing the technical, linguistic, and cultural challenges facing both the questioner (mustafti) and the mufti, and proposes a reformist methodological framework that secures alignment between juristic outputs, the higher objectives of Sharia, and the cultural specificity of American Muslims. Employing an inductive-analytical method grounded in twelve semi-structured interviews with imams and muftis active in the U.S. context, the paper unfolds across three chapters: the reality of fatwa in America; the methodological and Shariah-based challenges of digital fatwa; and the contours of a wise digital fatwa ecosystem for the American setting.',
      es: 'Una ponencia arbitrada presentada en la Décima Conferencia Mundial de la Secretaría General de las Casas y Organismos de Iftāʾ del Mundo (El Cairo, agosto de 2025), celebrada bajo el lema «La formación del muftí sabio en la era de la inteligencia artificial». La ponencia traza un mapa preciso de la realidad de la fatwa digital en los Estados Unidos, rastreando los desafíos técnicos, lingüísticos y culturales que encaran tanto el preguntante (mustaftī) como el muftí, y propone un marco metodológico reformista que asegure la concordancia entre los resultados jurídicos, los fines superiores de la sharía y la especificidad cultural de los musulmanes estadounidenses. Empleando un método inductivo-analítico fundamentado en doce entrevistas semiestructuradas con imames y muftíes activos en el contexto estadounidense, la ponencia se despliega en tres capítulos: la realidad de la fatwa en América; los desafíos metodológicos y sharaicos de la fatwa digital; y los contornos de un ecosistema de fatwa digital sabio para el entorno estadounidense.',
    },
    venue: {
      ar: 'المؤتمر العالميّ العاشر — الأَمانة العامّة لدُور وهَيئات الإفتاء في العالم',
      en: '10th World Conference — General Secretariat for Houses and Bodies of Iftaa Worldwide',
      es: 'Décima Conferencia Mundial — Secretaría General de las Casas y Organismos de Iftāʾ del Mundo',
    },
    location: {
      ar: 'القاهرة — جُمهوريّة مِصر العربيّة',
      en: 'Cairo — Arab Republic of Egypt',
      es: 'El Cairo — República Árabe de Egipto',
    },
    publisher: {
      ar: 'الأَمانة العامّة لدُور وهَيئات الإفتاء في العالم (تابِعة لدار الإفتاء المصريّة) — أَبحاث المؤتمر، المُجلَّد الخامس، المحور الرّابع: الذَّكاء الاصطناعيّ وتَطوير العَمل المؤسَّسيّ الإفتائيّ — ص ٢٣٠٢–٢٣٤٣',
      en: 'General Secretariat for Houses and Bodies of Iftaa Worldwide (affiliated with the Egyptian Dar al-Iftaa) — Conference Proceedings, Volume 5, Track 4: AI and the Development of Institutional Fatwa Work — pp. 2302–2343',
      es: 'Secretaría General de las Casas y Organismos de Iftāʾ del Mundo (adscrita a Dar al-Iftāʾ de Egipto) — Actas de la conferencia, Volumen 5, Eje 4: La inteligencia artificial y el desarrollo del trabajo institucional del dictamen — pp. 2302–2343',
    },
    pages: 42,
    language: 'ar',
    isbn: '978-977-6998-61-2',
    pdfUrl: '/research/fatwa-us-ai-2025/paper.pdf',
    keywords: {
      ar: ['الفتوى الرقمية', 'الذكاء الاصطناعي', 'الولايات المتحدة', 'فقه الأقليات', 'صناعة المفتي', 'المنظومة الإفتائية', 'دار الإفتاء المصرية'],
      en: ['digital fatwa', 'artificial intelligence', 'United States', 'minorities fiqh', 'mufti formation', 'fatwa ecosystem', 'Egyptian Dar al-Iftaa'],
      es: ['fatwa digital', 'inteligencia artificial', 'Estados Unidos', 'jurisprudencia de las minorías', 'formación del muftí', 'ecosistema del dictamen', 'Dar al-Iftāʾ de Egipto'],
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
    date: { ar: 'فبراير ٢٠١٨', en: 'February 2018', es: 'Febrero de 2018' },
    title: {
      ar: 'الفتوى بين أَهليّة المُفتي وفوضى الإفتاء',
      en: 'Fatwa Between the Mufti\'s Eligibility and the Chaos of Fatwa-Issuance',
      es: 'La fatwa entre la idoneidad del muftí y el caos de la emisión de dictámenes',
    },
    abstract: {
      ar: 'بَحثٌ محكَّم قُدِّم في مؤتمر الأَئمّة الخامس عشر لمَجمع فقهاء الشَّريعة بأمريكا (AMJA) في هيوستن، فبراير 2018. يَطرح البحث تَعريفاً دَقيقاً للفتوى والمُفتي والمستفتي والأَهليّة والفَوضى، ثمّ يُعرّج على شُروط المُفتي في ثلاثة أَقسام (تَكليفيّة، عِلميّة، شَخصيّة)، ويُقدّم تَفصيلاً للصفات الشَّخصيّة الثَّمان للمُفتي. كما يُحلّل ظاهرة فَوضى الإفتاء في زَمنها (الفضائيّات والوسائط الناشئة)، ويَختم بستّ مقترحاتٍ لإصلاح المشهد الإفتائيّ.',
      en: 'A peer-reviewed paper presented at the 15th Annual Imams\' Conference of the Assembly of Muslim Jurists of America (AMJA) in Houston, February 2018. The paper offers precise definitions of fatwa, mufti, mustafti (questioner), eligibility, and chaos. It then examines the conditions of the mufti across three categories (legal capacity, scholarly, and personal), with detailed elaboration of eight personal qualities. The paper diagnoses the chaos of fatwa in its era (satellite channels and emerging media) and concludes with six proposals for reforming the fatwa landscape.',
      es: 'Una ponencia arbitrada presentada en la Decimoquinta Conferencia Anual de Imames de la Asamblea de Juristas Musulmanes de América (AMJA) en Houston, febrero de 2018. La ponencia ofrece definiciones precisas de la fatwa, el muftí, el mustaftī (preguntante), la idoneidad y el caos. Luego examina las condiciones del muftí en tres categorías (de capacidad legal, académicas y personales), con una elaboración detallada de ocho cualidades personales. La ponencia diagnostica el caos del dictamen en su época (los canales satelitales y los medios emergentes) y concluye con seis propuestas para reformar el panorama del dictamen.',
    },
    venue: {
      ar: 'مؤتمر الأَئمّة الخامس عشر — مَجمع فقهاء الشَّريعة بأمريكا (AMJA)',
      en: '15th Annual Imams\' Conference — Assembly of Muslim Jurists of America (AMJA)',
      es: 'Decimoquinta Conferencia Anual de Imames — Asamblea de Juristas Musulmanes de América (AMJA)',
    },
    location: {
      ar: 'هيوستن، تكساس — الولايات المتّحدة الأمريكيّة',
      en: 'Houston, Texas — United States',
      es: 'Houston, Texas — Estados Unidos',
    },
    pages: 34,
    language: 'ar',
    pdfUrl: '/research/fatwa-mufti-eligibility-2018/paper.pdf',
    keywords: {
      ar: ['فتوى', 'أهلية المفتي', 'فوضى الإفتاء', 'AMJA', 'فقه الأقليات'],
      en: ['fatwa', 'mufti eligibility', 'fatwa chaos', 'AMJA', 'minority fiqh'],
      es: ['fatwa', 'idoneidad del muftí', 'caos del dictamen', 'AMJA', 'jurisprudencia de las minorías'],
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
export function getPdfUrl(item: ResearchMeta, locale: string): string | undefined {
  const p = item.pdfUrl;
  if (!p) return undefined;
  if (typeof p === 'string') return p;
  return (p as Record<string, string | undefined>)[locale] || p.ar || p.en;
}

export const researchTypeLabels = {
  ar: {
    book: 'بحث',
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
  es: {
    book: 'Libro',
    'conference-paper': 'Ponencia arbitrada de conferencia',
    'journal-paper': 'Artículo arbitrado de revista',
    'book-chapter': 'Capítulo de libro',
    monograph: 'Monografía',
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
  es: {
    'fiqh-and-fatwa': 'Jurisprudencia y dictamen',
    imamship: 'Imamato y Liderazgo',
    minorities: 'Jurisprudencia de las minorías',
    'quranic-studies': 'Estudios coránicos',
    civilization: 'El Corán y la Civilización',
  },
};
