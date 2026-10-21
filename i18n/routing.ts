import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['ar', 'en', 'es', 'ur'],
  defaultLocale: 'ar',
  localeDetection: true,
  // The middleware's HTTP `Link` alternates always list all four locales for
  // every path, which contradicts the per-page hreflang (only languages that
  // really have the text; see lib/seo.ts). Alternates are declared once, in
  // the HTML head, by each page.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);
