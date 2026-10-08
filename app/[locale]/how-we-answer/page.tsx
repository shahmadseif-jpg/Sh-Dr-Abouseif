import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getResearchItem } from '@/lib/research';

type Locale = 'ar' | 'en' | 'es' | 'ur';

interface Txt {
  eyebrow: string;
  title: string;
  intro: string;
  principles: { title: string; body: string }[];
  caseTitle: string;
  caseBody: string;
  caseCta: string;
  basisTitle: string;
  basisIntro: string;
  ask: string;
  siteName: string;
}

/** Research items that ground this methodology (titles come from lib/research.ts). */
const BASIS_SLUGS = ['fatwa-mufti-eligibility-2018', 'fatwa-us-ai-2025', 'fatwa-digital-transformation'];

const TXT: Record<Locale, Txt> = {
  ar: {
    eyebrow: 'سؤال وجواب',
    title: 'كيف نجيب؟',
    intro:
      'نستقبل أسئلتكم عن الدين وشؤون الحياة، ونجيب عنها بما نراه أقرب إلى الصواب، مستعينين بالله، ملتزمين بالأصول الآتية.',
    principles: [
      {
        title: 'الكتاب والسنة أولًا',
        body: 'نردّ كل مسألة إلى نصوص القرآن الكريم والسنة الصحيحة، ونذكر الدليل ما أمكن، ليطمئن السائل إلى مصدر الجواب.',
      },
      {
        title: 'الإفادة من تراث الفقهاء',
        body: 'ننظر في أقوال المذاهب الفقهية المعتبرة، ونعرض الخلاف إذا كان معتبرًا، ولا نُلزم أحدًا برأي واحد فيما وسّع فيه العلماء.',
      },
      {
        title: 'مراعاة الواقع',
        body: 'نجيب المسلم الذي يعيش في الغرب على أنه يعيش هنا لا هناك. ونراعي قوانين البلد وأعرافه وظروف السائل الخاصة، في حدود ما تسمح به الأصول الشرعية.',
      },
      {
        title: 'التيسير بلا تفريط',
        body: 'نختار من الأقوال ما يرفع الحرج عن الناس إذا قام عليه دليل معتبر، ولا نتتبّع الرخص لمجرد التسهيل.',
      },
      {
        title: 'الإحالة إلى المختصين',
        body: 'في المسائل التي يتداخل فيها الحكم الشرعي مع الطب أو القانون أو المال، نبيّن الجانب الشرعي، وننصح بالرجوع إلى المختص في الجانب الآخر.',
      },
      {
        title: 'الخصوصية',
        body: 'لا ننشر اسم السائل ولا بياناته. وننشر من الأسئلة ما فيه نفع عام، بعد حذف كل ما يدل على صاحبه، وبموافقته.',
      },
    ],
    caseTitle: 'الجواب العام والحالة الخاصة',
    caseBody:
      'الأجوبة المنشورة هنا توجيه عام لمن يشترك في المسألة. فإذا كانت حالتك تتعلق بطلاق أو نزاع أسري أو ميراث معقد أو قضية تحتاج تفاصيل ومتابعة، فالأنسب لها الاستشارة الشخصية لا الجواب المكتوب.',
    caseCta: 'احجز استشارة أسرية',
    basisTitle: 'مرجعية هذا المنهج',
    basisIntro: 'هذه الأصول ليست اجتهادًا عابرًا؛ هي خلاصة أبحاث نشرتها في ضبط الفتوى:',
    ask: 'أرسل سؤالك',
    siteName: 'د. أحمد أبو سيف',
  },
  en: {
    eyebrow: 'Questions & Answers',
    title: 'How We Answer',
    intro:
      'We welcome your questions about faith and everyday life, and we answer them as faithfully as we can, seeking God’s help and following these principles.',
    principles: [
      {
        title: 'The Qur’an and Sunnah come first',
        body: 'Every question goes back to the Qur’an and the authentic Sunnah. We cite the evidence whenever we can, so you know where the answer comes from.',
      },
      {
        title: 'Drawing on the legal tradition',
        body: 'We look at the positions of the recognized schools of Islamic law. Where scholars have legitimately differed, we say so — and we don’t hold anyone to a single view on matters the scholars left open.',
      },
      {
        title: 'Taking real life into account',
        body: 'We answer Muslims living in the West as people who live here, not somewhere else. We consider local laws, customs, and your personal circumstances, within the limits of Islamic principles.',
      },
      {
        title: 'Ease without cutting corners',
        body: 'When a well-supported position relieves people of hardship, we choose it. But we don’t go looking for loopholes just to make things easy.',
      },
      {
        title: 'Referring to specialists',
        body: 'When a question overlaps with medicine, law, or finance, we explain the religious side and recommend that you consult a qualified professional on the rest.',
      },
      {
        title: 'Your privacy',
        body: 'We never publish your name or personal details. We only publish questions that can help others, with your consent, and after removing anything that could identify you.',
      },
    ],
    caseTitle: 'General answers vs. personal situations',
    caseBody:
      'The answers published here are general guidance for anyone facing the same question. If your situation involves divorce, a family conflict, a complicated inheritance, or anything that needs details and follow-up, a personal consultation will serve you better than a written answer.',
    caseCta: 'Book a family consultation',
    basisTitle: 'The research behind this approach',
    basisIntro:
      'These principles aren’t improvised. They grow out of research I have published on the standards for issuing religious rulings (fatwa):',
    ask: 'Send your question',
    siteName: 'Dr. Ahmed Abouseif',
  },
  es: {
    eyebrow: 'Preguntas y Respuestas',
    title: 'Cómo respondemos',
    intro:
      'Recibimos sus preguntas sobre la religión y la vida cotidiana, y las respondemos según lo que consideramos más cercano a lo correcto, pidiendo la ayuda de Dios y siguiendo estos principios.',
    principles: [
      {
        title: 'Primero el Corán y la Sunna',
        body: 'Remitimos cada cuestión a los textos del Corán y de la Sunna auténtica, y citamos la evidencia siempre que es posible, para que quien pregunta sepa de dónde viene la respuesta.',
      },
      {
        title: 'Apoyo en la tradición jurídica',
        body: 'Consideramos las opiniones de las escuelas jurídicas reconocidas. Cuando hay una diferencia de opinión legítima, la exponemos, y no obligamos a nadie a seguir una sola opinión en lo que los sabios dejaron abierto.',
      },
      {
        title: 'Atención a la realidad',
        body: 'Respondemos al musulmán que vive en Occidente como alguien que vive aquí, no en otro lugar. Tenemos en cuenta las leyes y costumbres del país y las circunstancias de cada persona, dentro de los límites de los principios islámicos.',
      },
      {
        title: 'Facilidad sin descuido',
        body: 'Elegimos la opinión que alivia las dificultades de la gente cuando cuenta con una evidencia válida, pero no buscamos excepciones solo para hacer las cosas más fáciles.',
      },
      {
        title: 'Remisión a especialistas',
        body: 'Cuando una cuestión se cruza con la medicina, el derecho o las finanzas, explicamos el aspecto religioso y recomendamos consultar a un profesional cualificado para lo demás.',
      },
      {
        title: 'Privacidad',
        body: 'No publicamos el nombre ni los datos de quien pregunta. Solo publicamos preguntas de beneficio general, con su consentimiento y tras eliminar todo lo que pueda identificarle.',
      },
    ],
    caseTitle: 'Respuesta general y caso personal',
    caseBody:
      'Las respuestas publicadas aquí son una orientación general para quien comparte la misma cuestión. Si su caso tiene que ver con un divorcio, un conflicto familiar, una herencia complicada o algo que requiere detalles y seguimiento, le conviene más una consulta personal que una respuesta escrita.',
    caseCta: 'Reservar una consulta familiar',
    basisTitle: 'El fundamento de este método',
    basisIntro:
      'Estos principios no son improvisados: resumen investigaciones que he publicado sobre las normas de la fatwa (dictamen religioso):',
    ask: 'Envíe su pregunta',
    siteName: 'Dr. Ahmed Abouseif',
  },
  ur: {
    eyebrow: 'سوال و جواب',
    title: 'ہم کیسے جواب دیتے ہیں؟',
    intro:
      'ہم دین اور زندگی کے معاملات سے متعلق آپ کے سوالات وصول کرتے ہیں، اور اللہ کی مدد سے ان کا وہ جواب دیتے ہیں جو ہمارے نزدیک درستی کے سب سے قریب ہو، ان اصولوں کی پابندی کے ساتھ۔',
    principles: [
      {
        title: 'قرآن و سنت سب سے پہلے',
        body: 'ہم ہر مسئلے کو قرآنِ کریم اور صحیح سنت کی نصوص کی طرف لوٹاتے ہیں، اور جہاں تک ممکن ہو دلیل ذکر کرتے ہیں، تاکہ سائل کو جواب کے ماخذ پر اطمینان ہو۔',
      },
      {
        title: 'فقہی ورثے سے استفادہ',
        body: 'ہم معتبر فقہی مذاہب کے اقوال دیکھتے ہیں، اختلاف معتبر ہو تو اسے بیان کرتے ہیں، اور جن امور میں علما نے گنجائش رکھی ہے ان میں کسی کو ایک ہی رائے کا پابند نہیں کرتے۔',
      },
      {
        title: 'حالات کی رعایت',
        body: 'ہم مغرب میں رہنے والے مسلمان کو یہیں کا رہنے والا سمجھ کر جواب دیتے ہیں، کہیں اور کا نہیں۔ ملک کے قوانین و عرف اور سائل کے خاص حالات کی رعایت کرتے ہیں، شرعی اصولوں کی حدود میں رہتے ہوئے۔',
      },
      {
        title: 'آسانی، مگر کوتاہی کے بغیر',
        body: 'جو قول معتبر دلیل پر قائم ہو اور لوگوں سے تنگی دور کرے، اسے اختیار کرتے ہیں؛ مگر محض سہولت کی خاطر رخصتیں تلاش نہیں کرتے۔',
      },
      {
        title: 'ماہرین سے رجوع',
        body: 'جن مسائل میں شرعی حکم طب، قانون یا مالیات سے جڑا ہو، ان میں ہم شرعی پہلو واضح کرتے ہیں اور دوسرے پہلو کے لیے متعلقہ ماہر سے رجوع کا مشورہ دیتے ہیں۔',
      },
      {
        title: 'رازداری',
        body: 'ہم سائل کا نام یا اس کی معلومات شائع نہیں کرتے۔ صرف وہی سوالات شائع کرتے ہیں جن میں عام فائدہ ہو، سائل کی رضامندی سے، اور ہر وہ بات حذف کرنے کے بعد جس سے اس کی شناخت ہو سکے۔',
      },
    ],
    caseTitle: 'عام جواب اور ذاتی معاملہ',
    caseBody:
      'یہاں شائع ہونے والے جوابات اسی مسئلے سے دوچار ہر شخص کے لیے عمومی رہنمائی ہیں۔ اگر آپ کا معاملہ طلاق، خاندانی تنازع، پیچیدہ وراثت یا کسی ایسی صورت سے متعلق ہے جس میں تفصیل اور پیروی درکار ہو، تو اس کے لیے تحریری جواب کے بجائے ذاتی مشاورت زیادہ مناسب ہے۔',
    caseCta: 'خاندانی مشاورت کا وقت لیں',
    basisTitle: 'اس منہج کی بنیاد',
    basisIntro: 'یہ اصول کوئی وقتی رائے نہیں، بلکہ فتویٰ کے ضوابط پر میری شائع شدہ تحقیقات کا خلاصہ ہیں:',
    ask: 'اپنا سوال بھیجیں',
    siteName: 'ڈاکٹر احمد ابو سیف',
  },
};

const NUM_LOCALE: Record<Locale, string> = { ar: 'ar-EG', en: 'en-US', es: 'es-ES', ur: 'ur-PK' };

function pick(locale: string): Txt {
  return TXT[locale as Locale] ?? TXT.ar;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = pick(locale);
  return { title: `${t.title} — ${t.siteName}`, description: t.intro };
}

export default async function HowWeAnswerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = pick(locale);
  const loc = (TXT[locale as Locale] ? locale : 'ar') as Locale;
  const numLocale = NUM_LOCALE[loc];

  const basis = BASIS_SLUGS.map((slug) => getResearchItem(slug))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .map((r) => ({
      slug: r.slug,
      title: (r.title as Record<string, string | undefined>)[loc] ?? r.title.ar,
      year: r.year.toLocaleString(numLocale, { useGrouping: false }),
    }));

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.2em] text-gold-500 mb-3 font-medium">{t.eyebrow}</div>
          <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-4">{t.title}</h1>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto leading-relaxed">{t.intro}</p>
        </div>

        <div className="space-y-4">
          {t.principles.map((p, i) => (
            <div key={i} className="bg-white border border-navy-100 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-9 h-9 rounded-full bg-navy-50 text-navy-600 flex items-center justify-center text-sm font-medium">
                  {(i + 1).toLocaleString(numLocale)}
                </div>
                <div>
                  <h2 className="text-lg font-medium text-navy-700 mb-1">{p.title}</h2>
                  <p className="text-navy-600 leading-relaxed">{p.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-gold-200 bg-gold-50/60 p-6">
          <h2 className="text-lg font-medium text-navy-700 mb-2">{t.caseTitle}</h2>
          <p className="text-navy-600 leading-relaxed mb-4">{t.caseBody}</p>
          <Link
            href="/consultations"
            className="inline-flex items-center px-5 py-2.5 border border-navy-200 text-navy-600 text-sm font-medium rounded-md hover:bg-white transition-colors no-underline"
          >
            {t.caseCta}
          </Link>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-medium text-navy-700 mb-3">{t.basisTitle}</h2>
          <p className="text-navy-600 leading-relaxed mb-4">{t.basisIntro}</p>
          <ul className="space-y-2">
            {basis.map((r) => (
              <li key={r.slug}>
                <Link href={`/research/${r.slug}`} className="text-navy-700 hover:text-gold-600">
                  {loc === 'en' ? `“${r.title}”` : `«${r.title}»`}
                </Link>
                <span className="text-navy-400 text-sm"> ({r.year})</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/qa#ask"
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy-600 text-white text-sm font-medium rounded-md hover:bg-navy-700 transition-colors no-underline"
          >
            {t.ask}
          </Link>
        </div>
      </div>
    </div>
  );
}
