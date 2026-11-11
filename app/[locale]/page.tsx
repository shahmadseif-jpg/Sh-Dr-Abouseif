// Home page — composes Hero, Mission, reading-paths map, and feeds.
import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import IntellectualProjects from '@/components/IntellectualProjects';
import Stats from '@/components/Stats';
import LatestVideos from '@/components/LatestVideos';
import FacebookEmbed from '@/components/FacebookEmbed';
import CTASection from '@/components/CTASection';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import { pageMetadata } from '@/lib/seo';

// Static + ISR: regenerated at most once a day (YouTube RSS is fetched at
// regeneration time, not per visit). force-dynamic here made every visit
// run the server and drove Fast Origin Transfer past the free quota.
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  return pageMetadata({ locale, path: '', title: t('title'), description: t('description') });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Mission />
      <IntellectualProjects />
      <Stats />
      <Suspense fallback={null}>
        <LatestVideos />
      </Suspense>
      <FacebookEmbed />
      <CTASection />
    </>
  );
}
