// Lists observance dates for checking against a printed Tamil calendar:
//   npx tsx scripts/observances.ts 2026-10-01 2026-12-31 chennai
import { DateTime } from "luxon";
import { CITIES } from "../src/engine/cities";
import { observancesFor } from "../src/engine/observances";
import { computePanchang } from "../src/engine/panchang";

const [from = "2026-10-01", to = "2026-12-31", slug = "chennai"] = process.argv.slice(2);
const city = CITIES.find((c) => c.slug === slug)!;

const dates: string[] = [];
for (let d = DateTime.fromISO(from).minus({ days: 1 }); d <= DateTime.fromISO(to).plus({ days: 1 }); d = d.plus({ days: 1 })) dates.push(d.toISODate()!);
const days = dates.map((d) => computePanchang(d, city));
const obs = observancesFor(days);

const t = (iso: string | null) => (iso ? DateTime.fromISO(iso, { zone: city.tz }).plus({ seconds: 30 }).toFormat("dd LLL hh:mm a") : "—");
console.log(`${city.name.en}, ${from} to ${to}\n`);
for (const key of ["amavasai", "pournami", "pradosham", "sankatahara", "ekadasi", "sashti", "kiruthigai"]) {
  const rows = days.flatMap((p, i) => (i === 0 || i === days.length - 1 ? [] : obs[i].filter((o) => o.key === key).map((o) => ({ p, o }))));
  console.log(`${rows[0]?.o.name.en.replace(/^(Sani|Soma) /, "") ?? key}:`);
  for (const { p, o } of rows) {
    const tithi = p.tithi.map((e) => `${e.name.en} till ${t(e.end)}`).join(", ");
    const extra = key === "sankatahara" ? `  moonrise ${t(p.moon.rise)}` : key === "pradosham" ? `  sunset ${t(p.sun.set)}` : "";
    console.log(`  ${DateTime.fromISO(p.date).toFormat("ccc dd LLL yyyy")}  ${p.tamil.month.en} ${p.tamil.day}  ${o.name.en.padEnd(22)} [${tithi}]${extra}`);
  }
  console.log();
}
