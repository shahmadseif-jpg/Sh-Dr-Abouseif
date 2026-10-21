#!/usr/bin/env node
/**
 * Unit checks for lib/forms.ts (shared FormSubmit client + validation).
 *   node scripts/check-forms.mjs
 * fetch is always mocked: no request leaves the machine.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = fs.readFileSync(path.join(root, 'lib/forms.ts'), 'utf8');
const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'forms-check-'));
const file = path.join(tmp, 'forms.mjs');
fs.writeFileSync(file, out.outputText);
const F = await import(pathToFileURL(file).href);

const failures = [];
const eq = (name, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) failures.push(`${name}: got ${g}, want ${w}`);
};

// e-mail
for (const ok of ['a@b.co', 'name.surname+tag@example.org', 'x@sub.domain.museum']) eq(`email ok ${ok}`, F.isValidEmail(ok), true);
for (const bad of ['', 'a', 'a@', '@b.com', 'a@b', 'a b@c.com', 'a@b..com', 'a@.com', 'not-an-email']) eq(`email bad ${bad}`, F.isValidEmail(bad), false);

// validation
eq(
  'validate empty',
  F.validateFields({ name: '', email: '', q: '  ', c: false }, { name: { required: true }, email: { required: true, email: true }, q: { required: true }, c: { mustBeChecked: true } }),
  { name: 'required', email: 'required', q: 'required', c: 'consent' }
);
eq('validate email format', F.validateFields({ email: 'x@y' }, { email: { required: true, email: true } }), { email: 'email' });
eq('validate optional email empty', F.validateFields({ email: '' }, { email: { email: true } }), {});
eq('validate too long', F.validateFields({ n: 'x'.repeat(11) }, { n: { maxLength: 10 } }), { n: 'tooLong' });
eq('validate ok', F.validateFields({ n: 'A', c: true }, { n: { required: true }, c: { mustBeChecked: true } }), {});

// provider response interpretation
eq('200 success:"true"', F.interpretFormSubmitResponse(200, { success: 'true' }), { kind: 'ok' });
eq('200 success:true', F.interpretFormSubmitResponse(200, { success: true }), { kind: 'ok' });
eq(
  '200 activation',
  F.interpretFormSubmitResponse(200, { success: 'false', message: "This form needs Activation. We've sent you an email containing an 'Activate Form' link." }),
  { kind: 'activation' }
);
eq('200 success:false', F.interpretFormSubmitResponse(200, { success: 'false', message: 'spam' }), { kind: 'rejected', status: 200 });
eq('200 no json', F.interpretFormSubmitResponse(200, null), { kind: 'rejected', status: 200 });
eq('500', F.interpretFormSubmitResponse(500, { success: 'true' }), { kind: 'rejected', status: 500 });

// submit with mocked fetch
const mkFetch = (status, body, delay = 0) => async (url, init) => {
  mkFetch.calls.push({ url, init });
  await new Promise((resolve, reject) => {
    const tm = setTimeout(resolve, delay);
    init.signal?.addEventListener('abort', () => {
      clearTimeout(tm);
      const e = new Error('aborted');
      e.name = 'AbortError';
      reject(e);
    });
  });
  return { status, json: async () => (typeof body === 'string' ? JSON.parse(body) : body) };
};
mkFetch.calls = [];
eq('submit ok', await F.submitToFormSubmit({ a: '1' }, { fetchImpl: mkFetch(200, { success: 'true' }) }), { kind: 'ok' });
const call = mkFetch.calls[0];
eq('endpoint', call.url, 'https://formsubmit.co/ajax/shahmadseif@gmail.com');
eq('method/json', [call.init.method, call.init.headers['Content-Type'], call.init.headers.Accept], ['POST', 'application/json', 'application/json']);
eq('has abort signal', !!call.init.signal, true);
eq('submit activation', await F.submitToFormSubmit({}, { fetchImpl: mkFetch(200, { success: 'false', message: 'needs Activation' }) }), { kind: 'activation' });
eq('submit bad json', await F.submitToFormSubmit({}, { fetchImpl: mkFetch(200, '{not json') }), { kind: 'rejected', status: 200 });
eq('submit timeout', await F.submitToFormSubmit({}, { fetchImpl: mkFetch(200, { success: 'true' }, 500), timeoutMs: 50 }), { kind: 'timeout' });
eq('submit network', await F.submitToFormSubmit({}, { fetchImpl: async () => { throw new TypeError('Failed to fetch'); } }), { kind: 'network' });

// consent version constant used by the Q&A form
eq('consent version format', /^qa-consent-v\d+-\d{4}-\d{2}-\d{2}$/.test(F.CONSENT_POLICY_VERSION), true);

// Static source checks on the three forms
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const fatwa = read('components/FatwaContent.tsx');
const checks = [
  ['FatwaContent uses shared client', /submitToFormSubmit\(/.test(fatwa)],
  ['FatwaContent consent checkbox is named', /fieldProps\('consentProcessing'\)/.test(fatwa) && /name="consentPublish"/.test(fatwa)],
  ['FatwaContent payload carries consent version + timestamp', /CONSENT_POLICY_VERSION/.test(fatwa) && /toISOString\(\)/.test(fatwa)],
  ['Newsletter uses shared client', /submitToFormSubmit\(/.test(read('components/Newsletter.tsx'))],
  ['Comments use shared client', /submitToFormSubmit\(/.test(read('components/ArticleComments.tsx'))],
  ['No other direct formsubmit fetch in components', !/formsubmit\.co/.test(read('components/FatwaContent.tsx') + read('components/Newsletter.tsx') + read('components/ArticleComments.tsx'))],
  ['No left:-9999px honeypot', !/-9999px|-\[9999px\]/.test(fatwa + read('components/ArticleComments.tsx'))],
  ['API fatwa has body cap', /MAX_BODY_BYTES/.test(read('app/api/fatwa/route.ts'))],
  ['API comment has body cap', /MAX_BODY_BYTES/.test(read('app/api/comment/route.ts'))],
  ['API does not echo exceptions', !/String\(err\)/.test(read('app/api/fatwa/route.ts') + read('app/api/comment/route.ts'))],
];
for (const [name, ok] of checks) if (!ok) failures.push(`static: ${name}`);

fs.rmSync(tmp, { recursive: true, force: true });
if (failures.length) {
  console.log(`FAIL: ${failures.length}`);
  failures.forEach((f) => console.log('  ' + f));
  process.exit(1);
}
console.log('PASS: forms validation, provider-response handling, timeout, static wiring');
