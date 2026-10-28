#!/usr/bin/env node
/**
 * i18n invariants for the UI dictionaries (no network, no build needed):
 *   node scripts/check-i18n.mjs
 *
 * 1. ar/en/es/ur message files have identical key paths and array lengths.
 * 2. Every message compiles and formats with use-intl (ICU syntax check),
 *    including plural keys for representative counts.
 * 3. Arabic plural forms used by the UI are grammatical for 0,1,2,3,10,11,99,100.
 * 4. Promise wording: the success texts no longer claim the question
 *    "reached" the Imam / the reader is "subscribed".
 * 5. Reports (does not fail on) the stray copy i18n/messages/i18n/messages/ur.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createTranslator } = require('use-intl/core');

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dir = path.join(root, 'i18n/messages');
const LOCALES = ['ar', 'en', 'es', 'ur'];
const msgs = Object.fromEntries(LOCALES.map((l) => [l, JSON.parse(fs.readFileSync(path.join(dir, `${l}.json`), 'utf8'))]));
const failures = [];

function paths(obj, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v)) out.push(`${p}[${v.length}]`);
    else if (v && typeof v === 'object') out.push(...paths(v, p));
    else out.push(p);
  }
  return out;
}

// 1. key parity
const base = new Set(paths(msgs.ar));
for (const l of LOCALES.slice(1)) {
  const s = new Set(paths(msgs[l]));
  for (const k of base) if (!s.has(k)) failures.push(`${l}: missing ${k}`);
  for (const k of s) if (!base.has(k)) failures.push(`${l}: extra ${k} (not in ar)`);
}

// 2. every string compiles/formats
const SAMPLE = { count: 3, n: '3', email: 'x@example.com', date: '1 Jan 2026', network: 'X', year: 2026, shown: 40, total: 374, page: 1, pages: 20, countText: '3 articles' };
let formatted = 0;
for (const l of LOCALES) {
  const t = createTranslator({ locale: l, messages: msgs[l], onError: (e) => failures.push(`${l}: ${e.message}`) });
  for (const p of paths(msgs[l])) {
    if (p.includes('[')) continue; // arrays are read with t.raw
    t(p, SAMPLE);
    formatted++;
  }
}

// 3. Arabic plurals
const tAr = createTranslator({ locale: 'ar', messages: msgs.ar });
const expect = {
  'ui.readingMinutes': { 1: 'دقيقة واحدة', 2: 'دقيقتان', 3: '3 دقائق', 10: '10 دقائق', 11: '11 دقيقة', 99: '99 دقيقة', 100: '100 دقيقة' },
  'qaList.count': { 0: 'لا أسئلة', 1: 'سؤال واحد', 2: 'سؤالان', 4: '4 أسئلة', 11: '11 سؤالًا', 100: '100 سؤال' },
  'ui.articleCount': { 1: 'مقالة واحدة', 2: 'مقالتان', 7: '7 مقالات', 25: '25 مقالةً', 461: '461 مقالةً', 200: '200 مقالة' },
};
for (const [key, cases] of Object.entries(expect)) {
  for (const [n, want] of Object.entries(cases)) {
    const got = tAr(key, { count: Number(n), n: String(n) });
    if (got !== want) failures.push(`ar ${key}(${n}) = "${got}", expected "${want}"`);
  }
}
const tEn = createTranslator({ locale: 'en', messages: msgs.en });
if (tEn('ui.articleCount', { count: 1, n: '1' }) !== '1 article') failures.push('en articleCount(1) not singular');
const tEs = createTranslator({ locale: 'es', messages: msgs.es });
if (tEs('ui.articleCount', { count: 1, n: '1' }) !== '1 artículo') failures.push('es articleCount(1) not singular');

// 4. promise wording
const overPromise = [
  [/reached the Imam/i, 'en', 'fatwa.success'],
  [/llegó al Imam/i, 'es', 'fatwa.success'],
  [/ووصل إلى الشيخ/, 'ar', 'fatwa.success'],
  [/شیخ تک پہنچ گیا/, 'ur', 'fatwa.success'],
];
for (const [re, l, key] of overPromise) {
  const v = key.split('.').reduce((o, k) => o?.[k], msgs[l]);
  if (re.test(v)) failures.push(`${l} ${key} still over-promises: ${v}`);
}
for (const l of LOCALES) {
  if (/subscribed|suscripción realizada|تمّ اشتراكك|سبسکرپشن مکمل/i.test(JSON.stringify(msgs[l].newsletter))) {
    failures.push(`${l} newsletter still claims a completed subscription`);
  }
}

// 5. stray file
const stray = path.join(dir, 'i18n/messages/ur.json');
const strayNote = fs.existsSync(stray) ? 'present (not loaded by i18n/request.ts; owner to delete)' : 'absent';

console.log(`keys per locale: ${base.size}; messages formatted: ${formatted}; stray ur.json copy: ${strayNote}`);
if (failures.length) {
  console.log(`FAIL: ${failures.length}`);
  failures.slice(0, 100).forEach((f) => console.log('  ' + f));
  process.exit(1);
}
console.log('PASS: i18n parity, ICU syntax, Arabic plurals, promise wording');
