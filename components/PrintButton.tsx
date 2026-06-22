'use client';

/** A small print-to-PDF button for the academic CV page. */
export default function PrintButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-md border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors print:hidden"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
      {label}
    </button>
  );
}
