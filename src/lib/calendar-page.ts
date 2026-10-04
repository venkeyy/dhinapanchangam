import type { Metadata } from "next";
import { DateTime } from "luxon";
import type { City } from "@/engine/cities";
import { OBSERVANCE_INFO, type ObservanceKey } from "@/engine/observances";
import { CAL_MONTHS, monthDays, monthName, monthPath, type YM } from "./calendar";
import { faqNode, pageSchema } from "./schema";
import { CAL_TEXT, LANGS, SITE, fill, type Lang } from "./site";

const longDay = (date: string, lang: Lang) =>
  DateTime.fromISO(date).setLocale(lang === "ta" ? "ta" : "en").toFormat(lang === "ta" ? "d MMMM, cccc" : "cccc, d MMMM");

const languages = (path: (l: Lang) => string) =>
  Object.fromEntries([...LANGS.map((l) => [l === "ta" ? "ta-IN" : "en", path(l)]), ["x-default", path("en")]]);

/** Everything a month page shows and tells search engines, computed once. */
export function monthContent(lang: Lang, ym: YM, city: City) {
  const days = monthDays(ym, city);
  const cityName = city.name[lang];
  const month = monthName(ym.month, lang);
  const vars = {
    month,
    monthLower: monthName(ym.month, "en").toLowerCase(),
    year: String(ym.year),
    city: cityName,
    cityPart: city.slug === "chennai" ? "" : ` ${cityName}`,
  };

  // Tamil months this month covers, in order (e.g. Purattasi – Aippasi)
  const tamilMonths = [...new Map(days.map((d) => [d.p.tamil.monthIndex, d.p.tamil.month])).values()];
  const tamilRange = tamilMonths.map((m) => m[lang]).join(" – ");
  const firstDay = days[0].p.tamil;
  const lastDay = days[days.length - 1].p.tamil;
  const starts = days.filter((d) => d.p.tamil.day === 1);

  // Observance dates grouped by kind, in a fixed order
  const order: ObservanceKey[] = ["amavasai", "pournami", "pradosham", "ekadasi", "sankatahara", "sashti", "kiruthigai"];
  const groups = order
    .map((key) => ({
      key,
      ...OBSERVANCE_INFO[key],
      days: days.flatMap((d) => d.obs.filter((o) => o.key === key).map((o) => ({ date: d.date, name: o.name }))),
    }))
    .filter((g) => g.days.length > 0);

  const obsAnswer = (key: ObservanceKey) => {
    const name = OBSERVANCE_INFO[key].name[lang];
    const dates = groups.find((g) => g.key === key)?.days.map((d) => longDay(d.date, lang)) ?? [];
    return dates.length ? fill(CAL_TEXT.aObs[lang], { ...vars, name, dates: dates.join(lang === "ta" ? ", " : " and ") }) : fill(CAL_TEXT.aNone[lang], { ...vars, name });
  };
  const faq = [
    {
      q: fill(CAL_TEXT.qTamilMonth[lang], vars),
      a: [
        fill(CAL_TEXT.aTamilMonth[lang], { ...vars, from: `${firstDay.month[lang]} ${firstDay.day}`, to: `${lastDay.month[lang]} ${lastDay.day}` }),
        ...starts.map((d) => fill(CAL_TEXT.aMonthStarts[lang], { tm: d.p.tamil.month[lang], date: longDay(d.date, lang) })),
      ].join(" "),
    },
    { q: fill(CAL_TEXT.qAmavasai[lang], vars), a: obsAnswer("amavasai") },
    { q: fill(CAL_TEXT.qPournami[lang], vars), a: obsAnswer("pournami") },
  ];

  const path = (l: Lang) => monthPath(l, ym, city.slug);
  const title = fill(CAL_TEXT.monthTitle[lang], vars);
  const description = fill(CAL_TEXT.monthDesc[lang], vars);
  const h1 = fill(CAL_TEXT.monthH1[lang], { ...vars, tamilMonths: tamilRange });

  const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: path(lang), languages: languages(path) },
    openGraph: { siteName: SITE.name[lang], locale: lang === "ta" ? "ta_IN" : "en_IN", type: "website" },
  };
  const crumbs = [
    { name: SITE.name[lang], path: `/${lang}` },
    { name: fill(CAL_TEXT.yearH1[lang], vars).split(" – ")[0], path: `/${lang}/tamil-calendar/${ym.year}` },
    { name: `${month} ${ym.year}`, path: monthPath(lang, ym) },
    ...(city.slug === "chennai" ? [] : [{ name: cityName, path: path(lang) }]),
  ];
  const schema = pageSchema({ lang, path: path(lang), name: h1, description, crumbs, extra: [faqNode(path(lang), faq)] });

  return { days, vars, h1, groups, faq, metadata, schema };
}

/** Year page: every month of the year with its Tamil months, Amavasai and Pournami (Chennai). */
export function yearContent(lang: Lang, year: number, city: City) {
  const months = CAL_MONTHS.filter((m) => m.year === year).map((ym) => {
    const days = monthDays(ym, city);
    const tamil = [...new Map(days.map((d) => [d.p.tamil.monthIndex, d.p.tamil.month[lang]])).values()].join(" – ");
    const on = (key: ObservanceKey) => days.filter((d) => d.obs.some((o) => o.key === key)).map((d) => d.date);
    return { ym, tamil, amavasai: on("amavasai"), pournami: on("pournami") };
  });
  const vars = { year: String(year) };
  const path = (l: Lang) => `/${l}/tamil-calendar/${year}`;
  const h1 = fill(CAL_TEXT.yearH1[lang], vars);
  const description = fill(CAL_TEXT.yearDesc[lang], vars);
  const metadata: Metadata = {
    title: fill(CAL_TEXT.yearTitle[lang], vars),
    description,
    alternates: { canonical: path(lang), languages: languages(path) },
    openGraph: { siteName: SITE.name[lang], locale: lang === "ta" ? "ta_IN" : "en_IN", type: "website" },
  };
  const schema = pageSchema({
    lang,
    path: path(lang),
    name: h1,
    description,
    crumbs: [
      { name: SITE.name[lang], path: `/${lang}` },
      { name: h1.split(" – ")[0], path: path(lang) },
    ],
  });
  return { months, h1, metadata, schema };
}
