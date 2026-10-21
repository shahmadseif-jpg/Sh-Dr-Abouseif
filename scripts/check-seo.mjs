#!/usr/bin/env node
/**
 * check-seo — static assertions for the indexing policy (no build, no network).
 *
 *  - lib/seo.ts: canonical / hreflang / x-default rules for static pages,
 *    translated content, Arabic-fallback content; OG url; search noindex;
 *    JSON-LD "<" escaping; RFC 822 feed dates without invented time.
 *  - app/sitemap.ts: only real translations, no lastModified, no drafts,
 *    hreflang sets mirror the pages.
 *  - app/[locale]/feed/route.ts: unsupported locale -> 404, real-language
 *    items only, no 08:00 synthetic time.
 *  - publication gate: a synthetic draft (never written to disk) is invisible
 *    to getArticleMeta / lists / search / sitemap / feed.
 *  - every app/[locale] page with metadata uses pageMetadata (exceptions
 *    listed), and the four message files have identical key sets.
 *
 * Usage: node scripts/check-seo.mjs   (exit 1 on any failure)
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, importProject } from './lib/ts-loader.mjs';

process.chdir(ROOT); // content availability is resolved from process.cwd()

const results = [];
const check = (name, cond, detail = '') => results.push({ name, ok: !!cond, detail });

const seo = await importProject('lib/seo.ts');
const { SITE_URL } = await importProject('lib/site.ts');

/* ---------- languagePolicy / pageMetadata ---------- */
{
  const p = seo.languagePolicy({ locale: 'es', path: '/about' });
  check('static page: canonical is own URL', p.canonical === '/es/about');
  check('static page: hreflang lists 4 locales + x-default(ar)',
    JSON.stringify(Object.keys(p.languages)) === JSON.stringify(['ar', 'en', 'es', 'ur', 'x-default']) && p.languages['x-default'] === '/ar/about');
}
{
  const p = seo.languagePolicy({ locale: 'en', path: '/articles/x', available: ['ar', 'en'] });
  check('translated content: canonical self', p.canonical === '/en/articles/x' && p.isOwnVersion);
  check('translated content: hreflang only real translations', JSON.stringify(p.languages) === JSON.stringify({ ar: '/ar/articles/x', en: '/en/articles/x', 'x-default': '/ar/articles/x' }));
}
{
  const p = seo.languagePolicy({ locale: 'ur', path: '/khawatir/x', available: ['ar', 'en'], resolvedLocale: 'ar' });
  check('fallback content: canonical to Arabic URL', p.canonical === '/ar/khawatir/x' && !p.isOwnVersion);
  check('fallback content: no hreflang emitted', Object.keys(p.languages).length === 0);
  check('fallback content: content language is Arabic', p.contentLocale === 'ar');
}
{
  const p = seo.languagePolicy({ locale: 'es', path: '/articles/y', available: ['en'], resolvedLocale: 'en' });
  check('no Arabic body: x-default/fallback use first available', p.canonical === '/en/articles/y');
  const q = seo.languagePolicy({ locale: 'en', path: '/articles/y', available: ['en'] });
  check('no Arabic body: x-default = en', q.languages['x-default'] === '/en/articles/y');
}
{
  const m = seo.pageMetadata({ locale: 'ur', path: '/qa/z', title: 'T', description: 'D', available: ['ar', 'en'], resolvedLocale: 'ar', ogType: 'article', publishedTime: '2026-01-02' });
  check('OG url equals canonical', m.openGraph.url === '/ar/qa/z' && m.alternates.canonical === '/ar/qa/z');
  check('OG locale follows the language shown', m.openGraph.locale === 'ar_EG');
  check('OG title/description per page', m.openGraph.title === 'T' && m.openGraph.description === 'D');
  check('fallback metadata has no languages key', !('languages' in m.alternates));
  const s = seo.pageMetadata({ locale: 'ar', path: '/search', title: 'S', noindex: true });
  check('search is noindex,follow', s.robots && s.robots.index === false && s.robots.follow === true);
  const h = seo.pageMetadata({ locale: 'en', path: '', title: 'H' });
  check('home canonical /en', h.alternates.canonical === '/en');
}
{
  const out = seo.jsonLdString({ a: '</script><script>alert(1)</script>', b: 'x & y', c: '\u2028' });
  check('JSON-LD escapes < > & and U+2028', !out.includes('<') && !out.includes('>') && !out.includes('&') && out.includes('\\u003c/script') && !out.includes('\u2028'));
  check('JSON-LD stays equivalent', JSON.parse(out).a === '</script><script>alert(1)</script>');
}
{
  check('rssDate: day at 00:00 GMT', seo.rssDate('2026-10-18') === 'Sun, 18 Oct 2026 00:00:00 GMT');
  check('rssDate: missing/invalid -> null', seo.rssDate(undefined) === null && seo.rssDate('2026-13') === null);
}

/* ---------- publication gate with a synthetic draft ---------- */
const articles = await importProject('lib/articles.ts');
const khawatir = await importProject('lib/khawatir.ts');
const research = await importProject('lib/research.ts');
const qa = await importProject('lib/qa.ts');
const DRAFT_SLUG = 'wisdom-lost-property'; // has real bodies in all 4 locales
const original = articles.articlesMeta.find((a) => a.slug === DRAFT_SLUG);
check('fixture article exists', !!original);
original.draft = true; // in-memory only
check('draft: getArticleMeta(slug) is undefined', articles.getArticleMeta(DRAFT_SLUG) === undefined);
check('draft: excluded from getAllArticles', !articles.getAllArticles().some((a) => a.slug === DRAFT_SLUG));
const search = await importProject('lib/search.ts');
check('draft: excluded from search index', !search.buildIndex('ar').some((h) => h.slug === DRAFT_SLUG && h.type === 'article'));

const sitemapMod = await importProject('app/sitemap.ts');
const sm = sitemapMod.default();
check('draft: excluded from sitemap', !sm.some((e) => e.url.includes(`/articles/${DRAFT_SLUG}`)));
const feedMod = await importProject('app/[locale]/feed/route.ts');
const feedAr = await (await feedMod.GET(new Request('http://x/ar/feed'), { params: Promise.resolve({ locale: 'ar' }) })).text();
check('draft: excluded from feed', !feedAr.includes(`/articles/${DRAFT_SLUG}<`));
original.draft = undefined;
check('restored: visible again', articles.getArticleMeta(DRAFT_SLUG) !== undefined);
const feedArAgain = await (await feedMod.GET(new Request('http://x/ar/feed'), { params: Promise.resolve({ locale: 'ar' }) })).text();
check('restored: back in feed (gate check is meaningful)', feedArAgain.includes(`/articles/${DRAFT_SLUG}<`));
check('restored: back in sitemap', sitemapMod.default().some((e) => e.url.endsWith(`/ar/articles/${DRAFT_SLUG}`)));

/* ---------- BibTeX keys (CITE-01) ---------- */
{
  const keys = research.researchMeta.map((r) => `abouseif${r.year}-${r.slug}`.replace(/[^A-Za-z0-9:_-]/g, ''));
  const years = research.researchMeta.map((r) => r.year);
  const sameYear = years.length - new Set(years).size;
  check(`BibTeX keys unique across ${keys.length} works (${sameYear} share a year)`, new Set(keys).size === keys.length);
  const page = fs.readFileSync(path.join(ROOT, 'app/[locale]/research/[slug]/page.tsx'), 'utf8');
  const cite = fs.readFileSync(path.join(ROOT, 'components/CiteThis.tsx'), 'utf8');
  check('research page passes a per-work citeKey', page.includes('citeKey={`abouseif${item.year}-${slug}`}'));
  check('CiteThis has Urdu labels', cite.includes("locale === 'ur'") && cite.includes('اس تحقیق کا حوالہ دیں'));
  check('CiteThis no longer uses year-only key', !cite.includes('const key = `abouseif${year}`;'));
}
for (const [name, mod, get, list] of [['khawatir', khawatir, 'getKhatraMeta', 'khawatirMeta'], ['research', research, 'getResearchItem', 'researchMeta'], ['qa', qa, 'getQAMeta', 'qaMeta']]) {
  const item = mod[list][0];
  item.draft = true;
  check(`draft gate: ${name} lookup hides drafts`, mod[get](item.slug) === undefined);
  item.draft = undefined;
}

/* ---------- sitemap ---------- */
{
  const entries = sitemapMod.default();
  check('sitemap: no lastModified anywhere', entries.every((e) => e.lastModified === undefined));
  check('sitemap: no /search', !entries.some((e) => /\/search$/.test(e.url)));
  const urls = new Set(entries.map((e) => e.url));
  check('sitemap: no duplicate URLs', urls.size === entries.length);
  let fallbackListed = 0;
  let hreflangMismatch = 0;
  for (const e of entries) {
    const m = e.url.match(/^https?:\/\/[^/]+\/(ar|en|es|ur)\/(articles|khawatir|qa|research)\/([^/]+)$/);
    if (!m) continue;
    const [, loc, kind, slug] = m;
    const dirs = kind === 'articles' ? ['', 'content/articles'] : [kind];
    if (!dirs.some((d) => fs.existsSync(path.join(ROOT, d, `${slug}.${loc}.md`)))) fallbackListed++;
    for (const href of Object.values(e.alternates?.languages ?? {})) if (!urls.has(href)) hreflangMismatch++;
  }
  check('sitemap: every content URL has a body in its language', fallbackListed === 0, `${fallbackListed} fallback URLs`);
  check('sitemap: every hreflang target is itself listed', hreflangMismatch === 0, `${hreflangMismatch} dangling`);
  console.log(`sitemap entries: ${entries.length}`);
}

/* ---------- feed ---------- */
{
  const bad = await feedMod.GET(new Request('http://x/xx/feed'), { params: Promise.resolve({ locale: 'xx' }) });
  check('feed: unsupported locale -> 404', bad.status === 404);
  check('feed: dynamicParams=false', feedMod.dynamicParams === false);
  const counts = {};
  for (const loc of ['ar', 'en', 'es', 'ur']) {
    const xml = await (await feedMod.GET(new Request(`http://x/${loc}/feed`), { params: Promise.resolve({ locale: loc }) })).text();
    counts[loc] = (xml.match(/<item>/g) || []).length;
    check(`feed ${loc}: no synthetic 08:00 time`, !xml.includes('08:00:00 GMT'));
    const links = [...xml.matchAll(/<link>https?:\/\/[^<]+\/(articles|khawatir|research)\/([^<]+)<\/link>/g)];
    const missing = links.filter(([, kind, slug]) => {
      const dirs = kind === 'articles' ? ['', 'content/articles'] : [kind];
      return !dirs.some((d) => fs.existsSync(path.join(ROOT, d, `${slug}.${loc}.md`)));
    });
    check(`feed ${loc}: items only with a ${loc} body`, missing.length === 0, `${missing.length} without body`);
  }
  console.log(`feed items per locale: ${JSON.stringify(counts)}`);
}

/* ---------- pages use the helper ---------- */
{
  const pages = [];
  const walk = (d) => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) walk(p);
      else if (f.name === 'page.tsx') pages.push(p);
    }
  };
  walk(path.join(ROOT, 'app', '[locale]'));
  // events: owned by another track; cv: permanent redirect; [...rest]: 404 only
  const EXEMPT = ['events', 'cv', '[...rest]'];
  const missing = pages.filter((p) => {
    const rel = path.relative(path.join(ROOT, 'app', '[locale]'), p);
    if (EXEMPT.some((e) => rel.startsWith(e + path.sep))) return false;
    return !fs.readFileSync(p, 'utf8').includes('pageMetadata(');
  });
  check('every indexable page uses pageMetadata', missing.length === 0, missing.map((p) => path.relative(ROOT, p)).join(', '));
  const layout = fs.readFileSync(path.join(ROOT, 'app/[locale]/layout.tsx'), 'utf8');
  check('layout declares no locale-root hreflang / og:url', !/languages:\s*\{\s*ar:\s*'\/ar'/.test(layout) && !/url:\s*`\/\$\{locale\}`/.test(layout));
  check('layout has RSS autodiscovery', layout.includes('application/rss+xml'));
  const routing = fs.readFileSync(path.join(ROOT, 'i18n/routing.ts'), 'utf8');
  check('middleware Link alternates disabled', /alternateLinks:\s*false/.test(routing));
  const ld = ['app/[locale]/articles/[slug]/page.tsx', 'app/[locale]/qa/[slug]/page.tsx'].map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8'));
  check('JSON-LD uses jsonLdString, not raw JSON.stringify', ld.every((s) => s.includes('jsonLdString(jsonLd)') && !s.includes('__html: JSON.stringify')));
  check('Q&A no longer claims QAPage/acceptedAnswer', !ld[1].includes("'QAPage'") && !ld[1].includes('acceptedAnswer'));
  check('JSON-LD inLanguage is the body language', ld.every((s) => s.includes('inLanguage: bodyLang')));
}

/* ---------- message parity ---------- */
{
  const flat = (o, pre = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? flat(v, `${pre}${k}.`) : [`${pre}${k}`]));
  const sets = ['ar', 'en', 'es', 'ur'].map((l) => new Set(flat(JSON.parse(fs.readFileSync(path.join(ROOT, `i18n/messages/${l}.json`), 'utf8')))));
  const same = sets.every((s) => s.size === sets[0].size && [...s].every((k) => sets[0].has(k)));
  check('i18n: ar/en/es/ur key sets identical', same);
  for (const k of ['not_found.title', 'search.scope', 'search.showing', 'search.more', 'search.type_qa', 'lectures.window_note', 'lectures.archive_link']) {
    check(`i18n: ${k} present in all locales`, sets.every((s) => s.has(k)));
  }
}

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`);
console.log(`\ncheck-seo: ${results.length - failed.length}/${results.length} passed (SITE_URL ${SITE_URL})`);
process.exit(failed.length ? 1 : 0);
