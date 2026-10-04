import Link from "next/link";
import CityPicker from "@/components/CityPicker";
import JsonLd from "@/components/JsonLd";
import MonthCalendar, { shortDay } from "@/components/MonthCalendar";
import type { City } from "@/engine/cities";
import { OBSERVANCE_INFO } from "@/engine/observances";
import { inCalendar, monthName, monthPath, shiftMonth, type YM } from "@/lib/calendar";
import { monthContent } from "@/lib/calendar-page";
import { cityOptions } from "@/lib/page-data";
import { CAL_TEXT, T, fill, type Lang } from "@/lib/site";
import { VRATHAM_KEYS, vrathamPath } from "@/lib/vratham";

const chip = "rounded-full border border-stone-300 px-3 py-1 hover:bg-stone-100 dark:border-stone-600 dark:hover:bg-stone-800";

export default function MonthPage({ lang, ym, city }: { lang: Lang; ym: YM; city: City }) {
  const { days, vars, h1, groups, faq, schema } = monthContent(lang, ym, city);
  const c = (k: string, v: Record<string, string> = vars) => fill(CAL_TEXT[k][lang], v);
  const prev = shiftMonth(ym, -1);
  const next = shiftMonth(ym, 1);
  const label = (m: YM) => `${monthName(m.month, lang)} ${m.year}`;

  return (
    <div className="space-y-5">
      <JsonLd data={schema} />
      <CityPicker options={cityOptions(lang)} current={city.slug} basePath={monthPath(lang, ym)} defaultSlug="chennai" label={T.city[lang]} />

      <div>
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{h1}</h1>
        <p className="mt-1 text-stone-600 dark:text-stone-300">{c("forCity")}</p>
      </div>

      <nav className="flex flex-wrap gap-2 text-sm">
        {inCalendar(prev) && (
          <Link href={monthPath(lang, prev, city.slug)} className={chip} rel="prev" title={c("prevMonth")}>
            ← {label(prev)}
          </Link>
        )}
        {inCalendar(next) && (
          <Link href={monthPath(lang, next, city.slug)} className={chip} rel="next" title={c("nextMonth")}>
            {label(next)} →
          </Link>
        )}
        <Link href={`/${lang}/tamil-calendar/${ym.year}`} className={chip}>
          {c("allMonths")}
        </Link>
      </nav>

      <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600 dark:text-stone-300">
        {VRATHAM_KEYS.map((k) => (
          <Link key={k} href={vrathamPath(lang, k, ym.year, city.slug)} className="hover:text-maroon hover:underline">
            {OBSERVANCE_INFO[k].icon} {OBSERVANCE_INFO[k].name[lang]}
          </Link>
        ))}
      </p>

      <MonthCalendar days={days} lang={lang} city={city.slug} />

      {groups.length > 0 && (
        <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-700 dark:bg-stone-900">
          <h2 className="mb-3 text-lg font-semibold text-maroon">{c("observances")}</h2>
          <dl className="divide-y divide-stone-100 dark:divide-stone-800">
            {groups.map((g) => (
              <div key={g.key} className="grid gap-1 py-2 text-[15px] sm:grid-cols-[13rem_1fr]">
                <dt className="font-medium">
                  <Link href={vrathamPath(lang, g.key, ym.year, city.slug)} className="hover:text-maroon hover:underline">
                    {g.icon} {g.name[lang]}
                  </Link>
                </dt>
                <dd className="flex flex-wrap gap-x-3 gap-y-1">
                  {g.days.map((d) => (
                    <Link key={d.date} href={`/${lang}/panchangam/${city.slug}/${d.date}`} className="underline decoration-stone-300 hover:text-maroon">
                      {shortDay(d.date, lang)}
                      {d.name[lang] !== g.name[lang] && ` (${d.name[lang]})`}
                    </Link>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-lg font-semibold">{c("faq")}</h2>
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
