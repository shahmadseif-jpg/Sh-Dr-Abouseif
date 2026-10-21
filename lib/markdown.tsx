/**
 * Shared Markdown renderer for article, research, Q&A and khawatir bodies.
 *
 * Replaces four ad-hoc per-page renderers. It is deliberately a small,
 * line-oriented parser for the dialect actually used in the corpus — not a
 * general CommonMark engine — and renders straight to React elements (no
 * dangerouslySetInnerHTML; every piece of source text is a React text child).
 *
 * Supported dialect (checked over every body by scripts/check-render.mjs):
 *   blocks  : #..###### headings, paragraphs, > blockquotes, thematic breaks (---, ***, ___),
 *             pipe tables, "-"/"*"/"+" and "1." / "1)" / "١." lists with
 *             nesting (any deeper indentation) and continuation lines,
 *             footnote definitions "[^id]: text" (one per line; adjacent
 *             definitions are separate even without a blank line between),
 *             a whole-paragraph "*…*" signature line.
 *   inline  : **bold**, *italic*, [^id] footnote references, [text](url)
 *             links (http/https/mailto, site-relative "/…" and "#…" only),
 *             &nbsp; / &amp; entities.
 *   not supported (rendered as literal text): images, raw HTML, code.
 *
 * Footnotes: each reference occurrence gets a unique id (fnref-ID, then
 * fnref-ID-2, fnref-ID-3 …) and every definition (fn-ID) carries one
 * back-link per occurrence, so repeated references never duplicate ids.
 */
import { createElement, Fragment, type CSSProperties, type ReactNode } from 'react';

export type MarkdownKind = 'articles' | 'khawatir' | 'qa' | 'research';
export type MarkdownVariant = 'article' | 'research';

/* ============================================================
   Body preparation (front-matter / duplicated title removal)
   ============================================================ */

function stripFrontmatterLines(lines: string[]): string[] | null {
  if (lines[0]?.trim() !== '---') return null;
  let i = 1;
  while (i < lines.length && lines[i].trim() !== '---') i++;
  if (i < lines.length) i++; // closing ---
  while (i < lines.length && lines[i].trim() === '') i++;
  return lines.slice(i);
}

/**
 * Remove YAML front matter. For articles and khawatir without front matter
 * (legacy files), also drop the leading #/##/### title lines that duplicate
 * the metadata title, up to the first rule or first content line — the same
 * behaviour the per-page renderers had.
 */
export function prepareMarkdownBody(raw: string, kind: MarkdownKind): string {
  const lines = raw.replace(/\r\n?/g, '\n').split('\n');
  const fm = stripFrontmatterLines(lines);
  if (fm) return fm.join('\n').trim();
  if (kind === 'qa' || kind === 'research') return raw.trim();

  const out: string[] = [];
  let done = false;
  for (const line of lines) {
    if (!done) {
      if (/^#{1,3}\s/.test(line) || line.trim() === '') continue;
      done = true;
      if (line.trim() === '---') continue;
    }
    out.push(line);
  }
  return out.join('\n').trim();
}

/* ============================================================
   Block parser
   ============================================================ */

export interface ListItem {
  text: string;
  children: ListBlock[];
}

export interface ListBlock {
  type: 'list';
  ordered: boolean;
  /** marker family: "-" for bullets, else delimiter + digit script, e.g. ".l", ")a" */
  family: string;
  start: number;
  arabicDigits: boolean;
  indent: number;
  items: ListItem[];
}

export type Block =
  | { type: 'heading'; level: number; text: string; id?: string }
  | { type: 'paragraph'; text: string; signature: boolean }
  | { type: 'hr' }
  | { type: 'blockquote'; lines: string[] }
  | { type: 'table'; header: string[]; rows: string[][] }
  | ListBlock;

export interface FootnoteDef {
  id: string;
  text: string;
}

export interface MarkdownDoc {
  blocks: Block[];
  footnotes: FootnoteDef[];
}

export interface TocEntry {
  level: number;
  text: string;
  id: string;
}

const RE_HEADING = /^ {0,3}(#{1,6})\s+(.*?)\s*#*\s*$/;
const RE_HR = /^ {0,3}([-*_])(\s*\1){2,}\s*$/;
const RE_FNDEF = /^\[\^([^\]\s]+)\]:\s?(.*)$/;
const RE_QUOTE = /^ {0,3}>/;
const RE_LIST = /^(\s*)([-*+]|\d{1,9}[.)]|[٠-٩۰-۹]{1,9}[.)])(?:\s+(.*))?$/;
const RE_TABLE_ROW = /^\s*\|/;
const RE_TABLE_SEP = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/;

const isBlank = (l: string) => l.trim() === '';

function listMatch(line: string): RegExpExecArray | null {
  const m = RE_LIST.exec(line);
  // "- " needs content (a bare "-" or "*" is not an item); rules win over lists.
  if (!m || m[3] === undefined || m[3].trim() === '' || RE_HR.test(line)) return null;
  return m;
}

function isTableStart(lines: string[], i: number): boolean {
  return RE_TABLE_ROW.test(lines[i]) && i + 1 < lines.length && RE_TABLE_ROW.test(lines[i + 1]);
}

function startsBlock(lines: string[], i: number): boolean {
  const l = lines[i];
  return (
    RE_HEADING.test(l) ||
    RE_HR.test(l) ||
    RE_FNDEF.test(l) ||
    RE_QUOTE.test(l) ||
    listMatch(l) !== null ||
    isTableStart(lines, i)
  );
}

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
function markerNumber(marker: string): number {
  const digits = marker
    .replace(/[.)]$/, '')
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 1;
}

function indentWidth(ws: string): number {
  return ws.replace(/\t/g, '    ').length;
}

function markerFamily(marker: string): string {
  if (/^[-*+]$/.test(marker)) return '-';
  return `${marker.slice(-1)}${/^[٠-٩۰-۹]/.test(marker) ? 'a' : 'l'}`;
}

function newList(m: RegExpExecArray): ListBlock {
  const marker = m[2];
  const ordered = !/^[-*+]$/.test(marker);
  return {
    type: 'list',
    ordered,
    family: markerFamily(marker),
    start: ordered ? markerNumber(marker) : 1,
    arabicDigits: /^[٠-٩۰-۹]/.test(marker),
    indent: indentWidth(m[1]),
    items: [],
  };
}

/**
 * Parse a list starting at lines[i]. Deeper-indented items nest under the
 * previous item; a change of marker family (bullet, "1.", "1)", "١.") at the
 * same depth opens a sibling list; non-item lines are continuation text of the deepest open item.
 * Blank lines end the list unless the next non-blank line is another item.
 */
function parseList(lines: string[], start: number): { list: ListBlock; next: number } {
  const first = listMatch(lines[start])!;
  const root = newList(first);
  // stack of open lists, each with the item that owns it (for nesting)
  const stack: { list: ListBlock; owner: ListItem | null }[] = [{ list: root, owner: null }];
  let i = start;

  while (i < lines.length) {
    const line = lines[i];
    if (isBlank(line)) {
      let j = i + 1;
      while (j < lines.length && isBlank(lines[j])) j++;
      if (j < lines.length && listMatch(lines[j])) {
        i = j;
        continue;
      }
      break;
    }

    const m = listMatch(line);
    if (m) {
      const indent = indentWidth(m[1]);
      const family = markerFamily(m[2]);
      while (stack.length > 1 && indent < stack[stack.length - 1].list.indent) stack.pop();
      let top = stack[stack.length - 1];
      const lastItem = top.list.items[top.list.items.length - 1];

      if (indent > top.list.indent && lastItem) {
        const child = newList(m);
        lastItem.children.push(child);
        stack.push({ list: child, owner: lastItem });
        top = stack[stack.length - 1];
      } else if (top.list.family !== family) {
        if (stack.length === 1) break; // a different marker family at top level starts a new list
        const sibling = newList(m);
        top.owner!.children.push(sibling);
        stack[stack.length - 1] = { list: sibling, owner: top.owner };
        top = stack[stack.length - 1];
      }
      top.list.items.push({ text: m[3].trim(), children: [] });
      i++;
      continue;
    }

    if (startsBlock(lines, i)) break;

    // continuation line: belongs to the deepest open item
    const deepest = stack[stack.length - 1].list;
    const item = deepest.items[deepest.items.length - 1];
    item.text += '\n' + line.trim();
    i++;
  }

  return { list: root, next: i };
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}

export function parseMarkdown(md: string, opts: { headingIds?: boolean } = {}): MarkdownDoc {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  const footnotes: FootnoteDef[] = [];
  const seenDefs = new Map<string, number>();
  let headingCounter = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (isBlank(line)) {
      i++;
      continue;
    }

    // Footnote definition — one per line; lazy continuation lines join it.
    const fn = RE_FNDEF.exec(line);
    if (fn) {
      let text = fn[2];
      i++;
      while (i < lines.length && !isBlank(lines[i]) && !startsBlock(lines, i)) {
        text += '\n' + lines[i].trim();
        i++;
      }
      // A repeated definition id keeps its text (never dropped) under a
      // distinct id; references resolve to the first definition.
      const n = (seenDefs.get(fn[1]) ?? 0) + 1;
      seenDefs.set(fn[1], n);
      footnotes.push({ id: n === 1 ? fn[1] : `${fn[1]}-def${n}`, text: text.trim() });
      continue;
    }

    const h = RE_HEADING.exec(line);
    if (h) {
      const block: Block = { type: 'heading', level: h[1].length, text: h[2] };
      if (opts.headingIds) block.id = `sec-${headingCounter++}`;
      blocks.push(block);
      i++;
      continue;
    }

    if (RE_HR.test(line)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    if (isTableStart(lines, i)) {
      const rows: string[] = [];
      while (i < lines.length && RE_TABLE_ROW.test(lines[i])) rows.push(lines[i++]);
      const body = rows.slice(1).filter((r) => !RE_TABLE_SEP.test(r));
      blocks.push({ type: 'table', header: splitRow(rows[0]), rows: body.map(splitRow) });
      continue;
    }

    if (RE_QUOTE.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && !isBlank(lines[i]) && !RE_FNDEF.test(lines[i]) && !RE_HEADING.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^ {0,3}>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'blockquote', lines: quoteLines });
      continue;
    }

    if (listMatch(line)) {
      const { list, next } = parseList(lines, i);
      blocks.push(list);
      i = next;
      continue;
    }

    // Paragraph: consecutive lines until a blank line or another block.
    const para: string[] = [line];
    i++;
    while (i < lines.length && !isBlank(lines[i]) && !startsBlock(lines, i)) para.push(lines[i++]);
    const text = para.join('\n').trim();
    const signature = text.startsWith('*') && text.endsWith('*') && !text.startsWith('**') && text.length > 2;
    blocks.push({ type: 'paragraph', text, signature });
  }

  return { blocks, footnotes };
}

/** Headings of levels 1–3 with the ids assigned by parseMarkdown({headingIds}). */
export function extractToc(doc: MarkdownDoc): TocEntry[] {
  return doc.blocks
    .filter((b): b is Extract<Block, { type: 'heading' }> => b.type === 'heading' && !!b.id && b.level <= 3)
    .map((b) => ({
      level: b.level,
      id: b.id!,
      text: b.text.replace(/\*\*/g, '').replace(/★\s*/g, '').replace(/\[\^[^\]\s]+\]/g, '').trim(),
    }));
}

/* ============================================================
   Inline rendering
   ============================================================ */

/** Link destinations that may become live anchors. Everything else stays text. */
export function safeHref(url: string): string | null {
  const u = url.trim();
  if (/^(https?:\/\/|mailto:)/i.test(u)) return u;
  if (/^\/(?!\/)/.test(u) || u.startsWith('#')) return u;
  return null;
}

interface RenderCtx {
  variant: MarkdownVariant;
  defs: Map<string, FootnoteDef>;
  /** reference occurrences per footnote id, in document order */
  refs: Map<string, string[]>;
  labels: Labels;
}

const TOKEN =
  /(\[(?!\^)([^\]\n]+)\]\(\s*<?([^\s)<>]+)>?(?:\s+"[^"]*")?\s*\))|(\*\*(?:[^*]|\*(?!\*))+?\*\*)|(\[\^([^\]\s]+)\])|((?<![*\p{L}\p{N}])\*(?![\s*])[^*\n]+?(?<![\s*])\*(?![*\p{L}\p{N}]))/gu;

function normalizeText(text: string): string {
  return text
    .replace(/&nbsp;/g, '\u00a0')
    .replace(/&amp;/g, '&')
    .replace(/\n/g, ' ')
    .replace(/[ \t]+/g, ' ');
}

function inline(text: string, ctx: RenderCtx, opts: { inLink?: boolean; inNote?: boolean } = {}): ReactNode[] {
  const working = normalizeText(text);
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  const re = new RegExp(TOKEN.source, TOKEN.flags);
  let m: RegExpExecArray | null;

  while ((m = re.exec(working)) !== null) {
    if (m.index > last) out.push(working.slice(last, m.index));
    const k = key++;

    if (m[1]) {
      // [text](url)
      const href = opts.inLink ? null : safeHref(m[3]);
      if (href) {
        const external = /^(https?:)/i.test(href);
        out.push(
          createElement(
            'a',
            {
              key: `l${k}`,
              href,
              ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
              className: 'text-gold-600 hover:text-gold-700 underline',
            },
            inline(m[2], ctx, { ...opts, inLink: true })
          )
        );
      } else {
        out.push(m[0]); // unsupported destination: keep the source text visible, inactive
      }
    } else if (m[4]) {
      out.push(
        createElement(
          'strong',
          { key: `b${k}`, className: 'font-semibold text-navy-800' },
          inline(m[4].slice(2, -2), ctx, opts)
        )
      );
    } else if (m[5]) {
      out.push(noteRef(m[6], ctx, opts, k));
    } else if (m[7]) {
      out.push(
        createElement(
          'em',
          { key: `i${k}`, className: ctx.variant === 'research' ? 'italic' : undefined },
          inline(m[7].slice(1, -1), ctx, opts)
        )
      );
    }
    last = m.index + m[0].length;
  }
  if (last < working.length) out.push(working.slice(last));
  return out;
}

function noteRef(id: string, ctx: RenderCtx, opts: { inLink?: boolean; inNote?: boolean }, k: number): ReactNode {
  const linkClass = 'text-gold-600 hover:text-gold-700 font-medium no-underline text-xs';
  if (!ctx.defs.has(id)) {
    // No definition in the source: show the marker, but no dangling link.
    return createElement('sup', { key: `f${k}`, className: 'mx-0.5' }, `[${id}]`);
  }
  if (opts.inLink || opts.inNote) {
    // A reference inside a note or link text links to the note without
    // claiming a back-link anchor of its own.
    return createElement(
      'sup',
      { key: `f${k}`, className: 'mx-0.5' },
      createElement('a', { href: `#fn-${id}`, className: linkClass }, `[${id}]`)
    );
  }
  const occurrences = ctx.refs.get(id) ?? [];
  const refId = occurrences.length === 0 ? `fnref-${id}` : `fnref-${id}-${occurrences.length + 1}`;
  occurrences.push(refId);
  ctx.refs.set(id, occurrences);
  return createElement(
    'sup',
    { key: `f${k}`, id: refId, className: 'mx-0.5' },
    createElement(
      'a',
      { href: `#fn-${id}`, className: linkClass, role: 'doc-noteref', 'aria-label': `${ctx.labels.note} ${id}` },
      `[${id}]`
    )
  );
}

/* ============================================================
   Block rendering
   ============================================================ */

interface Labels {
  notes: string;
  note: string;
  back: string;
}

const LABELS: Record<string, Labels> = {
  ar: { notes: 'الهوامش', note: 'الحاشية', back: 'العودة إلى موضع الإحالة' },
  en: { notes: 'Notes', note: 'Note', back: 'Back to reference' },
  es: { notes: 'Notas', note: 'Nota', back: 'Volver a la referencia' },
  ur: { notes: 'حواشی', note: 'حاشیہ', back: 'حوالے کے مقام پر واپس' },
};

const CLS = {
  article: {
    h1: 'text-2xl sm:text-3xl font-semibold text-navy-700 mt-14 mb-5 gold-line',
    h2: 'text-2xl sm:text-3xl font-semibold text-navy-700 mt-14 mb-5 gold-line',
    h3: 'text-xl sm:text-2xl font-medium text-navy-700 mt-12 mb-4 gold-line',
    h4: 'text-lg font-medium text-navy-700 mt-8 mb-3',
    p: 'text-base sm:text-lg text-navy-700 leading-loose my-5',
    sig: 'text-sm text-navy-500 italic leading-relaxed mt-6',
    quote: 'border-r-4 border-gold-400 ps-5 pe-5 py-3 my-6 bg-gold-50 text-navy-700 text-lg leading-loose italic',
    li: 'text-navy-600 leading-relaxed',
    tableWrap: 'my-6 overflow-x-auto',
    table: 'w-full border-collapse text-base text-navy-700',
    theadRow: undefined as string | undefined,
    th: 'border border-navy-100 bg-gold-50 px-3 py-2 text-start font-semibold',
    td: 'border border-navy-100 px-3 py-2 align-top',
    tr: (_i: number) => undefined as string | undefined,
  },
  research: {
    h1: 'scroll-mt-24 text-2xl sm:text-3xl font-semibold text-navy-900 mt-14 mb-5 pb-2 border-b-2 border-gold-300',
    h2: 'scroll-mt-24 text-2xl sm:text-3xl font-medium text-navy-800 mt-12 mb-4 gold-line',
    h3: 'scroll-mt-24 text-xl sm:text-2xl font-medium text-navy-700 mt-10 mb-3',
    h4: 'scroll-mt-24 text-lg font-medium text-navy-700 mt-8 mb-3',
    p: 'text-base sm:text-lg text-navy-700 leading-loose my-5',
    sig: 'text-sm text-navy-500 italic leading-relaxed my-6',
    quote: 'border-s-4 border-gold-400 ps-5 pe-5 py-3 my-6 bg-gold-50 text-navy-700 text-lg leading-loose',
    li: 'text-navy-700 leading-relaxed',
    tableWrap: 'my-8 overflow-x-auto',
    table: 'w-full text-sm border-collapse',
    theadRow: 'bg-navy-50' as string | undefined,
    th: 'border border-navy-200 px-3 py-2 font-medium text-navy-800 text-start',
    td: 'border border-navy-200 px-3 py-2 text-navy-700 align-top leading-relaxed',
    tr: (i: number) => (i % 2 ? 'bg-white' : 'bg-navy-50/30') as string | undefined,
  },
};

function renderList(list: ListBlock, ctx: RenderCtx, key: string, nested: boolean): ReactNode {
  const c = CLS[ctx.variant];
  const spacing = nested ? 'mt-2 space-y-2' : 'my-5 space-y-2';
  const children = (item: ListItem, idx: number) =>
    item.children.map((child, ci) => renderList(child, ctx, `${key}-${idx}-${ci}`, true));

  if (!list.ordered) {
    return createElement(
      'ul',
      { key, className: `${spacing} ps-5` },
      list.items.map((item, idx) =>
        createElement(
          'li',
          { key: idx, className: `${c.li} flex gap-3 items-start` },
          createElement('span', { className: 'mt-2 h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0', 'aria-hidden': true }),
          item.children.length
            ? createElement('div', { className: 'min-w-0' }, inline(item.text, ctx), children(item, idx))
            : createElement('span', null, inline(item.text, ctx))
        )
      )
    );
  }

  const style: CSSProperties | undefined = list.arabicDigits ? { listStyleType: 'arabic-indic' } : undefined;
  return createElement(
    'ol',
    {
      key,
      className: `${spacing} ps-5 list-decimal list-inside`,
      ...(list.start !== 1 ? { start: list.start } : {}),
      ...(style ? { style } : {}),
    },
    list.items.map((item, idx) =>
      createElement('li', { key: idx, className: c.li }, inline(item.text, ctx), children(item, idx))
    )
  );
}

function renderBlock(block: Block, ctx: RenderCtx, i: number): ReactNode {
  const c = CLS[ctx.variant];
  switch (block.type) {
    case 'hr':
      return createElement('hr', { key: `hr-${i}`, className: 'border-t border-gold-200 my-10' });
    case 'heading': {
      const level = block.level;
      const tag = level === 1 ? 'h2' : `h${Math.min(level, 6)}`;
      const cls = level === 1 ? c.h1 : level === 2 ? c.h2 : level === 3 ? c.h3 : c.h4;
      return createElement(tag, { key: `h-${i}`, id: block.id, className: cls }, inline(block.text, ctx));
    }
    case 'paragraph':
      if (block.signature) {
        return createElement('p', { key: `sig-${i}`, className: c.sig }, inline(block.text.replace(/^\*+|\*+$/g, '').trim(), ctx));
      }
      return createElement('p', { key: `p-${i}`, className: c.p }, inline(block.text, ctx));
    case 'blockquote':
      return createElement(
        'blockquote',
        { key: `q-${i}`, className: c.quote },
        block.lines.map((line, idx) => createElement('span', { key: idx, className: 'block' }, inline(line, ctx)))
      );
    case 'list':
      return renderList(block, ctx, `l-${i}`, false);
    case 'table':
      return createElement(
        'div',
        { key: `tbl-${i}`, className: c.tableWrap },
        createElement(
          'table',
          { className: c.table },
          createElement(
            'thead',
            null,
            createElement(
              'tr',
              { className: c.theadRow },
              block.header.map((h, hi) => createElement('th', { key: hi, className: c.th }, inline(h, ctx)))
            )
          ),
          createElement(
            'tbody',
            null,
            block.rows.map((r, ri) =>
              createElement(
                'tr',
                { key: ri, className: c.tr(ri) },
                r.map((cell, ci) => createElement('td', { key: ci, className: c.td }, inline(cell, ctx)))
              )
            )
          )
        )
      );
  }
}

function renderFootnotes(doc: MarkdownDoc, ctx: RenderCtx): ReactNode {
  if (!doc.footnotes.length) return null;
  const allNumeric = doc.footnotes.every((f) => /^\d+$/.test(f.id));
  return createElement(
    'section',
    { key: 'footnotes', className: 'mt-16 pt-8 border-t border-navy-100', 'aria-labelledby': 'footnotes-heading', role: 'doc-endnotes' },
    createElement(
      'h3',
      { id: 'footnotes-heading', className: 'text-base font-medium text-navy-700 mb-4 uppercase tracking-wider' },
      ctx.labels.notes
    ),
    createElement(
      'ol',
      { className: `space-y-3 text-sm text-navy-600 leading-relaxed ${allNumeric ? 'list-decimal' : 'list-none'} list-inside` },
      doc.footnotes.map((fn) => {
        const occurrences = ctx.refs.get(fn.id) ?? [];
        return createElement(
          'li',
          { key: fn.id, id: `fn-${fn.id}`, className: 'ps-2', ...(allNumeric ? { value: Number(fn.id) } : {}) },
          allNumeric ? null : createElement('span', { className: 'me-1 font-medium' }, `[${fn.id.replace(/-def\d+$/, '')}]`),
          createElement('span', null, inline(fn.text, ctx, { inNote: true })),
          occurrences.map((refId, n) =>
            createElement(
              'a',
              {
                key: refId,
                href: `#${refId}`,
                className: 'text-gold-500 hover:text-gold-700 ms-2 text-xs no-underline',
                role: 'doc-backlink',
                'aria-label': occurrences.length > 1 ? `${ctx.labels.back} ${fn.id} (${n + 1})` : `${ctx.labels.back} ${fn.id}`,
              },
              occurrences.length > 1 ? `↩${n + 1}` : '↩'
            )
          )
        );
      })
    )
  );
}

/**
 * Render a parsed body. `locale` is the language of the BODY (the resolved
 * content locale), which selects the footnote labels.
 */
export function renderMarkdown(
  doc: MarkdownDoc,
  opts: { variant?: MarkdownVariant; locale: string }
): ReactNode {
  const ctx: RenderCtx = {
    variant: opts.variant ?? 'article',
    defs: new Map(doc.footnotes.map((f) => [f.id, f])),
    refs: new Map(),
    labels: LABELS[opts.locale] ?? LABELS.en,
  };
  // Blocks first (this records reference occurrences), then the notes.
  const body = doc.blocks.map((b, i) => renderBlock(b, ctx, i));
  const notes = renderFootnotes(doc, ctx);
  return createElement(Fragment, null, body, notes);
}

/** Convenience component: prepare + parse + render a raw Markdown file body. */
export function MarkdownBody({
  raw,
  kind,
  locale,
}: {
  raw: string;
  kind: MarkdownKind;
  locale: string;
}) {
  const doc = parseMarkdown(prepareMarkdownBody(raw, kind), { headingIds: kind === 'research' });
  return <>{renderMarkdown(doc, { variant: kind === 'research' ? 'research' : 'article', locale })}</>;
}
