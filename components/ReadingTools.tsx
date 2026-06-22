'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLocale } from 'next-intl';

/**
 * Reading aids for long-form pages (articles, research):
 *  - a slim top reading-progress bar
 *  - font-size controls (A- / A / A+) applied to `.article-prose`, persisted.
 * Purely client-side, additive; no layout changes to the page itself.
 */
export default function ReadingTools() {
  const locale = useLocale();
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0); // -1, 0, 1, 2

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

  const apply = useCallback((s: number) => {
    const scale = [0.92, 1, 1.14, 1.28][s + 1] ?? 1;
    document.querySelectorAll<HTMLElement>('.article-prose').forEach((el) => {
      el.style.fontSize = `${scale}em`;
    });
    try {
      localStorage.setItem('reading-font-step', String(s));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let s = 0;
    try {
      const v = localStorage.getItem('reading-font-step');
      if (v !== null) s = Math.max(-1, Math.min(2, parseInt(v, 10)));
    } catch {
      /* ignore */
    }
    setStep(s);
    apply(s);
  }, [apply]);

  const change = (delta: number) => {
    const s = Math.max(-1, Math.min(2, step + delta));
    setStep(s);
    apply(s);
  };

  const isAr = locale === 'ar';
  const sideClass = isAr ? 'left-4' : 'right-4';
  const label =
    locale === 'ar' ? 'حجم الخط' : locale === 'es' ? 'Tamaño' : 'Text size';

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 inset-x-0 z-50 h-1 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gold-500 transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Font-size control */}
      <div
        className={`fixed bottom-5 ${sideClass} z-40 flex items-center gap-1 rounded-full border border-navy-200 bg-white/95 backdrop-blur px-2 py-1 shadow-md`}
        aria-label={label}
      >
        <button
          onClick={() => change(-1)}
          disabled={step <= -1}
          className="h-8 w-8 rounded-full text-navy-600 hover:bg-navy-50 disabled:opacity-30 text-sm"
          aria-label="A-"
        >
          A−
        </button>
        <span className="text-[10px] text-navy-400 select-none">{label}</span>
        <button
          onClick={() => change(1)}
          disabled={step >= 2}
          className="h-8 w-8 rounded-full text-navy-700 hover:bg-navy-50 disabled:opacity-30 text-base font-medium"
          aria-label="A+"
        >
          A+
        </button>
      </div>
    </>
  );
}
