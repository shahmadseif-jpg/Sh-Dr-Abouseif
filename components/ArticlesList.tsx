'use client';

import { useLocale } from 'next-intl';

interface Article {
  id: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  dateAr: string;
  dateEn: string;
  category: string;
}

const articles: Article[] = [
  {
    id: '1',
    titleAr: 'الإمامة في الإسلام: مسؤولية القيادة الروحية في الغرب',
    titleEn: 'Imamship in Islam: The Responsibility of Spiritual Leadership in the West',
    excerptAr:
      'دور الإمام في المجتمع المسلم لم يعد محصوراً في إمامة الصلاة، بل امتد ليشمل التوجيه الأسري، والإرشاد النفسي، وقيادة المؤسسات. هذا المقال يبحث في تحديات الإمامة المعاصرة في المهجر، وكيف نُعدّ جيلاً من الأئمة قادراً على خدمة الجالية المسلمة بفهم عميق وروية شرعية.',
    excerptEn:
      "The role of the Imam in Muslim communities extends beyond leading prayer to family guidance, counseling, and institutional leadership. This article explores the challenges of contemporary imamship in the diaspora, and how we prepare a generation capable of serving the Muslim community with deep understanding.",
    dateAr: '7 مايو 2026',
    dateEn: 'May 7, 2026',
    category: 'imamship',
  },
  {
    id: '2',
    titleAr: 'الأسرة المسلمة بين أصالة الشرع ومتغيرات الواقع',
    titleEn: 'The Muslim Family: Between Authentic Shariah and Modern Realities',
    excerptAr:
      'تواجه الأسرة المسلمة في العصر الحاضر تحديات لم تعرفها الأجيال السابقة. كيف نوازن بين الثوابت الشرعية ومتطلبات الحياة المعاصرة؟ نناقش في هذا المقال أصول التربية الإسلامية، ومهارات التواصل بين الزوجين، وكيفية تنشئة الأبناء على القيم في زمن العولمة.',
    excerptEn:
      'The Muslim family today faces challenges previous generations did not. How do we balance Shariah principles with modern life demands? This article discusses Islamic parenting foundations, spousal communication skills, and raising children with values in the age of globalization.',
    dateAr: '28 أبريل 2026',
    dateEn: 'April 28, 2026',
    category: 'family',
  },
  {
    id: '3',
    titleAr: 'فقه الأقليات: ضوابط شرعية ومرتكزات منهجية',
    titleEn: "Minority Jurisprudence: Shariah Principles and Methodological Foundations",
    excerptAr:
      'كيف نعيش إسلامنا في بلاد لا تحكمها الشريعة؟ كيف نتعامل مع المعاملات المالية والاجتماعية في المجتمعات غير المسلمة؟ يستعرض هذا المقال أسس فقه الأقليات الذي وضعه كبار العلماء المعاصرون، مع نماذج تطبيقية من حياة الجالية المسلمة في أمريكا.',
    excerptEn:
      'How do we live our Islam in lands not governed by Shariah? How do we approach financial and social transactions in non-Muslim societies? This article examines the foundations of minority jurisprudence (fiqh al-aqalliyat) with practical examples from the American Muslim community.',
    dateAr: '15 أبريل 2026',
    dateEn: 'April 15, 2026',
    category: 'fiqh',
  },
];

const categoryLabels = {
  ar: {
    imamship: 'الإمامة والقيادة',
    family: 'الأسرة والتربية',
    fiqh: 'فقه وفكر',
  },
  en: {
    imamship: 'Imamship & Leadership',
    family: 'Family & Parenting',
    fiqh: 'Jurisprudence',
  },
};

export default function ArticlesList() {
  const locale = useLocale() as 'ar' | 'en';
  const readMore = locale === 'ar' ? 'اقرأ المزيد' : 'Read more';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <article
          key={article.id}
          className="bg-white border border-navy-100 rounded-lg p-6 card-hover flex flex-col"
        >
          <div className="text-xs uppercase tracking-wider text-gold-500 mb-3">
            {categoryLabels[locale][article.category as keyof typeof categoryLabels.ar]}
          </div>
          <h3 className="text-lg font-medium text-navy-700 leading-snug mb-3 flex-1">
            {locale === 'ar' ? article.titleAr : article.titleEn}
          </h3>
          <p className="text-sm text-navy-600 leading-relaxed mb-4 line-clamp-4">
            {locale === 'ar' ? article.excerptAr : article.excerptEn}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-navy-100 mt-auto">
            <span className="text-xs text-navy-500">
              {locale === 'ar' ? article.dateAr : article.dateEn}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 hover:text-gold-500 transition-colors"
              onClick={() => {
                alert(
                  locale === 'ar'
                    ? 'المقال الكامل سيُنشر قريباً إن شاء الله.'
                    : 'Full article will be published soon, insha\'Allah.'
                );
              }}
            >
              {readMore}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {locale === 'ar' ? <path d="M9 3L5 7l4 4" /> : <path d="M5 3l4 4-4 4" />}
              </svg>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
