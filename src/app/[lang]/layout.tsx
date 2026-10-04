import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../globals.css";
import { CAL_TEXT, LANGS, SITE, T, TODAY_TOOLS, TOOL_TEXT, isLang } from "@/lib/site";

// No `dynamicParams = false` here: child routes inherit it, and the any-date
// pages must render on demand. Unknown languages still 404 via notFound().
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const other = lang === "en" ? "ta" : "en";
  return (
    <html lang={lang}>
      <body className="min-h-screen antialiased">
        <header className="border-b border-stone-200 bg-white/80 dark:border-stone-800 dark:bg-stone-900/80">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-4 py-3">
            <Link href={`/${lang}`} className="text-xl font-bold text-maroon">
              {SITE.name[lang]}
            </Link>
            <nav className="flex flex-wrap items-center gap-3 text-sm">
              {TODAY_TOOLS.map((tool) => (
                <Link key={tool} href={`/${lang}/${tool}/chennai`} className="hover:text-maroon">
                  {TOOL_TEXT[tool].nav[lang]}
                </Link>
              ))}
              <Link href={`/${lang}/tamil-calendar`} className="hover:text-maroon">
                {CAL_TEXT.nav[lang]}
              </Link>
              <Link href={`/${other}`} className="rounded border border-stone-300 px-2 py-0.5 dark:border-stone-600" hrefLang={other}>
                {T.langSwitch[lang]}
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-4xl px-4 pb-10 text-xs text-stone-500">
          © {new Date().getFullYear()} {SITE.name[lang]} ·{" "}
          <a href={SITE.repo} className="underline">
            {T.source[lang]}
          </a>
        </footer>
      </body>
      {/* Set NEXT_PUBLIC_GA_ID in Netlify; without it (e.g. local dev) nothing is tracked. */}
      {SITE.gaId && <GoogleAnalytics gaId={SITE.gaId} />}
    </html>
  );
}
