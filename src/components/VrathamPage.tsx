import Link from "next/link";
import CityPicker from "@/components/CityPicker";
import JsonLd from "@/components/JsonLd";
import { shortDay } from "@/components/MonthCalendar";
import NextVratham, { type NextRow } from "@/components/NextVratham";
import type { City } from "@/engine/cities";
import { OBSERVANCE_INFO, type ObservanceKey } from "@/engine/observances";
import { inCalendar, monthPath } from "@/lib/calendar";
import { fmtDate, fmtTime } from "@/lib/format";
import { cityOptions } from "@/lib/page-data";
import { T, fill, type Lang } from "@/lib/site";
import { VRATHAM_KEYS, VRATHAM_YEARS, VR_UI, vrathamContent, vrathamPath } from "@/lib/vratham";

const chip = "rounded-full border border-stone-300 px-3 py-1 hover:bg-stone-100 dark:border-stone-600 dark:hover:bg-stone-800";

export default function VrathamPage({ lang, vkey, year, city }: { lang: Lang; vkey: ObservanceKey; year: number; city: City }) {
  const { rows, vars, h1, faq, schema, extraLabel } = vrathamContent(lang, vkey, year, city);
  const u = (k: string, v: Record<string, string> = vars) => fill(VR_UI[k][lang], v);
  const time = (iso: string, base: string) => fmtTime(iso, city.tz, base, lang);
  const dayHref = (date: string) => `/${lang}/panchangam/${city.slug}/${date}`;
  const extra = (r: (typeof rows)[number]) => (r.extra ? (r.extra.end ? `${time(r.extra.start, r.date)} – ${time(r.extra.end, r.date)}` : time(r.extra.start, r.date)) : "");
  const startEnd = (r: (typeof rows)[number]) => `${r.start ? time(r.start, r.date) : "…"} – ${time(r.end, r.date)}`;
  const otherYear = VRATHAM_YEARS.filter((y) => y !== year);
  const nextYear = VRATHAM_YEARS.find((y) => y === year + 1);

  const nextRows: NextRow[] = rows.map((r) => ({
    id: r.date,
    href: dayHref(r.date),
    start: r.start,
    end: r.end,
    label: `${r.name[lang]} · ${fmtDate(r.date, lang)}`,
    times: extraLabel ? `${extraLabel}: ${extra(r)} · ${startEnd(r)}` : startEnd(r),
  }));

  return (
    <div className="space-y-5">
      <JsonLd data={schema} />
      <CityPicker options={cityOptions(lang)} current={city.slug} basePath={vrathamPath(lang, vkey, year)} defaultSlug="chennai" label={T.city[lang]} />

      <div>
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
          {OBSERVANCE_INFO[vkey].icon} {h1}
        </h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{u("forCity")}</p>
      </div>

      <NextVratham
        rows={nextRows}
        text={{ next: u("next"), running: u("running"), none: u("none"), seeYear: nextYear ? fill(VR_UI.seeYear[lang], { year: String(nextYear) }) : undefined }}
        nextYearHref={nextYear ? vrathamPath(lang, vkey, nextYear, city.slug) : undefined}
      />

      {/* Table (tablet/desktop) */}
      <div className="hidden overflow-x-auto rounded-xl border border-stone-200 bg-white sm:block dark:border-stone-700 dark:bg-stone-900">
        <table className="w-full text-left text-[15px]">
          <thead className="bg-stone-50 text-sm text-stone-600 dark:bg-stone-800 dark:text-stone-300">
            <tr>
              <th className="px-3 py-2">{u("date")}</th>
              <th className="px-3 py-2">{u("tamilDate")}</th>
              <th className="px-3 py-2">{u("name")}</th>
              {extraLabel && <th className="px-3 py-2">{extraLabel}</th>}
              <th className="px-3 py-2">{u("starts")}</th>
              <th className="px-3 py-2">{u("ends")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {rows.map((r) => (
              <tr key={r.date} id={`d-${r.date}`}>
                <td className="whitespace-nowrap px-3 py-2">
                  <Link href={dayHref(r.date)} className="font-medium underline decoration-stone-300 hover:text-maroon">
                    {shortDay(r.date, lang)}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  {inCalendar({ year: Number(r.date.slice(0, 4)), month: Number(r.date.slice(5, 7)) }) ? (
                    <Link
                      href={monthPath(lang, { year: Number(r.date.slice(0, 4)), month: Number(r.date.slice(5, 7)) }, city.slug)}
                      className="hover:text-maroon"
                    >
                      {r.tamil.month[lang]} {r.tamil.day}
                    </Link>
                  ) : (
                    `${r.tamil.month[lang]} ${r.tamil.day}`
                  )}
                </td>
                <td className="px-3 py-2">{r.name[lang]}</td>
                {extraLabel && <td className="whitespace-nowrap px-3 py-2 font-medium">{extra(r)}</td>}
                <td className="whitespace-nowrap px-3 py-2">{r.start ? time(r.start, r.date) : "…"}</td>
                <td className="whitespace-nowrap px-3 py-2">{time(r.end, r.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (phones) */}
      <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white sm:hidden dark:divide-stone-700 dark:border-stone-700 dark:bg-stone-900">
        {rows.map((r) => (
          <li key={r.date} id={`m-${r.date}`} className="px-3 py-2 text-sm">
            <Link href={dayHref(r.date)} className="block">
              <span className="flex flex-wrap justify-between gap-x-2">
                <span className="font-semibold">{shortDay(r.date, lang)}</span>
                <span className="text-maroon">
                  {r.tamil.month[lang]} {r.tamil.day}
                </span>
              </span>
              {r.name[lang] !== vars.name && <span className="block font-semibold text-amber-800 dark:text-amber-300">{r.name[lang]}</span>}
              {extraLabel && (
                <span className="block">
                  {extraLabel}: <strong>{extra(r)}</strong>
                </span>
              )}
              <span className="block text-stone-600 dark:text-stone-300">{startEnd(r)}</span>
            </Link>
          </li>
        ))}
      </ul>

      <nav className="space-y-2 text-sm">
        <div className="flex flex-wrap gap-2">
          {otherYear.map((y) => (
            <Link key={y} href={vrathamPath(lang, vkey, y, city.slug)} className={chip}>
              {vars.name} {y}
            </Link>
          ))}
        </div>
        <h2 className="pt-2 font-semibold">{u("otherVrathams")}</h2>
        <div className="flex flex-wrap gap-2">
          {VRATHAM_KEYS.filter((k) => k !== vkey).map((k) => (
            <Link key={k} href={vrathamPath(lang, k, year, city.slug)} className={chip}>
              {OBSERVANCE_INFO[k].icon} {OBSERVANCE_INFO[k].name[lang]} {year}
            </Link>
          ))}
        </div>
      </nav>

      <section>
        <h2 className="mb-2 text-lg font-semibold">{u("faq")}</h2>
        <div className="space-y-3">
          {faq.map(({ q, a }) => (
            <div key={q}>
              <h3 className="font-medium">{q}</h3>
              <p className="text-stone-700 dark:text-stone-300">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-sm text-stone-500">{fill(T.method[lang], { city: city.name[lang], tz: city.tz })}</p>
    </div>
  );
}
