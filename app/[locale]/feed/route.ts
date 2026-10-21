/**
 * RSS 2.0 feed — one per locale at /{locale}/feed, advertised with
 * <link rel="alternate" type="application/rss+xml"> in the locale layout.
 * Aggregates articles + research + khawatir (Q&A is intentionally not part
 * of the feed).
 *
 * Language policy: a locale's feed lists only items whose text exists in
 * that language (lib/content-availability-server.ts); Arabic-fallback pages
 * are not syndicated as if they were translations.
 *
 * Dates: metadata records publication DAYS only, so pubDate is that day at
 * 00:00 GMT by convention (RFC 822 requires a time); no clock time is
 * invented, and an item without a date gets no pubDate rather than the
 * build time.
 */
import { getAllArticles, localize } from '@/lib/articles';
import { getAllKhawatir } from '@/lib/khawatir';
import { getAllResearch } from '@/lib/research';
import { SITE_URL } from '@/lib/site';
import { SITE_LOCALES, isSiteLocale, rssDate } from '@/lib/seo';
import { availableLocales } from '@/lib/content-availability-server';

export const dynamic = 'force-static';
// Only the four site locales exist; any other /{x}/feed is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return SITE_LOCALES.map((locale) => ({ locale }));
}

const FEED_TITLE: Record<string, string> = {
  ar: 'د. أحمد أبو سيف — أحدث المحتوى',
  en: 'Dr. Ahmed Abouseif — Latest',
  es: 'Dr. Ahmed Abouseif — Lo más reciente',
  ur: 'ڈاکٹر احمد ابو سیف — تازہ ترین مواد',
};
const FEED_DESC: Record<string, string> = {
  ar: 'أحدث المقالات والأبحاث والخواطر للدكتور أحمد أبو سيف.',
  en: 'Latest articles, research, and reflections by Dr. Ahmed Abouseif.',
  es: 'Últimos artículos, investigaciones y reflexiones del Dr. Ahmed Abouseif.',
  ur: 'ڈاکٹر احمد ابو سیف کے تازہ ترین مضامین، تحقیقات اور خواطر۔',
};

function esc(s: string): string {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface FeedItem {
  title: string;
  desc: string;
  url: string;
  date: string;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) {
    return new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  const base = `${SITE_URL}/${locale}`;
  const items: FeedItem[] = [];
  const has = (kind: Parameters<typeof availableLocales>[0], slug: string, meta?: Parameters<typeof availableLocales>[2]) =>
    (availableLocales(kind, slug, meta) as string[]).includes(locale);

  for (const a of getAllArticles()) {
    if (!has('articles', a.slug)) continue;
    items.push({
      title: localize(a.title, locale),
      desc: localize(a.excerpt, locale),
      url: `${base}/articles/${a.slug}`,
      date: a.isoDate,
    });
  }
  for (const r of getAllResearch()) {
    if (!has('research', r.slug, r)) continue;
    items.push({
      title: localize(r.title, locale),
      desc: localize(r.abstract, locale),
      url: `${base}/research/${r.slug}`,
      date: r.isoDate,
    });
  }
  for (const k of getAllKhawatir()) {
    if (!has('khawatir', k.slug)) continue;
    items.push({
      title: localize(k.title, locale),
      desc: localize(k.excerpt, locale),
      url: `${base}/khawatir/${k.slug}`,
      date: k.isoDate,
    });
  }

  items.sort((a, b) => (a.date < b.date ? 1 : -1));

  const lastBuild = new Date().toUTCString();
  const xmlItems = items
    .map((it) => {
      const pub = rssDate(it.date);
      return `    <item>
      <title>${esc(it.title)}</title>
      <link>${esc(it.url)}</link>
      <guid isPermaLink="true">${esc(it.url)}</guid>
${pub ? `      <pubDate>${pub}</pubDate>\n` : ''}      <description>${esc(it.desc)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(FEED_TITLE[locale] || FEED_TITLE.ar)}</title>
    <link>${base}</link>
    <description>${esc(FEED_DESC[locale] || FEED_DESC.ar)}</description>
    <language>${locale}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${base}/feed" rel="self" type="application/rss+xml"/>
${xmlItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
