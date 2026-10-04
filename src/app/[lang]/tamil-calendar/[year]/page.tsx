import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { shortDay } from "@/components/MonthCalendar";
import { DEFAULT_CITY } from "@/engine/cities";
import { OBSERVANCE_INFO } from "@/engine/observances";
import { CAL_YEARS, monthName, monthPath } from "@/lib/calendar";
import { yearContent } from "@/lib/calendar-page";
import { CAL_TEXT, fill, isLang } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return CAL_YEARS.map((y) => ({ year: String(y) }));
}

const year = (y: string) => (CAL_YEARS.includes(Number(y)) ? Number(y) : null);

export async function generateMetadata({ params }: PageProps<"/[lang]/tamil-calendar/[year]">): Promise<Metadata> {
  const { lang, year: y } = await params;
  const yr = year(y);
  return isLang(lang) && yr ? yearContent(lang, yr, DEFAULT_CITY).metadata : {};
}

export default async function YearPage({ params }: PageProps<"/[lang]/tamil-calendar/[year]">) {
  const { lang, year: y } = await params;
  const yr = year(y);
  if (!isLang(lang) || !yr) notFound();
  const { months, h1, schema } = yearContent(lang, yr, DEFAULT_CITY);
  const dates = (ds: string[]) => ds.map((d) => shortDay(d, lang)).join(", ");
  return (
    <div className="space-y-5">
      <JsonLd data={schema} />
      <div>
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{h1}</h1>
        <p className="mt-1 text-stone-600 dark:text-stone-300">{fill(CAL_TEXT.forCity[lang], { city: DEFAULT_CITY.name[lang] })}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {months.map((m) => (
          <Link
            key={m.ym.month}
            href={monthPath(lang, m.ym)}
            className="block rounded-xl border border-stone-200 bg-white p-4 shadow-sm hover:border-maroon dark:border-stone-700 dark:bg-stone-900"
          >
            <h2 className="text-lg font-semibold text-maroon">{fill(CAL_TEXT.monthCalendar[lang], { month: monthName(m.ym.month, lang), year: String(yr) })}</h2>
            <p className="mb-2 text-sm font-medium">{m.tamil}</p>
            <p className="text-sm">
              {OBSERVANCE_INFO.amavasai.icon} {OBSERVANCE_INFO.amavasai.name[lang]}: {dates(m.amavasai)}
            </p>
            <p className="text-sm">
              {OBSERVANCE_INFO.pournami.icon} {OBSERVANCE_INFO.pournami.name[lang]}: {dates(m.pournami)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
