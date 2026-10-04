import { DateTime } from "luxon";
import type { City } from "@/engine/cities";
import { observancesFor, type Observance } from "@/engine/observances";
import { computePanchang, type Panchang } from "@/engine/panchang";
import { CAL_FIRST, CAL_LAST, type Lang } from "./site";

export const MONTH_SLUGS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
] as const;

export type YM = { year: number; month: number }; // month 1-12
const key = ({ year, month }: YM) => `${year}-${String(month).padStart(2, "0")}`;

/** Every month that has a calendar page, in order. */
export const CAL_MONTHS: YM[] = (() => {
  const out: YM[] = [];
  for (let d = DateTime.fromISO(`${CAL_FIRST}-01`); key({ year: d.year, month: d.month }) <= CAL_LAST; d = d.plus({ months: 1 }))
    out.push({ year: d.year, month: d.month });
  return out;
})();
export const CAL_YEARS = [...new Set(CAL_MONTHS.map((m) => m.year))];

export const inCalendar = (ym: YM) => key(ym) >= CAL_FIRST && key(ym) <= CAL_LAST;
export const monthSlug = (m: number) => MONTH_SLUGS[m - 1];

/** "2027" + "october" → { year, month } if that month has a page. */
export function parseMonth(year: string, slug: string): YM | null {
  const m = MONTH_SLUGS.indexOf(slug as (typeof MONTH_SLUGS)[number]) + 1;
  const ym = { year: Number(year), month: m };
  return /^\d{4}$/.test(year) && m > 0 && inCalendar(ym) ? ym : null;
}

export const monthName = (m: number, lang: Lang) =>
  DateTime.fromObject({ year: 2000, month: m }).setLocale(lang === "ta" ? "ta" : "en").toFormat("LLLL");

/** URL of a month page; Chennai (the default city) has no city part. */
export const monthPath = (lang: Lang, ym: YM, city?: string) =>
  `/${lang}/tamil-calendar/${ym.year}/${monthSlug(ym.month)}${city && city !== "chennai" ? `/${city}` : ""}`;

export const shiftMonth = (ym: YM, n: number): YM => {
  const d = DateTime.fromObject({ year: ym.year, month: ym.month }).plus({ months: n });
  return { year: d.year, month: d.month };
};

export type CalDay = { date: string; p: Panchang; obs: Observance[] };

/** Panchangam + observances for every day of a month in one city. */
export function monthDays({ year, month }: YM, city: City): CalDay[] {
  const first = DateTime.fromObject({ year, month, day: 1 });
  const n = first.daysInMonth!;
  // One extra day on each side: some observance rules compare neighbouring days.
  const dates = Array.from({ length: n + 2 }, (_, i) => first.plus({ days: i - 1 }).toISODate()!);
  const ps = dates.map((d) => computePanchang(d, city));
  const obs = observancesFor(ps);
  return ps.slice(1, -1).map((p, i) => ({ date: p.date, p, obs: obs[i + 1] }));
}

/** Observances for a single day (needs the neighbouring days for some rules). */
export function dayObservances(date: string, city: City): Observance[] {
  const d = DateTime.fromISO(date);
  const ps = [-1, 0, 1].map((k) => computePanchang(d.plus({ days: k }).toISODate()!, city));
  return observancesFor(ps)[1];
}
