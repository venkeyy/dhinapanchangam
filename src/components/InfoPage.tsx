import JsonLd from "@/components/JsonLd";
import { pageSchema } from "@/lib/schema";
import { SITE, type Lang } from "@/lib/site";

export type Section = { h: string; p: React.ReactNode[] };

/** Plain text page (Contact, Privacy): heading, intro, sections. */
export default function InfoPage({
  lang,
  path,
  title,
  intro,
  sections,
  updated,
}: {
  lang: Lang;
  path: string;
  title: string;
  intro?: React.ReactNode;
  sections: Section[];
  updated?: string;
}) {
  return (
    <article className="max-w-2xl space-y-5 text-[15px] leading-relaxed">
      <JsonLd
        data={pageSchema({ lang, path, name: title, description: title, crumbs: [{ name: SITE.name[lang], path: `/${lang}` }, { name: title, path }] })}
      />
      <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
      {updated && <p className="text-sm text-stone-500">{updated}</p>}
      {intro && <p>{intro}</p>}
      {sections.map((s) => (
        <section key={s.h}>
          <h2 className="mb-1 text-lg font-semibold text-maroon">{s.h}</h2>
          {s.p.map((x, i) => (
            <p key={i} className="mb-2">
              {x}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}

export const Email = () => (
  <a href={`mailto:${SITE.email}`} className="font-semibold text-maroon underline">
    {SITE.email}
  </a>
);
