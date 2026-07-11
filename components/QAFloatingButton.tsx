'use client';

import { usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function QAFloatingButton() {
  const pathname = usePathname();
  const locale = useLocale();
  const isRtl = locale === 'ar' || locale === 'ur';

  // Hide on the Q&A page itself
  if (pathname === '/qa' || pathname.startsWith('/qa/')) return null;

  const label =
    locale === 'ar' ? 'اسأل الشيخ' :
    locale === 'ur' ? 'شیخ سے پوچھیں' :
    locale === 'es' ? 'Pregunta al Jeque' :
    'Ask the Sheikh';

  return (
    <Link
      href="/qa"
      className={
        'fixed bottom-6 z-50 flex items-center gap-2 rounded-full shadow-lg no-underline print:hidden ' +
        'bg-gold-400 hover:bg-gold-300 text-navy-900 font-semibold text-sm px-5 py-3 ' +
        'transition-all duration-200 hover:scale-105 hover:shadow-xl ' +
        (isRtl ? 'left-6' : 'right-6')
      }
      aria-label={label}
    >
      {/* Question mark icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <span>{label}</span>
    </Link>
  );
}
