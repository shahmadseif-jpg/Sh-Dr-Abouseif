import { useTranslations, useLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';

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
        'الإجازة في العلوم الإسلامية',
        'دراسات متقدمة في الفقه والأصول',
        'برامج تخصصية في الدعوة والقيادة الإسلامية',
      ],
      scholarly: [
        'تقديم محاضرات أسبوعية في مساجد ومراكز إسلامية بالولايات المتحدة',
        'تأليف ونشر مقالات في الفقه والفكر الإسلامي',
        'إلقاء خطب الجمعة بمراكز إسلامية متعددة',
        'تدريس مواد متخصصة في علوم الشريعة',
      ],
      leadership: [
        'رئيس أكاديمية الأئمة الأمريكية',
        'مستشار في عدد من المؤسسات الإسلامية',
        'مشارك في برامج تأهيل الأئمة والدعاة',
      ],
    },
    en: {
      academic: [
        'Ijazah in Islamic Sciences',
        'Advanced studies in jurisprudence and its principles',
        'Specialized programs in da\'wah and Islamic leadership',
      ],
      scholarly: [
        'Weekly lectures at masjids and Islamic centers across the United States',
        'Authored and published articles on Islamic jurisprudence and thought',
        'Delivers Friday sermons at multiple Islamic centers',
        'Teaches specialized courses in Shari\'ah sciences',
      ],
      leadership: [
        'President of the American Imams Academy',
        'Advisor to several Islamic institutions',
        'Contributor to imam training and du\'ah qualification programs',
      ],
    },
  };

  const data = content[locale as 'ar' | 'en'];

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.2em] text-gold-500 mb-3">
            {t('subtitle')}
          </div>
          <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto leading-relaxed">
            {t('intro')}
          </p>
        </div>

        <div className="space-y-12 mt-16">
          <Section title={t('sections.academic')} items={data.academic} />
          <Section title={t('sections.scholarly')} items={data.scholarly} />
          <Section title={t('sections.leadership')} items={data.leadership} />
        </div>
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-2xl font-medium text-navy-700 mb-5 gold-line">
        {title}
      </h2>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-3 items-start text-navy-600 leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
