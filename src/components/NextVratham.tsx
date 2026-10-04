"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type NextRow = { id: string /* the date */; href: string; start: string | null; end: string; label: string; times: string };

/**
 * "Next Amavasai: …" box. Worked out in the visitor's browser from the current
 * time, so it stays correct although the page itself is cached. Also
 * highlights that row in the table.
 */
export default function NextVratham({
  rows,
  text,
  nextYearHref,
}: {
  rows: NextRow[];
  text: { next: string; running: string; none: string; seeYear?: string };
  nextYearHref?: string;
}) {
  const [found, setFound] = useState<{ row: NextRow | null; running: boolean } | null>(null);

  useEffect(() => {
    const now = Date.now();
    const row = rows.find((r) => new Date(r.end).getTime() > now) ?? null;
    const running = !!row && row.start != null && new Date(row.start).getTime() <= now;
    setFound({ row, running }); // eslint-disable-line react-hooks/set-state-in-effect
    // Table row (d-…) and phone card (m-…) for the same date
    if (row) for (const p of ["d-", "m-"]) document.getElementById(p + row.id)?.classList.add("vr-next");
  }, [rows]);

  if (!found) return <div className="min-h-[4.5rem]" aria-hidden />;
  const box = "rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/30";
  if (!found.row)
    return (
      <div className={box}>
        {text.none}{" "}
        {nextYearHref && text.seeYear && (
          <Link href={nextYearHref} className="font-semibold text-maroon underline">
            {text.seeYear}
          </Link>
        )}
      </div>
    );
  return (
    <div className={box}>
      <div className="text-sm font-medium text-amber-900 dark:text-amber-200">{found.running ? text.running : text.next}</div>
      <Link href={found.row.href} className="block text-xl font-bold hover:text-maroon">
        {found.row.label}
      </Link>
      <div className="text-[15px] text-stone-700 dark:text-stone-300">{found.row.times}</div>
    </div>
  );
}
