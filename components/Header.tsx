'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useEffect, useRef, useState } from 'react';

export default function Header() {
  const t = useTranslations('nav');
  const ui = useTranslations('ui');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  // `compact` collapses the desktop bar into the menu button whenever the
  // bar would not fit in one row (long translations, text zoom). CSS shows
  // the bar from 1280px (xl); this measurement is the safety net (ROOT-UI-03).
  const [compact, setCompact] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    const brand = brandRef.current;
    const measure = measureRef.current;
    if (!row || !brand || !measure) return;
    const check = () => {
      const cs = getComputedStyle(row);
      const inner = row.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const needed = brand.getBoundingClientRect().width + 16 + measure.scrollWidth;
      setCompact(needed > inner);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(row);
    ro.observe(measure);
    document.fonts?.ready.then(check).catch(() => {});
    return () => ro.disconnect();
  }, [locale]);

  // Close the mobile menu with Escape and return focus to its toggle.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const navItems = [
    { href: '/', label: t('home'), mobileOnly: true },
    // The desktop bar uses the short label; the menu shows the full one.
    { href: '/about', label: t('about'), short: t('profile') },
    { href: '/lectures', label: t('lectures') },
    { href: '/articles', label: t('articles') },
    { href: '/khawatir', label: t('khawatir') },
    { href: '/research', label: t('research') },
    { href: '/events', label: t('events') },
    { href: '/consultations', label: t('consultations'), highlight: true },
    { href: '/qa', label: t('qa'), highlight: true },
    { href: '/contact', label: t('contact') },
  ];

  // Each language is named in its own language for screen readers.
  const langNames: Record<'ar' | 'en' | 'es' | 'ur', string> = {
    ar: 'العربية',
    en: 'English',
    es: 'Español',
    ur: 'اردو',
  };

  const switchLocales: { code: 'ar' | 'en' | 'es' | 'ur'; label: string }[] = [
    { code: 'ar', label: 'ع' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'ur', label: 'UR' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 print:hidden">
      <div
        ref={rowRef}
        className="relative mx-auto flex max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8 h-16"
      >
        {/* Invisible, clipped copy of the desktop bar used only to measure
            the width it needs (never focusable, never announced). */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div ref={measureRef} className="invisible flex w-max items-center gap-0.5 text-sm">
            {navItems
              .filter((i) => !i.mobileOnly)
              .map((i) => (
                <span key={i.href} className="whitespace-nowrap px-2 py-2 border border-transparent">
                  {i.short ?? i.label}
                </span>
              ))}
            <span className="ms-1 w-[34px] shrink-0" />
            <span className="ms-2 w-[140px] shrink-0" />
          </div>
        </div>

        <Link href="/" ref={brandRef} className="flex shrink-0 items-center gap-3 no-underline">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-navy-600 text-white text-sm font-medium" aria-hidden="true">
            {locale === 'ar' || locale === 'ur' ? 'أ' : 'A'}
          </div>
          <div className="leading-tight">
            <div className="text-sm font-medium text-navy-700">
              {ui('siteOwner')}
            </div>
            <div className="text-xs text-navy-500">
              {ui('academyShort')}
            </div>
          </div>
        </Link>

        <nav
          className={`${compact ? 'hidden' : 'hidden xl:flex'} min-w-0 items-center gap-0.5`}
          aria-label={ui('mainNav')}
        >
          {navItems.filter((i) => !i.mobileOnly).map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`whitespace-nowrap px-2 py-2 text-sm rounded-md transition-colors no-underline ${
                  item.highlight
                    ? isActive
                      ? 'bg-gold-400 text-navy-900'
                      : 'bg-gold-50 text-gold-800 hover:bg-gold-100 border border-gold-200'
                    : isActive
                    ? 'text-navy-700 bg-navy-50'
                    : 'text-navy-600 hover:text-navy-700 hover:bg-navy-50/60'
                }`}
              >
                {item.short ?? item.label}
              </Link>
            );
          })}
          <Link
            href="/search"
            aria-label={t('search')}
            title={t('search')}
            className="ms-1 p-2 rounded-md text-navy-600 hover:text-navy-700 hover:bg-navy-50 no-underline"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </Link>
          <div className="ms-2 flex items-center gap-1 border border-navy-200 rounded-md p-0.5" role="group" aria-label={ui('languageSwitcher')}>
            {switchLocales.map((l) => (
              <Link
                key={l.code}
                href={pathname}
                locale={l.code}
                lang={l.code}
                hrefLang={l.code}
                aria-label={langNames[l.code]}
                className={`px-2 py-1 text-xs rounded transition-colors no-underline ${
                  locale === l.code
                    ? 'bg-navy-600 text-white'
                    : 'text-navy-600 hover:bg-navy-50'
                }`}
                aria-current={locale === l.code ? 'true' : undefined}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`${compact ? 'flex' : 'flex xl:hidden'} h-11 w-11 items-center justify-center rounded-md text-navy-600 hover:bg-navy-50`}
          aria-label={mobileOpen ? ui('menuClose') : ui('menuOpen')}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className={`${compact ? '' : 'xl:hidden'} border-t border-navy-100 bg-white`}>
          <nav className="px-4 py-3 flex flex-col gap-1" aria-label={ui('mainNav')}>
            <Link
              href="/search"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 min-h-[44px] text-sm rounded-md text-navy-600 hover:bg-navy-50 no-underline flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              {t('search')}
            </Link>
            {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={(item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)) ? 'page' : undefined}
                  className="px-3 py-2.5 min-h-[44px] flex items-center text-sm rounded-md text-navy-600 hover:bg-navy-50 no-underline"
                >
                  {item.label}
                </Link>
              ))}
            <div className="mt-2 flex items-center justify-center gap-1" role="group" aria-label={ui('languageSwitcher')}>
              {switchLocales.map((l) => (
                <Link
                  key={l.code}
                  href={pathname}
                  locale={l.code}
                  lang={l.code}
                  hrefLang={l.code}
                  aria-label={langNames[l.code]}
                  aria-current={locale === l.code ? 'true' : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`min-h-[44px] min-w-[44px] flex items-center justify-center px-4 py-2 text-sm rounded-md border no-underline ${
                    locale === l.code
                      ? 'bg-navy-600 text-white border-navy-600'
                      : 'border-navy-200 text-navy-600'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
