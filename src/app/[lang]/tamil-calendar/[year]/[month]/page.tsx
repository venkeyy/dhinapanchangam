import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MonthPage from "@/components/MonthPage";
import { DEFAULT_CITY } from "@/engine/cities";
import { CAL_MONTHS, monthSlug, parseMonth } from "@/lib/calendar";
import { monthContent } from "@/lib/calendar-page";
import { isLang } from "@/lib/site";

// Month pages never change, so they are built once per deploy.
export const dynamicParams = false;
// [lang] comes from the layout; this page lists both [year] and [month].
export function generateStaticParams() {
  return CAL_MONTHS.map((m) => ({ year: String(m.year), month: monthSlug(m.month) }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/tamil-calendar/[year]/[month]">): Promise<Metadata> {
  const { lang, year, month } = await params;
  const ym = parseMonth(year, month);
  return isLang(lang) && ym ? monthContent(lang, ym, DEFAULT_CITY).metadata : {};
}

export default async function ChennaiMonth({ params }: PageProps<"/[lang]/tamil-calendar/[year]/[month]">) {
  const { lang, year, month } = await params;
  const ym = parseMonth(year, month);
  if (!isLang(lang) || !ym) notFound();
  return <MonthPage lang={lang} ym={ym} city={DEFAULT_CITY} />;
}
