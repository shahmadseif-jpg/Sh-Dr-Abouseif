/**
 * Lecture counter — produces a continually-growing count
 * that reflects Dr. Ahmed's ongoing weekly teaching output.
 *
 * Baseline: 23,974 lectures as of May 13, 2026
 *   (estimated based on ~30 years × ~52 weeks × ~22 weekly lectures
 *    across mosque, academy, women's classes, youth circles,
 *    Friday khutbahs, and media appearances).
 *
 * Growth: +12 per week (conservative floor; actual output is higher).
 * The number self-updates on every page render, so the website
 * always reflects an up-to-date estimate without manual intervention.
 */

const BASE_LECTURES = 23974;
const BASE_DATE_MS = new Date('2026-05-13T00:00:00Z').getTime();
const WEEKLY_INCREMENT = 12;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export function getEstimatedLectureCount(now: number = Date.now()): number {
  const elapsedMs = Math.max(0, now - BASE_DATE_MS);
  const weeksElapsed = Math.floor(elapsedMs / MS_PER_WEEK);
  return BASE_LECTURES + weeksElapsed * WEEKLY_INCREMENT;
}
