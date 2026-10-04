import { DateTime } from "luxon";
import { notFound, redirect } from "next/navigation";
import { DEFAULT_CITY } from "@/engine/cities";
import { CAL_MONTHS, inCalendar, monthPath } from "@/lib/calendar";
import { isLang } from "@/lib/site";

// /{lang}/tamil-calendar → this month's calendar (Chennai time), so the header
// menu link never goes stale. Before/after the covered range, the first/last month.
export const dynamic = "force-dynamic";

export default async function CurrentMonth({ params }: PageProps<"/[lang]/tamil-calendar">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const now = DateTime.now().setZone(DEFAULT_CITY.tz);
  const ym = { year: now.year, month: now.month };
  const target = inCalendar(ym) ? ym : ym.year * 12 + ym.month < CAL_MONTHS[0].year * 12 + CAL_MONTHS[0].month ? CAL_MONTHS[0] : CAL_MONTHS.at(-1)!;
  redirect(monthPath(lang, target));
}
