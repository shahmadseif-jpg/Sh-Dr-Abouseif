import { setRequestLocale } from 'next-intl/server';
import QAList from '@/components/QAList';
import FatwaContent from '@/components/FatwaContent';
import { Link } from '@/i18n/routing';

const TXT = {
  ar: {
    title: 'سؤال وجواب',
    subtitle: 'أرشيفٌ من الأسئلة الشرعيّة المُجابة بأسلوبٍ مقاصديّ ميسَّر، يُعنى بنوازل المسلم في الغرب وعباداته ومعاملاته وأسرته.',
    howLink: 'كيف نجيب؟ تعرّف على منهجنا في الإجابة',
    caseNote: 'إن كانت مسألتك حالة شخصية تحتاج تفاصيل ومتابعة، فالاستشارة الأسرية أنسب لها.',
    caseCta: 'احجز استشارة',
  },
  en: {
    title: 'Questions & Answers',
    subtitle: 'An archive of answered religious questions in an accessible, purpose-driven style — attentive to the worship, transactions, family, and modern issues of Muslims in the West.',
    howLink: 'How we answer: read about our approach',
    caseNote: 'If your question is a personal situation that needs details and follow-up, a family consultation will serve you better.',
    caseCta: 'Book a consultation',
  },
  es: {
    title: 'Preguntas y Respuestas',
    subtitle: 'Un archivo de preguntas religiosas respondidas con un estilo accesible y orientado a los fines —atento a la adoración, las transacciones, la familia y las cuestiones del musulmán en Occidente.',
    howLink: 'Cómo respondemos: conozca nuestro método',
    caseNote: 'Si su pregunta es un caso personal que requiere detalles y seguimiento, le conviene más una consulta familiar.',
    caseCta: 'Reservar una consulta',
  },
  ur: {
    title: 'سوال و جواب',
    subtitle: 'شرعی سوالات اور ان کے آسان، مقاصدی جوابات کا ذخیرہ—مغرب میں مسلمانوں کی عبادات، معاملات، خاندان اور معاصر مسائل پر خصوصی توجہ کے ساتھ۔',
    howLink: 'ہم کیسے جواب دیتے ہیں؟ ہمارا منہج جانیے',
    caseNote: 'اگر آپ کا سوال کوئی ذاتی معاملہ ہے جس میں تفصیل اور پیروی درکار ہو، تو خاندانی مشاورت زیادہ مناسب ہے۔',
    caseCta: 'مشاورت کا وقت لیں',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = TXT[(locale as keyof typeof TXT)] ?? TXT.ar;
  return {
    title: `${t.title} — ${locale === 'ar' ? 'د. أحمد أبو سيف' : locale === 'ur' ? 'ڈاکٹر احمد ابو سیف' : 'Dr. Ahmed Abouseif'}`,
    description: t.subtitle,
  };
}

export default async function QAPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = TXT[(locale as keyof typeof TXT)] ?? TXT.ar;

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-4">{t.title}</h1>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto leading-relaxed">{t.subtitle}</p>
        </div>
        <QAList />
      </div>

      {/* Ask form — questions submitted here arrive at the Shaykh's email */}
      <div id="ask" className="scroll-mt-24 mt-8 border-t border-navy-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-10 text-center space-y-3">
          <Link href="/how-we-answer" className="inline-block text-navy-700 font-medium hover:text-gold-600">
            {t.howLink}
          </Link>
          <p className="text-sm text-navy-600 bg-gold-50/60 border border-gold-200 rounded-md px-4 py-3">
            {t.caseNote}{' '}
            <Link href="/consultations" className="font-medium text-navy-700 underline hover:text-gold-600">
              {t.caseCta}
            </Link>
          </p>
        </div>
        <FatwaContent />
      </div>
    </div>
  );
}
