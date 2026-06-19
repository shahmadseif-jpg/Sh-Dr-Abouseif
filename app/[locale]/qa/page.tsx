import { setRequestLocale } from 'next-intl/server';
import QAList from '@/components/QAList';

const TXT = {
  ar: {
    title: 'سؤال وجواب',
    subtitle: 'أرشيفٌ من الأسئلة الشرعيّة المُجابة بأسلوبٍ مقاصديّ ميسَّر، يُعنى بنوازل المسلم في الغرب وعباداته ومعاملاته وأسرته.',
  },
  en: {
    title: 'Questions & Answers',
    subtitle: 'An archive of answered religious questions in an accessible, purpose-driven style — attentive to the worship, transactions, family, and modern issues of Muslims in the West.',
  },
  es: {
    title: 'Preguntas y Respuestas',
    subtitle: 'Un archivo de preguntas religiosas respondidas con un estilo accesible y orientado a los fines —atento a la adoración, las transacciones, la familia y las cuestiones del musulmán en Occidente.',
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
    title: `${t.title} — ${locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}`,
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
    </div>
  );
}
