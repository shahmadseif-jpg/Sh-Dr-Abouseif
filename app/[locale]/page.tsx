// Home page — composes Hero, Mission, reading-paths map, and feeds.
import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import IntellectualProjects from '@/components/IntellectualProjects';
import Stats from '@/components/Stats';
import LatestVideos from '@/components/LatestVideos';
import FacebookEmbed from '@/components/FacebookEmbed';
import CTASection from '@/components/CTASection';
import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

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
