/**
 * Khawatir (dawah reflections) metadata — safe to import in client components.
 * For file content loading (uses fs), see lib/khawatir-server.ts
 */

export type Prayer = 'fajr' | 'isha';

export interface KhatraMeta {
  slug: string;
  prayer: Prayer;
  isoDate: string; // YYYY-MM-DD
  date: { ar: string; en: string };
  readingMinutes: number;
  title: { ar: string; en: string };
  subtitle?: { ar: string; en: string };
  excerpt: { ar: string; en: string };
  /** YouTube watch URL (or any embeddable video URL) */
  videoUrl?: string;
  /** Optional override for the video thumbnail */
  videoThumbnail?: string;
  draft?: boolean;
}

export const khawatirMeta: KhatraMeta[] = [
  // الخواطر ستضاف هنا بمجرد جهوزية التفريغ النصي
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
