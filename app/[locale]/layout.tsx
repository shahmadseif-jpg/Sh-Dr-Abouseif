import type { Metadata } from 'next';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QAFloatingButton from '@/components/QAFloatingButton';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import '../globals.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  const lang = locale as 'ar' | 'en' | 'es' | 'ur';
  const ogLocale = locale === 'ar' ? 'ar_EG' : locale === 'es' ? 'es_ES' : locale === 'ur' ? 'ur_PK' : 'en_US';

  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      siteName: (SITE_NAME as Record<string, string>)[lang] ?? SITE_NAME.ar,
      url: `/${locale}`,
      locale: ogLocale,
      images: ['/dr-ahmed.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/dr-ahmed.jpg'],
    },
    alternates: {
      languages: {
        ar: '/ar',
        en: '/en',
        es: '/es',
        ur: '/ur',
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = (locale === 'ar' || locale === 'ur') ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-navy-900 antialiased" style={locale === 'ur' ? { fontFamily: "'Noto Nastaliq Urdu', 'Cairo', serif" } : undefined}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <QAFloatingButton />
        </NextIntlClientProvider>
        {/* Privacy-friendly analytics (activates once the domain is added in a Plausible account) */}
        <Script
          defer
          data-domain="sh-dr-abouseif.vercel.app"
          src="https://plausible.io/js/script.js"
        />
      </body>
    </html>
  );
}
