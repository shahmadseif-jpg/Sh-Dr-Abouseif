/**
 * Khawatir (dawah reflections) metadata — safe to import in client components.
 * For file content loading (uses fs), see lib/khawatir-server.ts
 */

export type Prayer = 'fajr' | 'isha';

export interface KhatraMeta {
  slug: string;
  prayer: Prayer;
  isoDate: string; // YYYY-MM-DD
  date: { ar: string; en: string; es?: string };
  readingMinutes: number;
  title: { ar: string; en: string; es?: string };
  subtitle?: { ar: string; en: string; es?: string };
  excerpt: { ar: string; en: string; es?: string };
  /** YouTube watch URL (or any embeddable video URL) */
  videoUrl?: string;
  /** Optional override for the video thumbnail */
  videoThumbnail?: string;
  draft?: boolean;
}

export const khawatirMeta: KhatraMeta[] = [
  {
    slug: 'go-forth-light-or-heavy',
    prayer: 'fajr',
    isoDate: '2026-05-14',
    date: { ar: '١٤ مايو ٢٠٢٦', en: 'May 14, 2026', es: '14 de mayo de 2026' },
    readingMinutes: 4,
    title: {
      ar: 'انفِروا خِفافاً وثِقالاً',
      en: 'Go Forth, Light or Heavy',
      es: 'Partid, ligeros o pesados',
    },
    subtitle: {
      ar: 'خاطرة فجر — لا عُذرَ لأَحَدٍ في التَّخَلُّف عن السَّعي',
      en: 'A Fajr reflection — No excuse for anyone to lag behind in striving',
      es: 'Una reflexión del Fajr — Ninguna excusa para nadie de rezagarse en el esfuerzo',
    },
    excerpt: {
      ar: 'تأمُّلٌ في قول الله تعالى ﴿انفِروا خِفافاً وثِقالاً﴾: لا عُذرَ لأَحَدٍ في يُسرٍ أو عُسر، وأن قضيَّة الانبعاث قضيَّةٌ نفسيَّةٌ قبل أن تكون مادِّيَّة. فإذا كَرِهَ الله انبعاثَ أقوامٍ ثبَّطهم؛ والمؤمنُ يَمضي حيثُما كان، فالعاقبةُ عند الله والمُجازي ربُّ العزَّة.',
      en: "A reflection on Allah's command ﴿Go forth, light or heavy﴾: there is no excuse for anyone, in ease or hardship. The matter of being sent forth (al-inbiʿāth) is psychological before it is material. The believer moves forward wherever he is — for the outcome rests with Allah, and the One who rewards is the Lord of Might.",
      es: 'Una reflexión sobre la orden de Dios ﴾Partid, ligeros o pesados﴿: no hay excusa para nadie, en la holgura o en la dificultad, y el asunto del ponerse en marcha (al-inbiʿāth) es psicológico antes de ser material. Si Dios aborreció el envío de unas gentes, las retuvo; y el creyente avanza dondequiera que esté, pues el desenlace está en Dios y quien recompensa es el Señor de la Majestad.',
    },
    videoUrl: 'https://www.youtube.com/watch?v=IcmdcI2SQFk',
  },
  {
    slug: 'hearts-and-deeds',
    prayer: 'fajr',
    isoDate: '2015-04-20',
    date: { ar: '٢٠ أبريل ٢٠١٥', en: 'April 20, 2015', es: '20 de abril de 2015' },
    readingMinutes: 3,
    title: {
      ar: 'ما المُؤمِنُ إِلَّا عَمَلٌ يُثمِر',
      en: 'The Believer Is Naught But Fruit-Bearing Work',
      es: 'El creyente no es sino obra que fructifica',
    },
    subtitle: {
      ar: 'خاطرة فجر — تأمُّل في حديث «لا يَنظُرُ إلى أَجسامِكُم ولكن إلى قُلوبِكُم وأَعمالِكُم»',
      en: "A Fajr reflection on the hadith 'Allah does not look at your bodies, but at your hearts and your deeds'",
      es: 'Una reflexión del Fajr sobre el hadiz «Dios no mira vuestros cuerpos, sino vuestros corazones y vuestras obras»',
    },
    excerpt: {
      ar: 'في حديث أبي هريرة رضي الله عنه: «إنَّ اللهَ لا يَنظُرُ إلى أَجسامِكُم ولا إلى صُوَرِكُم، ولكِنْ يَنظُرُ إلى قُلوبِكُم وأَعمالِكُم». تأمُّلٌ في الرُّكنَين اللَّذَين لا يَستَغني المُؤمِنُ عن أَحَدِهِما: النِّيَّةِ في القَلب، والعَمَلِ الَّذي يُثمِر في الحياة. فما المُؤمِنُ إلَّا أَداةٌ لفِعلِ الطَّيِّباتِ وإِنجازِ الصَّالِحات.',
      en: "A reflection on the hadith of Abū Hurayrah: 'Allah does not look at your bodies or your forms, but at your hearts and your deeds.' Two pillars the believer cannot do without: the intention in the heart, and the action that bears fruit in life. The believer is naught but an instrument for performing the good and accomplishing the righteous.",
      es: 'En el hadiz de Abū Hurayra: «En verdad, Dios no mira vuestros cuerpos ni vuestras figuras, sino que mira vuestros corazones y vuestras obras.» Una reflexión sobre los dos pilares de los que el creyente no puede prescindir: la intención en el corazón, y la obra que fructifica en la vida. Pues el creyente no es sino un instrumento para hacer el bien y realizar las buenas obras.',
    },
    videoUrl: 'https://youtu.be/pnzhOumcc2s',
  },
];

export function getKhatraMeta(slug: string): KhatraMeta | undefined {
  return khawatirMeta.find((k) => k.slug === slug);
}

export function getAllKhawatir(): KhatraMeta[] {
  return [...khawatirMeta]
    .filter((k) => !k.draft)
    .sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));
}

export const prayerLabels = {
  ar: {
    fajr: 'الفَجر',
    isha: 'العِشاء',
  },
  en: {
    fajr: 'Fajr',
    isha: 'Isha',
  },
  es: {
    fajr: 'Fajr',
    isha: 'Isha',
  },
} as const;

/**
 * Convert a YouTube watch URL (or shortened form) to an embed URL.
 * Returns null if the URL is not recognized.
 */
export function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  // Shortened: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // Already an embed URL
  if (url.includes('youtube.com/embed/')) return url;
  return null;
}
