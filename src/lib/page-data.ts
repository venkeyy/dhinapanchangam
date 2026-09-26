import type { Metadata } from "next";
import { CITIES, type City } from "@/engine/cities";
import { computePanchang } from "@/engine/panchang";
import { fmtShortDate, todayIn } from "./format";
import { LANGS, SITE, TOOL_TEXT, fill, type Lang, type Tool } from "./site";

const GROUP: Record<string, Record<Lang, string>> = {
  IN: { en: "India", ta: "இந்தியா" },
  LK: { en: "Sri Lanka", ta: "இலங்கை" },
};
const WORLD = { en: "Worldwide", ta: "உலகம்" };

export function cityOptions(lang: Lang) {
  return CITIES.map((c) => ({
    slug: c.slug,
    label: lang === "ta" ? c.name.ta : c.name.en,
    group: (GROUP[c.country] ?? WORLD)[lang],
  }));
}

export function todaysPanchang(city: City) {
  return computePanchang(todayIn(city.tz), city);
}

export function toolMetadata(lang: Lang, tool: Tool, city: City): Metadata {
  const vars = { city: lang === "ta" ? city.name.ta : city.name.en, date: fmtShortDate(todayIn(city.tz), city.tz) };
  const path = (l: Lang) => `/${l}/${tool}/${city.slug}`;
  return {
    title: fill(TOOL_TEXT[tool].title[lang], vars),
    description: fill(TOOL_TEXT[tool].desc[lang], vars),
    alternates: {
      canonical: path(lang),
      languages: Object.fromEntries([...LANGS.map((l) => [l === "ta" ? "ta-IN" : "en", path(l)]), ["x-default", path("en")]]),
    },
    openGraph: { siteName: SITE.name[lang], locale: lang === "ta" ? "ta_IN" : "en_IN", type: "website" },
  };
}
