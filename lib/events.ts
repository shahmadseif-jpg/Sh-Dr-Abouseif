/**
 * Recurring sessions listed on /events.
 *
 * Publication status (audit PUBLISH-01): these entries were marked
 * "Placeholder events" in the source and have not been verified by the
 * Academy. They stay visible for orientation but are rendered with a
 * "to be confirmed" badge and a page-level notice until the owner checks
 * each one.
 *
 * OWNER ACTION: after confirming an entry's day, time and place, set its
 * `confirmed: true` and set EVENTS_LAST_CONFIRMED to the date of that check
 * (YYYY-MM-DD). Nothing else needs to change; the notice disappears when
 * every entry is confirmed.
 */
export type Loc = 'ar' | 'en' | 'es' | 'ur';
type L10n = Record<Loc, string>;

export interface RecurringEvent {
  id: string;
  confirmed: boolean;
  title: L10n;
  when: L10n;
  location: string;
  type: L10n;
}

/** Date the Academy last confirmed the schedule, or null if never recorded. */
export const EVENTS_LAST_CONFIRMED: string | null = '2026-10-21';

export const recurringEvents: RecurringEvent[] = [
  {
    id: 'weekly-jami-al-ulum',
    confirmed: true,
    title: {
      ar: 'جامع العلوم والحكم',
      en: "Jami' Al-Ulum wal-Hikam",
      es: 'Yāmiʿ al-ʿUlūm wal-Ḥikam',
      ur: 'جامع العلوم والحکم',
    },
    when: {
      ar: 'كل أحد بعد صلاة الفجر',
      en: 'Every Sunday after Fajr prayer',
      es: 'Cada domingo tras la oración del Fayr',
      ur: 'ہر اتوار نمازِ فجر کے بعد',
    },
    location: 'AIA',
    type: { ar: 'درس أسبوعي', en: 'Weekly class', es: 'Clase semanal', ur: 'ہفتہ وار درس' },
  },
  {
    id: 'jumuah-khutbah',
    confirmed: true,
    title: {
      ar: 'خطبة الجمعة',
      en: "Jumu'ah Khutbah",
      es: 'Sermón del viernes (Yumuʿa)',
      ur: 'جمعہ خطبہ',
    },
    when: { ar: 'كل جمعة', en: 'Every Friday', es: 'Cada viernes', ur: 'ہر جمعہ' },
    location: 'Bayt Al-Karim Islamic Center',
    type: { ar: 'خطبة أسبوعية', en: 'Weekly khutbah', es: 'Sermón semanal', ur: 'ہفتہ وار خطبہ' },
  },
  {
    id: 'isha-lecture-calls-to-faith-ar',
    confirmed: true,
    title: {
      ar: 'محاضرة العشاء — نداءات الإيمان (بالعربية)',
      en: 'Isha Lecture — Calls to Faith (in Arabic)',
      es: 'Conferencia del ʿIshāʾ — Llamadas a la fe (en árabe)',
      ur: 'عشاء لیکچر — نداءاتِ ایمان (عربی میں)',
    },
    when: {
      ar: 'كل أحد بعد العشاء',
      en: 'Every Sunday after Isha',
      es: 'Cada domingo tras el ʿIshāʾ',
      ur: 'ہر اتوار نمازِ عشاء کے بعد',
    },
    location: 'AIA',
    type: { ar: 'محاضرة أسبوعية', en: 'Weekly lecture', es: 'Conferencia semanal', ur: 'ہفتہ وار محاضرہ' },
  },
  {
    id: 'isha-lecture-calls-to-faith-en',
    confirmed: true,
    title: {
      ar: 'محاضرة العشاء — نداءات الإيمان (بالإنجليزية)',
      en: 'Isha Lecture — Calls to Faith (in English)',
      es: 'Conferencia del ʿIshāʾ — Llamadas a la fe (en inglés)',
      ur: 'عشاء لیکچر — نداءاتِ ایمان (انگریزی میں)',
    },
    when: {
      ar: 'كل ثلاثاء بعد العشاء',
      en: 'Every Tuesday after Isha',
      es: 'Cada martes tras el ʿIshāʾ',
      ur: 'ہر منگل نمازِ عشاء کے بعد',
    },
    location: 'AIA',
    type: { ar: 'محاضرة أسبوعية', en: 'Weekly lecture', es: 'Conferencia semanal', ur: 'ہفتہ وار محاضرہ' },
  },
];
