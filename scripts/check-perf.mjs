#!/usr/bin/env node
/**
 * Performance invariants (PERF-02 / PERF-03 and the client-bundle split).
 *
 *   node scripts/check-perf.mjs                       # static + build checks
 *   node scripts/check-perf.mjs --base http://localhost:4130   # + browser checks
 *
 * Static: no 'use client' module imports values from the content metadata
 *   modules (lib/articles, lib/khawatir, lib/lectures-meta) — type-only
 *   imports are fine. lib/qa must not import lib/articles.
 * Build (needs `next build`): the JS chunks referenced by the prerendered
 *   /ar, /ar/articles, /ar/khawatir, /ar/qa and /ar/research pages contain no
 *   article/lecture metadata (marker: a known article slug) and no khawatir
 *   metadata (marker: a khawatir slug), and the hero renditions exist.
 * Browser (with --base): khawatir list renders 24 cards with a live count;
 *   "show more" adds 24 and moves focus to the first new card; a filter
 *   resets to 24; "show all" reveals every card of the filter; the <noscript>
 *   index lists every published reflection; the hero <picture> picks a WebP
 *   rendition narrower than the original on a phone viewport.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const BASE = (() => {
  const i = args.indexOf('--base');
  return i >= 0 ? args[i + 1].replace(/\/$/, '') : null;
})();
const failures = [];
const fail = (m) => failures.push(m);
const ok = (m) => console.log('ok  ', m);

// ------------------------------------------------------------------ static
const HEAVY = ['@/lib/articles', '@/lib/khawatir', '@/lib/lectures-meta'];
const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : /\.tsx?$/.test(e.name) ? [path.join(d, e.name)] : []
  );
let clientFiles = 0;
for (const f of [...walk(path.join(root, 'components')), ...walk(path.join(root, 'app'))]) {
  const src = fs.readFileSync(f, 'utf8');
  if (!/^\s*['"]use client['"]/.test(src)) continue;
  clientFiles++;
  for (const m of src.matchAll(/^import\s+(type\s+)?([^;]*?)\s+from\s+'([^']+)'/gm)) {
    const [, typeOnly, what, from] = m;
    if (!HEAVY.includes(from)) continue;
    const allTypes = typeOnly || /^\{\s*(type\s+\w+\s*,?\s*)+\}$/.test(what.trim());
    if (!allTypes) fail(`${path.relative(root, f)} (client) imports values from ${from}: ${what}`);
  }
}
ok(`scanned ${clientFiles} client modules for metadata imports`);
if (/from '\.\/articles'/.test(fs.readFileSync(path.join(root, 'lib/qa.ts'), 'utf8'))) fail('lib/qa.ts imports ./articles');

for (const w of [480, 720, 960, 1127]) {
  const p = path.join(root, `public/hero/dr-ahmed-${w}.webp`);
  if (!fs.existsSync(p)) fail(`missing hero rendition ${p}`);
}

// ------------------------------------------------------------------- build
const appDir = path.join(root, '.next/server/app/ar');
if (!fs.existsSync(appDir)) {
  console.log('skip build checks (no .next build)');
} else {
  const ARTICLE_MARKER = 'calls-to-faith-maidah-wasila';
  const KHAWATIR_MARKER = 'go-forth-light-or-heavy';
  const pages = { '/ar': '../ar.html', '/ar/articles': 'articles.html', '/ar/khawatir': 'khawatir.html', '/ar/qa': 'qa.html', '/ar/research': 'research.html' };
  for (const [route, file] of Object.entries(pages)) {
    const htmlPath = path.join(appDir, file);
    let html;
    if (fs.existsSync(htmlPath)) html = fs.readFileSync(htmlPath, 'utf8');
    else if (BASE) html = await (await fetch(BASE + route)).text(); // force-dynamic page (home)
    else {
      ok(`${route}: not prerendered (dynamic); pass --base to check its chunks`);
      continue;
    }
    const chunks = [...new Set([...html.matchAll(/\/_next\/(static\/chunks\/[^"']+?\.js)/g)].map((m) => m[1]))];
    let bytes = 0;
    for (const c of chunks) {
      const p = path.join(root, '.next', decodeURIComponent(c));
      if (!fs.existsSync(p)) continue;
      const js = fs.readFileSync(p, 'utf8');
      bytes += js.length;
      if (js.includes(ARTICLE_MARKER)) fail(`${route}: chunk ${c} contains article metadata`);
      if (js.includes(KHAWATIR_MARKER) && route !== '/ar/khawatir') fail(`${route}: chunk ${c} contains khawatir metadata`);
      if (js.includes('excerpt:{ar:')) fail(`${route}: chunk ${c} contains multilingual excerpt metadata`);
    }
    ok(`${route}: ${chunks.length} chunks, ${(bytes / 1024).toFixed(0)} KiB raw JS, no metadata markers`);
  }
}

// ----------------------------------------------------------------- browser
if (BASE) {
  const require = createRequire(import.meta.url);
  let chromium;
  for (const p of ['playwright', '/opt/npm-tools/node_modules/playwright']) {
    try {
      ({ chromium } = require(p));
      break;
    } catch {
      /* next */
    }
  }
  if (!chromium) fail('playwright not found');
  else {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await ctx.route('**/*', (r) => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));
    const page = await ctx.newPage();
    const cards = () => page.locator('div.grid > a[href*="/khawatir/"]').count();
    const status = () => page.locator('[data-khawatir-pager] [aria-live]').textContent();

    for (const loc of ['ar', 'en', 'es', 'ur']) {
      const res = await page.goto(`${BASE}/${loc}/khawatir`, { waitUntil: 'networkidle' });
      if (res.status() !== 200) fail(`/${loc}/khawatir status ${res.status()}`);
      const raw = await (await fetch(`${BASE}/${loc}/khawatir`)).text();
      const nos = raw.match(/<noscript>([\s\S]*?)<\/noscript>/);
      const nosLinks = nos ? (nos[1].match(/href="\/[a-z]{2}\/khawatir\//g) || []).length : 0;
      const n0 = await cards();
      const s0 = await status();
      const total = Number((s0.match(/(\d+)\D*$/) || [])[1]) || Number((s0.match(/(\d+)/g) || [])[0]);
      if (n0 !== 24) fail(`/${loc}/khawatir: ${n0} cards initially, expected 24`);
      if (!nos || nosLinks < 24) fail(`/${loc}/khawatir: noscript index has ${nosLinks} links`);
      if (loc === 'ar') {
        await page.getByRole('button', { name: /عرض المزيد/ }).click();
        await page.waitForTimeout(150);
        const n1 = await cards();
        const focusedHref = await page.evaluate(() => document.activeElement?.getAttribute('href'));
        const href25 = await page.locator('div.grid > a[href*="/khawatir/"]').nth(24).getAttribute('href');
        if (n1 !== 48) fail(`ar show more: ${n1} cards, expected 48`);
        if (focusedHref !== href25) fail(`ar show more: focus on ${focusedHref}, expected first new card ${href25}`);
        const s1 = await status();
        await page.getByRole('button', { name: /^عرض الكل/ }).click();
        await page.waitForTimeout(150);
        const n2 = await cards();
        if (n2 !== nosLinks) fail(`ar show all: ${n2} cards, noscript index ${nosLinks}`);
        if (await page.locator('[data-khawatir-pager] button').count()) fail('ar show all: pager buttons still shown');
        // A filter starts again from the first page.
        const filterBtn = page.locator('button[aria-pressed]').nth(1);
        await filterBtn.click();
        await page.waitForTimeout(150);
        const n3 = await cards();
        const s3 = await status();
        if (n3 > 24) fail(`ar filter: ${n3} cards after switching filter, expected <=24`);
        console.log(`ok   ar: 24 -> ${n1} (focus ${focusedHref === href25 ? 'moved' : 'NOT moved'}) -> all ${n2}; filter -> ${n3}; "${s0}" / "${s1}" / "${s3}"`);
      } else {
        console.log(`ok   ${loc}: ${n0} cards, "${s0}", noscript links ${nosLinks}`);
      }
      if (!total) fail(`/${loc}/khawatir: count text has no total: "${s0}"`);
    }

    await page.goto(`${BASE}/ar`, { waitUntil: 'load' });
    const hero = await page.evaluate(() => {
      const img = document.querySelector('picture img');
      return img && { currentSrc: img.currentSrc, w: img.naturalWidth, box: img.getBoundingClientRect().width };
    });
    if (!hero || !/\/hero\/dr-ahmed-\d+\.webp$/.test(hero.currentSrc)) fail(`hero did not pick a WebP rendition: ${JSON.stringify(hero)}`);
    else if (hero.w >= 1127) fail(`hero picked the full-size rendition on a 390px phone: ${hero.currentSrc}`);
    else ok(`hero @390px DPR2: ${hero.currentSrc.split('/').pop()} (${hero.w}px for a ${Math.round(hero.box)}px box)`);
    await browser.close();
  }
}

for (const f of failures) console.log('FAIL', f);
console.log(failures.length ? `check-perf: ${failures.length} failure(s)` : 'check-perf: PASS');
process.exit(failures.length ? 1 : 0);
