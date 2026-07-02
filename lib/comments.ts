import fs from 'fs';
import path from 'path';

/**
 * تعليقات المقالات — نموذج «مراجعة قبل النشر».
 *
 * التعليقات المُقَرّة تُخزَّن في ملفات JSON داخل `content/comments/<slug>.json`.
 * لا يظهر أيُّ تعليق على الموقع إلا بعد إضافته يدويًّا إلى هذا الملف (بعد المراجعة).
 * أما استقبال التعليقات الجديدة فيتم عبر البريد (app/api/comment/route.ts).
 */

export interface ArticleComment {
  /** معرّف اختياري (لأغراض المفتاح في React) */
  id?: string;
  /** اسم المعلِّق كما يُعرَض */
  name: string;
  /** تاريخ النشر ISO، مثل "2026-07-02" */
  date?: string;
  /** نصّ التعليق */
  body: string;
  /** ردُّ الشيخ الاختياري على التعليق */
  reply?: string;
}

/** يقرأ التعليقات المُقَرّة لمقالٍ بعينه (أو مصفوفة فارغة إن لم توجد). */
export function getApprovedComments(slug: string): ArticleComment[] {
  try {
    const p = path.join(process.cwd(), 'content', 'comments', `${slug}.json`);
    if (!fs.existsSync(p)) return [];
    const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
    if (!Array.isArray(data)) return [];
    return data.filter((c: ArticleComment) => c && c.name && c.body);
  } catch {
    return [];
  }
}
