// Thin wrapper over Swiss Ephemeris (sweph, AGPL/LGPL).
// Uses the built-in Moshier ephemeris (no data files needed), which is
// accurate to well under a second of arc for the Sun and a few arcseconds
// for the Moon — far finer than the minute-level timings a panchangam shows.
import { calc_ut, constants as C, rise_trans, set_sid_mode, get_ayanamsa_ex_ut } from "sweph";

const EPHE = C.SEFLG_MOSEPH;
const SID_FLAGS = EPHE | C.SEFLG_SIDEREAL | C.SEFLG_SPEED;

let initialised = false;
function init() {
  if (initialised) return;
  set_sid_mode(C.SE_SIDM_LAHIRI, 0, 0); // Lahiri / Chitrapaksha ayanamsa
  initialised = true;
}

export type GeoPos = { lat: number; lon: number; alt?: number };

/** Julian Day (UT) from a JS Date */
export const jdFromDate = (d: Date) => d.getTime() / 86400000 + 2440587.5;
/** JS Date from Julian Day (UT) */
export const dateFromJd = (jd: number) => new Date(Math.round((jd - 2440587.5) * 86400000));

export type BodyPos = { lon: number; speed: number };

/** Sidereal (Lahiri) ecliptic longitude and daily speed of a body */
export function sidereal(jd: number, body: "sun" | "moon"): BodyPos {
  init();
  const ipl = body === "sun" ? C.SE_SUN : C.SE_MOON;
  const r = calc_ut(jd, ipl, SID_FLAGS);
  if (r.flag < 0) throw new Error(`swe calc error: ${r.error}`);
  return { lon: r.data[0], speed: r.data[3] };
}

export function ayanamsa(jd: number): number {
  init();
  return get_ayanamsa_ex_ut(jd, EPHE).data;
}

/**
 * Next rise or set of the Sun/Moon after `jdStart`.
 * Default Swiss Ephemeris behaviour = upper limb of the disc, with
 * atmospheric refraction — the same convention Drik Panchang uses.
 */
export function nextRiseSet(
  jdStart: number,
  body: "sun" | "moon",
  kind: "rise" | "set",
  geo: GeoPos,
): number | null {
  init();
  const ipl = body === "sun" ? C.SE_SUN : C.SE_MOON;
  const rsmi = kind === "rise" ? C.SE_CALC_RISE : C.SE_CALC_SET;
  const r = rise_trans(jdStart, ipl, null, EPHE, rsmi, [geo.lon, geo.lat, geo.alt ?? 0], 1013.25, 15);
  if (r.flag === -2) return null; // circumpolar: never rises / sets
  if (r.flag < 0) throw new Error(`swe rise_trans error: ${r.error}`);
  return r.data;
}
