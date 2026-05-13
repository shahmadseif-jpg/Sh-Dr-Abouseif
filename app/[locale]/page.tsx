import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import LatestVideos from '@/components/LatestVideos';
import CTASection from '@/components/CTASection';
import { setRequestLocale } from 'next-intl/server';

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
      <Stats />
      <LatestVideos />
      <CTASection />
    </>
  );
}
