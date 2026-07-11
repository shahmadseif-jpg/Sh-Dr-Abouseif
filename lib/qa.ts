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
  /** Optional: the full original wording of the question, shown in a box above the answer. */
  questionFull?: LocalizedText;
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
    date: { ar: "يونيو ٢٠٢٦", en: "June 2026", es: "Junio de 2026", ur: "جون ۲۰۲۶ء" },
    question: {
      ar: "هل يجوز قراءة القرآن من الهاتف بدل المصحف الورقيّ؟",
      en: "Is it permissible to read the Qur’an from a phone instead of a printed muṣḥaf?",
      es: "¿Es lícito leer el Corán desde el teléfono en lugar del muṣḥaf impreso?",
      ur: "کیا مطبوع مصحف کی بجائے فون سے قرآن پڑھنا جائز ہے؟",
    },
    summary: {
      ar: "القراءة من تطبيقات الهاتف جائزةٌ ويُؤجَر عليها القارئ، وللمصحف الورقيّ فضلُ مسِّ الطهارة وجمعِ القلب.",
      en: "Reading from phone apps is permissible and rewarded; the printed muṣḥaf retains the merit of ritual purity and focus.",
      es: "Leer desde aplicaciones del teléfono es lícito y recompensado; el muṣḥaf impreso conserva el mérito de la pureza ritual y la concentración.",
      ur: "فون ایپ سے پڑھنا جائز ہے اور قاری ثواب پاتا ہے؛ مطبوع مصحف کو طہارت کی فضیلت اور یکسوئی کا امتیاز حاصل رہتا ہے۔",
    },
    tags: ["قرآن", "هاتف", "مصحف", "تلاوة"],
  },
  {
    slug: 'children-love-prayer-west',
    category: 'family',
    isoDate: '2026-06-19',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026', ur: 'جون ۲۰۲۶ء' },
    question: {
      ar: 'كيف أُحبّب الصلاة إلى أبنائي وأنا أربّيهم في بيئة الغرب؟',
      en: 'How do I endear prayer to my children while raising them in the West?',
      es: '¿Cómo hago que mis hijos amen la oración mientras los crío en Occidente?',
      ur: 'مغرب میں پرورش کرتے ہوئے بچوں کے دل میں نماز کی محبت کیسے ڈالوں؟',
    },
    summary: {
      ar: 'بالقدوة والرفق والتدرّج وربطِ الصلاة بالفرح لا بالعقاب، وجعلِ البيت بيئةً حاضنةً للعبادة.',
      en: 'Through example, gentleness, gradual habituation, and tying prayer to joy rather than punishment.',
      es: 'Mediante el ejemplo, la suavidad, la habituación gradual y vinculando la oración con la alegría, no con el castigo.',
      ur: 'نمونہ، نرمی، تدریجی عادت اور نماز کو سزا کی بجائے خوشی سے جوڑ کر، اور گھر کو عبادت کا پرورش نگہداشت کرنے والا ماحول بنا کر۔',
    },
    tags: ['تربية', 'أبناء', 'صلاة', 'الغرب'],
  },
  {
    slug: 'zakat-al-fitr-money',
    category: 'worship',
    isoDate: '2026-06-19',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026', ur: 'جون ۲۰۲۶ء' },
    question: {
      ar: 'هل يجوز إخراج زكاة الفطر نقدًا في بلاد الغرب؟',
      en: 'Is it permissible to give zakāt al-fiṭr as money in Western countries?',
      es: '¿Es lícito dar el zakāt al-fiṭr en dinero en los países occidentales?',
      ur: 'کیا مغربی ممالک میں زکاۃ الفطر نقد رقم میں دینا جائز ہے؟',
    },
    summary: {
      ar: 'المسألة من مواضع الخلاف المعتبر؛ والأصل إخراجها طعامًا، ويُرخَّص في النقد عند الحاجة والمصلحة كما هو الحال غالبًا في الغرب.',
      en: 'A recognized point of scholarly difference; the default is food, with money permitted where need and benefit call for it — often the case in the West.',
      es: 'Un punto reconocido de diferencia entre los sabios; lo predeterminado es alimento, y se permite el dinero cuando la necesidad y el beneficio lo requieren, como suele ocurrir en Occidente.',
      ur: 'یہ ایک معتبر اختلافی مسئلہ ہے؛ اصل طعام ہے، اور ضرورت و مصلحت کی صورت میں نقد کی رخصت ہے جیسا کہ مغرب میں اکثر ہوتا ہے۔',
    },
    tags: ['زكاة الفطر', 'فقه', 'الغرب', 'نقد'],
  },
  {
    slug: 'widow-iddah-leaving-home',
    category: 'family',
    isoDate: '2026-06-22',
    date: { ar: "يونيو ٢٠٢٦", en: "June 2026", es: "Junio de 2026", ur: "جون ۲۰۲۶ء" },
    question: {
      ar: "ما حدود الخروج وممنوعات العدّة للمرأة المتوفّى عنها زوجها؟",
      en: "What are the limits of going out and the restrictions of the ʿiddah for a widow?",
      es: "¿Cuáles son los límites de salir y las restricciones de la ʿidda para una viuda?",
      ur: "بیوہ عورت کے لیے عدت میں نکلنے کی حدود اور ممنوعات کیا ہیں؟",
    },
    questionFull: {
      ar: "السلام عليكم شيخ أحمد. أسأل عن ممنوعات وقت العدّة، فكلُّ شيخٍ — بحسب اجتهاده وعلمه — يقول نعم أو لا في أشياء مختلفة، حتى احترتُ. هل يجوز أن أبيت عند ابنتي، وهي على بُعد ساعتين إلا ربعًا من بيتي؟ وهل أسافر للعمرة مع شريف؟ وهل أزور المقبرة؟ ولو كنتُ عند ابنتي فخرجت هي وأولادها إلى مطعم، هل أذهب معهم؟ ولستُ أدري ما المسموح وغير المسموح على وجه التحديد، وهل لفقه المغتربين خصوصيةٌ في ذلك؟ جزاكم الله خيرًا، وإن كان ثَمّ ما يُفيدني في الباب فأرجو إضافته.",
      en: "Peace be upon you, Shaykh Ahmed. I am asking about what is prohibited during the ʿiddah. Every shaykh — according to his own reasoning and knowledge — says yes or no to different things, until I have become confused. May I spend the night at my daughter’s home, which is about two hours and forty-five minutes from my house? May I travel for ʿumrah with Sharif? May I visit the cemetery? And if I am at my daughter’s and she goes out with her children to a restaurant, may I go with them? I honestly do not know exactly what is permitted and what is not, and whether the fiqh of those living abroad has any particularity in this. May God reward you, and if there is anything else of benefit in this matter, please add it.",
      es: "La paz sea contigo, Shaykh Ahmed. Pregunto sobre lo que está prohibido durante la ʿidda. Cada shaykh —según su propio razonamiento y conocimiento— dice sí o no a cosas distintas, hasta el punto de que me he confundido. ¿Puedo pernoctar en casa de mi hija, que está a unas dos horas y cuarenta y cinco minutos de mi casa? ¿Puedo viajar para la ʿumra con Sharif? ¿Puedo visitar el cementerio? Y si estoy en casa de mi hija y ella sale con sus hijos a un restaurante, ¿puedo ir con ellos? Sinceramente no sé exactamente qué está permitido y qué no, y si el fiqh de quienes viven en el extranjero tiene alguna particularidad en esto. Que Dios te recompense, y si hay algo más de beneficio en este asunto, por favor añádelo.",
      ur: "السلام علیکم شیخ احمد۔ میں عدت کے دوران ممنوع چیزوں کے بارے میں پوچھ رہی ہوں۔ ہر شیخ اپنے اجتہاد اور علم کے مطابق مختلف چیزوں میں ہاں یا نہ کہتا ہے، یہاں تک کہ میں پریشان ہوگئی ہوں۔ کیا میں اپنی بیٹی کے پاس رات گزار سکتی ہوں جو میرے گھر سے پونے دو گھنٹے کی دوری پر ہے؟ کیا میں شریف کے ساتھ عمرہ کے لیے سفر کر سکتی ہوں؟ کیا میں قبرستان جا سکتی ہوں؟ اور اگر میں اپنی بیٹی کے پاس ہوں اور وہ بچوں کے ساتھ ریستوران جائے تو کیا میں بھی جا سکتی ہوں؟ مجھے ٹھیک سے نہیں معلوم کہ کیا جائز ہے اور کیا نہیں، اور کیا مہاجرین کے فقہ میں اس میں کوئی خصوصیت ہے؟ اللہ آپ کو جزائے خیر دے، اور اگر اس باب میں کوئی مفید بات ہو تو براہ کرم اضافہ فرمائیں۔",
    },
    summary: {
      ar: "العدّة وفاءٌ وسكينةٌ لا حبسٌ ولا تهمة؛ فيُمنع خروج الزينة والتبرّج، ويُباح الخروج نهارًا للحاجة وما يُؤنس القلب مع المبيت في البيت.",
      en: "The ʿiddah is fidelity and tranquility, not confinement or suspicion; the going-out of adornment is forbidden, while leaving by day for need and comfort is permitted, with the night spent at home.",
      es: "La ʿidda es fidelidad y serenidad, no encierro ni sospecha; se prohíbe la salida del adorno, y se permite salir de día para la necesidad y el consuelo, pernoctando en casa.",
      ur: "عدت وفاداری اور سکون ہے نہ کہ قید یا الزام؛ زیب و زینت کے ساتھ نکلنا ممنوع ہے، دن میں ضرورت اور دل کو اطمینان دینے والے کام کے لیے نکلنا جائز ہے جبکہ رات گھر میں گزارنی ہے۔",
    },
    tags: ['العدة', 'الإحداد', 'المتوفى عنها زوجها', 'مقاصد', 'الغرب', 'فقه الأسرة'],
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
  ur: {
    worship: 'عبادات',
    family: 'خاندان اور تربیت',
    transactions: 'معاملات',
    creed: 'عقیدہ',
    'west-nawazil': 'مغرب کے نوازل',
    general: 'عام',
  },
};
