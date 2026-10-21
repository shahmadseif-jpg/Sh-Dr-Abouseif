import { NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '@/lib/site-config';
import { FIELD_LIMITS, isValidEmail } from '@/lib/forms';

/*
 * NOTE (audit FORM-02): no page calls this handler. The live forms post
 * from the browser straight to FormSubmit through lib/forms.ts because
 * FormSubmit rejects server-side POSTs. This route is kept for a future
 * Resend-based path and is hardened so it is safe if it is ever wired up:
 * JSON-only, 16 KB body cap, per-field length limits, honeypot, e-mail
 * format check and generic error bodies (no exception text to clients).
 * Rate limiting needs the hosting layer (Vercel WAF / middleware with a
 * shared store); an in-memory counter is not reliable on serverless.
 */
const MAX_BODY_BYTES = 16 * 1024;

async function readJsonBody(req: NextRequest): Promise<Record<string, unknown> | Response> {
  const ct = req.headers.get('content-type') || '';
  if (!ct.toLowerCase().includes('application/json')) {
    return NextResponse.json({ ok: false, error: 'unsupported media type' }, { status: 415 });
  }
  const declared = Number(req.headers.get('content-length') || '0');
  if (declared > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: 'payload too large' }, { status: 413 });
  }
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: 'payload too large' }, { status: 413 });
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('shape');
    return parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }
}

const str = (v: unknown, max: number) => (v == null ? '' : String(v)).trim().slice(0, max + 1);

/**
 * استقبال الأسئلة الشرعية وإرسالها إلى بريد الشيخ.
 *
 * يعمل بطريقتين تلقائياً:
 *  (1) إن وُجد RESEND_API_KEY  => إرسال عبر Resend (باسم نطاقك، مظهر رسمي).
 *  (2) وإلا => إرسال عبر FormSubmit بلا حساب (يعمل فوراً، يلزم تأكيد البريد مرة واحدة).
 *
 * بريد الاستقبال: متغيّر البيئة RECEIVING_EMAIL أو البريد المعرّف في site-config.
 */

const RECEIVING_EMAIL = process.env.RECEIVING_EMAIL || siteConfig.contact.email;

function escapeHtml(s = ''): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: NextRequest) {
  try {
    const parsedBody = await readJsonBody(req);
    if (parsedBody instanceof Response) return parsedBody;
    const body = parsedBody;

    // مكافحة السبام (الحقل المخفي)
    if (body._honey) return NextResponse.json({ ok: true });

    const name = str(body.name, FIELD_LIMITS.name);
    const email = str(body.email, FIELD_LIMITS.email);
    const country = str(body.country, FIELD_LIMITS.country);
    const topic = str(body.topic, FIELD_LIMITS.topic);
    const answerLang = str(body.answerLang, 40);
    const question = str(body.question, FIELD_LIMITS.question);
    const uiLang = str(body.uiLang, 5);

    if (!name || !email || !topic || !question) {
      return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 });
    }
    if (
      name.length > FIELD_LIMITS.name ||
      country.length > FIELD_LIMITS.country ||
      topic.length > FIELD_LIMITS.topic ||
      question.length > FIELD_LIMITS.question
    ) {
      return NextResponse.json({ ok: false, error: 'field too long' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'invalid email' }, { status: 400 });
    }

    const subject = `سؤال شرعي جديد | New Fatwa Question — ${topic}`;
    const rows: [string, string][] = [
      ['الاسم / Name', name],
      ['البريد / Email', email],
      ['الدولة / Country', country || '—'],
      ['الموضوع / Topic', topic],
      ['لغة الإجابة / Answer language', answerLang || '—'],
      ['لغة الواجهة / UI language', uiLang || '—'],
    ];
    const text =
      rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
      `\n\nالسؤال / Question:\n${question}\n`;
    const html = `
      <div style="font-family:Cairo,Arial,sans-serif;color:#091625;direction:rtl;text-align:right">
        <h2 style="color:#1E3A5F;margin:0 0 12px">سؤال شرعي جديد من الموقع</h2>
        <table style="border-collapse:collapse;font-size:14px">
          ${rows
            .map(
              ([k, v]) =>
                `<tr><td style="padding:6px 12px;background:#F1F4F9;font-weight:700;border:1px solid #DCE3ED">${k}</td><td style="padding:6px 12px;border:1px solid #DCE3ED">${escapeHtml(
                  v
                )}</td></tr>`
            )
            .join('')}
        </table>
        <h3 style="color:#1E3A5F;margin:16px 0 6px">نص السؤال</h3>
        <p style="white-space:pre-wrap;line-height:1.8;font-size:15px">${escapeHtml(question)}</p>
      </div>`;

    // ===== (1) Resend =====
    if (process.env.RESEND_API_KEY) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.MAIL_FROM || 'Fatwa <onboarding@resend.dev>',
          to: [RECEIVING_EMAIL],
          reply_to: email,
          subject,
          html,
          text,
        }),
      });
      if (!r.ok) throw new Error('resend failed ' + r.status);
      return NextResponse.json({ ok: true, via: 'resend' });
    }

    // ===== (2) FormSubmit (بلا حساب) =====
    const fd = new URLSearchParams();
    rows.forEach(([k, v]) => fd.append(k, v));
    fd.append('السؤال / Question', question);
    fd.append('_subject', subject);
    fd.append('_template', 'table');
    fd.append('_captcha', 'false');
    const r = await fetch(`https://formsubmit.co/ajax/${RECEIVING_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: 'https://drahmedabouseif.com/',
        Origin: 'https://drahmedabouseif.com',
      },
      body: fd.toString(),
    });
    if (!r.ok) throw new Error('formsubmit failed ' + r.status);
    return NextResponse.json({ ok: true, via: 'formsubmit' });
  } catch (err) {
    console.error(`[api/${'fatwa'}] delivery failed:`, err instanceof Error ? err.message : 'unknown');
    return NextResponse.json({ ok: false, error: 'delivery failed' }, { status: 502 });
  }
}
