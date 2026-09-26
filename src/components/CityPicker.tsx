"use client";

import { useRouter } from "next/navigation";

type Option = { slug: string; label: string; group: string };

export default function CityPicker({
  options,
  current,
  basePath,
  label,
}: {
  options: Option[];
  current: string;
  basePath: string; // e.g. /en/nalla-neram-today
  label: string;
}) {
  const router = useRouter();
  const groups = [...new Set(options.map((o) => o.group))];
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-stone-600 dark:text-stone-300">{label}</span>
      <select
        className="rounded-md border border-stone-300 bg-white px-2 py-1.5 text-base text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
        value={current}
        onChange={(e) => router.push(`${basePath}/${e.target.value}`)}
      >
        {groups.map((g) => (
          <optgroup key={g} label={g}>
            {options
              .filter((o) => o.group === g)
              .map((o) => (
                <option key={o.slug} value={o.slug}>
                  {o.label}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
