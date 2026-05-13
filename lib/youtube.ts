/**
 * YouTube channel integration via public RSS feed.
 * No API key required, no rate limits.
 * Returns the latest 15 videos by default.
 */

import { XMLParser } from 'fast-xml-parser';
import { siteConfig } from './site-config';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  language?: 'ar' | 'en';
}

/**
 * Detect video language from title.
 * Arabic videos usually have Arabic characters; English ones don't.
 */
function detectLanguage(title: string): 'ar' | 'en' {
  // If title contains Arabic Unicode range, it's Arabic
  return /[؀-ۿ]/.test(title) ? 'ar' : 'en';
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

      return {
        id: videoId,
        title: typeof title === 'string' ? title : title['#text'] || '',
        description:
          typeof description === 'string' ? description.slice(0, 200) : '',
        publishedAt: entry.published || '',
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        language: detectLanguage(typeof title === 'string' ? title : title['#text'] || ''),
      };
    });

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
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
