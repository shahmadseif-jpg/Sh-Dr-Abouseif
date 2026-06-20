import { NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '@/lib/site-config';

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
    const body = await req.json();

    // مكافحة السبام (الحقل المخفي)
    if (body._honey) return NextResponse.json({ ok: true });

    const name = (body.name || '').toString().trim();
    const email = (body.email || '').toString().trim();
    const country = (body.country || '').toString().trim();
    const topic = (body.topic || '').toString().trim();
    const answerLang = (body.answerLang || '').toString().trim();
    const question = (body.question || '').toString().trim();
    const uiLang = (body.uiLang || '').toString().trim();

    if (!name || !email || !topic || !question) {
      return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 });
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
      },
      body: fd.toString(),
    });
    if (!r.ok) throw new Error('formsubmit failed ' + r.status);
    return NextResponse.json({ ok: true, via: 'formsubmit' });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
