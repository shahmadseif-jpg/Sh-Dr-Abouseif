/**
 * Dormant RSS 2.0 feed — one per locale at /{locale}/feed
 * Aggregates articles + research + khawatir. Not linked anywhere yet;
 * ready to power auto-syndication (social / email) when activated.
 */
import { getAllArticles, localize } from '@/lib/articles';
import { getAllKhawatir } from '@/lib/khawatir';
import { getAllResearch } from '@/lib/research';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }, { locale: 'es' }];
}

const FEED_TITLE: Record<string, string> = {
  ar: 'د. أحمد أبو سيف — أحدث المحتوى',
  en: 'Dr. Ahmed Abouseif — Latest',
  es: 'Dr. Ahmed Abouseif — Lo más reciente',
};
const FEED_DESC: Record<string, string> = {
  ar: 'أحدث المقالات والأبحاث والخواطر للدكتور أحمد أبو سيف.',
  en: 'Latest articles, research, and reflections by Dr. Ahmed Abouseif.',
  es: 'Últimos artículos, investigaciones y reflexiones del Dr. Ahmed Abouseif.',
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
  const base = `${SITE_URL}/${locale}`;
  const items: FeedItem[] = [];

  for (const a of getAllArticles()) {
    items.push({
      title: localize(a.title, locale),
      desc: localize(a.excerpt, locale),
      url: `${base}/articles/${a.slug}`,
      date: a.isoDate,
    });
  }
  for (const r of getAllResearch()) {
    items.push({
      title: localize(r.title, locale),
      desc: localize(r.abstract, locale),
      url: `${base}/research/${r.slug}`,
      date: r.isoDate,
    });
  }
  for (const k of getAllKhawatir()) {
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
      const pub = it.date ? new Date(it.date + 'T08:00:00Z').toUTCString() : lastBuild;
      return `    <item>
      <title>${esc(it.title)}</title>
      <link>${esc(it.url)}</link>
      <guid isPermaLink="true">${esc(it.url)}</guid>
      <pubDate>${pub}</pubDate>
      <description>${esc(it.desc)}</description>
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
