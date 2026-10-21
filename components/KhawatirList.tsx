// Server component. Sorts and localizes the khawatir metadata on the server
// and hands the client grid only what the current locale displays, so the
// full four-language metadata (lib/khawatir.ts, ~540 kB of source) is no
// longer shipped to the browser (PERF-02).
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { khawatirMeta, prayerLabels } from '@/lib/khawatir';
import { localize } from '@/lib/localize';
import { published } from '@/lib/publish';
import KhawatirGrid, { type KhawatirCard } from './KhawatirGrid';

export default function KhawatirList() {
  const locale = useLocale();
  const t = useTranslations('khawatir');
  const ui = useTranslations('ui');
  const pl = prayerLabels[locale as 'ar' | 'en' | 'es' | 'ur'] ?? prayerLabels.en;

  // Sort by date descending
  const sorted = published(khawatirMeta).sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));

  if (sorted.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-navy-500 leading-relaxed">{t('no_khawatir')}</p>
      </div>
    );
  }

  const items: KhawatirCard[] = sorted.map((k) => ({
    slug: k.slug,
    prayer: k.prayer,
    title: localize(k.title, locale),
    excerpt: localize(k.excerpt, locale),
    date: localize(k.date, locale),
    minutes: ui('readingMinutes', { count: k.readingMinutes, n: String(k.readingMinutes) }),
    hasVideo: !!k.videoUrl,
  }));

  return (
    <>
      <KhawatirGrid items={items} prayerLabels={{ ...pl }} />
      {/* Without JavaScript only the first page of cards is visible, so a
          plain index of every reflection is kept in the HTML for no-JS
          readers and crawlers. With scripting on, <noscript> content is not
          parsed into DOM nodes and costs nothing at runtime. */}
      <noscript>
        <section className="mt-12">
          <h2 className="text-xl font-medium text-navy-700 mb-4">{t('index_heading')}</h2>
          <ul className="space-y-2">
            {items.map((k) => (
              <li key={k.slug}>
                <Link href={`/${locale}/khawatir/${k.slug}`}>{k.title}</Link>
                <span className="text-xs text-navy-500"> — {k.date}</span>
              </li>
            ))}
          </ul>
        </section>
      </noscript>
    </>
  );
}
