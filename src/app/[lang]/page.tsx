import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CityPicker from "@/components/CityPicker";
import DateNav from "@/components/DateNav";
import JsonLd from "@/components/JsonLd";
import PanchangView from "@/components/PanchangView";
import { CITIES, DEFAULT_CITY } from "@/engine/cities";
import { cityOptions, homeSchema, toolMetadata, toolPanchang } from "@/lib/page-data";
import { SITE, T, TOOL_TEXT, fill, isLang } from "@/lib/site";

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
  const p = toolPanchang("panchangam-today", city);
  return (
    <>
      <JsonLd data={homeSchema(lang, city)} />
      <div className="mb-4">
        <CityPicker options={cityOptions(lang)} current={city.slug} basePath={`/${lang}/panchangam-today`} label={T.city[lang]} />
      </div>
      <PanchangView
        p={p}
        city={city}
        lang={lang}
        kind="panchangam"
        day="today"
        heading={fill(TOOL_TEXT["panchangam-today"].h1[lang], { city: city.name[lang] })}
        nav={<DateNav lang={lang} city={city.slug} date={p.date} kind="panchangam" day="today" />}
      />
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
