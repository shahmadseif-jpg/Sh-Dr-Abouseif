/**
 * Q&A (Questions & Answers / Fatwa archive) metadata — safe to import in client components.
 * For file content loading (uses fs), see lib/qa-server.ts.
 * Answer bodies live in markdown files under `qa/<slug>.{ar,en,es}.md`.
 */

import { type Loc, type LocalizedText, localize } from './articles';

export type { Loc, LocalizedText };
export { localize };

export type QACategory =
  | 'worship'
  | 'family'
  | 'transactions'
  | 'creed'
  | 'west-nawazil'
  | 'general';

export interface QAMeta {
  slug: string;
  category: QACategory;
  isoDate: string; // YYYY-MM-DD
  date: LocalizedText;
  /** The question itself (used as the card title and page H1). */
  question: LocalizedText;
  /** A short summary of the answer, shown on cards and in search. */
  summary: LocalizedText;
  /** Optional: questioner's country/city, displayed discreetly. */
  origin?: LocalizedText;
  /** Optional keywords to improve search. */
  tags?: string[];
  draft?: boolean;
}

export const qaMeta: QAMeta[] = [
  {
    slug: 'quran-from-phone',
    category: 'worship',
    isoDate: '2026-06-19',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    question: {
      ar: 'هل يجوز قراءة القرآن من الهاتف بدل المصحف الورقيّ؟',
      en: 'Is it permissible to read the Qur’an from a phone instead of a printed muṣḥaf?',
      es: '¿Es lícito leer el Corán desde el teléfono en lugar del muṣḥaf impreso?',
    },
    summary: {
      ar: 'القراءة من تطبيقات الهاتف جائزةٌ ويُؤجَر عليها القارئ، وللمصحف الورقيّ فضلُ مسِّ الطهارة وجمعِ القلب.',
      en: 'Reading from phone apps is permissible and rewarded; the printed muṣḥaf retains the merit of ritual purity and focus.',
      es: 'Leer desde aplicaciones del teléfono es lícito y recompensado; el muṣḥaf impreso conserva el mérito de la pureza ritual y la concentración.',
    },
    tags: ['قرآن', 'هاتف', 'مصحف', 'تلاوة'],
  },
  {
    slug: 'children-love-prayer-west',
    category: 'family',
    isoDate: '2026-06-19',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    question: {
      ar: 'كيف أُحبّب الصلاة إلى أبنائي وأنا أربّيهم في بيئة الغرب؟',
      en: 'How do I endear prayer to my children while raising them in the West?',
      es: '¿Cómo hago que mis hijos amen la oración mientras los crío en Occidente?',
    },
    summary: {
      ar: 'بالقدوة والرفق والتدرّج وربطِ الصلاة بالفرح لا بالعقاب، وجعلِ البيت بيئةً حاضنةً للعبادة.',
      en: 'Through example, gentleness, gradual habituation, and tying prayer to joy rather than punishment.',
      es: 'Mediante el ejemplo, la suavidad, la habituación gradual y vinculando la oración con la alegría, no con el castigo.',
    },
    tags: ['تربية', 'أبناء', 'صلاة', 'الغرب'],
  },
  {
    slug: 'zakat-al-fitr-money',
    category: 'worship',
    isoDate: '2026-06-19',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    question: {
      ar: 'هل يجوز إخراج زكاة الفطر نقدًا في بلاد الغرب؟',
      en: 'Is it permissible to give zakāt al-fiṭr as money in Western countries?',
      es: '¿Es lícito dar el zakāt al-fiṭr en dinero en los países occidentales?',
    },
    summary: {
      ar: 'المسألة من مواضع الخلاف المعتبر؛ والأصل إخراجها طعامًا، ويُرخَّص في النقد عند الحاجة والمصلحة كما هو الحال غالبًا في الغرب.',
      en: 'A recognized point of scholarly difference; the default is food, with money permitted where need and benefit call for it — often the case in the West.',
      es: 'Un punto reconocido de diferencia entre los sabios; lo predeterminado es alimento, y se permite el dinero cuando la necesidad y el beneficio lo requieren, como suele ocurrir en Occidente.',
    },
    tags: ['زكاة الفطر', 'فقه', 'الغرب', 'نقد'],
  },
];

export function getAllQA(): QAMeta[] {
  return qaMeta.filter((q) => !q.draft);
}

export function getQAMeta(slug: string): QAMeta | undefined {
  return qaMeta.find((q) => q.slug === slug);
}

export const qaCategoryLabels: Record<Loc, Record<QACategory, string>> = {
  ar: {
    worship: 'العبادات',
    family: 'الأسرة والتربية',
    transactions: 'المعاملات',
    creed: 'العقيدة',
    'west-nawazil': 'نوازل الغرب',
    general: 'عامّ',
  },
  en: {
    worship: 'Worship',
    family: 'Family & Parenting',
    transactions: 'Transactions',
    creed: 'Creed',
    'west-nawazil': 'Issues of the West',
    general: 'General',
  },
  es: {
    worship: 'Adoración',
    family: 'Familia y Educación',
    transactions: 'Transacciones',
    creed: 'Credo',
    'west-nawazil': 'Cuestiones de Occidente',
    general: 'General',
  },
};
