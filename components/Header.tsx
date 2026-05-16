'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useState } from 'react';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/lectures', label: t('lectures') },
    { href: '/articles', label: t('articles') },
    { href: '/events', label: t('events') },
    { href: '/gallery', label: t('gallery') },
    { href: '/consultations', label: t('consultations'), highlight: true },
    { href: '/contact', label: t('contact') },
  ];

  const otherLocale = locale === 'ar' ? 'en' : 'ar';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-container items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-navy-600 text-white text-sm font-medium">
            {locale === 'ar' ? 'أ' : 'A'}
          </div>
          <div className="leading-tight">
            <div className="text-sm font-medium text-navy-700">
              {locale === 'ar' ? 'د. أحمد أبو سيف' : 'Dr. Ahmed Abouseif'}
            </div>
            <div className="text-xs text-navy-500">
              {locale === 'ar' ? 'أكاديمية الأئمة' : 'Imams Academy'}
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm rounded-md transition-colors no-underline ${
                  item.highlight
                    ? isActive
                      ? 'bg-gold-400 text-navy-900'
                      : 'bg-gold-50 text-gold-700 hover:bg-gold-100 border border-gold-200'
                    : isActive
                    ? 'text-navy-700 bg-navy-50'
                    : 'text-navy-600 hover:text-navy-700 hover:bg-navy-50/60'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={pathname}
            locale={otherLocale}
            className="ms-2 px-3 py-2 text-sm border border-navy-200 rounded-md text-navy-600 hover:bg-navy-50 transition-colors no-underline"
          >
            {t('language')}
          </Link>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-navy-600"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-navy-100 bg-white">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm rounded-md text-navy-600 hover:bg-navy-50 no-underline"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={pathname}
              locale={otherLocale}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-sm rounded-md border border-navy-200 text-navy-600 mt-2 no-underline text-center"
            >
              {t('language')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
