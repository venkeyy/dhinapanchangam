// Vratham / observance days, calculated per city from the panchangam.
//
// Every rule lives in this file so it can be checked against printed Tamil
// panchangams (Venkat's grandfather's books) and corrected in one place.
//
// Terms used below:
// - "Panchangam day" = local sunrise to the next sunrise (like the rest of the site).
// - Tithi index 0-29: 0-14 Valarpirai (Shukla) Prathamai..Pournami,
//   15-29 Theipirai (Krishna) Prathamai..Amavasai.
// - A tithi "at sunrise" is the one running when the Sun rises.
// - A "kshaya" tithi starts after sunrise and ends before the next sunrise,
//   so it is never the sunrise tithi of any day.
// - A long tithi can be running at sunrise on two days in a row. For every
//   "at sunrise" rule below, only the FIRST of the two days is marked
//   (e.g. Amavasai 8 Dec 2026 in Chennai, not also 9 Dec when it ends at 06:22 AM).

import type { Name } from "./names";
import type { Panchang } from "./panchang";

export type ObservanceKey = "amavasai" | "pournami" | "ekadasi" | "pradosham" | "sashti" | "kiruthigai" | "sankatahara";
export type Observance = { key: ObservanceKey; name: Name; icon: string };

const n = (en: string, ta: string): Name => ({ en, ta });

export const OBSERVANCE_INFO: Record<ObservanceKey, { name: Name; icon: string }> = {
  amavasai: { name: n("Amavasai", "அமாவாசை"), icon: "🌑" },
  pournami: { name: n("Pournami", "பௌர்ணமி"), icon: "🌕" },
  ekadasi: { name: n("Ekadasi", "ஏகாதசி"), icon: "🪷" },
  pradosham: { name: n("Pradosham", "பிரதோஷம்"), icon: "🔱" },
  sashti: { name: n("Sashti", "சஷ்டி"), icon: "🦚" },
  kiruthigai: { name: n("Kiruthigai", "கிருத்திகை"), icon: "🪔" },
  sankatahara: { name: n("Sankatahara Chaturthi", "சங்கடஹர சதுர்த்தி"), icon: "🐘" },
};

const TITHI = {
  VALARPIRAI_SASHTI: 5,
  VALARPIRAI_EKADASI: 10,
  VALARPIRAI_THRAYODASI: 12,
  POURNAMI: 14,
  THEIPIRAI_CHATHURTHI: 18,
  THEIPIRAI_EKADASI: 25,
  THEIPIRAI_THRAYODASI: 27,
  AMAVASAI: 29,
};
const KARTHIGAI_NATCHATHIRAM = 2; // Ashwini 0, Bharani 1, Karthigai 2

/** Pradosha kalam: from sunset to this many minutes after sunset. */
const PRADOSHA_MINUTES = 90;

const ms = (iso: string) => new Date(iso).getTime();

/** Tithi segments of the day as [start, end) in ms; the first one started before sunrise. */
const tithiSpans = (p: Panchang) =>
  p.tithi.map((e, i) => ({ index: e.index, start: i === 0 ? -Infinity : ms(p.tithi[i - 1].end), end: ms(e.end) }));

const sunriseTithi = (p: Panchang) => p.tithi[0].index;

/** True if tithi `index` is kshaya in this panchangam day (starts and ends between sunrise and next sunrise). */
const isKshaya = (p: Panchang, index: number) => p.tithi.slice(1, -1).some((e) => e.index === index);

const tithiAt = (p: Panchang, t: number) => tithiSpans(p).find((s) => t < s.end)?.index;

/** Minutes of Thrayodasi (either paksha) inside this day's pradosha kalam. */
function thrayodasiInPradosham(p: Panchang) {
  const from = ms(p.sun.set);
  const to = from + PRADOSHA_MINUTES * 60_000;
  return tithiSpans(p)
    .filter((s) => s.index === TITHI.VALARPIRAI_THRAYODASI || s.index === TITHI.THEIPIRAI_THRAYODASI)
    .reduce((sum, s) => sum + Math.max(0, Math.min(to, s.end) - Math.max(from, s.start)) / 60_000, 0);
}

/**
 * Observances for each day in `days` (consecutive dates, same city).
 * Pass one extra day before and after the range you display: the Pradosham and
 * Sankatahara rules compare neighbouring days.
 */
export function observancesFor(days: Panchang[]): Observance[][] {
  const pradosham = days.map(thrayodasiInPradosham);
  const sankatahara = days.map((p) => p.moon.rise != null && tithiAt(p, ms(p.moon.rise)) === TITHI.THEIPIRAI_CHATHURTHI);

  return days.map((p, i) => {
    const out: Observance[] = [];
    const add = (key: ObservanceKey, name?: Name) => out.push({ key, name: name ?? OBSERVANCE_INFO[key].name, icon: OBSERVANCE_INFO[key].icon });
    const tithi = sunriseTithi(p);
    const prevTithi = i > 0 ? sunriseTithi(days[i - 1]) : -1;
    /** `index` is the sunrise tithi today but was not yesterday (first of two days). */
    const startsAtSunrise = (index: number) => tithi === index && prevTithi !== index;

    // Amavasai / Pournami: the tithi is running at sunrise. If it is kshaya
    // (starts after sunrise and ends before the next sunrise), mark the day it starts.
    if (startsAtSunrise(TITHI.AMAVASAI) || isKshaya(p, TITHI.AMAVASAI)) add("amavasai");
    if (startsAtSunrise(TITHI.POURNAMI) || isKshaya(p, TITHI.POURNAMI)) add("pournami");

    // Ekadasi (Valarpirai and Theipirai): Ekadasi tithi at sunrise.
    // TO CHECK: a kshaya Ekadasi is currently not marked on any day.
    if (startsAtSunrise(TITHI.VALARPIRAI_EKADASI) || startsAtSunrise(TITHI.THEIPIRAI_EKADASI)) add("ekadasi");

    // Pradosham: Thrayodasi is running during pradosha kalam (sunset to 1.5 hours after).
    // If two evenings in a row both have some Thrayodasi in pradosha kalam, the one
    // with more of it wins (the earlier day on a tie). "Sani Pradosham" on Saturdays,
    // "Soma Pradosham" on Mondays.
    const pr = pradosham[i];
    const prev = i > 0 ? pradosham[i - 1] : 0;
    const next = i < days.length - 1 ? pradosham[i + 1] : 0;
    if (pr > 0 && pr > prev && pr >= next) {
      const wd = p.weekday.index; // 0 = Sunday
      if (wd === 6) add("pradosham", n("Sani Pradosham", "சனி பிரதோஷம்"));
      else if (wd === 1) add("pradosham", n("Soma Pradosham", "சோம பிரதோஷம்"));
      else add("pradosham");
    }

    // Sashti: Valarpirai (Shukla) Sashti at sunrise.
    if (startsAtSunrise(TITHI.VALARPIRAI_SASHTI)) add("sashti");

    // Kiruthigai: the Moon is in Karthigai natchathiram at sunrise.
    // (Like the tithi rules, only the first of two days in a row is marked.)
    const karthigai = (d: Panchang) => d.nakshatra[0].index === KARTHIGAI_NATCHATHIRAM;
    if (karthigai(p) && !(i > 0 && karthigai(days[i - 1]))) add("kiruthigai");

    // Sankatahara Chaturthi: Theipirai (Krishna) Chathurthi is running at moonrise.
    // If it is running at moonrise on two days in a row, the first day is marked.
    if (sankatahara[i] && !(i > 0 && sankatahara[i - 1])) add("sankatahara");

    return out;
  });
}
