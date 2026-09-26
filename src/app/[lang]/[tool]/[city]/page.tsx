import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityPicker from "@/components/CityPicker";
import PanchangView from "@/components/PanchangView";
import { CITIES, cityBySlug } from "@/engine/cities";
import { cityOptions, todaysPanchang, toolMetadata } from "@/lib/page-data";
import { LANGS, T, TOOLS, isLang, isTool } from "@/lib/site";

// "Today" pages are regenerated every 15 minutes, so each city rolls over
// to the new day within 15 minutes of its local midnight.
export const revalidate = 900;
export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.flatMap((lang) => TOOLS.flatMap((tool) => CITIES.map((c) => ({ lang, tool, city: c.slug }))));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[tool]/[city]">): Promise<Metadata> {
  const { lang, tool, city: slug } = await params;
  const city = cityBySlug(slug);
  if (!isLang(lang) || !isTool(tool) || !city) return {};
  return toolMetadata(lang, tool, city);
}

export default async function ToolPage({ params }: PageProps<"/[lang]/[tool]/[city]">) {
  const { lang, tool, city: slug } = await params;
  const city = cityBySlug(slug);
  if (!isLang(lang) || !isTool(tool) || !city) notFound();
  const p = todaysPanchang(city);
  return (
    <>
      <div className="mb-4">
        <CityPicker options={cityOptions(lang)} current={city.slug} basePath={`/${lang}/${tool}`} label={T.city[lang]} />
      </div>
      <PanchangView p={p} city={city} lang={lang} tool={tool} />
    </>
  );
}
