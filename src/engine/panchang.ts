import { DateTime } from "luxon";
import { ayanamsa, dateFromJd, jdFromDate, nextRiseSet, sidereal, type GeoPos } from "./astro";
import {
  AMAVASAI,
  GOWRI,
  karanaName,
  NAKSHATRAS,
  PAKSHAS,
  PLANETS,
  POURNAMI,
  RASIS,
  TAMIL_MONTHS,
  TAMIL_YEARS,
  TITHIS,
  WEEKDAYS,
  YOGAS,
  type GowriKey,
  type Name,
  type Planet,
} from "./names";

export type Place = GeoPos & { tz: string };

export type Span = { start: string; end: string }; // ISO UTC instants
export type Element = { index: number; name: Name; end: string; extra?: Record<string, unknown> };

const mod = (a: number, m: number) => ((a % m) + m) % m;
const norm180 = (a: number) => mod(a + 180, 360) - 180;
const iso = (jd: number) => dateFromJd(jd).toISOString();

// ---------- angular quantities ----------
type Angle = (jd: number) => { val: number; speed: number };

const elongation: Angle = (jd) => {
  const s = sidereal(jd, "sun");
  const m = sidereal(jd, "moon");
  return { val: mod(m.lon - s.lon, 360), speed: m.speed - s.speed };
};
const moonLon: Angle = (jd) => {
  const m = sidereal(jd, "moon");
  return { val: m.lon, speed: m.speed };
};
const yogaSum: Angle = (jd) => {
  const s = sidereal(jd, "sun");
  const m = sidereal(jd, "moon");
  return { val: mod(m.lon + s.lon, 360), speed: m.speed + s.speed };
};
const sunLon: Angle = (jd) => {
  const s = sidereal(jd, "sun");
  return { val: s.lon, speed: s.speed };
};

/** Time when `fn` next reaches `target` degrees (Newton iteration, ~0.1 s precision). */
function crossing(fn: Angle, target: number, from: number, direction: 1 | -1 = 1): number {
  const a0 = fn(from);
  let jd = from + (direction === 1 ? mod(target - a0.val, 360) : -mod(a0.val - target, 360)) / a0.speed;
  for (let i = 0; i < 30; i++) {
    const a = fn(jd);
    const diff = norm180(target - a.val);
    jd += diff / a.speed;
    if (Math.abs(diff) < 1e-6) break;
  }
  return jd;
}

/** Successive divisions of an angle (tithi, nakshatra...) from `start` until past `end`. */
function segments(fn: Angle, size: number, count: number, start: number, end: number) {
  const out: { index: number; endJd: number }[] = [];
  let idx = Math.floor(fn(start).val / size);
  let t = start;
  for (let guard = 0; guard < 6; guard++) {
    const endJd = crossing(fn, mod((idx + 1) * size, 360), t);
    out.push({ index: mod(idx, count), endJd });
    if (endJd >= end) break;
    idx++;
    t = endJd + 1e-5;
  }
  return out;
}

// ---------- day boundaries ----------
function localMidnightJd(date: string, tz: string) {
  const dt = DateTime.fromISO(date, { zone: tz }).startOf("day");
  if (!dt.isValid) throw new Error(`Invalid date ${date}`);
  return jdFromDate(dt.toJSDate());
}

function sunTimes(date: string, place: Place) {
  const mid = localMidnightJd(date, place.tz);
  const sunrise = nextRiseSet(mid, "sun", "rise", place);
  const sunset = nextRiseSet(sunrise ?? mid, "sun", "set", place);
  const nextSunrise = nextRiseSet(sunset ?? mid + 0.5, "sun", "rise", place);
  return { mid, sunrise, sunset, nextSunrise };
}

// ---------- tables ----------
// Rahu kalam, Yamagandam and Kuligai: which eighth of the daytime (1-based), by weekday Sun..Sat
const RAHU = [8, 2, 7, 5, 6, 4, 3];
const YAMA = [5, 4, 3, 2, 1, 7, 6];
const KULIGAI = [7, 6, 5, 4, 3, 2, 1];

// Gowri panchangam order by weekday (Sun..Sat), cross-checked against several
// published Tamil calendars (Sep 2026). Saturday night's last slot varies
// between sources (Rogam vs Soram); we follow the complete-set reading (Rogam).
const G = (s: string) => s.split(" ") as GowriKey[];
const GOWRI_DAY: GowriKey[][] = [
  G("uthi amirtham rogam laabam dhanam sugam soram visham"),
  G("amirtham visham rogam laabam dhanam sugam soram uthi"),
  G("rogam laabam dhanam sugam soram uthi visham amirtham"),
  G("laabam dhanam sugam soram visham uthi amirtham rogam"),
  G("dhanam sugam soram uthi amirtham visham rogam laabam"),
  G("sugam soram uthi visham amirtham rogam laabam dhanam"),
  G("soram uthi visham amirtham rogam laabam dhanam sugam"),
];
const GOWRI_NIGHT: GowriKey[][] = [
  G("dhanam sugam soram visham uthi amirtham rogam laabam"),
  G("sugam soram uthi amirtham visham rogam laabam dhanam"),
  G("soram uthi visham amirtham rogam laabam dhanam sugam"),
  G("uthi amirtham rogam laabam dhanam sugam soram visham"),
  G("amirtham visham rogam laabam dhanam sugam soram uthi"),
  G("rogam laabam dhanam sugam soram uthi visham amirtham"),
  G("laabam dhanam sugam soram uthi visham amirtham rogam"),
];

// Horai: planetary hours in the classical (Chaldean-derived) order, starting from the weekday lord
const HORAI_ORDER: Planet[] = ["sun", "venus", "mercury", "moon", "saturn", "jupiter", "mars"];
const WEEKDAY_LORD: Planet[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];

function split(start: number, end: number, parts: number) {
  const len = (end - start) / parts;
  return Array.from({ length: parts }, (_, i) => ({ s: start + i * len, e: start + (i + 1) * len }));
}

// ---------- Tamil calendar date ----------
function tamilDate(date: string, place: Place) {
  const { sunset } = sunTimes(date, place);
  const ref = sunset!;
  const s = sunLon(ref);
  const month = Math.floor(s.val / 30);
  const sankranti = crossing(sunLon, month * 30, ref, -1);
  // Tamil rule: if the Sun enters the sign before sunset, that day is day 1; otherwise the next day.
  const sDate = DateTime.fromJSDate(dateFromJd(sankranti), { zone: place.tz }).toISODate()!;
  const sDaySunset = sunTimes(sDate, place).sunset!;
  let first = DateTime.fromISO(sDate, { zone: place.tz });
  if (sankranti > sDaySunset) first = first.plus({ days: 1 });
  const d = DateTime.fromISO(date, { zone: place.tz });
  const day = Math.round(d.diff(first, "days").days) + 1;

  const civilMonth = d.month;
  const startYear = civilMonth >= 4 && !(month >= 9 && civilMonth === 4) ? d.year : d.year - 1;
  const year = TAMIL_YEARS[mod(startYear - 1987, 60)];
  return { month: TAMIL_MONTHS[month], monthIndex: month, day, year, sankranti: iso(sankranti) };
}

// ---------- main ----------
export function computePanchang(date: string, place: Place) {
  const { sunrise, sunset, nextSunrise } = sunTimes(date, place);
  if (sunrise == null || sunset == null || nextSunrise == null) {
    throw new Error("Sun does not rise or set on this date at this location");
  }
  const weekday = DateTime.fromISO(date, { zone: place.tz }).weekday % 7; // 0 = Sunday

  const tithi: Element[] = segments(elongation, 12, 30, sunrise, nextSunrise).map(({ index, endJd }) => {
    const paksha = index < 15 ? 0 : 1;
    const i15 = index % 15;
    const name = i15 === 14 ? (paksha === 0 ? POURNAMI : AMAVASAI) : TITHIS[i15];
    return { index, name, end: iso(endJd), extra: { paksha: PAKSHAS[paksha] } };
  });
  const nakSize = 360 / 27;
  const nakshatra: Element[] = segments(moonLon, nakSize, 27, sunrise, nextSunrise).map(({ index, endJd }) => ({
    index,
    name: NAKSHATRAS[index],
    end: iso(endJd),
  }));
  const yoga: Element[] = segments(yogaSum, nakSize, 27, sunrise, nextSunrise).map(({ index, endJd }) => ({
    index,
    name: YOGAS[index],
    end: iso(endJd),
  }));
  const karana: Element[] = segments(elongation, 6, 60, sunrise, nextSunrise).map(({ index, endJd }) => ({
    index,
    name: karanaName(index),
    end: iso(endJd),
  }));

  const moonAtSunrise = sidereal(sunrise, "moon").lon;
  const sunAtSunrise = sidereal(sunrise, "sun").lon;

  const dayParts = split(sunrise, sunset, 8);
  const nightParts = split(sunset, nextSunrise, 8);
  const slot = (i: number) => ({ start: iso(dayParts[i - 1].s), end: iso(dayParts[i - 1].e) });
  const muhurta = (sunset - sunrise) / 15;

  const gowri = {
    day: GOWRI_DAY[weekday].map((k, i) => ({ key: k, ...GOWRI[k], start: iso(dayParts[i].s), end: iso(dayParts[i].e) })),
    night: GOWRI_NIGHT[weekday].map((k, i) => ({ key: k, ...GOWRI[k], start: iso(nightParts[i].s), end: iso(nightParts[i].e) })),
  };

  const firstLord = HORAI_ORDER.indexOf(WEEKDAY_LORD[weekday]);
  const horai = [...split(sunrise, sunset, 12), ...split(sunset, nextSunrise, 12)].map((p, i) => {
    const planet = HORAI_ORDER[(firstLord + i) % 7];
    return { planet, name: PLANETS[planet], start: iso(p.s), end: iso(p.e), isDay: i < 12 };
  });

  // Moonrise/moonset within the panchangam day (sunrise to next sunrise), like Drik
  const moonrise = nextRiseSet(sunrise, "moon", "rise", place);
  const moonset = nextRiseSet(sunrise, "moon", "set", place);

  return {
    date,
    place,
    weekday: { index: weekday, name: WEEKDAYS[weekday] },
    tamil: tamilDate(date, place),
    sun: { rise: iso(sunrise), set: iso(sunset), nextRise: iso(nextSunrise) },
    moon: {
      rise: moonrise != null && moonrise < nextSunrise ? iso(moonrise) : null,
      set: moonset != null && moonset < nextSunrise ? iso(moonset) : null,
    },
    tithi,
    nakshatra,
    yoga,
    karana,
    rasi: { moon: RASIS[Math.floor(moonAtSunrise / 30)], sun: RASIS[Math.floor(sunAtSunrise / 30)] },
    ayanamsa: ayanamsa(sunrise),
    rahuKalam: slot(RAHU[weekday]),
    yamagandam: slot(YAMA[weekday]),
    kuligai: slot(KULIGAI[weekday]),
    abhijit: { start: iso(sunrise + 7 * muhurta), end: iso(sunrise + 8 * muhurta), note: weekday === 3 ? "avoid-wednesday" : null },
    gowri,
    horai,
  };
}

export type Panchang = ReturnType<typeof computePanchang>;
