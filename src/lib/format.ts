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

/** Today's date (YYYY-MM-DD) in the city's own timezone. */
export const todayIn = (tz: string) => DateTime.now().setZone(tz).toISODate()!;
