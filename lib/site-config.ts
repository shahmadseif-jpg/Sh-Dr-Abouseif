/**
 * Site-wide configuration
 * Edit these values to customize the site without touching components.
 */

export const siteConfig = {
  // Identity
  name: {
    ar: 'د. أحمد أبو سيف',
    en: 'Dr. Ahmed Abouseif',
  },
  url: 'https://drahmedabouseif.com', // Update when domain is ready

  // YouTube channel
  youtube: {
    channelId: 'UChw7t6ZmMevZQYpZ83XkSbA',
    handle: '@sh.ahmadseif',
    url: 'https://www.youtube.com/@sh.ahmadseif',
  },

  // Stats (update these manually when they change significantly)
  stats: {
    lectures: 2600,
    years: 15,
    subscribers: 88500, // Combined: YouTube (2.5K) + Facebook (86K)
    languages: 2,
  },

  // Social media
  social: {
    youtube: 'https://www.youtube.com/@sh.ahmadseif',
    facebook: 'https://www.facebook.com/AhmedAbouseif0',
    telegram: 'https://t.me/DrAhmedAbouseif',
    twitter: '', // Add when ready
    instagram: '', // Add when ready
  },

  // Contact
  contact: {
    email: 'admin@imamsacademy.com',
    academy: 'https://imamsacademy.com', // Update if different
  },

  // Recording locations (for Events page)
  locations: [
    { name: 'American Imams Academy (AIA)', nameAr: 'أكاديمية الأئمة الأمريكية', shortCode: 'AIA' },
    { name: 'Bayt Al-Karim Islamic Center', nameAr: 'مسجد بيت الكريم', shortCode: 'Bayt Al-Karim' },
    { name: 'Islamic Center of Greater Knoxville', nameAr: 'المركز الإسلامي', shortCode: 'ICGK' },
    { name: 'Woodbridge Masjid', nameAr: 'مسجد وودبريدج', shortCode: 'Woodbridge' },
  ],
};
