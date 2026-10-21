#!/usr/bin/env node
/**
 * Security-header and CSP compatibility check against a running build.
 *
 *   npx next build && npx next start -p 4130 &
 *   node scripts/check-headers.mjs --base http://localhost:4130 [--json out.json]
 *
 * 1. Header presence: every sampled response (HTML pages in all locales, the
 *    locale redirect, the 404, sitemap/robots/feed, a static asset and an
 *    optimized image) carries the headers from security-headers.js, does not
 *    set an HSTS header of its own (Vercel adds it), and the enforced CSP
 *    contains only frame-ancestors.
 * 2. Policy sanity: the Report-Only policy is parsed and the origins the site
 *    really uses are allowed by the right directive.
 * 3. Browser run (Playwright/Chromium): pages are loaded with every
 *    third-party origin served by page.route() stubs (no real network): a
 *    Google Fonts stylesheet that points at fonts.gstatic.com, a 1x1 image for
 *    YouTube thumbnails, blank documents for the YouTube/Facebook iframes, an
 *    empty Plausible script, and FormSubmit answering success. The page
 *    records every `securitypolicyviolation` event (Report-Only violations
 *    fire the same event) — the check fails on any violation, so the
 *    Report-Only policy would be safe to enforce for the pages covered.
 *    The Q&A form and newsletter are submitted (mocked) to exercise
 *    connect-src.
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const { securityHeaders, reportOnlyPolicy } = require('../security-headers.js');
let chromium;
for (const p of ['playwright', '/opt/npm-tools/node_modules/playwright']) {
  try {
    ({ chromium } = require(p));
    break;
  } catch {
    /* next */
  }
}

const args = process.argv.slice(2);
const argVal = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const BASE = argVal('--base', 'http://localhost:4130').replace(/\/$/, '');
const JSON_OUT = argVal('--json', null);

const failures = [];
const fail = (area, msg) => failures.push(`[${area}] ${msg}`);
const results = { base: BASE, headers: [], policy: {}, browser: [] };

// ------------------------------------------------------------ 1 header presence
const HEADER_URLS = [
  '/',
  '/ar',
  '/en',
  '/es',
  '/ur',
  '/ar/khawatir',
  '/ar/khawatir/go-forth-light-or-heavy',
  '/en/articles/wisdom-lost-property',
  '/ar/qa',
  '/ar/no-such-page-xyz',
  '/sitemap.xml',
  '/robots.txt',
  '/ar/feed',
  '/dr-ahmed.jpg',
  '/_next/image?url=%2Farticles%2Freformers-never-cease%2Fcover.jpg&w=640&q=75',
];
for (const u of HEADER_URLS) {
  const res = await fetch(BASE + u, { redirect: 'manual' });
  const row = { url: u, status: res.status, missing: [] };
  for (const { key, value } of securityHeaders) {
    const got = res.headers.get(key);
    // The image optimizer sends its own, stricter CSP
    // ("script-src 'none'; frame-src 'none'; sandbox;") for image bodies.
    if (key === 'Content-Security-Policy' && u.startsWith('/_next/image') && /sandbox/.test(got || '')) continue;
    if (got !== value) row.missing.push(key);
  }
  if (res.headers.get('strict-transport-security')) row.hstsFromApp = true;
  results.headers.push(row);
  if (row.missing.length) fail('headers', `${u} (${res.status}) missing/different: ${row.missing.join(', ')}`);
  if (row.hstsFromApp) fail('headers', `${u} sets HSTS itself; leave HSTS to Vercel`);
}
const enforced = securityHeaders.find((h) => h.key === 'Content-Security-Policy').value;
if (enforced.trim() !== "frame-ancestors 'self'") fail('policy', `enforced CSP must contain only frame-ancestors, got: ${enforced}`);

// ------------------------------------------------------------- 2 policy sanity
const directives = Object.fromEntries(
  reportOnlyPolicy.split(';').map((d) => d.trim().split(/\s+/)).filter((a) => a[0]).map(([k, ...v]) => [k, v])
);
results.policy = directives;
const NEED = {
  'script-src': ["'self'", 'https://plausible.io'],
  'style-src': ["'self'", 'https://fonts.googleapis.com'],
  'font-src': ['https://fonts.gstatic.com'],
  'img-src': ["'self'", 'data:', 'https://i.ytimg.com', 'https://yt3.ggpht.com'],
  'connect-src': ["'self'", 'https://formsubmit.co', 'https://plausible.io'],
  'frame-src': ['https://www.youtube.com', 'https://www.youtube-nocookie.com', 'https://www.facebook.com'],
  'form-action': ["'self'", 'https://formsubmit.co'],
  'frame-ancestors': ["'self'"],
  'object-src': ["'none'"],
};
for (const [d, vals] of Object.entries(NEED)) {
  for (const v of vals) if (!(directives[d] || []).includes(v)) fail('policy', `${d} lacks ${v}`);
}

// ---------------------------------------------------------- 3 browser violations
if (!chromium) {
  fail('browser', 'playwright not found; browser CSP check skipped');
} else {
  const browser = await chromium.launch();
  const context = await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 900 } });
  const PNG_1x1 = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64'
  );
  const thirdParty = [];
  await context.route('**/*', async (route) => {
    const url = route.request().url();
    if (url.startsWith(BASE)) return route.continue();
    thirdParty.push(url.split('?')[0]);
    if (url.startsWith('https://fonts.googleapis.com/')) {
      return route.fulfill({
        status: 200,
        contentType: 'text/css',
        body: "@font-face{font-family:'Cairo';src:url(https://fonts.gstatic.com/s/cairo/stub.woff2) format('woff2');}\n" +
          "@font-face{font-family:'Inter';src:url(https://fonts.gstatic.com/s/inter/stub.woff2) format('woff2');}\n" +
          "@font-face{font-family:'Noto Nastaliq Urdu';src:url(https://fonts.gstatic.com/s/nastaliq/stub.woff2) format('woff2');}",
      });
    }
    if (url.startsWith('https://fonts.gstatic.com/')) return route.fulfill({ status: 200, contentType: 'font/woff2', body: Buffer.alloc(0) });
    if (/^https:\/\/(i\.ytimg\.com|yt3\.ggpht\.com)\//.test(url)) return route.fulfill({ status: 200, contentType: 'image/png', body: PNG_1x1 });
    if (/^https:\/\/(www\.youtube\.com|www\.youtube-nocookie\.com|www\.facebook\.com)\//.test(url)) {
      return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub</title>' });
    }
    if (url.startsWith('https://plausible.io/')) return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* stub */' });
    if (url.startsWith('https://formsubmit.co/')) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: 'true', message: 'ok' }) });
    }
    return route.abort();
  });
  await context.addInitScript(() => {
    window.__cspViolations = [];
    document.addEventListener('securitypolicyviolation', (e) => {
      window.__cspViolations.push({
        directive: e.effectiveDirective || e.violatedDirective,
        blocked: e.blockedURI,
        disposition: e.disposition,
        sample: (e.sample || '').slice(0, 60),
        source: e.sourceFile ? `${e.sourceFile}:${e.lineNumber}` : '',
      });
    });
  });

  const PAGES = [
    '/ar',
    '/en',
    '/ur',
    '/ar/khawatir',
    '/ar/khawatir/go-forth-light-or-heavy',
    '/ar/articles/wisdom-lost-property',
    '/en/articles/reformers-never-cease',
    '/ar/research',
    '/ar/qa',
    '/en/qa',
    '/ar/consultations',
    '/ar/gallery',
    '/ar/lectures',
    '/ar/about',
    '/ar/search?q=%D8%A7%D9%84%D8%AA%D9%82%D9%88%D9%89',
    '/ar/no-such-page-xyz',
  ];
  const page = await context.newPage();
  const consoleCsp = [];
  page.on('console', (m) => {
    if (/Content Security Policy|Content-Security-Policy/i.test(m.text())) consoleCsp.push(m.text().slice(0, 200));
  });
  // Negative control: an image from an origin outside img-src must be reported,
  // otherwise "0 violations" below would prove nothing.
  await page.goto(BASE + '/en/about', { waitUntil: 'load' });
  await page.evaluate(() => {
    const img = document.createElement('img');
    img.src = 'https://not-allowed.invalid/x.png';
    document.body.appendChild(img);
  });
  await page.waitForTimeout(300);
  const control = await page.evaluate(() => window.__cspViolations);
  results.negativeControl = control;
  if (!control.some((x) => x.directive === 'img-src' && x.disposition === 'report')) {
    fail('csp', 'negative control: disallowed image did not produce a report-only violation');
  }
  for (const p of PAGES) {
    consoleCsp.length = 0;
    const res = await page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 }).catch((e) => ({ status: () => 'ERR ' + e.message }));
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    // Scroll so lazy images/iframes (Facebook plugin, thumbnails) are requested.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
    });
    await page.waitForTimeout(500);
    const extra = {};
    if (p === '/ar') {
      // Video thumbnails come from the YouTube RSS feed fetched on the server;
      // without network in the test environment the list is empty, so the
      // thumbnail origins are exercised with the same markup LatestVideos uses.
      await page.evaluate(() => {
        for (const src of ['https://i.ytimg.com/vi/IcmdcI2SQFk/hqdefault.jpg', 'https://yt3.ggpht.com/stub=s88']) {
          const img = document.createElement('img');
          img.src = src;
          img.alt = '';
          document.body.appendChild(img);
        }
      });
      await page.waitForTimeout(400);
    }
    if (p.endsWith('/qa')) {
      const form = page.locator('form:has(textarea[name="question"])');
      await form.locator('[name="name"]').fill('Test Reader');
      await form.locator('[name="email"]').fill('reader@example.com');
      await form.locator('[name="topic"]').selectOption({ index: 1 });
      await form.locator('[name="question"]').fill('Synthetic CSP test — not real.');
      await form.locator('[name="consentProcessing"]').check();
      await form.locator('button[type="submit"]').click();
      await page.waitForTimeout(800);
      extra.formStatus = ((await form.locator('[role="status"]').textContent()) || '').trim().slice(0, 60);
    }
    if (p === '/ar' || p === '/en') {
      const nl = page.locator('form:has(input[type="email"])').last();
      if (await nl.count()) {
        await nl.locator('input[type="email"]').fill('reader@example.com');
        await nl.locator('button[type="submit"]').click().catch(() => {});
        await page.waitForTimeout(800);
      }
    }
    const v = await page.evaluate(() => window.__cspViolations);
    const fontsLoaded = await page.evaluate(() => [...document.styleSheets].some((s) => (s.href || '').includes('fonts.googleapis.com')));
    const row = { page: p, status: res.status(), violations: v, consoleCsp: [...consoleCsp], fontsStylesheetApplied: fontsLoaded, ...extra };
    results.browser.push(row);
    if (v.length) fail('csp', `${p}: ${v.length} violation(s): ${v.map((x) => `${x.directive} ${x.blocked}`).join(' | ')}`);
    if (!fontsLoaded) fail('csp', `${p}: Google Fonts stylesheet not applied`);
  }
  results.thirdPartyRequested = [...new Set(thirdParty)].map((u) => new URL(u).origin).filter((v, i, a) => a.indexOf(v) === i);
  for (const o of ['https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://i.ytimg.com', 'https://www.youtube.com', 'https://www.facebook.com', 'https://plausible.io', 'https://formsubmit.co']) {
    if (!results.thirdPartyRequested.includes(o)) fail('coverage', `no request to ${o} was exercised`);
  }
  await browser.close();
}

if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify({ results, failures }, null, 2));
for (const r of results.browser) {
  console.log(`${String(r.status).padEnd(4)} ${r.page.padEnd(44)} violations=${r.violations.length}${r.formStatus ? ' form="' + r.formStatus + '"' : ''}`);
}
console.log('negative control violations:', (results.negativeControl || []).map((x) => `${x.directive}/${x.disposition}`).join(' '));
console.log('third-party origins exercised:', (results.thirdPartyRequested || []).join(' '));
console.log(`header rows: ${results.headers.length}, failures: ${failures.length}`);
for (const f of failures) console.log('FAIL', f);
process.exit(failures.length ? 1 : 0);
