import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['ar', 'en', 'es', 'ur'],
  defaultLocale: 'ar',
  localeDetection: true,
  // The middleware's HTTP `Link` alternates always list all four locales for
  // every path, which contradicts the per-page hreflang (only languages that
  // really have the text; see lib/seo.ts). Alternates are declared once, in
  // the HTML head, by each page.
  alternateLinks: false,
  // next-intl v4 made NEXT_LOCALE a session cookie; keep the one-year cookie
  // that production sends today (Max-Age=31536000, SameSite=lax).
  localeCookie: { maxAge: 60 * 60 * 24 * 365 },
});

export type Locale = (typeof routing.locales)[number];

// next-intl v4: createNavigation replaces createSharedPathnamesNavigation
// (same shared-pathname behaviour; `redirect` now takes { href, locale }).
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
