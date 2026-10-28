/** Shared by prebuilt archives and client controls; never imports content data. */
export const ARTICLES_PER_PAGE = 24;
export const articlePageCount = (total: number) => Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE));
export const articlePagePath = (page: number) => page <= 1 ? '/articles' : `/articles/page/${page}`;
