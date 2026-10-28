import { useTranslations } from 'next-intl';
import ArticlesList from './ArticlesList';

export default function ArticlesIndex({ initialPage = 1 }: { initialPage?: number }) {
  const t = useTranslations('articles');

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <ArticlesList initialPage={initialPage} />
      </div>
    </div>
  );
}
