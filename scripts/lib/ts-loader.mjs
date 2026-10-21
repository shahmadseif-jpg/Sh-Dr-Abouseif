/**
 * Minimal TypeScript/TSX loader for the check scripts (no test framework,
 * no tsx dependency). Transpiles a project file — and, recursively, the
 * relative / "@/" imports it pulls in — with sucrase into a temporary
 * directory, then imports it as an ES module.
 *
 * Bare package imports (react, next/…) are rewritten to absolute file URLs
 * resolved from the project root so the temporary copies can find them.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const require = createRequire(path.join(ROOT, 'package.json'));
const { transform } = require('sucrase');

const OUT = fs.mkdtempSync(path.join(os.tmpdir(), 'site-check-'));
const done = new Map();

function resolveLocal(spec, fromDir) {
  const base = spec.startsWith('@/') ? path.join(ROOT, spec.slice(2)) : path.resolve(fromDir, spec);
  for (const cand of [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.mjs`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')]) {
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) return cand;
  }
  throw new Error(`Cannot resolve ${spec} from ${fromDir}`);
}

/** Transpile TS/TSX source text into ESM JS and rewrite its imports. */
export function transpileSource(code, filePath) {
  const isJson = filePath.endsWith('.json');
  if (isJson) return `export default ${code};`;
  let js = transform(code, {
    transforms: ['typescript', 'jsx'],
    jsxRuntime: 'classic',
    jsxPragma: '__React.createElement',
    jsxFragmentPragma: '__React.Fragment',
    production: true,
    disableESTransforms: true,
  }).code;
  const reactUrl = pathToFileURL(require.resolve('react')).href;
  js = `import __React from ${JSON.stringify(reactUrl)};\n` + js;
  const fromDir = path.dirname(filePath);
  return js.replace(/(\bfrom\s*|\bimport\s*\(?\s*)(['"])([^'"]+)\2/g, (m, pre, q, spec) => {
    if (spec.startsWith('file:') || spec.startsWith('node:')) return m;
    if (spec.startsWith('.') || spec.startsWith('@/')) {
      const target = resolveLocal(spec, fromDir);
      return `${pre}${q}${compileFile(target)}${q}`;
    }
    if (['fs', 'path', 'os', 'url', 'crypto'].includes(spec)) return `${pre}${q}node:${spec}${q}`;
    try {
      return `${pre}${q}${pathToFileURL(require.resolve(spec)).href}${q}`;
    } catch {
      return m;
    }
  });
}

/** Compile a project file (recursively); returns the file URL of the output. */
export function compileFile(absPath) {
  if (done.has(absPath)) return done.get(absPath);
  const rel = path.relative(ROOT, absPath).replace(/[^\w.-]+/g, '_');
  const outPath = path.join(OUT, `${rel}.mjs`);
  const url = pathToFileURL(outPath).href;
  done.set(absPath, url);
  const src = fs.readFileSync(absPath, 'utf8');
  fs.writeFileSync(outPath, transpileSource(src, absPath));
  return url;
}

/** Import a project TS/TSX module by repo-relative path. */
export async function importProject(relPath) {
  return import(compileFile(path.join(ROOT, relPath)));
}

/** Import a module built from in-memory source (e.g. code extracted from git). */
export async function importSource(code, virtualRelPath) {
  const abs = path.join(ROOT, virtualRelPath);
  const hash = crypto.createHash('sha1').update(code).digest('hex').slice(0, 10);
  const outPath = path.join(OUT, `virtual_${hash}.mjs`);
  fs.writeFileSync(outPath, transpileSource(code, abs));
  return import(pathToFileURL(outPath).href);
}
