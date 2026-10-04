import type { Metadata } from "next";
import { cache } from "react";
import { DateTime } from "luxon";
import type { City } from "@/engine/cities";
import type { Name } from "@/engine/names";
import { OBSERVANCE_INFO, PRADOSHA_KALAM_MINUTES, observancesFor, specialNames, type ObservanceKey } from "@/engine/observances";
import { computePanchang, type Element, type Panchang } from "@/engine/panchang";
import { faqNode, pageSchema } from "./schema";
import { LANGS, SITE, fill, type Lang } from "./site";

// ---------- addresses ----------
export const VRATHAM_KEYS: ObservanceKey[] = ["amavasai", "pournami", "ekadasi", "pradosham", "sankatahara", "sashti", "kiruthigai"];
export const VRATHAM_SLUG: Record<ObservanceKey, string> = {
  amavasai: "amavasai",
  pournami: "pournami",
  ekadasi: "ekadasi",
  pradosham: "pradosham",
  sankatahara: "sankatahara-chaturthi",
  sashti: "sashti",
  kiruthigai: "kiruthigai",
};
export const VRATHAM_YEARS = [2026, 2027];

/** /ta/amavasai/2027 (Chennai) or /ta/amavasai/2027/london */
export const vrathamPath = (lang: Lang, key: ObservanceKey, year: number, city?: string) =>
  `/${lang}/${VRATHAM_SLUG[key]}/${year}${city && city !== "chennai" ? `/${city}` : ""}`;

export const parseVrathamYear = (y: string) => (VRATHAM_YEARS.includes(Number(y)) && /^\d{4}$/.test(y) ? Number(y) : null);

// ---------- data ----------
const ms = (iso: string) => new Date(iso).getTime();

/** Which tithi (or, for Kiruthigai, natchathiram) each observance is about. */
const TARGET: Record<ObservanceKey, { kind: "tithi" | "nakshatra"; index: number[] }> = {
  amavasai: { kind: "tithi", index: [29] },
  pournami: { kind: "tithi", index: [14] },
  ekadasi: { kind: "tithi", index: [10, 25] },
  pradosham: { kind: "tithi", index: [12, 27] },
  sankatahara: { kind: "tithi", index: [18] },
  sashti: { kind: "tithi", index: [5] },
  kiruthigai: { kind: "nakshatra", index: [2] },
};

type Seg = { index: number; start: string | null; end: string };

/** One continuous list of tithi (or natchathiram) spans across consecutive days. */
function timeline(days: Panchang[], pick: (p: Panchang) => Element[]): Seg[] {
  const out: Seg[] = [];
  for (const p of days)
    for (const e of pick(p)) {
      const last = out[out.length - 1];
      // The span running at a sunrise also ended the previous day's list: same span.
      if (last && last.index === e.index && Math.abs(ms(last.end) - ms(e.end)) < 120_000) continue;
      out.push({ index: e.index, start: last ? last.end : null, end: e.end });
    }
  return out;
}

export type VrathamRow = {
  date: string;
  weekday: Name;
  tamil: { month: Name; day: number };
  name: Name;
  start: string | null; // tithi / natchathiram start (ISO)
  end: string;
  extra?: { start: string; end?: string }; // pradosha kalam, or moonrise for Sankatahara
};

/** Every date of one observance in a year, for one city. */
export function vrathamRows(key: ObservanceKey, year: number, city: City): VrathamRow[] {
  const first = DateTime.fromObject({ year, month: 1, day: 1 });
  const n = first.endOf("year").ordinal;
  // One extra day on each side: some observance rules compare neighbouring days.
  const days = Array.from({ length: n + 2 }, (_, i) => computePanchang(first.plus({ days: i - 1 }).toISODate()!, city));
  const obs = observancesFor(days);
  const t = TARGET[key];
  const line = timeline(days, (p) => (t.kind === "tithi" ? p.tithi : p.nakshatra));

  const rows: VrathamRow[] = [];
  for (let i = 1; i <= n; i++) {
    const o = obs[i].find((x) => x.key === key);
    if (!o) continue;
    const p = days[i];
    const anchor = key === "pradosham" ? p.sun.set : key === "sankatahara" && p.moon.rise ? p.moon.rise : p.sun.rise;
    const seg = line.find((s) => t.index.includes(s.index) && ms(s.end) > ms(anchor));
    if (!seg) continue;
    const extra =
      key === "pradosham"
        ? { start: p.sun.set, end: new Date(ms(p.sun.set) + PRADOSHA_KALAM_MINUTES * 60_000).toISOString() }
        : key === "sankatahara" && p.moon.rise
          ? { start: p.moon.rise }
          : undefined;
    rows.push({ date: p.date, weekday: p.weekday.name, tamil: { month: p.tamil.month, day: p.tamil.day }, name: o.name, start: seg.start, end: seg.end, extra });
  }
  return rows;
}

// ---------- text ----------
type L = Record<Lang, string>;
type VText = { h1: L; title: L; desc: L; timeQ: L; timeA: L; extra?: L };

const GENERIC_TIME_Q: L = { en: "What time does {name} start and end?", ta: "{name} எப்போது தொடங்கி எப்போது முடிகிறது?" };
const GENERIC_TIME_A: L = {
  en: "{name} starts and ends at a different time each month and usually lasts about a day. The start and end time of every {name} in {year} is in the table above, in {city} local time ({tz}).",
  ta: "{name} ஒவ்வொரு மாதமும் வெவ்வேறு நேரத்தில் தொடங்கி முடிகிறது; பொதுவாக சுமார் ஒரு நாள் நீடிக்கும். {year}-இன் ஒவ்வொரு {name} தொடக்க, முடிவு நேரமும் மேலே உள்ள அட்டவணையில் {city} உள்ளூர் நேரப்படி ({tz}) உள்ளது.",
};
const START_END: L = { en: "Start & End Time", ta: "தொடக்கம், முடிவு நேரம்" };

export const VR_TEXT: Record<ObservanceKey, VText> = {
  amavasai: {
    h1: { en: "Amavasai {year} Dates (Amavasya){cityDash}", ta: "அமாவாசை {year} தேதிகள்{cityDash}" },
    title: {
      en: "Amavasai {year} Dates{cityPart} (Amavasya) – Start & End Time, Tamil Calendar | Dhina Panchangam",
      ta: "அமாவாசை {year} தேதிகள்{cityPart} – தொடக்கம், முடிவு நேரம் | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "All Amavasai (Amavasya) dates in {year} for {city} with start and end time, weekday and Tamil month, including Aadi Amavasai, Mahalaya Amavasai and Thai Amavasai.",
      ta: "{city} {year} அமாவாசை தேதிகள்: தொடக்க, முடிவு நேரம், கிழமை, தமிழ் மாதம். ஆடி அமாவாசை, மஹாளய அமாவாசை, தை அமாவாசை உட்பட.",
    },
    timeQ: GENERIC_TIME_Q,
    timeA: GENERIC_TIME_A,
  },
  pournami: {
    h1: { en: "Pournami {year} Dates (Purnima){cityDash}", ta: "பௌர்ணமி {year} தேதிகள்{cityDash}" },
    title: {
      en: "Pournami {year} Dates{cityPart} (Purnima) – Start & End Time, Tamil Calendar | Dhina Panchangam",
      ta: "பௌர்ணமி {year} தேதிகள்{cityPart} – தொடக்கம், முடிவு நேரம் | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "All Pournami (Purnima) dates in {year} for {city} with start and end time, weekday and Tamil month, including Chithra Pournami and Karthigai Pournami.",
      ta: "{city} {year} பௌர்ணமி தேதிகள்: தொடக்க, முடிவு நேரம், கிழமை, தமிழ் மாதம். சித்ரா பௌர்ணமி, கார்த்திகை பௌர்ணமி உட்பட.",
    },
    timeQ: GENERIC_TIME_Q,
    timeA: GENERIC_TIME_A,
  },
  ekadasi: {
    h1: { en: "Ekadasi {year} Dates (Ekadashi){cityDash}", ta: "ஏகாதசி {year} தேதிகள்{cityDash}" },
    title: {
      en: "Ekadasi {year} Dates{cityPart} (Ekadashi List) – Start & End Time | Dhina Panchangam",
      ta: "ஏகாதசி {year} தேதிகள்{cityPart} – தொடக்கம், முடிவு நேரம் | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "Ekadasi (Ekadashi) {year} list for {city}: every Valarpirai and Theipirai Ekadasi with start and end time and Tamil month, including Vaikunta Ekadasi.",
      ta: "{city} {year} ஏகாதசி பட்டியல்: வளர்பிறை, தேய்பிறை ஏகாதசி தொடக்க, முடிவு நேரம். வைகுண்ட ஏகாதசி உட்பட.",
    },
    timeQ: GENERIC_TIME_Q,
    timeA: GENERIC_TIME_A,
  },
  pradosham: {
    h1: { en: "Pradosham {year} Dates (Pradosh Vrat){cityDash}", ta: "பிரதோஷம் {year} தேதிகள்{cityDash}" },
    title: {
      en: "Pradosham {year} Dates{cityPart} (Pradosh Vrat) – Pradosha Kalam Timings | Dhina Panchangam",
      ta: "பிரதோஷம் {year} தேதிகள்{cityPart} – பிரதோஷ கால நேரம் | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "All Pradosham (Pradosh Vrat) dates in {year} for {city} with pradosha kalam timings, Thrayodasi start and end time, Sani Pradosham and Soma Pradosham.",
      ta: "{city} {year} பிரதோஷம் தேதிகள்: பிரதோஷ கால நேரம், திரயோதசி தொடக்க, முடிவு நேரம், சனி பிரதோஷம், சோம பிரதோஷம்.",
    },
    timeQ: { en: "What is pradosha kalam?", ta: "பிரதோஷ காலம் என்றால் என்ன?" },
    timeA: {
      en: "Pradosha kalam is the time from sunset to about 1.5 hours after sunset on a Pradosham day, when Thrayodasi is running. Shiva worship at this time is considered most auspicious. The pradosha kalam of every Pradosham in {year} is in the table above, in {city} local time ({tz}).",
      ta: "பிரதோஷ காலம் என்பது திரயோதசி நாளில் சூரிய அஸ்தமனம் முதல் சுமார் 1.5 மணி நேரம் வரையிலான நேரம். இந்த நேரத்தில் சிவ வழிபாடு மிகச் சிறப்பானது. {year}-இன் ஒவ்வொரு பிரதோஷ கால நேரமும் மேலே உள்ள அட்டவணையில் {city} உள்ளூர் நேரப்படி ({tz}) உள்ளது.",
    },
    extra: { en: "Pradosha kalam", ta: "பிரதோஷ காலம்" },
  },
  sankatahara: {
    h1: { en: "Sankatahara Chaturthi {year} Dates (Sankashti Chaturthi){cityDash}", ta: "சங்கடஹர சதுர்த்தி {year} தேதிகள்{cityDash}" },
    title: {
      en: "Sankatahara Chaturthi {year} Dates{cityPart} (Sankashti) – Moonrise Time | Dhina Panchangam",
      ta: "சங்கடஹர சதுர்த்தி {year} தேதிகள்{cityPart} – சந்திர உதய நேரம் | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "Sankatahara Chaturthi (Sankashti Chaturthi) {year} dates for {city} with moonrise (chandrodaya) time and Chathurthi start and end time.",
      ta: "{city} {year} சங்கடஹர சதுர்த்தி தேதிகள்: சந்திர உதய நேரம், சதுர்த்தி தொடக்க, முடிவு நேரம்.",
    },
    timeQ: { en: "What time is moonrise on Sankatahara Chaturthi?", ta: "சங்கடஹர சதுர்த்தி அன்று சந்திர உதயம் எப்போது?" },
    timeA: {
      en: "The Sankatahara Chaturthi fast is completed after seeing the moon. The moonrise (chandrodaya) time of every Sankatahara Chaturthi in {year} is in the table above, in {city} local time ({tz}).",
      ta: "சங்கடஹர சதுர்த்தி விரதம் சந்திரனைக் கண்ட பின் நிறைவு செய்யப்படுகிறது. {year}-இன் ஒவ்வொரு சங்கடஹர சதுர்த்தியின் சந்திர உதய நேரமும் மேலே உள்ள அட்டவணையில் {city} உள்ளூர் நேரப்படி ({tz}) உள்ளது.",
    },
    extra: { en: "Moonrise", ta: "சந்திர உதயம்" },
  },
  sashti: {
    h1: { en: "Sashti Viratham {year} Dates{cityDash}", ta: "சஷ்டி விரதம் {year} தேதிகள்{cityDash}" },
    title: {
      en: "Sashti Viratham {year} Dates{cityPart} – Start & End Time | Dhina Panchangam",
      ta: "சஷ்டி விரதம் {year} தேதிகள்{cityPart} – தொடக்கம், முடிவு நேரம் | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "All Sashti Viratham dates in {year} for {city} (Valarpirai Sashti) with start and end time and Tamil month, including Skanda Sashti.",
      ta: "{city} {year} சஷ்டி விரத தேதிகள் (வளர்பிறை சஷ்டி): தொடக்க, முடிவு நேரம். கந்த சஷ்டி உட்பட.",
    },
    timeQ: GENERIC_TIME_Q,
    timeA: GENERIC_TIME_A,
  },
  kiruthigai: {
    h1: { en: "Kiruthigai {year} Dates (Karthigai Viratham){cityDash}", ta: "கிருத்திகை {year} தேதிகள் (கார்த்திகை விரதம்){cityDash}" },
    title: {
      en: "Kiruthigai Dates {year}{cityPart} (Karthigai Viratham) – Start & End Time | Dhina Panchangam",
      ta: "கிருத்திகை {year} தேதிகள்{cityPart} (கார்த்திகை விரதம்) – தொடக்கம், முடிவு நேரம் | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "All Kiruthigai (Karthigai natchathiram) viratham dates in {year} for {city} with start and end time, including Aadi Kiruthigai and Karthigai Deepam.",
      ta: "{city} {year} கிருத்திகை விரத தேதிகள்: தொடக்க, முடிவு நேரம். ஆடி கிருத்திகை, கார்த்திகை தீபம் உட்பட.",
    },
    timeQ: GENERIC_TIME_Q,
    timeA: GENERIC_TIME_A,
  },
};

export const VR_UI: Record<string, L> = {
  date: { en: "Date", ta: "தேதி" },
  tamilDate: { en: "Tamil date", ta: "தமிழ் தேதி" },
  name: { en: "Name", ta: "பெயர்" },
  starts: { en: "Starts", ta: "தொடக்கம்" },
  ends: { en: "Ends", ta: "முடிவு" },
  next: { en: "Next {name}", ta: "அடுத்த {name}" },
  running: { en: "{name} is running now", ta: "இப்போது {name}" },
  none: { en: "No more {name} days in {year}.", ta: "{year}-இல் இனி {name} இல்லை." },
  seeYear: { en: "See {year}", ta: "{year} பார்க்க" },
  otherVrathams: { en: "Other vratham dates", ta: "மற்ற விரத நாட்கள்" },
  forCity: { en: "Calculated for {city} ({tz}). Times are local time, rounded to the minute.", ta: "{city} ({tz}) நேரப்படி கணக்கிடப்பட்டது." },
  faq: { en: "Frequently asked questions", ta: "அடிக்கடி கேட்கப்படும் கேள்விகள்" },
  nextQ: { en: "When is the next {name}?", ta: "அடுத்த {name} எப்போது?" },
  nextA: {
    en: "The next {name} for {city} is shown at the top of this page and updates automatically. There are {count} {name} days in {year} in {city}, all listed in the table with their timings.",
    ta: "{city} நகரத்திற்கான அடுத்த {name} இந்தப் பக்கத்தின் மேலே காட்டப்படுகிறது; அது தானாகப் புதுப்பிக்கப்படும். {year}-இல் {city} நகரத்தில் {count} {name} நாட்கள் உள்ளன; அனைத்தும் அட்டவணையில் உள்ளன.",
  },
  specialQ: { en: "When is {special} in {year}?", ta: "{year} {special} எப்போது?" },
  specialA: { en: "In {year}, {special} ({city}) is on {dates}.", ta: "{year} {special} ({city}): {dates}." },
  specialNone: { en: "There is no {special} in {year} ({city}).", ta: "{year}-இல் {special} இல்லை ({city})." },
  startEnd: START_END,
};

// ---------- page content ----------
const longDay = (date: string, lang: Lang) =>
  DateTime.fromISO(date).setLocale(lang === "ta" ? "ta" : "en").toFormat(lang === "ta" ? "d MMMM (cccc)" : "cccc, d MMMM");

const languages = (path: (l: Lang) => string) =>
  Object.fromEntries([...LANGS.map((l) => [l === "ta" ? "ta-IN" : "en", path(l)]), ["x-default", path("en")]]);

function vrathamContentUncached(lang: Lang, key: ObservanceKey, year: number, city: City) {
  const rows = vrathamRows(key, year, city);
  const name = OBSERVANCE_INFO[key].name[lang];
  const cityName = city.name[lang];
  const isDefault = city.slug === "chennai";
  const vars = {
    year: String(year),
    city: cityName,
    tz: city.tz,
    name,
    count: String(rows.length),
    cityPart: isDefault ? "" : ` ${cityName}`,
    cityDash: isDefault ? "" : ` – ${cityName}`,
  };
  const tx = VR_TEXT[key];
  const h1 = fill(tx.h1[lang], vars);
  const title = fill(tx.title[lang], vars);
  const description = fill(tx.desc[lang], vars);

  const faq = [
    { q: fill(VR_UI.nextQ[lang], vars), a: fill(VR_UI.nextA[lang], vars) },
    { q: fill(tx.timeQ[lang], vars), a: fill(tx.timeA[lang], vars) },
    ...specialNames(key).map((sp) => {
      const special = sp[lang];
      const dates = rows.filter((r) => r.name.en === sp.en).map((r) => longDay(r.date, lang));
      return {
        q: fill(VR_UI.specialQ[lang], { ...vars, special }),
        a: dates.length
          ? fill(VR_UI.specialA[lang], { ...vars, special, dates: dates.join(lang === "ta" ? ", " : " and ") })
          : fill(VR_UI.specialNone[lang], { ...vars, special }),
      };
    }),
  ];

  const path = (l: Lang) => vrathamPath(l, key, year, city.slug);
  const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: path(lang), languages: languages(path) },
    openGraph: { siteName: SITE.name[lang], locale: lang === "ta" ? "ta_IN" : "en_IN", type: "website" },
  };
  const crumbs = [
    { name: SITE.name[lang], path: `/${lang}` },
    { name: `${name} ${year}`, path: vrathamPath(lang, key, year) },
    ...(isDefault ? [] : [{ name: cityName, path: path(lang) }]),
  ];
  const schema = pageSchema({ lang, path: path(lang), name: h1, description, crumbs, extra: [faqNode(path(lang), faq)] });
  return { rows, vars, h1, faq, metadata, schema, extraLabel: tx.extra?.[lang] };
}

/** Cached per request: the page and its metadata share one calculation. */
export const vrathamContent = cache(vrathamContentUncached);
