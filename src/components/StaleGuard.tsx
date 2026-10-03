"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const MAX_RELOADS = 3;
const WAIT_MS = 2500;

/** YYYY-MM-DD for "now + offset days" in the given IANA timezone. */
function expectedDate(tz: string, offset: number) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

/**
 * Today/tomorrow pages are cached and refreshed in the background, so the first
 * visitor after a quiet spell can get an old copy. If the page's date is behind
 * the city's real date, reload (the stale visit has already started a refresh);
 * after a few tries, link to the always-correct date page instead.
 */
export default function StaleGuard({
  date,
  tz,
  offset,
  datePath, // e.g. /ta/panchangam/chennai
  text,
}: {
  date: string;
  tz: string;
  offset: number;
  datePath: string;
  text: { updating: string; stale: string; open: string };
}) {
  const [state, setState] = useState<{ expected: string; gaveUp: boolean } | null>(null);

  useEffect(() => {
    const expected = expectedDate(tz, offset);
    const key = `stale-reloads:${location.pathname}`;
    let tries = 0;
    try {
      tries = Number(sessionStorage.getItem(key) ?? 0);
    } catch {}
    // Only act when the page is behind; a visitor's wrong clock can't make it older.
    if (date >= expected) {
      try {
        sessionStorage.removeItem(key);
      } catch {}
      return;
    }
    if (tries >= MAX_RELOADS) {
      setState({ expected, gaveUp: true }); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    setState({ expected, gaveUp: false });
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(key, String(tries + 1));
      } catch {}
      location.reload();
    }, WAIT_MS);
    return () => clearTimeout(timer);
  }, [date, tz, offset]);

  if (!state) return null;
  return (
    <div role="status" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
      {state.gaveUp ? (
        <>
          {text.stale}{" "}
          <Link href={`${datePath}/${state.expected}`} className="font-semibold underline">
            {text.open}
          </Link>
        </>
      ) : (
        text.updating
      )}
    </div>
  );
}
