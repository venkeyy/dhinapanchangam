import { DateTime } from "luxon";
import type { Lang } from "./site";

/** Local wall-clock time, rounded to the nearest minute (as printed panchangams do). */
export function fmtTime(isoUtc: string, tz: string, baseDate: string, lang: Lang): string {
  const dt = DateTime.fromISO(isoUtc, { zone: tz }).plus({ seconds: 30 }).startOf("minute");
  const time = dt.toFormat("hh:mm a");
  const day = dt.toISODate();
  if (day === baseDate) return time;
  const tag = dt.setLocale(lang === "ta" ? "ta" : "en").toFormat("d MMM");
  return `${time} (${tag})`;
}

export function fmtLongDate(date: string, tz: string, lang: Lang): string {
  return DateTime.fromISO(date, { zone: tz })
    .setLocale(lang === "ta" ? "ta" : "en")
    .toFormat("cccc, d MMMM yyyy");
}

export function fmtShortDate(date: string, tz: string): string {
  return DateTime.fromISO(date, { zone: tz }).setLocale("en").toFormat("d MMM yyyy");
}

/** "15 January 2027" / "15 ஜனவரி 2027", used in date-page titles. */
export function fmtDate(date: string, lang: Lang): string {
  return DateTime.fromISO(date).setLocale(lang === "ta" ? "ta" : "en").toFormat("d MMMM yyyy");
}

/** Today's date (YYYY-MM-DD) in the city's own timezone. */
export const todayIn = (tz: string) => DateTime.now().setZone(tz).toISODate()!;

export const addDays = (date: string, n: number) => DateTime.fromISO(date).plus({ days: n }).toISODate()!;

/** The date a "today"/"tomorrow" page shows, in the city's own timezone. */
export const dateForDay = (day: "today" | "tomorrow", tz: string) => addDays(todayIn(tz), day === "today" ? 0 : 1);

/** True for a real calendar date written as YYYY-MM-DD within [min, max]. */
export function isIsoDate(s: string, min: string, max: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const dt = DateTime.fromISO(s);
  return dt.isValid && dt.toISODate() === s && s >= min && s <= max;
}
