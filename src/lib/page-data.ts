import type { Metadata } from "next";
import { CITIES, type City } from "@/engine/cities";
import { computePanchang } from "@/engine/panchang";
import { dateForDay, fmtDate, fmtShortDate } from "./format";
import { pageSchema } from "./schema";
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

const toolVars = (lang: Lang, tool: Tool, city: City) => ({
  city: city.name[lang],
  date: fmtShortDate(dateForDay(splitTool(tool).day, city.tz), city.tz),
});
const dateVars = (lang: Lang, date: string, city: City) => ({ city: city.name[lang], date: fmtDate(date, lang) });

export function toolMetadata(lang: Lang, tool: Tool, city: City): Metadata {
  const vars = toolVars(lang, tool, city);
  const path = (l: Lang) => `/${l}/${tool}/${city.slug}`;
  return {
    title: fill(TOOL_TEXT[tool].title[lang], vars),
    description: fill(TOOL_TEXT[tool].desc[lang], vars),
    alternates: { canonical: path(lang), languages: languages(path) },
    openGraph: { siteName: SITE.name[lang], locale: lang === "ta" ? "ta_IN" : "en_IN", type: "website" },
  };
}

export function dateMetadata(lang: Lang, date: string, city: City): Metadata {
  const vars = dateVars(lang, date, city);
  const path = (l: Lang) => `/${l}/panchangam/${city.slug}/${date}`;
  return {
    title: fill(DATE_TEXT.title[lang], vars),
    description: fill(DATE_TEXT.desc[lang], vars),
    alternates: { canonical: path(lang), languages: languages(path) },
    openGraph: { siteName: SITE.name[lang], locale: lang === "ta" ? "ta_IN" : "en_IN", type: "website" },
  };
}

const home = (lang: Lang) => ({ name: SITE.name[lang], path: `/${lang}` });

/** Structured data for the home page (/en, /ta). */
export function homeSchema(lang: Lang, city: City) {
  const vars = toolVars(lang, "panchangam-today", city);
  return pageSchema({
    lang,
    path: `/${lang}`,
    name: SITE.name[lang],
    description: fill(TOOL_TEXT["panchangam-today"].desc[lang], vars),
    crumbs: [home(lang)],
  });
}

/** Structured data for a today/tomorrow tool page: Home › "Rahu Kalam Today in Chennai". */
export function toolSchema(lang: Lang, tool: Tool, city: City) {
  const vars = toolVars(lang, tool, city);
  const path = `/${lang}/${tool}/${city.slug}`;
  const name = fill(TOOL_TEXT[tool].h1[lang], vars);
  return pageSchema({ lang, path, name, description: fill(TOOL_TEXT[tool].desc[lang], vars), crumbs: [home(lang), { name, path }] });
}

/** Structured data for a date page: Home › Chennai › 15 January 2027. */
export function dateSchema(lang: Lang, date: string, city: City) {
  const vars = dateVars(lang, date, city);
  const path = `/${lang}/panchangam/${city.slug}/${date}`;
  return pageSchema({
    lang,
    path,
    name: fill(DATE_TEXT.h1[lang], vars),
    description: fill(DATE_TEXT.desc[lang], vars),
    crumbs: [home(lang), { name: vars.city, path: `/${lang}/panchangam-today/${city.slug}` }, { name: vars.date, path }],
  });
}
