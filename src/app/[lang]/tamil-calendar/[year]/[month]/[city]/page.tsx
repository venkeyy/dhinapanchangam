import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MonthPage from "@/components/MonthPage";
import { DEFAULT_CITY, cityBySlug } from "@/engine/cities";
import { parseMonth } from "@/lib/calendar";
import { monthContent } from "@/lib/calendar-page";
import { isLang } from "@/lib/site";

// Every city except Chennai (whose month page has no city in the address).
// Not pre-built: 61 cities x 15 months x 2 languages would add ~700 MB to every
// deploy. Each page is made on its first visit and then kept until the next deploy.
export const dynamicParams = true;
export const revalidate = false;
export function generateStaticParams() {
  return [];
}

async function resolve(params: PageProps<"/[lang]/tamil-calendar/[year]/[month]/[city]">["params"]) {
  const { lang, year, month, city: slug } = await params;
  const ym = parseMonth(year, month);
  const city = cityBySlug(slug);
  return isLang(lang) && ym && city && city.slug !== DEFAULT_CITY.slug ? { lang, ym, city } : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/tamil-calendar/[year]/[month]/[city]">): Promise<Metadata> {
  const r = await resolve(params);
  return r ? monthContent(r.lang, r.ym, r.city).metadata : {};
}

export default async function CityMonth({ params }: PageProps<"/[lang]/tamil-calendar/[year]/[month]/[city]">) {
  const r = await resolve(params);
  if (!r) notFound();
  return <MonthPage lang={r.lang} ym={r.ym} city={r.city} />;
}
