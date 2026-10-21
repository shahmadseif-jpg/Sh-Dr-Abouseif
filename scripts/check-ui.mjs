#!/usr/bin/env node
/**
 * UI regression checks (Playwright, Chromium) against a running build.
 *
 *   npx next build && npx next start -p 4123 &
 *   node scripts/check-ui.mjs --base http://localhost:4123 [--json out.json]
 *
 * All third-party requests are blocked and FormSubmit is mocked with
 * page.route(), so the script never sends real network traffic or form data.
 *
 * Asserts:
 *  1. no horizontal overflow (scrollWidth <= innerWidth) and no visible header
 *     link outside the viewport, at 320/390/767/768/820/1024/1280/1440 for
 *     /{ar,en,es,ur} home, an article, the khawatir list and contact;
 *  2. the floating "Ask" button does not intersect the reading tools on an
 *     article page (and elementFromPoint on each tool button hits the tool);
 *  3. A+ increases the computed font-size of prose paragraphs, reset restores;
 *  4. small text using gold colours reaches 4.5:1 contrast (computed);
 *  5. mobile menu exposes aria-expanded/aria-controls and closes on Escape;
 *  6. Q&A form: localized validation without any request, consent carried in
 *     the payload, provider "activation" answer is not shown as success and
 *     inputs are preserved, success only on {success:"true"};
 *  7. comments section on /ur is RTL; floating button keeps the locale prefix.
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', '/opt/npm-tools/node_modules/playwright']) {
  try {
    ({ chromium } = require(p));
    break;
  } catch {
    /* try next */
  }
}
if (!chromium) {
  console.error('playwright not found');
  process.exit(2);
}

const args = process.argv.slice(2);
const argVal = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const BASE = argVal('--base', 'http://localhost:4123').replace(/\/$/, '');
const JSON_OUT = argVal('--json', null);
const ARTICLE = argVal('--article', 'wisdom-lost-property');
const LOCALES = ['ar', 'en', 'es', 'ur'];
const WIDTHS = [320, 390, 767, 768, 820, 1024, 1280, 1440];
const PAGES = ['', `/articles/${ARTICLE}`, '/khawatir', '/contact'];

const results = { base: BASE, overflow: [], fab: [], font: [], contrast: [], menu: [], form: [], misc: [] };
const failures = [];
const fail = (area, msg) => failures.push(`[${area}] ${msg}`);

const browser = await chromium.launch(
  fs.existsSync('/opt/pw-browsers') ? {} : {}
);
const context = await browser.newContext({ locale: 'en-US' });
// Block everything that is not the local server.
await context.route('**/*', (route) => {
  const url = route.request().url();
  if (url.startsWith(BASE)) return route.continue();
  if (url.startsWith('https://formsubmit.co/')) return route.fallback();
  return route.abort();
});

async function section(area, fn) {
  try {
    await fn();
  } catch (e) {
    fail(area, 'section aborted: ' + String(e.message || e).split('\n')[0]);
  }
}

async function gotoStable(page, path) {
  const res = await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('load').catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await page.waitForTimeout(150);
  return res;
}

// ---------------------------------------------------------------- 1 overflow
await section('overflow', async () => {
  const page = await context.newPage();
  for (const loc of LOCALES) {
    for (const p of PAGES) {
      for (const w of WIDTHS) {
        await page.setViewportSize({ width: w, height: 900 });
        const res = await gotoStable(page, `/${loc}${p}`);
        if (!res || res.status() >= 400) {
          fail('overflow', `/${loc}${p} returned ${res && res.status()}`);
          continue;
        }
        const m = await page.evaluate(() => {
          if (!document.querySelector('header') || !document.querySelector('main')) return { blank: true };
          const vw = document.documentElement.clientWidth;
          const sw = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
          const off = [];
          document.querySelectorAll('header a, header button').forEach((el) => {
            const cs = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            if (cs.display === 'none' || cs.visibility === 'hidden' || r.width === 0 || r.height === 0) return;
            if (r.left < -1 || r.right > vw + 1) off.push((el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30));
          });
          return { vw, sw, off };
        });
        if (m.blank) {
          // A page without header/main would make every width check vacuous.
          fail('overflow', `/${loc}${p} @${w}: page rendered without header/main`);
          continue;
        }
        const row = { locale: loc, page: p || '/', width: w, scrollWidth: m.sw, viewport: m.vw, offscreen: m.off.length };
        results.overflow.push(row);
        if (m.sw > m.vw + 1) fail('overflow', `/${loc}${p} @${w}: scrollWidth ${m.sw} > ${m.vw}`);
        if (m.off.length) fail('overflow', `/${loc}${p} @${w}: ${m.off.length} header controls offscreen (${m.off.join(' | ')})`);
      }
    }
  }
  await page.close();
});

// ------------------------------------------------------- 2 FAB vs reading tools
const FAB_SEL = '[data-qa-fab], a.fixed[href*="qa"]';
const TOOLS_SEL = '[data-reading-tools], div.fixed.bottom-5';
await section('fab', async () => {
  const page = await context.newPage();
  for (const loc of LOCALES) {
    for (const w of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width: w, height: 800 });
      await gotoStable(page, `/${loc}/articles/${ARTICLE}`);
      const m = await page.evaluate(([fs, ts]) => {
        const fab = document.querySelector(fs);
        const tools = document.querySelector(ts);
        if (!fab || !tools) return { missing: !fab ? 'fab' : 'tools' };
        const a = fab.getBoundingClientRect();
        const b = tools.getBoundingClientRect();
        const intersects = !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
        const hits = [...tools.querySelectorAll('button')].map((btn) => {
          const r = btn.getBoundingClientRect();
          const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          return { label: btn.getAttribute('aria-label'), ok: !!el && tools.contains(el), w: Math.round(r.width), h: Math.round(r.height) };
        });
        return { intersects, hits, fabHref: fab.getAttribute('href') };
      }, [FAB_SEL, TOOLS_SEL]);
      results.fab.push({ locale: loc, width: w, ...m });
      if (m.missing) fail('fab', `/${loc} article @${w}: ${m.missing} not found`);
      else {
        if (m.intersects) fail('fab', `/${loc} article @${w}: floating Ask button intersects reading tools`);
        for (const h of m.hits) {
          if (!h.ok) fail('fab', `/${loc} article @${w}: tool "${h.label}" covered by another element`);
          if (h.w < 44 || h.h < 44) fail('fab', `/${loc} article @${w}: tool "${h.label}" target ${h.w}x${h.h} < 44px`);
        }
        if (!m.fabHref || !m.fabHref.startsWith(`/${loc}/`)) fail('fab', `/${loc}: floating button href ${m.fabHref} lacks locale prefix`);
      }
    }
  }
  await page.close();
});

// ------------------------------------------------------------- 3 font size
await section('font', async () => {
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 800 });
  for (const loc of LOCALES) {
    await gotoStable(page, `/${loc}/articles/${ARTICLE}`);
    await page.evaluate(() => {
      try {
        localStorage.removeItem('reading-font-step');
      } catch {}
    });
    await gotoStable(page, `/${loc}/articles/${ARTICLE}`);
    const size = () =>
      page.evaluate(() => {
        // Body paragraphs carry `text-base sm:text-lg` (the case the audit measured).
        const p = document.querySelector('.article-prose p.text-base') || document.querySelector('.article-prose p');
        return p ? parseFloat(getComputedStyle(p).fontSize) : null;
      });
    const before = await size();
    const inc = page.locator('[data-font-inc], button[aria-label="A+"]').first();
    // Keyboard activation works even when another element covers the button
    // (the baseline defect), so the measurement itself is always obtained.
    await inc.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);
    const after = await size();
    const reset = page.locator('[data-font-reset]').first();
    let restored = null;
    if (await reset.count()) {
      await reset.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(100);
      restored = await size();
    } else {
      await page.locator('[data-font-dec], button[aria-label="A-"]').first().focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(100);
      restored = await size();
    }
    // persistence
    await inc.focus();
    await page.keyboard.press('Enter');
    await gotoStable(page, `/${loc}/articles/${ARTICLE}`);
    const persisted = await size();
    results.font.push({ locale: loc, before, after, restored, persisted });
    if (before == null) fail('font', `/${loc}: no .article-prose p found`);
    else {
      if (!(after > before)) fail('font', `/${loc}: A+ did not enlarge prose paragraph (${before} -> ${after})`);
      if (restored !== before) fail('font', `/${loc}: reset gave ${restored}, expected ${before}`);
      if (!(persisted > before)) fail('font', `/${loc}: choice not persisted after reload (${persisted})`);
    }
    await page.evaluate(() => {
      try {
        localStorage.removeItem('reading-font-step');
      } catch {}
    });
  }
  await page.close();
});

// --------------------------------------------------------------- 4 contrast
await section('contrast', async () => {
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const path of ['/ar', '/en', '/ur', `/ar/articles/${ARTICLE}`, '/en/events', '/en/consultations', '/ar/khawatir']) {
    await gotoStable(page, path);
    const bad = await page.evaluate(() => {
      const parse = (c) => {
        const m = c.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
        return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
      };
      const lum = ({ r, g, b }) => {
        const f = (v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const bgOf = (el) => {
        const layers = [];
        for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
          const c = parse(getComputedStyle(n).backgroundColor);
          if (c && c.a > 0) layers.push(c);
          if (c && c.a >= 1) break;
        }
        let out = { r: 255, g: 255, b: 255 };
        for (const c of layers.reverse()) {
          out = { r: c.r * c.a + out.r * (1 - c.a), g: c.g * c.a + out.g * (1 - c.a), b: c.b * c.a + out.b * (1 - c.a) };
        }
        return out;
      };
      const res = [];
      document.querySelectorAll('[class*="text-gold"]').forEach((el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        if (cs.display === 'none' || cs.visibility === 'hidden' || r.width === 0) return;
        // Decorative content is out of scope for 1.4.3: aria-hidden subtrees and
        // bare separator glyphs (•, ·) between metadata items.
        if (el.closest('[aria-hidden="true"]')) return;
        if (/^[•·|]$/.test(el.textContent.trim())) return;
        const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!hasText) return;
        const fg = parse(cs.color);
        if (!fg) return;
        const bg = bgOf(el);
        const L1 = lum(fg), L2 = lum(bg);
        const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const size = parseFloat(cs.fontSize);
        const weight = parseInt(cs.fontWeight, 10);
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        const need = large ? 3 : 4.5;
        if (ratio < need) res.push({ text: el.textContent.trim().slice(0, 40), ratio: +ratio.toFixed(2), size, weight, cls: el.className.toString().slice(0, 80) });
      });
      return res;
    });
    results.contrast.push({ path, failing: bad });
    for (const b of bad) fail('contrast', `${path}: "${b.text}" ${b.ratio}:1 (${b.size}px/${b.weight})`);
  }
  await page.close();
});

// ------------------------------------------------------------------ 5 menu
await section('menu', async () => {
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 800 });
  for (const loc of LOCALES) {
    await gotoStable(page, `/${loc}`);
    const btn = page.locator('header button[aria-controls], header button.md\\:hidden, header button[aria-expanded]').first();
    const before = await btn.getAttribute('aria-expanded');
    const name = await btn.getAttribute('aria-label');
    await btn.click({ timeout: 5000 });
    const opened = await btn.getAttribute('aria-expanded');
    const controls = await btn.getAttribute('aria-controls');
    const panelVisible = controls ? await page.locator(`#${controls}`).isVisible() : false;
    await page.keyboard.press('Escape');
    await page.waitForTimeout(50);
    const afterEsc = await btn.getAttribute('aria-expanded');
    const focusBack = await page.evaluate(() => document.activeElement?.tagName);
    results.menu.push({ locale: loc, name, before, opened, controls, panelVisible, afterEsc, focusBack });
    if (before !== 'false' || opened !== 'true') fail('menu', `/${loc}: aria-expanded ${before} -> ${opened}`);
    if (!controls || !panelVisible) fail('menu', `/${loc}: aria-controls missing or panel not visible`);
    if (afterEsc !== 'false') fail('menu', `/${loc}: Escape did not close menu`);
    if (loc !== 'en' && (!name || name === 'Toggle menu')) fail('menu', `/${loc}: menu button name not localized (${name})`);
  }
  await page.close();
});

// ------------------------------------------------------------------ 6 form
await section('form', async () => {
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 900 });
  let mode = 'success';
  const posted = [];
  await page.route('https://formsubmit.co/**', async (route) => {
    posted.push(JSON.parse(route.request().postData() || '{}'));
    await new Promise((r) => setTimeout(r, 300));
    const body =
      mode === 'success'
        ? { success: 'true', message: 'The form was submitted successfully.' }
        : { success: 'false', message: "This form needs Activation. We've sent you an email containing an 'Activate Form' link." };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
  for (const loc of ['en', 'ur']) {
    await gotoStable(page, `/${loc}/qa`);
    const form = page.locator('form:has(textarea[name="question"])');
    await form.locator('button[type="submit"]').click({ timeout: 5000 });
    await page.waitForTimeout(100);
    const errCount = await form.locator('[id$="-err"]').count();
    const invalid = await form.locator('[aria-invalid="true"]').count();
    const focused = await page.evaluate(() => document.activeElement?.getAttribute('name'));
    const r1 = { locale: loc, emptySubmit: { errCount, invalid, focused, requests: posted.length } };
    if (posted.length) fail('form', `/${loc}: empty submit sent a request`);
    if (errCount < 4) fail('form', `/${loc}: expected >=4 field errors on empty submit, got ${errCount}`);
    if (focused !== 'name') fail('form', `/${loc}: focus not moved to first invalid field (${focused})`);

    await form.locator('[name="name"]').fill('Test Reader');
    await form.locator('[name="email"]').fill('not-an-email');
    await form.locator('[name="topic"]').selectOption({ index: 1 });
    await form.locator('[name="question"]').fill('Synthetic test question — not real.');
    await form.locator('button[type="submit"]').click({ timeout: 5000 });
    await page.waitForTimeout(100);
    const emailErr = await form.locator('#fatwa-email-err').textContent().catch(() => null);
    const consentErr = await form.locator('#fatwa-consentProcessing-err').count();
    r1.invalidEmail = { emailErr, consentErr, requests: posted.length };
    if (!emailErr) fail('form', `/${loc}: no email format error`);
    if (!consentErr) fail('form', `/${loc}: no consent error`);
    if (posted.length) fail('form', `/${loc}: invalid form sent a request`);

    await form.locator('[name="email"]').fill('reader@example.com');
    await form.locator('[name="consentProcessing"]').check();
    mode = 'activation';
    await form.locator('button[type="submit"]').click({ timeout: 5000 });
    const disabledWhileSending = await form.locator('button[type="submit"]').isDisabled();
    await page.waitForTimeout(600);
    const statusText = (await form.locator('[role="status"]').textContent()) || '';
    const preserved = await form.locator('[name="question"]').inputValue();
    const last = posted[posted.length - 1] || {};
    r1.activation = { disabledWhileSending, statusText: statusText.slice(0, 80), preserved: !!preserved, payloadKeys: Object.keys(last).filter((k) => /consent|موافق|النشر|Consent/i.test(k)) };
    if (!disabledWhileSending) fail('form', `/${loc}: submit button not disabled while sending`);
    if (!preserved) fail('form', `/${loc}: inputs cleared after activation-required answer`);
    if (!Object.values(last).includes('qa-consent-v2-2026-10-21')) fail('form', `/${loc}: consent policy version missing from payload`);
    if (!Object.keys(last).some((k) => /Publish after anonymization/.test(k))) fail('form', `/${loc}: publication choice missing from payload`);

    mode = 'success';
    await form.locator('button[type="submit"]').click({ timeout: 5000 });
    await page.waitForTimeout(700);
    const okText = (await form.locator('[role="status"]').textContent()) || '';
    const cleared = (await form.locator('[name="question"]').inputValue()) === '';
    r1.success = { okText: okText.slice(0, 80), cleared };
    if (!cleared) fail('form', `/${loc}: success did not reset the form`);
    if (okText === statusText) fail('form', `/${loc}: success and activation messages identical`);
    results.form.push(r1);
    posted.length = 0;
  }
  await page.close();
});

// ------------------------------------------------------------------ 7 misc
await section('misc', async () => {
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await gotoStable(page, `/ur/articles/${ARTICLE}`);
  const dir = await page.evaluate(() => {
    const h = [...document.querySelectorAll('section')].find((s) => s.querySelector('textarea'));
    return h ? getComputedStyle(h).direction : null;
  });
  results.misc.push({ urCommentsDirection: dir });
  if (dir !== 'rtl') fail('misc', `/ur comments direction is ${dir}`);
  await page.close();
});

await browser.close();

results.failures = failures;
if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify(results, null, 2));
const n = (a) => a.length;
console.log(
  `overflow rows ${n(results.overflow)}, fab rows ${n(results.fab)}, font rows ${n(results.font)}, contrast pages ${n(results.contrast)}`
);
if (failures.length) {
  console.log(`FAIL: ${failures.length} problem(s)`);
  for (const f of failures.slice(0, 200)) console.log('  ' + f);
  process.exit(1);
}
console.log('PASS: all UI checks');
