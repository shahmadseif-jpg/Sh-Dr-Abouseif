import { NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '@/lib/site-config';

/**
 * استقبال تعليقات القرّاء على المقالات وإرسالها إلى بريد الشيخ للمراجعة.
 *
 * يعمل بطريقتين تلقائياً (كما في مسار الفتوى):
 *  (1) إن وُجد RESEND_API_KEY  => إرسال عبر Resend.
 *  (2) وإلا => إرسال عبر FormSubmit بلا حساب (يلزم تأكيد البريد مرة واحدة).
 *
 * التعليق لا يظهر على الموقع تلقائياً؛ بل يصل للشيخ، فإن أقرّه أُضيف إلى
 * content/comments/<slug>.json ليُعرَض تحت المقال.
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
    const comment = (body.comment || '').toString().trim();
    const slug = (body.slug || '').toString().trim();
    const articleTitle = (body.articleTitle || '').toString().trim();
    const uiLang = (body.uiLang || '').toString().trim();

    if (!name || !comment || !slug) {
      return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 });
    }

    // نموذج JSON جاهز للصق في content/comments/<slug>.json عند الإقرار
    const today = new Date().toISOString().slice(0, 10);
    const jsonSnippet = JSON.stringify(
      { name, date: today, body: comment },
      null,
      2
    );

    const subject = `تعليق جديد على مقال | New comment — ${articleTitle || slug}`;
    const rows: [string, string][] = [
      ['الاسم / Name', name],
      ['البريد / Email', email || '—'],
      ['المقال / Article', articleTitle || '—'],
      ['المعرّف / Slug', slug],
      ['لغة الواجهة / UI language', uiLang || '—'],
    ];
    const approveHint =
      `لإقرار التعليق ونشره: أضِف الكائن التالي إلى المصفوفة في` +
      ` content/comments/${slug}.json\n\n${jsonSnippet}\n`;
    const text =
      rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
      `\n\nالتعليق / Comment:\n${comment}\n\n----------\n${approveHint}`;
    const html = `
      <div style="font-family:Cairo,Arial,sans-serif;color:#091625;direction:rtl;text-align:right">
        <h2 style="color:#1E3A5F;margin:0 0 12px">تعليق جديد على مقال</h2>
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
        <h3 style="color:#1E3A5F;margin:16px 0 6px">نص التعليق</h3>
        <p style="white-space:pre-wrap;line-height:1.8;font-size:15px">${escapeHtml(comment)}</p>
        <h3 style="color:#1E3A5F;margin:16px 0 6px">لإقراره ونشره</h3>
        <p style="font-size:13px;color:#334">أضِف الكائن التالي إلى مصفوفة <code>content/comments/${escapeHtml(
          slug
        )}.json</code>:</p>
        <pre style="background:#F1F4F9;border:1px solid #DCE3ED;padding:12px;border-radius:6px;direction:ltr;text-align:left;font-size:13px;white-space:pre-wrap">${escapeHtml(
          jsonSnippet
        )}</pre>
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
          from: process.env.MAIL_FROM || 'Comments <onboarding@resend.dev>',
          to: [RECEIVING_EMAIL],
          reply_to: email || undefined,
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
    fd.append('التعليق / Comment', comment);
    fd.append('للإقرار / To approve', approveHint);
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
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
