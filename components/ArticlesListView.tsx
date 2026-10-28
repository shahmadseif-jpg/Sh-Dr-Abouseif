'use client';

// Rendering half of ArticlesList (see that file for why the split exists).
// Keeps the full localized index for filters; only one page of cards is mounted.
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ARTICLES_PER_PAGE, articlePageCount, articlePagePath } from '@/lib/article-pagination';
import { normalize } from '@/lib/search-normalize';

export interface ArticleCardData {
  slug: string;
  titleLocale: string;
  excerptLocale: string;
  arabicFallback: boolean;
  title: string;
  excerpt: string;
  date: string;
  /** Formatted reading time. */
  minutes: string;
  /** Episode number when shown inside a series group. */
  episode: number | null;
}

export interface ArticleGroup {
  cat: string;
  label: string;
  desc: string;
  countText: string;
  seriesGroups: { key: string; title: string; items: ArticleCardData[] }[];
  standalone: ArticleCardData[];
  total: number;
}

function ArticleCard({
  article,
  locale,
  readMore,
  epLabel,
}: {
  article: ArticleCardData;
  locale: string;
  readMore: string;
  epLabel: string;
}) {
  return (
    <Link
      href={`/${locale}/articles/${article.slug}`}
      data-article-card
      className="bg-white border border-navy-100 rounded-lg p-6 card-hover flex flex-col group"
    >
      {article.arabicFallback && (
        <span className="text-xs text-navy-600 bg-navy-50 rounded px-2 py-1 mb-3 self-start" lang={locale}>
          {locale === 'es' ? 'Original árabe; traducción no disponible' : locale === 'ur' ? 'عربی اصل؛ ترجمہ دستیاب نہیں' : locale === 'en' ? 'Arabic original; translation unavailable' : 'الأصل العربي؛ الترجمة غير متاحة'}
        </span>
      )}
      {article.episode != null && (
        <div className="text-xs font-medium text-gold-700 mb-2">
          {epLabel} {article.episode}
        </div>
      )}

      <h3 lang={article.titleLocale} dir={['ar', 'ur'].includes(article.titleLocale) ? 'rtl' : 'ltr'} className="text-lg font-medium text-navy-700 leading-snug mb-3 group-hover:text-gold-600 transition-colors">
        {article.title}
      </h3>

      <p lang={article.excerptLocale} dir={['ar', 'ur'].includes(article.excerptLocale) ? 'rtl' : 'ltr'} className="text-sm text-navy-600 leading-relaxed mb-4 line-clamp-4 flex-1">
        {article.excerpt}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-navy-100">
        <div className="text-xs text-navy-500 flex items-center gap-2">
          <span>{article.date}</span>
          <span className="text-gold-300" aria-hidden="true">•</span>
          <span>{article.minutes}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 group-hover:text-gold-500 transition-colors">
          {readMore}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {locale === 'ar' || locale === 'ur' ? <path d="M9 3L5 7l4 4" /> : <path d="M5 3l4 4-4 4" />}
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function ArticlesListView({ groups, initialPage }: { groups: ArticleGroup[]; initialPage: number }) {
  const locale = useLocale();
  const ui = useTranslations('ui');
  const readMore = ui('readArticle');
  const epLabel = ui('episode');
  const t = useTranslations('articlePagination');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(initialPage);
  const heading = useRef<HTMLHeadingElement>(null);
  const allRows = useMemo(() => groups.flatMap(g => [
    ...g.seriesGroups.flatMap(s => s.items.map(a => ({ article: a, cat: g.cat, series: s.title }))),
    ...g.standalone.map(a => ({ article: a, cat: g.cat, series: '' })),
  ]), [groups]);
  const filtered = useMemo(() => {
    const terms = normalize(query).split(' ').filter(Boolean);
    return allRows.filter(r => (category === 'all' || r.cat === category) &&
      terms.every(term => normalize([r.article.title, r.article.excerpt, r.series].join(' ')).includes(term)));
  }, [allRows, category, query]);
  const pages = articlePageCount(filtered.length);
  const current = Math.min(Math.max(1, page), pages);
  const selected = new Set(filtered.slice((current - 1) * ARTICLES_PER_PAGE, current * ARTICLES_PER_PAGE).map(r => r.article.slug));
  const visibleGroups = groups.map(g => ({ ...g,
    seriesGroups: g.seriesGroups.map(s => ({ ...s, items: s.items.filter(a => selected.has(a.slug)) })).filter(s => s.items.length),
    standalone: g.standalone.filter(a => selected.has(a.slug)),
  })).filter(g => g.seriesGroups.length || g.standalone.length);

  // Query/filter state is an enhancement over static archive URLs. A plain
  // browser can still browse every archive page and the compact full index.
  const urlFor = useCallback((n: number, q = query, cat = category) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (cat !== 'all') params.set('category', cat);
    if (q || cat !== 'all') {
      if (n > 1) params.set('page', String(n));
      return `/${locale}/articles?${params}` + (cat !== 'all' ? `#cat-${cat}` : '');
    }
    return `/${locale}${articlePagePath(n)}`;
  }, [locale, query, category]);
  useEffect(() => {
    const read = () => {
      const url = new URL(window.location.href);
      const requestedCat = url.searchParams.get('category') || url.hash.replace(/^#cat-/, '');
      const cat = groups.some(g => g.cat === requestedCat) ? requestedCat : 'all';
      const q = url.searchParams.get('q') || '';
      const raw = url.searchParams.get('page') || url.pathname.match(/\/articles\/page\/(\d+)$/)?.[1] || '1';
      const requestedPage = /^[1-9]\d*$/.test(raw) ? Number(raw) : 1;
      setCategory(cat); setQuery(q); setPage(requestedPage);
    };
    read();
    window.addEventListener('popstate', read);
    window.addEventListener('hashchange', read);
    return () => { window.removeEventListener('popstate', read); window.removeEventListener('hashchange', read); };
  }, [groups]);
  useEffect(() => {
    if (page !== current) {
      setPage(current);
      window.history.replaceState(null, '', urlFor(current));
    }
  }, [page, current, urlFor]);
  // History-only paging keeps filters instant. Keep head URLs aligned with
  // the equivalent prebuilt archive; filtered views canonicalize to the index.
  useEffect(() => {
    const path = query || category !== 'all' ? '/articles' : articlePagePath(current);
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      const url = new URL(canonical.href); url.pathname = `/${locale}${path}`;
      canonical.href = url.href;
      document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', url.href);
    }
    document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]').forEach(link => {
      const lang = link.hreflang === 'x-default' ? 'ar' : link.hreflang;
      const url = new URL(link.href); url.pathname = `/${lang}${path}`; link.href = url.href;
    });
    document.title = t('pageTitle', { page: current });
  }, [current, query, category, locale, t]);
  const go = (n: number) => {
    const target = Math.min(Math.max(n, 1), pages);
    if (target === current) return;
    window.history.pushState(null, '', urlFor(target));
    setPage(target);
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'start' }); });
  };
  const changeFilter = (q: string, cat: string, replace = false) => {
    setQuery(q); setCategory(cat); setPage(1);
    window.history[replace ? 'replaceState' : 'pushState'](null, '', urlFor(1, q, cat));
  };
  const resultLabel = t('results', { countText: ui('articleCount', { count: filtered.length, n: filtered.length.toLocaleString(locale) }), page: current.toLocaleString(locale), pages: pages.toLocaleString(locale) });
  const pageNumbers = [...new Set([1, current - 1, current, current + 1, pages])].filter(n => n >= 1 && n <= pages).sort((a,b) => a-b);
  const pager = (
    <nav aria-label={t('navigation')} className="flex flex-wrap items-center justify-center gap-2 my-8" data-article-pagination>
      <a href={urlFor(Math.max(1, current - 1))} rel="prev" aria-disabled={current === 1} tabIndex={current === 1 ? -1 : undefined} onClick={e => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); go(current - 1); }} className="min-h-[44px] inline-flex items-center px-4 border border-navy-200 rounded no-underline text-navy-700 aria-disabled:opacity-40">{t('previous')}</a>
      {pageNumbers.map((n, i) => <span key={n} className="inline-flex items-center gap-2">
        {i > 0 && n > pageNumbers[i - 1] + 1 && <span aria-hidden="true">…</span>}
        <a href={urlFor(n)} aria-current={n === current ? 'page' : undefined} onClick={e => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault(); go(n);
        }} className={`min-w-[44px] min-h-[44px] inline-flex items-center justify-center border rounded no-underline ${n === current ? 'bg-navy-700 text-white border-navy-700' : 'border-navy-200 text-navy-700'}`}>
          <span className="sr-only">{t('page')} </span>{n.toLocaleString(locale)}
        </a>
      </span>)}
      <a href={urlFor(Math.min(pages, current + 1))} rel="next" aria-disabled={current === pages} tabIndex={current === pages ? -1 : undefined} onClick={e => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); go(current + 1); }} className="min-h-[44px] inline-flex items-center px-4 border border-navy-200 rounded no-underline text-navy-700 aria-disabled:opacity-40">{t('next')}</a>
    </nav>
  );


  return (
    <div>
      <div className="mb-8 grid sm:grid-cols-2 gap-4">
        <label className="text-sm text-navy-700">{t('search')}
          <input type="search" value={query} onChange={e => changeFilter(e.target.value, category, true)} className="mt-2 block w-full min-h-[44px] px-3 border border-navy-200 rounded" />
        </label>
        <div className="text-sm text-navy-700"><label htmlFor="article-category">{t('category')}</label>
          <select id="article-category" value={category} onChange={e => changeFilter(query, e.target.value)} className="mt-2 block w-full min-h-[44px] px-3 border border-navy-200 rounded">
            <option value="all">{t('all')}</option>
            {groups.map(g => <option value={g.cat} key={g.cat}>{g.label}</option>)}
          </select>
        </div>
      </div>
      <h2 ref={heading} tabIndex={-1} className="text-base text-navy-700 scroll-mt-24 outline-none" data-article-results>{resultLabel}</h2>
      <p role="status" aria-live="polite" className="sr-only">{resultLabel}</p>
      {pager}
      {filtered.length === 0 && <p className="py-8 text-navy-600">{t('empty')}</p>}
      <div className="space-y-16">
      {visibleGroups.map(({ cat, label, desc, countText, seriesGroups, standalone }) => (
        <section key={cat} id={`results-cat-${cat}`} className="scroll-mt-24">
          {/* Section heading */}
          {cat === 'fiqh' ? (
            <div className="mb-6 px-5 py-4 bg-gold-50 border border-gold-200 rounded-lg">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-medium text-navy-700">
                    {label}
                  </h2>
                  <span className="text-xs font-semibold bg-gold-400 text-navy-900 px-3 py-1 rounded-full whitespace-nowrap">
                    {ui('muslimsWest')}
                  </span>
                </div>
                <span className="text-xs text-navy-500 whitespace-nowrap">
                  {countText}
                </span>
              </div>
              <p className="mt-2 text-sm text-navy-600 leading-relaxed">
                {desc}
              </p>
            </div>
          ) : (
            <div className="mb-6 pb-4 border-b border-navy-100">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-2xl font-medium text-navy-700">
                  {label}
                </h2>
                <span className="text-xs text-navy-500 whitespace-nowrap">
                  {countText}
                </span>
              </div>
              <p className="mt-1 text-sm text-navy-500 leading-relaxed">
                {desc}
              </p>
            </div>
          )}

          <div className="space-y-10">
            {/* Series sub-groups */}
            {seriesGroups.map((sg) => (
              <div key={sg.key}>
                <h3 className="text-base font-semibold text-gold-700 mb-4 flex items-center gap-2">
                  <span className="inline-block w-6 h-px bg-gold-300" aria-hidden="true" />
                  {sg.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sg.items.map((article) => (
                    <ArticleCard key={article.slug} article={article} locale={locale} readMore={readMore} epLabel={epLabel} />
                  ))}
                </div>
              </div>
            ))}

            {/* Standalone articles */}
            {standalone.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {standalone.map((article) => (
                  <ArticleCard key={article.slug} article={article} locale={locale} readMore={readMore} epLabel={epLabel} />
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      </div>
      {pager}
      <noscript>
        <p>{t('noScript')}</p>
        {groups.map(g => <section key={g.cat} id={`cat-${g.cat}`}>
          <h2>{g.label}</h2>
          <ul>{[...g.seriesGroups.flatMap(s => s.items), ...g.standalone].map(a => <li key={a.slug}><a href={`/${locale}/articles/${a.slug}`} lang={a.titleLocale} dir={['ar','ur'].includes(a.titleLocale) ? 'rtl' : 'ltr'}>{a.title}</a></li>)}</ul>
        </section>)}
      </noscript>
    </div>
  );
}
