import { notFound, redirect } from "next/navigation";
import { cityBySlug } from "@/engine/cities";
import { isLang } from "@/lib/site";

// /{lang}/panchangam/{city} without a date → today's panchangam for that city.
export default async function PanchangamCity({ params }: PageProps<"/[lang]/panchangam/[city]">) {
  const { lang, city } = await params;
  if (!isLang(lang) || !cityBySlug(city)) notFound();
  redirect(`/${lang}/panchangam-today/${city}`);
}
