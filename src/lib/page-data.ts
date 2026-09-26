import type { Metadata } from "next";
import { CITIES, type City } from "@/engine/cities";
import { computePanchang } from "@/engine/panchang";
import { dateForDay, fmtDate, fmtShortDate } from "./format";
import { DATE_TEXT, LANGS, SITE, TOOL_TEXT, fill, splitTool, type Lang, type Tool } from "./site";

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

/** Panchangam for the day a tool page shows (today or tomorrow in the city's timezone). */
export function toolPanchang(tool: Tool, city: City) {
  return computePanchang(dateForDay(splitTool(tool).day, city.tz), city);
}

const languages = (path: (l: Lang) => string) =>
  Object.fromEntries([...LANGS.map((l) => [l === "ta" ? "ta-IN" : "en", path(l)]), ["x-default", path("en")]]);

export function toolMetadata(lang: Lang, tool: Tool, city: City): Metadata {
  const date = dateForDay(splitTool(tool).day, city.tz);
  const vars = { city: lang === "ta" ? city.name.ta : city.name.en, date: fmtShortDate(date, city.tz) };
  const path = (l: Lang) => `/${l}/${tool}/${city.slug}`;
  return {
    title: fill(TOOL_TEXT[tool].title[lang], vars),
    description: fill(TOOL_TEXT[tool].desc[lang], vars),
    alternates: { canonical: path(lang), languages: languages(path) },
    openGraph: { siteName: SITE.name[lang], locale: lang === "ta" ? "ta_IN" : "en_IN", type: "website" },
  };
}

export function dateMetadata(lang: Lang, date: string, city: City): Metadata {
  const vars = { city: lang === "ta" ? city.name.ta : city.name.en, date: fmtDate(date, lang) };
  const path = (l: Lang) => `/${l}/panchangam/${city.slug}/${date}`;
  return {
    title: fill(DATE_TEXT.title[lang], vars),
    description: fill(DATE_TEXT.desc[lang], vars),
    alternates: { canonical: path(lang), languages: languages(path) },
    openGraph: { siteName: SITE.name[lang], locale: lang === "ta" ? "ta_IN" : "en_IN", type: "website" },
  };
}
