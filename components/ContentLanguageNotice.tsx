import type { ContentLocale } from '@/lib/localized-content-server';

const LANGUAGE_NAMES: Record<ContentLocale, Record<ContentLocale, string>> = {
  ar: { ar: 'العربية', en: 'الإنجليزية', es: 'الإسبانية', ur: 'الأردية' },
  en: { ar: 'Arabic', en: 'English', es: 'Spanish', ur: 'Urdu' },
  es: { ar: 'árabe', en: 'inglés', es: 'español', ur: 'urdu' },
  ur: { ar: 'عربی', en: 'انگریزی', es: 'ہسپانوی', ur: 'اردو' },
};

const COPY: Record<
  ContentLocale,
  (language: string) => string
> = {
  ar: (language) =>
    `هذه المادة غير متاحة بالعربية حاليًا؛ لذلك يُعرض النص ${language} مؤقتًا مع بيان لغة المصدر.`,
  en: (language) =>
    `This item is not yet available in English. The ${language} text is shown temporarily, with its source language clearly identified.`,
  es: (language) =>
    `Este contenido aún no está disponible en español. Se muestra temporalmente el texto en ${language}, indicando claramente su idioma.`,
  ur: (language) =>
    `یہ مواد ابھی اردو میں دستیاب نہیں؛ اس لیے ماخذ کی زبان واضح کرتے ہوئے عارضی طور پر ${language} متن دکھایا جا رہا ہے۔`,
};

export default function ContentLanguageNotice({
  requestedLocale,
  resolvedLocale,
}: {
  requestedLocale: ContentLocale;
  resolvedLocale: ContentLocale;
}) {
  if (requestedLocale === resolvedLocale) return null;

  const language = LANGUAGE_NAMES[requestedLocale][resolvedLocale];

  return (
    <aside
      role="status"
      className="mb-8 rounded-lg border border-gold-200 bg-gold-50 px-5 py-4 text-sm leading-relaxed text-navy-700"
    >
      {COPY[requestedLocale](language)}
    </aside>
  );
}
