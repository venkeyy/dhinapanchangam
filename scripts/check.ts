// Quick manual check: npx tsx scripts/check.ts 2026-09-26 chennai
import { DateTime } from "luxon";
import { computePanchang } from "../src/engine/panchang";
import { CITIES } from "../src/engine/cities";

const [date = "2026-09-26", slug = "chennai"] = process.argv.slice(2);
const city = CITIES.find((c) => c.slug === slug)!;
const t0 = performance.now();
const p = computePanchang(date, city);
const ms = performance.now() - t0;
const f = (s: string | null) =>
  s ? DateTime.fromISO(s, { zone: city.tz }).plus({ seconds: 30 }).startOf("minute").toFormat("dd LLL hh:mm a") : "—";

console.log(`${city.name.en} ${date} (${p.weekday.name.en}) — computed in ${ms.toFixed(0)} ms`);
console.log(`Tamil: ${p.tamil.year.en} ${p.tamil.month.en} ${p.tamil.day}`);
console.log(`Sunrise ${f(p.sun.rise)}  Sunset ${f(p.sun.set)}  Moonrise ${f(p.moon.rise)}  Moonset ${f(p.moon.set)}`);
console.log(`Ayanamsa ${p.ayanamsa.toFixed(6)}`);
for (const k of ["tithi", "nakshatra", "yoga", "karana"] as const)
  console.log(`${k.padEnd(10)} ` + p[k].map((e) => `${e.name.en} upto ${f(e.end)}`).join(" → "));
console.log(`Rahu ${f(p.rahuKalam.start)}–${f(p.rahuKalam.end)} | Yama ${f(p.yamagandam.start)}–${f(p.yamagandam.end)} | Kuligai ${f(p.kuligai.start)}–${f(p.kuligai.end)} | Abhijit ${f(p.abhijit.start)}–${f(p.abhijit.end)}`);
console.log("Gowri day:   " + p.gowri.day.map((g) => `${g.en} ${f(g.start).slice(-8)}`).join(", "));
console.log("Gowri night: " + p.gowri.night.map((g) => `${g.en} ${f(g.start).slice(-8)}`).join(", "));
console.log("Horai: " + p.horai.slice(0, 6).map((h) => `${h.name.en} ${f(h.start).slice(-8)}`).join(", ") + " …");
