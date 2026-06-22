'use client';

import { useState } from 'react';

interface Props {
  title: string;
  author?: string;
  year: number | string;
  venue?: string;
  publisher?: string;
  pages?: number;
  doi?: string;
  url: string;
  locale: string;
}

/** "Cite this" panel for research pages: APA / Chicago / BibTeX + copy + Scholar. */
export default function CiteThis({
  title,
  author = 'Abouseif, Ahmed',
  year,
  venue,
  publisher,
  pages,
  doi,
  url,
  locale,
}: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string>('');

  const t =
    locale === 'ar'
      ? { cite: 'استشهد بهذا البحث', apa: 'APA', chicago: 'شيكاغو', bib: 'BibTeX', copy: 'نسخ', done: 'تم النسخ', scholar: 'بحث في Google Scholar' }
      : locale === 'es'
      ? { cite: 'Citar esta investigación', apa: 'APA', chicago: 'Chicago', bib: 'BibTeX', copy: 'Copiar', done: 'Copiado', scholar: 'Buscar en Google Scholar' }
      : { cite: 'Cite this research', apa: 'APA', chicago: 'Chicago', bib: 'BibTeX', copy: 'Copy', done: 'Copied', scholar: 'Search Google Scholar' };

  const src = [venue, publisher].filter(Boolean).join(', ');
  const tail = doi ? `https://doi.org/${doi}` : url;

  const apa = `${author} (${year}). ${title}.${src ? ` ${src}.` : ''} ${tail}`;
  const chicago = `${author}. "${title}." ${src ? `${src}, ` : ''}${year}. ${tail}.`;
  const key = `abouseif${year}`;
  const bibtex =
    `@misc{${key},\n` +
    `  author = {Ahmed Abouseif},\n` +
    `  title = {${title}},\n` +
    `  year = {${year}},\n` +
    (src ? `  howpublished = {${src}},\n` : '') +
    (pages ? `  pages = {${pages}},\n` : '') +
    (doi ? `  doi = {${doi}},\n` : '') +
    `  url = {${url}}\n}`;

  const items: [string, string][] = [
    [t.apa, apa],
    [t.chicago, chicago],
    [t.bib, bibtex],
  ];

  const doCopy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 1800);
    } catch {
      /* ignore */
    }
  };

  const scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`;

  return (
    <div className="my-8 rounded-lg border border-navy-100 bg-navy-50/40 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-5 py-3 text-sm font-medium text-navy-700 hover:bg-navy-50"
      >
        <span className="inline-flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
          {t.cite}
        </span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" className={open ? 'rotate-180 transition' : 'transition'} aria-hidden="true"><path d="M3 5l4 4 4-4" /></svg>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4">
          {items.map(([label, text]) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gold-600">{label}</span>
                <button
                  onClick={() => doCopy(label, text)}
                  className="text-xs text-navy-500 hover:text-gold-600 border border-navy-200 rounded px-2 py-0.5"
                >
                  {copied === label ? t.done : t.copy}
                </button>
              </div>
              <pre dir="ltr" className="text-xs text-navy-700 bg-white border border-navy-100 rounded p-3 whitespace-pre-wrap break-words leading-relaxed text-left">{text}</pre>
            </div>
          ))}
          <a
            href={scholarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-navy-600 hover:text-gold-600"
          >
            {t.scholar} ↗
          </a>
        </div>
      )}
    </div>
  );
}
