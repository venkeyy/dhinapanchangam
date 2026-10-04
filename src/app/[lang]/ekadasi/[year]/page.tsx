import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VrathamPage from "@/components/VrathamPage";
import { DEFAULT_CITY } from "@/engine/cities";
import { isLang } from "@/lib/site";
import { VRATHAM_YEARS, parseVrathamYear, vrathamContent } from "@/lib/vratham";

// ekadasi dates for a year, Chennai (pre-built). Shared layout: components/VrathamPage.tsx
export const dynamicParams = false;
export function generateStaticParams() {
  return VRATHAM_YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/ekadasi/[year]">): Promise<Metadata> {
  const { lang, year } = await params;
  const y = parseVrathamYear(year);
  return isLang(lang) && y ? vrathamContent(lang, "ekadasi", y, DEFAULT_CITY).metadata : {};
}

export default async function Page({ params }: PageProps<"/[lang]/ekadasi/[year]">) {
  const { lang, year } = await params;
  const y = parseVrathamYear(year);
  if (!isLang(lang) || !y) notFound();
  return <VrathamPage lang={lang} vkey="ekadasi" year={y} city={DEFAULT_CITY} />;
}
