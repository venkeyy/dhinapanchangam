@AGENTS.md

# Dhina Panchangam — project brief for Claude Code

Bilingual (Tamil + English) daily panchangam site for any city in the world, built to compete with drikpanchang.com on Tamil searches. Owner: Venkat (Chennai). Domain planned: dhinapanchangam.com (until bought, the site runs on dhinapanchangam.netlify.app).

## Decisions (do not change without asking)
- Stack: Next.js (App Router, TypeScript, Tailwind) on Netlify, code on a PUBLIC GitHub repo.
- Engine: Swiss Ephemeris via the `sweph` npm package (native N-API addon with prebuilt binaries), built-in Moshier ephemeris (flag SEFLG_MOSEPH, no data files). Licence AGPL-3.0, so the repo must stay public. Never commit secrets; use Netlify environment variables.
- Ayanamsa: Lahiri (SE_SIDM_LAHIRI).
- Rahu kalam, yamagandam, kuligai, Gowri (nalla neram) and horai are calculated from the REAL local sunrise/sunset (like Drik), not fixed 6 AM clock times.
- Sunrise/sunset = upper limb with refraction (Swiss Ephemeris default). Panchangam day = sunrise to next sunrise. Times are shown rounded to the nearest minute.
- URLs: /{en|ta}/{tool}/{city-slug}, tools = panchangam-today, nalla-neram-today, rahu-kalam-today, horai-today. hreflang between en and ta-IN. Titles target romanised Tamil search terms ("nalla neram today", "rahu kalam today", "today panchangam tamil").
- City pages must show real computed data per city (no thin duplicate pages). Grow the city list gradually.

## Where things are
- `src/engine/astro.ts` — Swiss Ephemeris wrapper (sidereal positions, rise/set).
- `src/engine/panchang.ts` — tithi, natchathiram, yogam, karanam (with end times), rahu kalam/yamagandam/kuligai, abhijit, Gowri day/night table, horai, Tamil month/date/year.
- `src/engine/names.ts` — all names in romanised Tamil + Tamil script.
- `src/engine/cities.ts` — launch city list (62 cities, IANA timezones).
- `src/lib/site.ts` — UI text in both languages, tool titles/descriptions.
- `src/components/PanchangView.tsx` — the page layout.
- `scripts/check.ts` — `npx tsx scripts/check.ts 2026-09-26 chennai` prints one day's panchangam for checking.

## Validation baseline (Drik Panchang, Chennai, 26 Sep 2026)
Sunrise 05:58 AM, sunset 06:02 PM, moonrise 05:49 PM, no moonset. Tithi Purnima until 10:18 PM. Nakshatra Purva Bhadrapada until 11:32 AM. Yoga Ganda until 01:17 PM. Karana Vishti until 10:46 AM, Bava until 10:18 PM. Rahu 08:59–10:30 AM, Yamaganda 01:31–03:01 PM, Gulikai 05:58–07:29 AM, Abhijit 11:36 AM–12:24 PM.
Our engine: all of these match to the minute except tithi/yoga/karana (about 1 minute later) and moonrise (05:45 PM, about 4 minutes earlier). Open task: investigate the moonrise convention.

## Known open questions
- Gowri table: sources disagree on Saturday night's last slot (Rogam vs Soram). We use Rogam. Venkat will check his grandfather's Tamil books.
- Vakya panchangam (from the grandfather's books) comes in Phase 4, shown alongside Thirukanitha.

## Roadmap
1. Phase 1 (to 15 Nov 2026): daily tools MVP live — share-card images, tomorrow/date view, sitemaps, schema, 5 pillar articles.
2. Phase 2 (by 1 Dec 2026): Tamil monthly calendar 2026 & 2027, vratham date pages (Amavasai, Pournami, Pradosham, Ekadasi, Sashti, Kiruthigai, Sankatahara Chaturthi), festival pages (Pongal 2027 etc.), muhurtham dates.
3. Phase 3 (late Feb 2027): Rasi/natchathiram finder, Jathagam (South Indian rasi & navamsa chart, dasa-bhukti, PDF), 10-porutham matching.
4. Phase 4 (from Mar 2027): daily rasi palan, Vakya panchangam, peyarchi pages, monetisation (AdSense + paid jathagam/porutham reports).

## Working rules
- Venkat has weekday evenings and weekends; keep changes small and explain them in plain words.
- After any engine change, run `scripts/check.ts` for Chennai and compare with the baseline above.
- Run `npm run build` before pushing; Netlify deploys automatically from the main branch.
