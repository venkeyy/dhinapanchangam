import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CityPicker from "@/components/CityPicker";
import DateNav from "@/components/DateNav";
import JsonLd from "@/components/JsonLd";
import PanchangView from "@/components/PanchangView";
import { cityBySlug } from "@/engine/cities";
import { computePanchang } from "@/engine/panchang";
import { fmtDate, isIsoDate } from "@/lib/format";
import { cityOptions, dateMetadata, dateSchema } from "@/lib/page-data";
import { dayObservances, inCalendar, monthName, monthPath } from "@/lib/calendar";
import { CAL_TEXT, DATE_TEXT, MAX_DATE, MIN_DATE, T, fill, isLang } from "@/lib/site";
import { VRATHAM_YEARS, vrathamPath } from "@/lib/vratham";

// Any date from 1950 to 2100. Nothing is built ahead of time: each page is
// computed on its first visit and then kept (a date's panchangam never changes;
// every new deploy starts a fresh cache).
export const dynamicParams = true;
export const revalidate = false;
export function generateStaticParams() {
  return [];
}

async function resolve(params: PageProps<"/[lang]/panchangam/[city]/[date]">["params"]) {
  const { lang, city: slug, date } = await params;
  const city = cityBySlug(slug);
  if (!isLang(lang) || !city || !isIsoDate(date, MIN_DATE, MAX_DATE)) return null;
  return { lang, city, date };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/panchangam/[city]/[date]">): Promise<Metadata> {
  const r = await resolve(params);
  return r ? dateMetadata(r.lang, r.date, r.city) : {};
}

export default async function DatePage({ params }: PageProps<"/[lang]/panchangam/[city]/[date]">) {
  const r = await resolve(params);
  if (!r) notFound();
  const { lang, city, date } = r;
  const p = computePanchang(date, city);
  const obs = dayObservances(date, city);
  const ym = { year: Number(date.slice(0, 4)), month: Number(date.slice(5, 7)) };
  return (
    <>
      <JsonLd data={dateSchema(lang, date, city)} />
      <div className="mb-4">
        <CityPicker options={cityOptions(lang)} current={city.slug} basePath={`/${lang}/panchangam`} suffix={`/${date}`} label={T.city[lang]} />
      </div>
      <PanchangView
        p={p}
        city={city}
        lang={lang}
        kind="panchangam"
        heading={fill(DATE_TEXT.h1[lang], { city: city.name[lang], date: fmtDate(date, lang) })}
        nav={
          <div className="space-y-2">
            {obs.length > 0 && (
              <p className="flex flex-wrap gap-2">
                {obs.map((o) => {
                  const cls = "rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900 dark:bg-amber-950/50 dark:text-amber-200";
                  return VRATHAM_YEARS.includes(ym.year) ? (
                    <Link key={o.key} href={vrathamPath(lang, o.key, ym.year, city.slug)} className={`${cls} hover:underline`}>
                      {o.icon} {o.name[lang]}
                    </Link>
                  ) : (
                    <span key={o.key} className={cls}>
                      {o.icon} {o.name[lang]}
                    </span>
                  );
                })}
              </p>
            )}
            <DateNav lang={lang} city={city.slug} tz={city.tz} date={date} />
            {inCalendar(ym) && (
              <Link href={monthPath(lang, ym, city.slug)} className="inline-block text-sm underline decoration-stone-300 hover:text-maroon">
                📅 {fill(CAL_TEXT.monthCalendar[lang], { month: monthName(ym.month, lang), year: String(ym.year) })}
              </Link>
            )}
          </div>
        }
      />
    </>
  );
}
