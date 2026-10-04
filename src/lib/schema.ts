import { SITE, type Lang } from "./site";

// schema.org structured data (JSON-LD). Every page carries the same WebSite
// node, which lets Google show "Dhina Panchangam" as the site name, plus its
// own WebPage and a BreadcrumbList for the trail shown in search results.

const WEBSITE_ID = `${SITE.url}/#website`;
const abs = (path: string) => `${SITE.url}${path}`;

type Crumb = { name: string; path: string };

/** FAQPage node for questions shown on the page. */
export const faqNode = (url: string, qa: { q: string; a: string }[]) => ({
  "@type": "FAQPage",
  "@id": `${abs(url)}#faq`,
  mainEntity: qa.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

export function pageSchema({
  lang,
  path,
  name,
  description,
  crumbs,
  extra = [],
}: {
  lang: Lang;
  path: string;
  name: string;
  description: string;
  crumbs: Crumb[]; // from the home page down to this page
  extra?: object[]; // more nodes for the graph, e.g. an FAQPage
}) {
  const url = abs(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${SITE.url}/`,
        name: SITE.name.en,
        alternateName: [SITE.name.ta, "DhinaPanchangam"],
        inLanguage: ["en", "ta-IN"],
      },
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name,
        description,
        inLanguage: lang === "ta" ? "ta-IN" : "en",
        isPartOf: { "@id": WEBSITE_ID },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
      },
      ...extra,
    ],
  };
}
