/**
 * YouTube channel integration via public RSS feed.
 * No API key required, no rate limits.
 * Returns the latest 15 videos by default.
 */

import { XMLParser } from 'fast-xml-parser';
import { siteConfig } from './site-config';

export type VideoType = 'lecture' | 'khutbah' | 'khatira';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  /** Lower-res 4:3 fallback shown behind the 16:9 maxres thumbnail
   *  in case the video has no maxresdefault image. */
  thumbnailFallback: string;
  url: string;
  language?: 'ar' | 'en';
  type?: VideoType;
  /** True if the video is presented by Dr. Ahmed Abouseif
   *  (solo or jointly). False if another speaker is named instead. */
  isOwn?: boolean;
}

/**
 * Name variants that identify Dr. Ahmed Abouseif as the speaker.
 * If any of these match, the video is included (covers solo videos AND
 * joint meetings where his name appears alongside other speakers).
 */
const OWN_NAME_PATTERNS: RegExp[] = [
  /أحمد\s+محمد\s+علي\s+أبو\s+سيف/,
  /أحمد\s+أبو\s*سيف/,
  /أحمد\s+سيف/,
  /\babou?\s*seif\b/i,
  /ahmed\s+abou?\s*seif/i,
  /sh\.?\s*ahmad?\s+seif/i,
  /\babouseif\b/i,
];

/**
 * Patterns indicating ANOTHER named speaker. When matched without
 * Dr. Abouseif's name also being present, the video is excluded.
 */
const OTHER_SPEAKER_PATTERNS: RegExp[] = [
  /\bbr\.\s/i,        // "Br. " (Brother)
  /\bsr\.\s/i,        // "Sr. " (Sister)
  /\bbro\.\s/i,       // "Bro. "
  /الأخ\s+\S+/,       // الأخ + اسم
  /الأخت\s+\S+/,      // الأخت + اسم
  // Independent khutbah by a guest speaker (not Dr. Abouseif).
  // Note: joint works (e.g. with Dr. Abdul-Bari Mish'al) are intentionally kept.
  /عماد\s*فاضل/,      // د. عماد فاضل
  /\bfadh?[ei]l\b/i,  // "Fadhel" / "Fadel" (English transliteration)
];

/**
 * Detect video language from title.
 * Arabic videos usually have Arabic characters; English ones don't.
 */
function detectLanguage(title: string): 'ar' | 'en' {
  // If title contains Arabic Unicode range, it's Arabic
  return /[؀-ۿ]/.test(title) ? 'ar' : 'en';
}

/**
 * Detect video type (lecture / khutbah / khatira) from title.
 * Order matters: khatira and khutbah are checked before lecture,
 * because some khatira/khutbah titles also include the word "lecture".
 */
function detectType(title: string): VideoType {
  const t = title.toLowerCase();

  // Khatira (short morning reflections)
  if (
    /خاطرة|خواطر/.test(title) ||
    /\bkhatira\b|\bkhatirah\b|\bkhatiras\b|fajr khatira/i.test(title)
  ) {
    return 'khatira';
  }

  // Khutbah (Friday sermon)
  if (
    /خطبة|خطب الجمعة|الجمعة/.test(title) ||
    /\bkhutbah\b|\bkhutba\b|\bjumu[ao]?h?\b|friday sermon/i.test(title)
  ) {
    return 'khutbah';
  }

  // Default to lecture (covers Isha Lecture, general lectures, talks, etc.)
  return 'lecture';
}

/**
 * Decide whether the video should be shown on Dr. Abouseif's personal site.
 * Rule:
 *   1. If his name appears in the title  → include (covers solo + joint).
 *   2. Else, if another speaker is named → exclude.
 *   3. Otherwise (no speaker named)      → include (default; most general
 *      lectures on his channel have no speaker tag in the title).
 */
export function isOwnContent(title: string): boolean {
  if (OWN_NAME_PATTERNS.some((p) => p.test(title))) return true;
  if (OTHER_SPEAKER_PATTERNS.some((p) => p.test(title))) return false;
  return true;
}

/**
 * Fetch latest videos from YouTube channel via RSS.
 * Cached for 1 hour to avoid hitting YouTube too often.
 */
export async function fetchLatestVideos(limit = 6): Promise<YouTubeVideo[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${siteConfig.youtube.channelId}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Failed to fetch YouTube RSS: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });

    const parsed = parser.parse(xml);
    const entries = parsed?.feed?.entry || [];
    const entriesArray = Array.isArray(entries) ? entries : [entries];

    const videos: YouTubeVideo[] = entriesArray.slice(0, limit).map((entry: any) => {
      const videoId = entry['yt:videoId'] || '';
      const title = entry.title || '';
      const description =
        entry['media:group']?.['media:description'] || entry.description || '';

      const titleText = typeof title === 'string' ? title : title['#text'] || '';
      return {
        id: videoId,
        title: titleText,
        description:
          typeof description === 'string' ? description.slice(0, 200) : '',
        publishedAt: entry.published || '',
        thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        thumbnailFallback: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        language: detectLanguage(titleText),
        type: detectType(titleText),
        isOwn: isOwnContent(titleText),
      };
    });

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}

/**
 * Convenience: fetch the latest videos and keep only Dr. Abouseif's own
 * content (solo or jointly presented). YouTube RSS returns at most 15
 * entries, so we fetch the max and then trim to `limit` after filtering.
 */
export async function fetchLatestOwnVideos(limit = 6): Promise<YouTubeVideo[]> {
  const all = await fetchLatestVideos(15); // RSS hard cap
  return all.filter((v) => v.isOwn !== false).slice(0, limit);
}

/**
 * Format date for display in either locale.
 */
export function formatDate(dateString: string, locale: 'ar' | 'en'): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}
