# Dhina Panchangam (தின பஞ்சாங்கம்)

Bilingual (Tamil + English) daily panchangam for any city: tithi, natchathiram, yogam, karanam, nalla neram (Gowri panchangam), rahu kalam, yamagandam, kuligai and horai.

- **Engine:** `src/engine/` — Swiss Ephemeris (`sweph`, built-in Moshier ephemeris, no data files), Lahiri ayanamsa. Rahu kalam, Gowri and horai are computed from the real local sunrise/sunset.
- **Site:** Next.js App Router. Routes: `/{en|ta}/{panchangam-today|nalla-neram-today|rahu-kalam-today|horai-today}/{city}`. Pages are static and regenerate every 15 minutes.
- **Cities:** `src/engine/cities.ts`.

## Run locally

```bash
npm install
npm run dev                          # http://localhost:3000
npx tsx scripts/check.ts 2026-09-26 chennai   # print one day's panchangam
```

## Deploy (Netlify)

Import this GitHub repo in Netlify → build settings are read from `netlify.toml`. Set `NEXT_PUBLIC_SITE_URL` to the live URL (e.g. `https://dhinapanchangam.com`).

## Accuracy (checked against Drik Panchang, Chennai, 26 Sep 2026)

Sunrise/sunset, natchathiram, rahu kalam, yamagandam, kuligai and abhijit match to the minute. Tithi, yogam and karanam end times are within 1 minute. Moonrise differs by ~4 minutes (Drik appears to use a different moonrise convention; to be investigated).

## Licence

AGPL-3.0 (required by Swiss Ephemeris). The source must stay public.
