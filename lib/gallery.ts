/**
 * Gallery metadata — safe to import in client components.
 * Place actual image files in /public/gallery/
 */

export type GalleryCategory =
  | 'lectures'
  | 'events'
  | 'academy'
  | 'community'
  | 'media';

export interface GalleryItem {
  /** Path relative to /public, e.g. "/gallery/khutba-2024.jpg" */
  src: string;
  /** Short alt text (accessibility, SEO) */
  alt: { ar: string; en: string };
  /** Optional descriptive caption shown to the user */
  caption?: { ar: string; en: string };
  /** ISO date (YYYY-MM-DD) for sorting */
  isoDate?: string;
  /** Optional location text */
  location?: { ar?: string; en?: string };
  /** Category for filtering */
  category: GalleryCategory;
  /** Optional intrinsic dimensions (improves layout stability) */
  width?: number;
  height?: number;
  /** If true, hide from gallery */
  draft?: boolean;
}

/**
 * Master list of gallery items.
 * To add a photo:
 *   1. Place the file in /public/gallery/ (e.g. /public/gallery/khutba-aia-2024.jpg)
 *   2. Add a new object below with metadata
 *
 * NOTE: This list is intentionally empty until curated photos are uploaded.
 */
export const galleryItems: GalleryItem[] = [];

export function getGalleryItems(): GalleryItem[] {
  return [...galleryItems]
    .filter((g) => !g.draft)
    .sort((a, b) => {
      if (!a.isoDate && !b.isoDate) return 0;
      if (!a.isoDate) return 1;
      if (!b.isoDate) return -1;
      return a.isoDate < b.isoDate ? 1 : -1;
    });
}

export function getGalleryByCategory(category: GalleryCategory): GalleryItem[] {
  return getGalleryItems().filter((g) => g.category === category);
}

export const galleryCategories: GalleryCategory[] = [
  'lectures',
  'events',
  'academy',
  'community',
  'media',
];
