import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CityPicker from "@/components/CityPicker";
import PanchangView from "@/components/PanchangView";
import { CITIES, DEFAULT_CITY } from "@/engine/cities";
import { cityOptions, todaysPanchang, toolMetadata } from "@/lib/page-data";
import { SITE, T, isLang } from "@/lib/site";

export const revalidate = 900;

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const base = toolMetadata(lang, "panchangam-today", DEFAULT_CITY);
  return {
    ...base,
    title: lang === "ta" ? `${SITE.name.ta} – இன்றைய பஞ்சாங்கம், நல்ல நேரம், ராகு காலம்` : `${SITE.name.en} – Today Panchangam, Nalla Neram, Rahu Kalam`,
    alternates: { canonical: `/${lang}`, languages: { en: "/en", "ta-IN": "/ta", "x-default": "/en" } },
  };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const city = DEFAULT_CITY;
  const p = todaysPanchang(city);
  return (
    <>
      <div className="mb-4">
        <CityPicker options={cityOptions(lang)} current={city.slug} basePath={`/${lang}/panchangam-today`} label={T.city[lang]} />
      </div>
      <PanchangView p={p} city={city} lang={lang} tool="panchangam-today" />
      <section className="mt-8">
        <h2 className="mb-2 text-lg font-semibold">{T.otherCities[lang]}</h2>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {CITIES.map((c) => (
            <li key={c.slug}>
              <Link href={`/${lang}/panchangam-today/${c.slug}`} className="underline decoration-stone-300 hover:text-maroon">
                {lang === "ta" ? c.name.ta : c.name.en}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
