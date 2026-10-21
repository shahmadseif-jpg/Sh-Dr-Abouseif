/**
 * Response security headers (audit HEADERS-01 / LIVE-HARDENING-01 / SEC-02).
 *
 * Applied to every route by next.config.js `headers()`. HSTS is NOT set here:
 * Vercel already sends `strict-transport-security: max-age=63072000` on every
 * response and that must stay as it is.
 *
 * Content-Security-Policy is shipped in two parts:
 *  1. An ENFORCED policy that contains only `frame-ancestors 'self'`
 *     (anti-clickjacking). `frame-ancestors` is ignored inside a Report-Only
 *     policy, so it has to live in the enforced header to have any effect; it
 *     restricts nothing else on the page.
 *  2. The full resource policy in Content-Security-Policy-Report-Only. Browsers
 *     only log violations to the console; nothing is blocked. Enforcing it is a
 *     follow-up after a monitoring period (and ideally a report endpoint).
 *
 * Why 'unsafe-inline' in script-src: the App Router streams its RSC payload in
 * inline <script> tags and the pages are statically generated, so per-request
 * nonces are not possible without making every page dynamic. JSON-LD blocks
 * are `type="application/ld+json"` and are not executed.
 *
 * Origins and what needs them:
 *  - fonts.googleapis.com (stylesheet) / fonts.gstatic.com (font files)
 *  - plausible.io: analytics script + its event POST
 *  - i.ytimg.com / yt3.ggpht.com: video thumbnails (also next.config remotePatterns)
 *  - www.youtube.com / www.youtube-nocookie.com: khawatir video embeds
 *  - www.facebook.com: Page plugin iframe on the home page
 *  - formsubmit.co: reader forms POST with fetch (connect-src); form-action
 *    allows it too in case a form ever falls back to a native submit.
 */

const reportOnlyPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://plausible.io",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://i.ytimg.com https://yt3.ggpht.com",
  "media-src 'self'",
  "connect-src 'self' https://formsubmit.co https://plausible.io",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.facebook.com",
  "form-action 'self' https://formsubmit.co",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ');

// Only powerful features the site never uses are denied. Features delegated to
// the YouTube and Facebook iframes through their `allow` attributes
// (autoplay, encrypted-media, picture-in-picture, clipboard-write, web-share,
// accelerometer, gyroscope, fullscreen) are deliberately not listed, because a
// top-level `feature=()` would also switch them off inside those embeds.
const permissionsPolicy = [
  'camera=()',
  'microphone=()',
  'geolocation=()',
  'payment=()',
  'usb=()',
  'magnetometer=()',
  'browsing-topics=()',
].join(', ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: permissionsPolicy },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
  { key: 'Content-Security-Policy-Report-Only', value: reportOnlyPolicy },
];

module.exports = { securityHeaders, reportOnlyPolicy, permissionsPolicy };
