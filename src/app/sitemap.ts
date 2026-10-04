import type { MetadataRoute } from "next";
import { CITIES } from "@/engine/cities";
import { CAL_MONTHS, CAL_YEARS, monthPath } from "@/lib/calendar";
import { VRATHAM_KEYS, VRATHAM_YEARS, vrathamPath } from "@/lib/vratham";
import { LANGS, SITE, TOOLS, type Lang } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

/** One entry per language, each listing both language versions (hreflang). */
function both(path: (l: Lang) => string, rest: Omit<Entry, "url" | "alternates">): Entry[] {
  const languages = { en: `${SITE.url}${path("en")}`, "ta-IN": `${SITE.url}${path("ta")}`, "x-default": `${SITE.url}${path("en")}` };
  return LANGS.map((l) => ({ url: `${SITE.url}${path(l)}`, alternates: { languages }, ...rest }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const home = both((l) => `/${l}`, { lastModified: now, changeFrequency: "daily", priority: 1 });
  const tools = TOOLS.flatMap((t) =>
    CITIES.flatMap((c) =>
      both((l) => `/${l}/${t}/${c.slug}`, {
        lastModified: now,
        changeFrequency: "daily",
        priority: t.endsWith("-tomorrow") ? (c.country === "IN" ? 0.7 : 0.5) : c.country === "IN" ? 0.8 : 0.6,
      }),
    ),
  );
  // Calendar pages don't change, so no lastModified.
  const years = CAL_YEARS.flatMap((y) => both((l) => `/${l}/tamil-calendar/${y}`, { changeFrequency: "monthly", priority: 0.9 }));
  const months = CAL_MONTHS.flatMap((m) =>
    CITIES.flatMap((c) =>
      both((l) => monthPath(l, m, c.slug), { changeFrequency: "monthly", priority: c.slug === "chennai" ? 0.9 : c.country === "IN" ? 0.6 : 0.5 }),
    ),
  );
  const vrathams = VRATHAM_KEYS.flatMap((k) =>
    VRATHAM_YEARS.flatMap((y) =>
      CITIES.flatMap((c) =>
        both((l) => vrathamPath(l, k, y, c.slug), { changeFrequency: "monthly", priority: c.slug === "chennai" ? 0.9 : c.country === "IN" ? 0.6 : 0.5 }),
      ),
    ),
  );
  const info = ["contact", "privacy"].flatMap((p) => both((l) => `/${l}/${p}`, { changeFrequency: "yearly", priority: 0.2 }));
  return [...home, ...tools, ...years, ...months, ...vrathams, ...info];
}
