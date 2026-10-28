/** Normalize text for tolerant matching (Arabic + Latin). */
export function normalize(s: string | undefined): string {
  return (s || '')
    .toLowerCase()
    // strip Arabic diacritics (harakat), superscript alif, and tatweel
    .replace(/[ً-ْٰـ]/g, '')
    // unify alif / ya / waw-hamza / ta-marbuta variants
    .replace(/[آأإا]/g, 'ا') // آأإا -> ا
    .replace(/[ىي]/g, 'ي') // ى ي -> ي
    .replace(/ؤ/g, 'و') // ؤ -> و
    .replace(/ئ/g, 'ي') // ئ -> ي
    .replace(/ة/g, 'ه') // ة -> ه
    .replace(/\s+/g, ' ')
    .trim();
}

