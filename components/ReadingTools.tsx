'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const STEPS = [0.92, 1, 1.14, 1.28];
const MIN = -1;
const MAX = 2;
const STORAGE_KEY = 'reading-font-step';

function readStoredStep(): number {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === null) return 0;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? Math.max(MIN, Math.min(MAX, n)) : 0;
  } catch {
    return 0;
  }
}

/**
 * Reading aids for long-form pages (articles, research):
 *  - a slim top reading-progress bar
 *  - text-size controls (A− / reset / A+).
 *
 * The size is applied through the CSS variable `--reading-scale` on <html>;
 * globals.css scales every `.article-prose` text utility (text-base,
 * sm:text-lg, …) by it, so paragraphs that carry fixed Tailwind sizes
 * actually change (ROOT-UI-02). The choice is kept in localStorage when
 * available and is removed again when the tools unmount.
 */
export default function ReadingTools() {
  const t = useTranslations('ui');
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  // Reading progress
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const apply = useCallback((s: number, persist: boolean) => {
    const scale = STEPS[s - MIN] ?? 1;
    document.documentElement.style.setProperty('--reading-scale', String(scale));
    if (!persist) return;
    try {
      if (s === 0) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, String(s));
    } catch {
      /* storage unavailable: the choice simply lasts for this page view */
    }
  }, []);

  useEffect(() => {
    const s = readStoredStep();
    setStep(s);
    apply(s, false);
    return () => {
      document.documentElement.style.removeProperty('--reading-scale');
    };
  }, [apply]);

  const set = (s: number) => {
    const clamped = Math.max(MIN, Math.min(MAX, s));
    setStep(clamped);
    apply(clamped, true);
  };

  const pct = Math.round((STEPS[step - MIN] ?? 1) * 100);
  const btn =
    'flex h-11 w-11 items-center justify-center rounded-full text-navy-700 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <>
      {/* Top progress bar (decorative) */}
      <div className="fixed top-0 inset-x-0 z-50 h-1 bg-transparent pointer-events-none print:hidden" aria-hidden="true">
        <div
          className="h-full bg-gold-500 transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Text-size control: inline-start side, lifted above the floating
          Ask button on narrow screens so the two never overlap. */}
      <div
        data-reading-tools=""
        role="group"
        aria-label={t('textSize')}
        className="fixed bottom-24 sm:bottom-5 start-4 z-40 flex items-center gap-0.5 rounded-full border border-navy-200 bg-white/95 backdrop-blur px-1 py-0.5 shadow-md print:hidden"
      >
        <button
          type="button"
          onClick={() => set(step - 1)}
          disabled={step <= MIN}
          className={`${btn} text-sm`}
          aria-label={t('textSmaller')}
          data-font-dec=""
        >
          <span aria-hidden="true">A−</span>
        </button>
        <button
          type="button"
          onClick={() => set(0)}
          className={`${btn} w-auto min-w-[44px] px-2 text-xs`}
          aria-label={`${t('textReset')} (${pct}%)`}
          data-font-reset=""
        >
          <span aria-hidden="true">{pct}%</span>
        </button>
        <button
          type="button"
          onClick={() => set(step + 1)}
          disabled={step >= MAX}
          className={`${btn} text-base font-medium`}
          aria-label={t('textLarger')}
          data-font-inc=""
        >
          <span aria-hidden="true">A+</span>
        </button>
        <span className="sr-only" aria-live="polite">
          {t('textSize')}: {pct}%
        </span>
      </div>
    </>
  );
}
