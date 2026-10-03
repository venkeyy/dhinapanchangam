import Link from "next/link";
import DatePicker from "@/components/DatePicker";
import StaleGuard from "@/components/StaleGuard";
import { addDays, fmtDate } from "@/lib/format";
import { DAYS, MAX_DATE, MIN_DATE, T, toolOf, type Day, type Kind, type Lang } from "@/lib/site";

type Props = { lang: Lang; city: string; date: string; tz: string } & ({ kind: Kind; day: Day } | { kind?: undefined; day?: undefined });

const chip = "rounded-full border border-stone-300 px-3 py-1 hover:bg-stone-100 dark:border-stone-600 dark:hover:bg-stone-800";
const active = "rounded-full bg-maroon px-3 py-1 text-white";

/** Today / Tomorrow switch on tool pages, previous / next day on date pages, plus a date picker. */
export default function DateNav({ lang, city, date, tz, kind, day }: Props) {
  const t = (k: string) => T[k][lang];
  const prev = addDays(date, -1);
  const next = addDays(date, 1);
  return (
    <div className="space-y-2">
      {day && (
        <StaleGuard
          date={date}
          tz={tz}
          offset={day === "today" ? 0 : 1}
          datePath={`/${lang}/panchangam/${city}`}
          text={{ updating: t("staleUpdating"), stale: t("staleShown"), open: t("staleOpen") }}
        />
      )}
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <div className="flex flex-wrap gap-2">
        {kind ? (
          DAYS.map((d) =>
            d === day ? (
              <span key={d} className={active}>
                {t(d)}
              </span>
            ) : (
              <Link key={d} href={`/${lang}/${toolOf(kind, d)}/${city}`} className={chip}>
                {t(d)}
              </Link>
            ),
          )
        ) : (
          <>
            {prev >= MIN_DATE && (
              <Link href={`/${lang}/panchangam/${city}/${prev}`} className={chip} rel="prev" title={t("prevDay")}>
                ← {fmtDate(prev, lang)}
              </Link>
            )}
            {next <= MAX_DATE && (
              <Link href={`/${lang}/panchangam/${city}/${next}`} className={chip} rel="next" title={t("nextDay")}>
                {fmtDate(next, lang)} →
              </Link>
            )}
            <Link href={`/${lang}/panchangam-today/${city}`} className={chip}>
              {t("today")}
            </Link>
          </>
        )}
      </div>
      <DatePicker basePath={`/${lang}/panchangam/${city}`} value={date} min={MIN_DATE} max={MAX_DATE} label={t("pickDate")} button={t("go")} />
    </div>
    </div>
  );
}
