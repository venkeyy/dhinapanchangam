import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VrathamPage from "@/components/VrathamPage";
import { DEFAULT_CITY, cityBySlug } from "@/engine/cities";
import { isLang } from "@/lib/site";
import { parseVrathamYear, vrathamContent } from "@/lib/vratham";

// ekadasi dates for a year in any city except Chennai: made on first visit, then kept.
export const dynamicParams = true;
export const revalidate = false;
export function generateStaticParams() {
  return [];
}

async function resolve(params: PageProps<"/[lang]/ekadasi/[year]/[city]">["params"]) {
  const { lang, year, city: slug } = await params;
  const y = parseVrathamYear(year);
  const city = cityBySlug(slug);
  return isLang(lang) && y && city && city.slug !== DEFAULT_CITY.slug ? { lang, y, city } : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/ekadasi/[year]/[city]">): Promise<Metadata> {
  const r = await resolve(params);
  return r ? vrathamContent(r.lang, "ekadasi", r.y, r.city).metadata : {};
}

export default async function Page({ params }: PageProps<"/[lang]/ekadasi/[year]/[city]">) {
  const r = await resolve(params);
  if (!r) notFound();
  return <VrathamPage lang={r.lang} vkey="ekadasi" year={r.y} city={r.city} />;
}
