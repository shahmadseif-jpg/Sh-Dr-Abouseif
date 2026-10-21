'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

/**
 * Floating "Ask the Sheikh" shortcut.
 * - Uses the locale-aware Link so /es and /ur keep their prefix (NAV-01).
 * - Sits on the inline-end side; ReadingTools sits on the inline-start side
 *   and is lifted above this button on narrow screens, so the two never
 *   overlap (ROOT-UI-01).
 */
export default function QAFloatingButton() {
  const pathname = usePathname();
  const t = useTranslations('ui');

  // Hide on the Q&A pages themselves
  if (pathname === '/qa' || pathname.startsWith('/qa/')) return null;

  const label = t('askSheikh');

  return (
    <Link
      href="/qa"
      data-qa-fab=""
      className={
        'fixed bottom-6 end-4 sm:end-6 z-50 flex min-h-[44px] items-center gap-2 rounded-full shadow-lg no-underline print:hidden ' +
        'bg-gold-400 hover:bg-gold-300 text-navy-900 font-semibold text-sm px-5 py-3 ' +
        'transition-all duration-200 hover:scale-105 hover:shadow-xl'
      }
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
