import Link from "next/link";
import type { Panchang } from "@/engine/panchang";
import type { City } from "@/engine/cities";
import { fmtLongDate, fmtTime } from "@/lib/format";
import { T, TOOLS, TOOL_TEXT, fill, type Lang, type Tool } from "@/lib/site";

type Props = { p: Panchang; city: City; lang: Lang; tool: Tool };

function Card({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <h2 className="mb-3 text-lg font-semibold text-maroon">{title}</h2>
      {children}
    </section>
  );
}

export default function PanchangView({ p, city, lang, tool }: Props) {
  const tz = city.tz;
  const t = (k: string) => T[k][lang];
  const time = (iso: string) => fmtTime(iso, tz, p.date, lang);
  const range = (s: { start: string; end: string }) => `${time(s.start)} – ${time(s.end)}`;
  const nm = (x: { en: string; ta: string }) => (lang === "ta" ? x.ta : x.en);

  const chain = (els: Panchang["tithi"]) =>
    els.map((e, i) => (
      <span key={i}>
        {i > 0 && <span className="text-stone-400"> → </span>}
        <strong>{nm(e.name)}</strong> <span className="text-stone-500">{lang === "ta" ? `${time(e.end)} ${t("upto")}` : `${t("upto")} ${time(e.end)}`}</span>
      </span>
    ));

  const paksha = p.tithi[0].extra?.paksha as { en: string; ta: string };

  const coreRows: [string, React.ReactNode][] = [
    [t("tithi"), chain(p.tithi)],
    [t("paksha"), nm(paksha)],
    [t("nakshatra"), chain(p.nakshatra)],
    [t("yoga"), chain(p.yoga)],
    [t("karana"), chain(p.karana)],
    [t("sunrise"), time(p.sun.rise)],
    [t("sunset"), time(p.sun.set)],
    [t("moonrise"), p.moon.rise ? time(p.moon.rise) : t("none")],
    [t("moonset"), p.moon.set ? time(p.moon.set) : t("none")],
    [t("moonRasi"), nm(p.rasi.moon)],
    [t("sunRasi"), nm(p.rasi.sun)],
    [t("ayanamsa"), `${p.ayanamsa.toFixed(4)}°`],
  ];

  const core = (
    <Card title={`${t("panchangam")}`} id="panchangam">
      <dl className="divide-y divide-stone-100 dark:divide-stone-800">
        {coreRows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-2 py-2 text-[15px]">
            <dt className="text-stone-500">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );

  const avoid = (
    <Card title={t("avoid")} id="rahu-kalam">
      <div className="grid gap-3 sm:grid-cols-3">
        {(
          [
            ["rahu", p.rahuKalam],
            ["yama", p.yamagandam],
            ["kuligai", p.kuligai],
          ] as const
        ).map(([k, s]) => (
          <div key={k} className="rounded-lg bg-red-50 p-3 dark:bg-red-950/40">
            <div className="text-sm text-red-800 dark:text-red-300">{t(k)}</div>
            <div className="text-lg font-semibold">{range(s)}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[15px]">
        <span className="text-stone-500">{t("abhijit")}: </span>
        <strong>{range(p.abhijit)}</strong>
        {p.abhijit.note && <span className="text-stone-500"> ({t("abhijitWed")})</span>}
      </p>
    </Card>
  );

  const gowriList = (rows: Panchang["gowri"]["day"]) => (
    <ul className="divide-y divide-stone-100 dark:divide-stone-800">
      {rows.map((g, i) => (
        <li key={i} className="flex flex-wrap items-center justify-between gap-x-3 py-1.5 text-[15px]">
          <span className="flex items-center gap-2">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${g.good ? "bg-green-600" : "bg-red-500"}`} />
            <strong>{nm(g)}</strong>
            <span className="text-xs text-stone-500">{g.good ? t("good") : t("bad")}</span>
          </span>
          <span className="ml-auto text-right tabular-nums">{range(g)}</span>
        </li>
      ))}
    </ul>
  );
  // Merge back-to-back good Gowri slots into single nalla neram windows
  const nallaNeram: { start: string; end: string; names: string[]; part: "day" | "night" }[] = [];
  for (const [part, list] of [["day", p.gowri.day], ["night", p.gowri.night]] as const) for (const g of list) {
    if (!g.good) continue;
    const last = nallaNeram[nallaNeram.length - 1];
    if (last && last.end === g.start && last.part === part) {
      last.end = g.end;
      last.names.push(nm(g));
    } else nallaNeram.push({ start: g.start, end: g.end, names: [nm(g)], part });
  }
  const gowri = (
    <Card title={t("gowri")} id="nalla-neram">
      <div className="mb-4 rounded-lg bg-green-50 p-3 dark:bg-green-950/40">
        <div className="mb-1 text-sm text-green-800 dark:text-green-300">{t("nallaNeram")}</div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[15px] font-semibold">
          {nallaNeram.map((g, i) => (
            <span key={i}>
              {range(g)} <span className="text-xs font-normal text-stone-500">({g.names.join(", ")})</span>
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-1 font-medium">{t("gowriDay")}</h3>
          {gowriList(p.gowri.day)}
        </div>
        <div>
          <h3 className="mb-1 font-medium">{t("gowriNight")}</h3>
          {gowriList(p.gowri.night)}
        </div>
      </div>
    </Card>
  );

  const horaiList = (rows: Panchang["horai"]) => (
    <ul className="divide-y divide-stone-100 dark:divide-stone-800">
      {rows.map((h, i) => (
        <li key={i} className="flex flex-wrap justify-between gap-x-3 py-1.5 text-[15px]">
          <strong>{nm(h.name)}</strong>
          <span className="ml-auto text-right tabular-nums">{range(h)}</span>
        </li>
      ))}
    </ul>
  );
  const horai = (
    <Card title={t("horai")} id="horai">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-1 font-medium">{t("horaiDay")}</h3>
          {horaiList(p.horai.filter((h) => h.isDay))}
        </div>
        <div>
          <h3 className="mb-1 font-medium">{t("horaiNight")}</h3>
          {horaiList(p.horai.filter((h) => !h.isDay))}
        </div>
      </div>
    </Card>
  );

  const order: Record<Tool, React.ReactNode[]> = {
    "panchangam-today": [core, avoid, gowri, horai],
    "nalla-neram-today": [gowri, avoid, core, horai],
    "rahu-kalam-today": [avoid, gowri, core, horai],
    "horai-today": [horai, avoid, gowri, core],
  };

  const tamilLine =
    lang === "ta"
      ? `${p.tamil.year.ta} ${t("varusham")}, ${p.tamil.month.ta} ${p.tamil.day}, ${p.weekday.name.ta}`
      : `${p.tamil.year.en} year, ${p.tamil.month.en} ${p.tamil.day}, ${p.weekday.name.en}`;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{fill(TOOL_TEXT[tool].h1[lang], { city: nm(city.name) })}</h1>
        <p className="mt-1 text-stone-600 dark:text-stone-300">
          {fmtLongDate(p.date, tz, lang)} · <span className="font-medium">{tamilLine}</span>
        </p>
      </div>

      {order[tool].map((node, i) => (
        <div key={i}>{node}</div>
      ))}

      <nav className="flex flex-wrap gap-2 text-sm">
        {TOOLS.filter((x) => x !== tool).map((x) => (
          <Link key={x} href={`/${lang}/${x}/${city.slug}`} className="rounded-full border border-stone-300 px-3 py-1 hover:bg-stone-100 dark:border-stone-600 dark:hover:bg-stone-800">
            {fill(TOOL_TEXT[x].h1[lang], { city: nm(city.name) })}
          </Link>
        ))}
      </nav>

      <p className="text-sm text-stone-500">{fill(T.method[lang], { city: nm(city.name), tz })}</p>
    </div>
  );
}
