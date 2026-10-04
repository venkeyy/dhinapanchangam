import Link from "next/link";
import { DateTime } from "luxon";
import type { CalDay } from "@/lib/calendar";
import type { Lang } from "@/lib/site";

const WEEK = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ta: ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"],
};

type Props = { days: CalDay[]; lang: Lang; city: string };

/** Month grid (tablet/desktop) and day list (phone). Each day links to its daily sheet. */
export default function MonthCalendar({ days, lang, city }: Props) {
  const nm = (x: { en: string; ta: string }) => x[lang];
  const href = (date: string) => `/${lang}/panchangam/${city}/${date}`;
  const lead = days[0].p.weekday.index; // blank cells before day 1 (week starts Sunday)
  const dayNum = (date: string) => Number(date.slice(8));
  const tamil = (d: CalDay) => `${nm(d.p.tamil.month)} ${d.p.tamil.day}`;
  const marked = (d: CalDay) => d.obs.length > 0;

  return (
    <>
      {/* Grid: 7 columns, from small tablets up */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-stone-500">
          {WEEK[lang].map((w, i) => (
            <div key={w} className={`py-1 ${i === 0 ? "text-red-700 dark:text-red-400" : ""}`}>
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: lead }, (_, i) => (
            <div key={`b${i}`} />
          ))}
          {days.map((d) => (
            <Link
              key={d.date}
              href={href(d.date)}
              className={`flex min-h-28 flex-col gap-0.5 rounded-lg border p-1.5 text-left text-[11px] leading-tight hover:border-maroon ${
                marked(d) ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30" : "border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900"
              }`}
            >
              <span className="flex items-start justify-between gap-1">
                <span className={`text-lg font-bold ${d.p.weekday.index === 0 ? "text-red-700 dark:text-red-400" : ""}`}>{dayNum(d.date)}</span>
                <span className="text-sm" aria-hidden>
                  {d.obs.map((o) => o.icon).join("")}
                </span>
              </span>
              <span className="font-medium text-maroon">{tamil(d)}</span>
              <span>{nm(d.p.tithi[0].name)}</span>
              <span className="text-stone-500">{nm(d.p.nakshatra[0].name)}</span>
              {d.obs.map((o) => (
                <span key={o.key} className="font-semibold text-amber-800 dark:text-amber-300">
                  {nm(o.name)}
                </span>
              ))}
            </Link>
          ))}
        </div>
      </div>

      {/* List: phones */}
      <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white sm:hidden dark:divide-stone-700 dark:border-stone-700 dark:bg-stone-900">
        {days.map((d) => (
          <li key={d.date}>
            <Link href={href(d.date)} className={`flex gap-3 px-3 py-2 text-sm ${marked(d) ? "bg-amber-50 dark:bg-amber-950/30" : ""}`}>
              <span className="w-16 shrink-0 text-center">
                <span className={`block text-xl font-bold leading-6 ${d.p.weekday.index === 0 ? "text-red-700 dark:text-red-400" : ""}`}>{dayNum(d.date)}</span>
                <span className="block text-[11px] text-stone-500">{WEEK[lang][d.p.weekday.index]}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-maroon">{tamil(d)}</span>
                <span className="block">
                  {nm(d.p.tithi[0].name)} · <span className="text-stone-500">{nm(d.p.nakshatra[0].name)}</span>
                </span>
                {d.obs.length > 0 && (
                  <span className="block font-semibold text-amber-800 dark:text-amber-300">{d.obs.map((o) => `${o.icon} ${nm(o.name)}`).join(" · ")}</span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

/** "Sat, 10 Oct" / "சனி, 10 அக்." for observance lists. */
export const shortDay = (date: string, lang: Lang) =>
  DateTime.fromISO(date).setLocale(lang === "ta" ? "ta" : "en").toFormat("ccc, d MMM");
