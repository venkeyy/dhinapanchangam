import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityPicker from "@/components/CityPicker";
import DateNav from "@/components/DateNav";
import JsonLd from "@/components/JsonLd";
import PanchangView from "@/components/PanchangView";
import { cityBySlug } from "@/engine/cities";
import { computePanchang } from "@/engine/panchang";
import { fmtDate, isIsoDate } from "@/lib/format";
import { cityOptions, dateMetadata, dateSchema } from "@/lib/page-data";
import { DATE_TEXT, MAX_DATE, MIN_DATE, T, fill, isLang } from "@/lib/site";

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
        nav={<DateNav lang={lang} city={city.slug} tz={city.tz} date={date} />}
      />
    </>
  );
}
