import type { MetadataRoute } from "next";
import { CITIES } from "@/engine/cities";
import { LANGS, SITE, TOOLS } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const home = LANGS.map((l) => ({ url: `${SITE.url}/${l}`, lastModified: now, changeFrequency: "daily" as const, priority: 1 }));
  const pages = LANGS.flatMap((l) =>
    TOOLS.flatMap((t) =>
      CITIES.map((c) => ({
        url: `${SITE.url}/${l}/${t}/${c.slug}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: t.endsWith("-tomorrow") ? (c.country === "IN" ? 0.7 : 0.5) : c.country === "IN" ? 0.8 : 0.6,
      })),
    ),
  );
  return [...home, ...pages];
}
