/**
 * Recurring sessions listed on /events.
 *
 * Publication status (audit PUBLISH-01): these three entries were marked
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
export const EVENTS_LAST_CONFIRMED: string | null = null;

export const recurringEvents: RecurringEvent[] = [
  {
    id: 'fajr-khatira-jami-al-ulum',
    confirmed: false,
    title: {
      ar: 'خاطرة الفجر — جامع العلوم والحكم',
      en: "Fajr Khatira — Jami' Al-Ulum wal-Hikam",
      es: 'Reflexión del Fayr — Yāmiʿ al-ʿUlūm wal-Ḥikam',
      ur: 'فجر خاطرہ — جامع العلوم والحکم',
    },
    when: {
      ar: 'يومياً بعد صلاة الفجر',
      en: 'Daily after Fajr prayer',
      es: 'A diario tras la oración del Fayr',
      ur: 'روزانہ نمازِ فجر کے بعد',
    },
    location: 'AIA',
    type: { ar: 'درس يومي', en: 'Daily class', es: 'Clase diaria', ur: 'روزانہ درس' },
  },
  {
    id: 'jumuah-khutbah',
    confirmed: false,
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
    id: 'isha-lecture-calls-to-faith',
    confirmed: false,
    title: {
      ar: 'محاضرة العشاء — نداءات الإيمان',
      en: 'Isha Lecture — Calls to Faith',
      es: 'Conferencia del ʿIshāʾ — Llamadas a la fe',
      ur: 'عشاء لیکچر — نداءاتِ ایمان',
    },
    when: {
      ar: 'كل سبت بعد العشاء',
      en: 'Every Saturday after Isha',
      es: 'Cada sábado tras el ʿIshāʾ',
      ur: 'ہر ہفتہ نمازِ عشاء کے بعد',
    },
    location: 'AIA',
    type: { ar: 'محاضرة أسبوعية', en: 'Weekly lecture', es: 'Conferencia semanal', ur: 'ہفتہ وار محاضرہ' },
  },
];
