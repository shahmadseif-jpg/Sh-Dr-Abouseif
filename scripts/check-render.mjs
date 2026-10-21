#!/usr/bin/env node
/**
 * check-render — renders EVERY Markdown body (articles, research, Q&A,
 * khawatir; all locales; one physical file per slug+locale in loader
 * precedence order) and reports rendering invariants:
 *
 *   duplicateIds       bodies whose static markup repeats an id attribute
 *   missingTargets     bodies with an internal href="#x" whose target id is absent
 *   droppedLines       source lines whose visible text is absent from the output
 *   listItemsLost      source list-item lines that did not become an <li>
 *   orphanRefs         reference anchors (fnref-…) with no back-link pointing at them
 *   headingsLost       ATX heading lines that did not become an <h1-6>
 *
 * In current mode it also runs synthetic fixtures (mixed/nested lists,
 * adjacent and repeated footnotes, unsafe link protocols, khawatir headings
 * and tables) and the positive/negative controls named by the audit
 * (wisdom-lost-property, the Hikma article: 17 live notes; ibtila-in-quran… targets 2-24).
 *   literalLinks       bodies whose visible text still contains "](http"
 *   unsafeHrefs        hrefs outside the http/https/mailto/#/ "/" allowlist
 *   undefinedNoteRefs  footnote references with no definition in the source
 *
 * Usage:
 *   node scripts/check-render.mjs              # current shared renderer (lib/markdown.tsx)
 *   node scripts/check-render.mjs --baseline   # the four pre-fix renderers, extracted from git 74b25cd
 *   node scripts/check-render.mjs --json out.json
 *
 * Exit code is 1 when the current renderer reports any duplicate id, missing
 * target, dropped line, literal link or unsafe href (baseline mode never fails).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { ROOT, importProject, importSource } from './lib/ts-loader.mjs';

const require = createRequire(path.join(ROOT, 'package.json'));
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const args = process.argv.slice(2);
const BASELINE = args.includes('--baseline');
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const BASE_REV = '74b25cd';
const LOCALES = ['ar', 'en', 'es', 'ur'];

const KINDS = {
  articles: { dirs: ['', 'content/articles'], meta: async () => (await importProject('lib/articles.ts')).articlesMeta },
  khawatir: { dirs: ['khawatir'], meta: async () => (await importProject('lib/khawatir.ts')).khawatirMeta },
  qa: { dirs: ['qa'], meta: async () => (await importProject('lib/qa.ts')).qaMeta },
  research: { dirs: ['research'], meta: async () => (await importProject('lib/research.ts')).researchMeta },
};

/* ---------------- renderers ---------------- */

async function baselineRenderers() {
  const ts = require('typescript');
  const pick = (rel, names) => {
    const src = execFileSync('git', ['show', `${BASE_REV}:${rel}`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 26 });
    const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const parts = [];
    sf.forEachChild((n) => {
      if (ts.isFunctionDeclaration(n) && n.name && names.includes(n.name.text)) parts.push(n.getText(sf));
    });
    return `import type { ReactNode } from 'react';\n${parts.join('\n\n')}\nexport { ${names.join(', ')} };\n`;
  };
  const art = await importSource(pick('app/[locale]/articles/[slug]/page.tsx', ['stripDuplicateHeaderFromMarkdown', 'renderMarkdown', 'processInline']), 'baseline-article.tsx');
  const kh = await importSource(pick('app/[locale]/khawatir/[slug]/page.tsx', ['stripDuplicateHeaderFromMarkdown', 'renderMarkdown', 'processInline']), 'baseline-khatra.tsx');
  const qa = await importSource(pick('app/[locale]/qa/[slug]/page.tsx', ['stripFrontmatter', 'renderMarkdown', 'processInline']), 'baseline-qa.tsx');
  const rs = await importSource(pick('app/[locale]/research/[slug]/page.tsx', ['stripFrontmatter', 'extractToc', 'renderResearchMarkdown', 'processResearchInline']), 'baseline-research.tsx');
  const tocNav = (toc) => toc.length > 2 ? React.createElement('nav', null, toc.map((t) => React.createElement('a', { key: t.id, href: `#${t.id}` }, t.text))) : null;
  return {
    articles: (raw, loc) => { const md = art.stripDuplicateHeaderFromMarkdown(raw); return { md, node: art.renderMarkdown(md, loc) }; },
    khawatir: (raw, loc) => { const md = kh.stripDuplicateHeaderFromMarkdown(raw); return { md, node: kh.renderMarkdown(md, loc) }; },
    qa: (raw, loc) => { const md = qa.stripFrontmatter(raw); return { md, node: qa.renderMarkdown(md, loc) }; },
    research: (raw, loc) => {
      const md = rs.stripFrontmatter(raw);
      return { md, node: React.createElement(React.Fragment, null, tocNav(rs.extractToc(md)), rs.renderResearchMarkdown(md, loc)) };
    },
  };
}

async function currentRenderers() {
  const m = await importProject('lib/markdown.tsx');
  const make = (kind) => (raw, loc) => {
    const md = m.prepareMarkdownBody(raw, kind);
    const doc = m.parseMarkdown(md, { headingIds: kind === 'research' });
    const toc = kind === 'research' ? m.extractToc(doc) : [];
    const nav = toc.length > 2 ? React.createElement('nav', null, toc.map((t) => React.createElement('a', { key: t.id, href: `#${t.id}` }, t.text))) : null;
    return {
      md,
      doc,
      node: React.createElement(React.Fragment, null, nav, m.renderMarkdown(doc, { variant: kind === 'research' ? 'research' : 'article', locale: loc })),
    };
  };
  return { articles: make('articles'), khawatir: make('khawatir'), qa: make('qa'), research: make('research') };
}

/* ---------------- analysis helpers ---------------- */

const decode = (s) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'")
  .replace(/&nbsp;/g, '\u00a0').replace(/&amp;/g, '&');
const visibleText = (html) => decode(html.replace(/<[^>]+>/g, ' '));
// Compare without whitespace and emphasis markers: inline formatting may
// legitimately move spaces/asterisks; we only care that the words survive.
// Brackets/carets are dropped too, so a footnote label shown as "[^x]" or
// "[x]" still counts as present text (literal links are reported separately).
const squash = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/[\s\u00a0*_[\]^]+/g, '');

/** Visible text fragments a source line is expected to contribute. */
function expectedFragments(line) {
  let l = line;
  if (!l.trim()) return [];
  if (/^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(l)) return []; // thematic break
  if (/^\s*\|?[\s:|-]*-{3,}[\s:|-]*\|?\s*$/.test(l) && l.includes('|')) return []; // table separator
  l = l.replace(/^\s*(#{1,6}\s+|>\s?|[-*+]\s+|(\d+|[٠-٩۰-۹]+)[.)]\s+)/, '');
  l = l.replace(/^\s*>\s?/, '');
  l = l.replace(/^\[\^[^\]\s]+\]:\s*/, '');
  // [^x] renders as the visible label [x]
  l = l.replace(/\[\^([^\]\s]+)\]/g, '[$1]');
  // [text](url) renders as "text" when linked; a literal leftover still contains "text"
  l = l.replace(/\[([^\]\n]+)\]\([^)\s]+(?:\s+"[^"]*")?\)/g, '$1');
  const cells = l.trim().startsWith('|') ? l.split('|') : [l];
  return cells.map((c) => squash(c)).filter((c) => c.length > 0);
}

function analyse(html, md) {
  const ids = [...html.matchAll(/\sid="([^"]*)"/g)].map((m) => decode(m[1]));
  const idSet = new Set(ids);
  const seen = new Set();
  const dupIds = new Set();
  for (const id of ids) (seen.has(id) ? dupIds : seen).add(id);
  const hrefs = [...html.matchAll(/\shref="([^"]*)"/g)].map((m) => decode(m[1]));
  const missing = [...new Set(hrefs.filter((h) => h.startsWith('#')).map((h) => decodeURIComponent(h.slice(1))).filter((h) => !idSet.has(h)))];
  const unsafe = hrefs.filter((h) => !/^(https?:|mailto:|#|\/(?!\/))/i.test(h));
  const text = visibleText(html);
  const literalLinks = (text.match(/\]\(https?:/g) || []).length;
  const textSq = squash(text.replace(/\[([^\]\n]+)\]\((?:https?|mailto):[^)\s]*\)/g, '$1'));
  // Multiset comparison: a fragment that occurs N times in the source must
  // occur at least N times in the output (catches repeated TOC/list lines).
  const need = new Map();
  const firstLine = new Map();
  md.split('\n').forEach((line, i) => {
    for (const frag of expectedFragments(line)) {
      need.set(frag, (need.get(frag) || 0) + 1);
      if (!firstLine.has(frag)) firstLine.set(frag, { line: i + 1, text: line.slice(0, 120) });
    }
  });
  const dropped = [];
  for (const [frag, n] of need) {
    let found = 0;
    for (let at = textSq.indexOf(frag); at !== -1 && found < n; at = textSq.indexOf(frag, at + frag.length)) found++;
    for (let k = found; k < n; k++) dropped.push(firstLine.get(frag));
  }
  const defs = new Set([...md.matchAll(/^\[\^([^\]\s]+)\]:/gm)].map((m) => m[1]));
  const refs = new Set([...md.matchAll(/\[\^([^\]\s]+)\](?!:)/g)].map((m) => m[1]));
  const undefinedRefs = [...refs].filter((r) => !defs.has(r));
  // Structural list check: every source list-item line must yield an <li>
  // (footnote <li id="fn-…"> excluded).
  const listLines = md.split('\n').filter((l) => /^\s*([-*+]|\d+[.)]|[٠-٩۰-۹]+[.)])\s+\S/.test(l) && !/^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(l)).length;
  const items = [...html.matchAll(/<li(\s[^>]*)?>/g)].filter((m) => !/\sid="fn-/.test(m[1] || '')).length;
  const listItemsLost = Math.max(0, listLines - items);
  // Every reference anchor must be reachable from a back-link.
  const hrefSet = new Set(hrefs.filter((h) => h.startsWith('#')).map((h) => decodeURIComponent(h.slice(1))));
  const orphanRefs = ids.filter((id) => id.startsWith('fnref-') && !hrefSet.has(id));
  // Every ATX heading line must become an <h1-6> element.
  const headingLines = md.split('\n').filter((l) => /^ {0,3}#{1,6}\s+\S/.test(l)).length;
  const headingEls = (html.match(/<h[1-6][\s>]/g) || []).length;
  const headingsLost = Math.max(0, headingLines - headingEls);
  return { dupIds: [...dupIds], missing, unsafe, literalLinks, dropped, undefinedRefs, listItemsLost, orphanRefs, headingsLost };
}

/* ---------------- main ---------------- */

const renderers = BASELINE ? await baselineRenderers() : await currentRenderers();
const totals = { bodies: 0, renderErrors: 0, duplicateIds: 0, missingTargets: 0, droppedLineBodies: 0, droppedLines: 0, listItemsLostBodies: 0, listItemsLost: 0, orphanRefBodies: 0, headingsLostBodies: 0, literalLinkBodies: 0, unsafeHrefBodies: 0, undefinedNoteRefBodies: 0 };
const byKind = {};
const ledger = [];

for (const [kind, cfg] of Object.entries(KINDS)) {
  const meta = await cfg.meta();
  byKind[kind] = { bodies: 0, duplicateIds: 0, missingTargets: 0, droppedLines: 0, literalLinks: 0 };
  for (const item of meta) {
    for (const loc of LOCALES) {
      let file = null;
      for (const d of cfg.dirs) {
        const p = path.join(ROOT, d, `${item.slug}.${loc}.md`);
        if (fs.existsSync(p)) { file = p; break; }
      }
      if (!file) continue;
      totals.bodies++; byKind[kind].bodies++;
      const raw = fs.readFileSync(file, 'utf8');
      let html, md;
      try {
        const r = renderers[kind](raw, loc);
        md = r.md;
        html = renderToStaticMarkup(r.node);
      } catch (e) {
        totals.renderErrors++;
        ledger.push({ file: path.relative(ROOT, file), error: String(e) });
        continue;
      }
      const a = analyse(html, md);
      if (a.dupIds.length) { totals.duplicateIds++; byKind[kind].duplicateIds++; }
      if (a.missing.length) { totals.missingTargets++; byKind[kind].missingTargets++; }
      if (a.dropped.length) { totals.droppedLineBodies++; totals.droppedLines += a.dropped.length; byKind[kind].droppedLines += a.dropped.length; }
      if (a.listItemsLost) { totals.listItemsLostBodies++; totals.listItemsLost += a.listItemsLost; }
      if (a.orphanRefs.length) totals.orphanRefBodies++;
      if (a.headingsLost) totals.headingsLostBodies++;
      if (a.literalLinks) { totals.literalLinkBodies++; byKind[kind].literalLinks++; }
      if (a.unsafe.length) totals.unsafeHrefBodies++;
      if (a.undefinedRefs.length) totals.undefinedNoteRefBodies++;
      if (a.dupIds.length || a.missing.length || a.dropped.length || a.listItemsLost || a.orphanRefs.length || a.headingsLost || a.literalLinks || a.unsafe.length || a.undefinedRefs.length) {
        ledger.push({ file: path.relative(ROOT, file), ...a, dupIds: a.dupIds.slice(0, 5), missing: a.missing.slice(0, 5), dropped: a.dropped.slice(0, 5) });
      }
    }
  }
}

console.log(`check-render (${BASELINE ? `baseline renderers @ ${BASE_REV}` : 'shared renderer lib/markdown.tsx'})`);
console.log(JSON.stringify({ totals, byKind }, null, 2));
const sample = ledger.filter((l) => l.dropped?.length || l.error).slice(0, 8);
if (sample.length) console.log('sample of bodies with dropped lines / errors:\n' + JSON.stringify(sample, null, 1).slice(0, 4000));
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ mode: BASELINE ? 'baseline' : 'current', totals, byKind, ledger }, null, 1));


/* ---------------- fixtures (current renderer only) ---------------- */
let fixtureFailures = 0;
if (!BASELINE) {
  const m = await importProject('lib/markdown.tsx');
  const render = (md, kind = 'khawatir', loc = 'en') =>
    renderToStaticMarkup(React.createElement(React.Fragment, null,
      m.renderMarkdown(m.parseMarkdown(md, { headingIds: kind === 'research' }), { variant: kind === 'research' ? 'research' : 'article', locale: loc })));
  const checks = [];
  const expect = (name, cond) => { checks.push({ name, ok: !!cond }); if (!cond) fixtureFailures++; };

  for (const kind of ['articles', 'khawatir', 'qa', 'research']) {
    const html = render('- KEEP_ALPHA\n  LOST_CONTINUATION\n1. LOST_MIXED_NUMBER\n- KEEP_BETA\n\nRepeat[^1] and again[^1]. Missing[^2].\n\n[^1]: Footnote one\n\n[link](https://example.com)\n\n![image](https://example.com/a.png)\n\n## Heading two\n\n[bad](javascript:alert(1)) [d](data:text/html,x) [v](vbscript:x)\n\n| a | b |\n|---|---|\n| c | d |', kind);
    const a = analyse(html, '');
    expect(`${kind}: audit fixture keeps continuation + mixed list lines`, ['KEEP_ALPHA', 'LOST_CONTINUATION', 'LOST_MIXED_NUMBER', 'KEEP_BETA'].every((t) => html.includes(t)));
    expect(`${kind}: audit fixture ids unique, targets present`, !a.dupIds.length && !a.missing.length);
    expect(`${kind}: repeated reference gets two back-links`, html.includes('href="#fnref-1"') && html.includes('href="#fnref-1-2"'));
    expect(`${kind}: undefined reference is not a dangling link`, !html.includes('href="#fn-2"'));
    expect(`${kind}: http link is an anchor`, /<a[^>]+href="https:\/\/example.com"/.test(html));
    expect(`${kind}: javascript/data/vbscript stay inert text`, !/href="(javascript|data|vbscript):/i.test(html) && html.includes('[bad](javascript:alert(1))'));
    expect(`${kind}: ## heading rendered`, /<h2[^>]*>Heading two<\/h2>/.test(html));
    expect(`${kind}: table rendered`, html.includes('<table') && html.includes('>d</td>'));
  }

  {
    const html = render('Text[^1] and[^2] and[^3].\n\n---\n[^1]: one\n[^2]: two\n[^3]: three');
    expect('adjacent single-newline definitions are separate', ['fn-1', 'fn-2', 'fn-3'].every((id) => html.includes(`id="${id}"`)) && !analyse(html, '').missing.length);
  }
  {
    const html = render('- a\n - a1\n   - a1x\n - a2\n- b\n\n١. أول\n٢. ثان\n\n3) three\n4) four');
    expect('nested list depth kept', (html.match(/<ul/g) || []).length === 3 && html.includes('a1x'));
    expect('arabic-digit ordered list', html.includes('arabic-indic') && html.includes('أول'));
    expect('"3)" list keeps start number', html.includes('start="3"'));
  }
  {
    const html = render('Intro line:\n- one\n- two\nafter text continues item two');
    expect('list interrupting a paragraph keeps both', html.includes('Intro line:') && (html.match(/<li/g) || []).length === 2 && html.includes('after text continues'));
  }
  {
    const html = render('## Heading line\nParagraph directly under heading.');
    expect('heading line followed by text splits into heading + paragraph', /<h2[^>]*>Heading line<\/h2>/.test(html) && /<p[^>]*>Paragraph directly/.test(html));
  }
  {
    const html = render('A[^أ] B[^ب]\n\n[^أ]: alif\n[^ب]: ba', 'articles', 'ar');
    expect('non-numeric (Arabic letter) footnote ids resolve', !analyse(html, '').missing.length && html.includes('id="fn-أ"') && html.includes('الهوامش'));
  }
  {
    const html = render('# H1\n\n## H2\n\n### H3\n\n#### H4', 'research');
    const toc = m.extractToc(m.parseMarkdown('# H1\n\n## H2\n\n### H3\n\n#### H4', { headingIds: true }));
    expect('research heading ids match TOC', toc.length === 3 && toc.every((t) => html.includes(`id="${t.id}"`)));
  }
  {
    const html = render('<script>alert(1)</script> **b** <img src=x onerror=alert(1)>');
    expect('raw HTML is escaped text', !html.includes('<script>') && !html.includes('<img') && html.includes('&lt;script&gt;'));
  }

  // Controls named by the directive.
  const fileHtml = (rel, loc) => {
    const raw = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    const md = m.prepareMarkdownBody(raw, 'articles');
    return { md, html: render(md, 'articles', loc) };
  };
  {
    const { md, html } = fileHtml('wisdom-lost-property.ar.md', 'ar');
    const defs = (md.match(/^\[\^[^\]\s]+\]:/gm) || []).length;
    const live = (html.match(/<li id="fn-/g) || []).length;
    const a = analyse(html, md);
    expect(`control wisdom-lost-property «الحكمة ضالة المؤمن» (ar): ${live} live notes (source defines ${defs}), no missing targets`, live === defs && defs >= 17 && !a.missing.length && !a.dupIds.length);
  }
  {
    const { md, html } = fileHtml('ibtila-in-quran-test-by-hardship-and-favour.ar.md', 'ar');
    const a = analyse(html, md);
    const t224 = Array.from({ length: 23 }, (_, k) => `fn-${k + 2}`).every((id) => html.includes(`id="${id}"`));
    expect('control ibtila (ar): targets fn-2..fn-24 exist, ids unique', t224 && !a.missing.length && !a.dupIds.length);
  }

  console.log(`fixtures: ${checks.filter((c) => c.ok).length}/${checks.length} passed`);
  for (const c of checks.filter((x) => !x.ok)) console.log(`  FAIL ${c.name}`);
}

const failing = fixtureFailures + totals.renderErrors + totals.duplicateIds + totals.missingTargets + totals.droppedLines + totals.listItemsLost + totals.orphanRefBodies + totals.headingsLostBodies + totals.literalLinkBodies + totals.unsafeHrefBodies;
if (!BASELINE && failing > 0) process.exit(1);
