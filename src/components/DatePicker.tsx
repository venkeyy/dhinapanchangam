"use client";

import { useRouter } from "next/navigation";

export default function DatePicker({
  basePath,
  value,
  min,
  max,
  label,
  button,
}: {
  basePath: string; // e.g. /ta/panchangam/chennai
  value: string;
  min: string;
  max: string;
  label: string;
  button: string;
}) {
  const router = useRouter();
  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const date = new FormData(e.currentTarget).get("date");
        if (typeof date === "string" && date >= min && date <= max) router.push(`${basePath}/${date}`);
      }}
    >
      <label className="flex items-center gap-2">
        <span className="text-stone-600 dark:text-stone-300">{label}</span>
        <input
          type="date"
          name="date"
          required
          defaultValue={value}
          min={min}
          max={max}
          className="rounded-md border border-stone-300 bg-white px-2 py-1 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
        />
      </label>
      <button type="submit" className="rounded-md bg-maroon px-3 py-1 text-white hover:opacity-90">
        {button}
      </button>
    </form>
  );
}
