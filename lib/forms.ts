/**
 * Shared client-side form plumbing for the site's three reader forms
 * (Q&A/fatwa question, article comment, newsletter request).
 *
 * Data path actually used in production (documented for the owner):
 *   browser  ──POST JSON──▶  FormSubmit (formsubmit.co/ajax/<inbox>)  ──email──▶  the Imam's inbox
 * FormSubmit rejects server-to-server POSTs, so the forms post from the
 * browser. The two route handlers under app/api/{fatwa,comment} are NOT
 * called by any form; they are kept (hardened) for a future Resend-based
 * path but are not part of the live flow.
 *
 * What this module guarantees on the client:
 *  - a single endpoint and a single response interpreter, so a page never
 *    says "received" unless FormSubmit's JSON says `success: "true"`;
 *  - FormSubmit's "this form needs activation" answer is surfaced as its own
 *    state (the message was NOT delivered to the inbox yet);
 *  - every request has a timeout (AbortController);
 *  - callers keep the user's input on any non-success outcome.
 *
 * What it cannot guarantee (needs owner / ops access, see LEDGER):
 *  - server-side retention of consent records, rate limiting and retention
 *    policy at FormSubmit; delivery into the inbox after FormSubmit accepts.
 */

export const FORM_RECEIVER = 'shahmadseif@gmail.com';
export const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${FORM_RECEIVER}`;
export const FORM_TIMEOUT_MS = 15000;

/**
 * Version of the consent wording shown with the Q&A form. Bump it whenever
 * the `fatwa.consentProcessing` / `fatwa.consentPublish` texts change so the
 * value carried in each submission identifies the wording the reader saw.
 * The policy itself is the public page /<locale>/how-we-answer.
 */
export const CONSENT_POLICY_VERSION = 'qa-consent-v3-2026-10-28';

/** Upper bounds mirrored by the (unused) API handlers. */
export const FIELD_LIMITS = {
  name: 120,
  email: 254,
  country: 80,
  topic: 120,
  question: 6000,
  comment: 4000,
} as const;

export type SubmitOutcome =
  | { kind: 'ok' }
  | { kind: 'activation' }
  | { kind: 'rejected'; status: number }
  | { kind: 'timeout' }
  | { kind: 'network' };

// Pragmatic e-mail check: one "@", no spaces, a dot in the domain part,
// no leading/trailing dot. Mirrors what <input type=email> accepts closely
// enough for a contact form; final validation is the provider's.
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

export function isValidEmail(value: string): boolean {
  const v = value.trim();
  return v.length > 0 && v.length <= FIELD_LIMITS.email && EMAIL_RE.test(v);
}

export type FieldError = 'required' | 'email' | 'tooLong' | 'consent';

export interface FieldRule {
  required?: boolean;
  email?: boolean;
  maxLength?: number;
  /** checkbox that must be ticked */
  mustBeChecked?: boolean;
}

/** Returns a map field -> first error, empty object when valid. */
export function validateFields(
  values: Record<string, string | boolean | undefined>,
  rules: Record<string, FieldRule>
): Record<string, FieldError> {
  const errors: Record<string, FieldError> = {};
  for (const [field, rule] of Object.entries(rules)) {
    const raw = values[field];
    if (rule.mustBeChecked) {
      if (raw !== true) errors[field] = 'consent';
      continue;
    }
    const v = typeof raw === 'string' ? raw.trim() : '';
    if (rule.required && !v) {
      errors[field] = 'required';
      continue;
    }
    if (v && rule.email && !isValidEmail(v)) {
      errors[field] = 'email';
      continue;
    }
    if (v && rule.maxLength && v.length > rule.maxLength) {
      errors[field] = 'tooLong';
    }
  }
  return errors;
}

/**
 * Interpret FormSubmit's AJAX answer. FormSubmit answers HTTP 200 with
 * `{"success":"false","message":"This form needs Activation..."}` until the
 * receiving inbox confirms the activation e-mail, so HTTP status alone is
 * never treated as delivery.
 */
export function interpretFormSubmitResponse(status: number, body: unknown): SubmitOutcome {
  const obj = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const success = obj.success === true || obj.success === 'true';
  const message = typeof obj.message === 'string' ? obj.message : '';
  if (status >= 200 && status < 300 && success) return { kind: 'ok' };
  if (/activat/i.test(message)) return { kind: 'activation' };
  return { kind: 'rejected', status };
}

export async function submitToFormSubmit(
  data: Record<string, string>,
  opts: { fetchImpl?: typeof fetch; timeoutMs?: number; endpoint?: string } = {}
): Promise<SubmitOutcome> {
  const fetchImpl = opts.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? FORM_TIMEOUT_MS);
  try {
    const res = await fetchImpl(opts.endpoint ?? FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    return interpretFormSubmitResponse(res.status, body);
  } catch (err) {
    if (controller.signal.aborted || (err as { name?: string })?.name === 'AbortError') {
      return { kind: 'timeout' };
    }
    return { kind: 'network' };
  } finally {
    clearTimeout(timer);
  }
}

/** Visually-hidden honeypot style that does not widen the layout (RTL-safe). */
export const HONEYPOT_STYLE: Record<string, string | number> = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
};
