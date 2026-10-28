import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import ArticlesIndex from '@/components/ArticlesIndex';
import { getAllArticles } from '@/lib/articles';
import { articlePageCount, articlePagePath } from '@/lib/article-pagination';
import { pageMetadata } from '@/lib/seo';

// Every archive page ships with the deployment; unknown pages never generate.
export const revalidate = false;
export const dynamicParams = false;
export function generateStaticParams() {
  return Array.from({ length: articlePageCount(getAllArticles().length) - 1 }, (_, i) => ({ page: String(i + 2) }));
}
type Params = Promise<{ locale: string; page: string }>;
function resolvePage(value: string) {
  const n = Number(value);
  if (!/^[1-9]\d*$/.test(value) || n < 2 || n > articlePageCount(getAllArticles().length)) notFound();
  return n;
}
export async function generateMetadata({ params }: { params: Params }) {
  const { locale, page } = await params;
  const n = resolvePage(page);
  const t = await getTranslations({ locale, namespace: 'articlePagination' });
  return pageMetadata({ locale, path: articlePagePath(n), title: t('pageTitle', { page: n }) });
}
export default async function ArchivePage({ params }: { params: Params }) {
  const { locale, page } = await params;
  setRequestLocale(locale);
  return <ArticlesIndex initialPage={resolvePage(page)} />;
}
