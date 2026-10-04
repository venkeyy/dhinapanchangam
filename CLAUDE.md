@AGENTS.md

# Dhina Panchangam — project brief for Claude Code

Bilingual (Tamil + English) daily panchangam site for any city in the world, built to compete with drikpanchang.com on Tamil searches. Owner: Venkat (Chennai). Domain: dhinapanchangam.com (bought Oct 2026 at GoDaddy; DNS stays at GoDaddy: A @ 75.2.60.5, CNAME www to dhinapanchangam.netlify.app). The old .netlify.app address 301-redirects to it (netlify.toml).

## Decisions (do not change without asking)
- Stack: Next.js (App Router, TypeScript, Tailwind) on Netlify, code on a PUBLIC GitHub repo.
- Engine: Swiss Ephemeris via the `sweph` npm package (native N-API addon with prebuilt binaries), built-in Moshier ephemeris (flag SEFLG_MOSEPH, no data files). Licence AGPL-3.0, so the repo must stay public. Never commit secrets; use Netlify environment variables.
- Ayanamsa: Lahiri (SE_SIDM_LAHIRI).
- Rahu kalam, yamagandam, kuligai, Gowri (nalla neram) and horai are calculated from the REAL local sunrise/sunset (like Drik), not fixed 6 AM clock times.
- Sunrise/sunset = upper limb with refraction (Swiss Ephemeris default). Panchangam day = sunrise to next sunrise. Times are shown rounded to the nearest minute.
- URLs: /{en|ta}/{tool}/{city-slug}, tools = panchangam, nalla-neram, rahu-kalam, horai, each as -today and -tomorrow (e.g. nalla-neram-tomorrow). Any date 1950–2100: /{en|ta}/panchangam/{city-slug}/{yyyy-mm-dd} (full panchangam, rendered on first visit then cached, indexable but not in the sitemap). Tamil monthly calendar: /{en|ta}/tamil-calendar/{year}/{month} (Chennai) and /{en|ta}/tamil-calendar/{year}/{month}/{city-slug} for other cities (Oct 2026–Dec 2027, set by CAL_FIRST/CAL_LAST in site.ts); year pages /{en|ta}/tamil-calendar/{year}; /{en|ta}/tamil-calendar redirects to the current month (header menu link). Vratham date pages: /{en|ta}/{amavasai|pournami|ekadasi|pradosham|sankatahara-chaturthi|sashti|kiruthigai}/{year} (Chennai) and .../{year}/{city-slug} (2026 and 2027, VRATHAM_YEARS in src/lib/vratham.ts); Hindi spellings (Amavasya, Purnima, Ekadashi, Pradosh Vrat, Sankashti) are in titles/headings only. Calendar day cells link to the date pages above (the "Tamil daily calendar"). hreflang between en and ta-IN, also in the sitemap. Titles target romanised Tamil search terms ("nalla neram today", "rahu kalam today", "today panchangam tamil").
- Analytics: Google Analytics 4 via @next/third-parties, ID in the Netlify env var NEXT_PUBLIC_GA_ID (no ID = no tracking, e.g. local dev). No cookie banner yet (Venkat chose this, Oct 2026); add an EU/UK consent banner before AdSense.
- City pages must show real computed data per city (no thin duplicate pages). Grow the city list gradually.

## Where things are
- `src/engine/astro.ts` — Swiss Ephemeris wrapper (sidereal positions, rise/set).
- `src/engine/panchang.ts` — tithi, natchathiram, yogam, karanam (with end times), rahu kalam/yamagandam/kuligai, abhijit, Gowri day/night table, horai, Tamil month/date/year.
- `src/engine/names.ts` — all names in romanised Tamil + Tamil script.
- `src/engine/cities.ts` — launch city list (63 cities, IANA timezones).
- `src/engine/observances.ts` — ALL vratham rules (Amavasai, Pournami, Ekadasi, Pradosham, Sashti, Kiruthigai, Sankatahara Chaturthi), commented for checking against printed panchangams. `npx tsx scripts/observances.ts 2026-10-01 2026-12-31 chennai` lists the dates.
- `src/lib/vratham.ts`, `src/components/VrathamPage.tsx`, `src/components/NextVratham.tsx` — vratham date pages; the "Next …" box is worked out in the browser so cached pages stay correct. Special names (Aadi/Mahalaya/Thai Amavasai, Chithra/Karthigai Pournami, Vaikunta Ekadasi, Skanda Sashti, Aadi Kiruthigai, Karthigai Deepam, Sani/Soma Pradosham) are rules in observances.ts.
- `src/lib/calendar.ts`, `src/lib/calendar-page.ts`, `src/components/MonthCalendar.tsx`, `src/components/MonthPage.tsx` — Tamil monthly calendar. Only Chennai month pages are pre-built; other cities' month pages render on first visit and are kept (pre-building all ~1,900 added ~700 MB per deploy).
- `src/lib/site.ts` — UI text in both languages, tool titles/descriptions.
- `src/components/PanchangView.tsx` — the page layout.
- `src/components/DateNav.tsx` — today/tomorrow switch, previous/next day, date picker.
- `src/app/[lang]/panchangam/[city]/[date]/page.tsx` — any-date page. Don't add `dynamicParams = false` to `[lang]/layout.tsx`: children inherit it and date pages would 404.
- `scripts/check.ts` — `npx tsx scripts/check.ts 2026-09-26 chennai` prints one day's panchangam for checking.

## Validation baseline (Drik Panchang, Chennai, 26 Sep 2026)
Sunrise 05:58 AM, sunset 06:02 PM, moonrise 05:49 PM, no moonset. Tithi Purnima until 10:18 PM. Nakshatra Purva Bhadrapada until 11:32 AM. Yoga Ganda until 01:17 PM. Karana Vishti until 10:46 AM, Bava until 10:18 PM. Rahu 08:59–10:30 AM, Yamaganda 01:31–03:01 PM, Gulikai 05:58–07:29 AM, Abhijit 11:36 AM–12:24 PM.
Our engine: all of these match to the minute except tithi/yoga/karana (about 1 minute later) and moonrise (05:45 PM, about 4 minutes earlier). Open task: investigate the moonrise convention.

## Known open questions
- Gowri table: sources disagree on Saturday night's last slot (Rogam vs Soram). We use Rogam. Venkat will check his grandfather's Tamil books.
- Vakya panchangam (from the grandfather's books) comes in Phase 4, shown alongside Thirukanitha.
- Observance rules to confirm (observances.ts): kshaya Ekadasi is not marked; when a tithi is at sunrise on two days only the first is marked; Pournami is the sunrise-tithi day (so 26 Oct and 24 Dec 2026 in Chennai, where some printed calendars may show the evening before).
- Tamil month start uses the sankranti-before-sunset rule in local time, so diaspora cities can differ by a day from India (e.g. Aippasi 1 = 17 Oct 2026 in London, 18 Oct in Chennai).

## Roadmap
1. Phase 1 (to 15 Nov 2026): daily tools MVP live — share-card images, tomorrow/date view, sitemaps, schema, 5 pillar articles.
2. Phase 2 (by 1 Dec 2026): Tamil monthly calendar 2026 & 2027, vratham date pages (Amavasai, Pournami, Pradosham, Ekadasi, Sashti, Kiruthigai, Sankatahara Chaturthi), festival pages (Pongal 2027 etc.), muhurtham dates.
3. Phase 3 (late Feb 2027): Rasi/natchathiram finder, Jathagam (South Indian rasi & navamsa chart, dasa-bhukti, PDF), 10-porutham matching.
4. Phase 4 (from Mar 2027): daily rasi palan, Vakya panchangam, peyarchi pages, monetisation (AdSense + paid jathagam/porutham reports).

## Working rules
- Venkat has weekday evenings and weekends; keep changes small and explain them in plain words.
- After any engine change, run `scripts/check.ts` for Chennai and compare with the baseline above.
- Run `npm run build` before pushing; Netlify deploys automatically from the main branch.
