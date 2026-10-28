#!/usr/bin/env node
// Run after next build. Verify the actual build output, not source settings:
// every published content route must exist in all four locales, remain
// static until redeploy, and reject unknown slugs without runtime fallback.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { importProject, ROOT } from './lib/ts-loader.mjs';

const manifest = JSON.parse(fs.readFileSync(`${ROOT}/.next/prerender-manifest.json`, 'utf8'));
const locales = ['ar', 'en', 'es', 'ur'];
const sections = {
  articles: ['lib/articles.ts', 'getAllArticles'],
  khawatir: ['lib/khawatir.ts', 'getAllKhawatir'],
  qa: ['lib/qa.ts', 'getAllQA'],
  research: ['lib/research.ts', 'getAllResearch'],
};
let total = 0;
for (const [section, [modulePath, getter]] of Object.entries(sections)) {
  const items = (await importProject(modulePath))[getter]();
  assert.ok(items.length, `${section}: no published content found`);
  const dynamic = manifest.dynamicRoutes[`/[locale]/${section}/[slug]`];
  assert.equal(dynamic?.fallback, false, `${section}: runtime fallback must be disabled`);
  for (const { slug } of items) {
    for (const locale of locales) {
      const route = `/${locale}/${section}/${slug}`;
      assert.ok(manifest.routes[route], `${route}: missing prerendered page`);
      assert.equal(manifest.routes[route].initialRevalidateSeconds, false,
        `${route}: must not perform timed ISR`);
      assert.ok(!manifest.notFoundRoutes.includes(route), `${route}: unexpectedly 404`);
      total++;
    }
  }
  console.log(`${section}: ${items.length * locales.length} static pages; runtime fallback disabled`);
}
console.log(`PASS: ${total} published content pages verified across ${locales.length} locales`);
