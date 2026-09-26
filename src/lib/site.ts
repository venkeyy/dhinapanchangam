export const SITE = {
  name: { en: "Dhina Panchangam", ta: "தின பஞ்சாங்கம்" },
  // Change to https://dhinapanchangam.com once the domain is connected
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dhinapanchangam.netlify.app",
  repo: "https://github.com/venkeyy/dhinapanchangam", // public source link required by AGPL
};

export const LANGS = ["en", "ta"] as const;
export type Lang = (typeof LANGS)[number];
export const isLang = (x: string): x is Lang => (LANGS as readonly string[]).includes(x);

// A tool page is a kind (what is shown first) for a day: /{lang}/{kind}-{day}/{city}
export const KINDS = ["panchangam", "nalla-neram", "rahu-kalam", "horai"] as const;
export type Kind = (typeof KINDS)[number];
export const DAYS = ["today", "tomorrow"] as const;
export type Day = (typeof DAYS)[number];
export type Tool = `${Kind}-${Day}`;
export const toolOf = (kind: Kind, day: Day): Tool => `${kind}-${day}`;
export const TODAY_TOOLS = KINDS.map((k) => toolOf(k, "today"));
export const TOOLS = DAYS.flatMap((d) => KINDS.map((k) => toolOf(k, d)));
export const isTool = (x: string): x is Tool => (TOOLS as string[]).includes(x);
export const splitTool = (tool: Tool) => {
  const i = tool.lastIndexOf("-");
  return { kind: tool.slice(0, i) as Kind, day: tool.slice(i + 1) as Day };
};

type L = Record<Lang, string>;
export const TOOL_TEXT: Record<Tool, { nav: L; h1: L; title: L; desc: L }> = {
  "panchangam-today": {
    nav: { en: "Panchangam", ta: "பஞ்சாங்கம்" },
    h1: { en: "Today's Panchangam in {city}", ta: "இன்றைய பஞ்சாங்கம் — {city}" },
    title: {
      en: "Today Panchangam {city} – Tamil Panchangam {date} | Dhina Panchangam",
      ta: "இன்றைய பஞ்சாங்கம் {city} – {date} | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "Today's Tamil panchangam for {city}: tithi, natchathiram, yogam, karanam, nalla neram, rahu kalam and sunrise, calculated for your city.",
      ta: "{city} இன்றைய தமிழ் பஞ்சாங்கம்: திதி, நட்சத்திரம், யோகம், கரணம், நல்ல நேரம், ராகு காலம் மற்றும் சூரிய உதயம்.",
    },
  },
  "nalla-neram-today": {
    nav: { en: "Nalla Neram", ta: "நல்ல நேரம்" },
    h1: { en: "Nalla Neram Today in {city}", ta: "இன்றைய நல்ல நேரம் — {city}" },
    title: {
      en: "Nalla Neram Today {city} – Gowri Panchangam {date} | Dhina Panchangam",
      ta: "இன்றைய நல்ல நேரம் {city} – கௌரி பஞ்சாங்கம் {date}",
    },
    desc: {
      en: "Nalla neram today in {city} with the full Gowri panchangam for day and night, based on today's actual sunrise and sunset.",
      ta: "{city} இன்றைய நல்ல நேரம் மற்றும் கௌரி பஞ்சாங்கம் (காலை, மாலை) — இன்றைய சூரிய உதயத்தின் அடிப்படையில்.",
    },
  },
  "rahu-kalam-today": {
    nav: { en: "Rahu Kalam", ta: "ராகு காலம்" },
    h1: { en: "Rahu Kalam Today in {city}", ta: "இன்றைய ராகு காலம் — {city}" },
    title: {
      en: "Rahu Kalam Today {city} – Yamagandam & Kuligai {date} | Dhina Panchangam",
      ta: "இன்றைய ராகு காலம் {city} – எமகண்டம், குளிகை {date}",
    },
    desc: {
      en: "Rahu kalam, yamagandam and kuligai timings today in {city}, calculated from the local sunrise and sunset.",
      ta: "{city} இன்றைய ராகு காலம், எமகண்டம், குளிகை நேரங்கள் — உள்ளூர் சூரிய உதயம் மற்றும் அஸ்தமனத்தின் அடிப்படையில்.",
    },
  },
  "horai-today": {
    nav: { en: "Horai", ta: "ஹோரை" },
    h1: { en: "Horai Today in {city}", ta: "இன்றைய ஹோரை — {city}" },
    title: {
      en: "Horai Today {city} – Horai Timings in Tamil {date} | Dhina Panchangam",
      ta: "இன்றைய ஹோரை {city} – ஹோரை நேரங்கள் {date}",
    },
    desc: {
      en: "Today's horai (planetary hours) in {city} for day and night, starting from the local sunrise.",
      ta: "{city} இன்றைய ஹோரை நேரங்கள் (பகல், இரவு) — உள்ளூர் சூரிய உதயத்திலிருந்து.",
    },
  },
  "panchangam-tomorrow": {
    nav: { en: "Panchangam", ta: "பஞ்சாங்கம்" },
    h1: { en: "Tomorrow's Panchangam in {city}", ta: "நாளைய பஞ்சாங்கம் — {city}" },
    title: {
      en: "Tomorrow Panchangam {city} – Tamil Panchangam {date} | Dhina Panchangam",
      ta: "நாளைய பஞ்சாங்கம் {city} – {date} | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "Tomorrow's Tamil panchangam for {city} ({date}): tithi, natchathiram, yogam, karanam, nalla neram, rahu kalam and sunrise, calculated for your city.",
      ta: "{city} நாளைய ({date}) தமிழ் பஞ்சாங்கம்: திதி, நட்சத்திரம், யோகம், கரணம், நல்ல நேரம், ராகு காலம் மற்றும் சூரிய உதயம்.",
    },
  },
  "nalla-neram-tomorrow": {
    nav: { en: "Nalla Neram", ta: "நல்ல நேரம்" },
    h1: { en: "Nalla Neram Tomorrow in {city}", ta: "நாளை நல்ல நேரம் — {city}" },
    title: {
      en: "Nalla Neram Tomorrow {city} – Gowri Panchangam {date} | Dhina Panchangam",
      ta: "நாளை நல்ல நேரம் {city} – கௌரி பஞ்சாங்கம் {date}",
    },
    desc: {
      en: "Nalla neram tomorrow ({date}) in {city} with the full Gowri panchangam for day and night, based on the actual local sunrise and sunset.",
      ta: "{city} நாளை ({date}) நல்ல நேரம் மற்றும் கௌரி பஞ்சாங்கம் (காலை, மாலை) — உண்மையான சூரிய உதயத்தின் அடிப்படையில்.",
    },
  },
  "rahu-kalam-tomorrow": {
    nav: { en: "Rahu Kalam", ta: "ராகு காலம்" },
    h1: { en: "Rahu Kalam Tomorrow in {city}", ta: "நாளை ராகு காலம் — {city}" },
    title: {
      en: "Rahu Kalam Tomorrow {city} – Yamagandam & Kuligai {date} | Dhina Panchangam",
      ta: "நாளை ராகு காலம் {city} – எமகண்டம், குளிகை {date}",
    },
    desc: {
      en: "Rahu kalam, yamagandam and kuligai timings tomorrow ({date}) in {city}, calculated from the local sunrise and sunset.",
      ta: "{city} நாளை ({date}) ராகு காலம், எமகண்டம், குளிகை நேரங்கள் — உள்ளூர் சூரிய உதயம் மற்றும் அஸ்தமனத்தின் அடிப்படையில்.",
    },
  },
  "horai-tomorrow": {
    nav: { en: "Horai", ta: "ஹோரை" },
    h1: { en: "Horai Tomorrow in {city}", ta: "நாளைய ஹோரை — {city}" },
    title: {
      en: "Horai Tomorrow {city} – Horai Timings in Tamil {date} | Dhina Panchangam",
      ta: "நாளைய ஹோரை {city} – ஹோரை நேரங்கள் {date}",
    },
    desc: {
      en: "Tomorrow's horai (planetary hours) in {city} ({date}) for day and night, starting from the local sunrise.",
      ta: "{city} நாளைய ({date}) ஹோரை நேரங்கள் (பகல், இரவு) — உள்ளூர் சூரிய உதயத்திலிருந்து.",
    },
  },
};

// Any-date page: /{lang}/panchangam/{city}/{yyyy-mm-dd}
export const DATE_TEXT: { h1: L; title: L; desc: L } = {
  h1: { en: "Panchangam for {date} in {city}", ta: "{city} பஞ்சாங்கம் — {date}" },
  title: {
    en: "Panchangam {date} {city} – Tithi, Nalla Neram, Rahu Kalam | Dhina Panchangam",
    ta: "பஞ்சாங்கம் {date} {city} – திதி, நல்ல நேரம், ராகு காலம்",
  },
  desc: {
    en: "Tamil panchangam for {city} on {date}: tithi, natchathiram, yogam, karanam, nalla neram (Gowri), rahu kalam, horai and sunrise.",
    ta: "{city} {date} தமிழ் பஞ்சாங்கம்: திதி, நட்சத்திரம், யோகம், கரணம், நல்ல நேரம், ராகு காலம், ஹோரை மற்றும் சூரிய உதயம்.",
  },
};
export const MIN_DATE = "1950-01-01";
export const MAX_DATE = "2100-12-31";

export const T: Record<string, L> = {
  sunrise: { en: "Sunrise", ta: "சூரிய உதயம்" },
  sunset: { en: "Sunset", ta: "சூரிய அஸ்தமனம்" },
  moonrise: { en: "Moonrise", ta: "சந்திர உதயம்" },
  moonset: { en: "Moonset", ta: "சந்திர அஸ்தமனம்" },
  none: { en: "None on this day", ta: "இந்நாளில் இல்லை" },
  today: { en: "Today", ta: "இன்று" },
  tomorrow: { en: "Tomorrow", ta: "நாளை" },
  prevDay: { en: "Previous day", ta: "முந்தைய நாள்" },
  nextDay: { en: "Next day", ta: "அடுத்த நாள்" },
  pickDate: { en: "Any date", ta: "எந்த தேதியும்" },
  go: { en: "Show", ta: "காண்க" },
  tithi: { en: "Tithi", ta: "திதி" },
  nakshatra: { en: "Natchathiram", ta: "நட்சத்திரம்" },
  yoga: { en: "Yogam", ta: "யோகம்" },
  karana: { en: "Karanam", ta: "கரணம்" },
  paksha: { en: "Paksham", ta: "பக்ஷம்" },
  weekday: { en: "Day", ta: "கிழமை" },
  moonRasi: { en: "Moon sign (Rasi)", ta: "சந்திர ராசி" },
  sunRasi: { en: "Sun sign", ta: "சூரிய ராசி" },
  ayanamsa: { en: "Ayanamsa (Lahiri)", ta: "அயனாம்சம் (லஹிரி)" },
  upto: { en: "upto", ta: "வரை" },
  then: { en: "then", ta: "பின்" },
  rahu: { en: "Rahu Kalam", ta: "ராகு காலம்" },
  yama: { en: "Yamagandam", ta: "எமகண்டம்" },
  kuligai: { en: "Kuligai", ta: "குளிகை" },
  abhijit: { en: "Abhijit Muhurtham", ta: "அபிஜித் முகூர்த்தம்" },
  abhijitWed: { en: "not observed on Wednesdays", ta: "புதன்கிழமை தவிர்க்கப்படுகிறது" },
  avoid: { en: "Times to avoid", ta: "தவிர்க்க வேண்டிய நேரம்" },
  gowri: { en: "Gowri Panchangam", ta: "கௌரி பஞ்சாங்கம்" },
  gowriDay: { en: "Day (sunrise to sunset)", ta: "பகல் (காலை)" },
  gowriNight: { en: "Night (sunset to sunrise)", ta: "இரவு (மாலை)" },
  nallaNeram: { en: "Nalla neram (good times)", ta: "நல்ல நேரம்" },
  good: { en: "Good", ta: "நல்லது" },
  bad: { en: "Avoid", ta: "தவிர்க்கவும்" },
  horai: { en: "Horai", ta: "ஹோரை" },
  horaiDay: { en: "Day horai", ta: "பகல் ஹோரை" },
  horaiNight: { en: "Night horai", ta: "இரவு ஹோரை" },
  panchangam: { en: "Panchangam", ta: "பஞ்சாங்கம்" },
  city: { en: "City", ta: "நகரம்" },
  otherCities: { en: "Other cities", ta: "மற்ற நகரங்கள்" },
  tamilDate: { en: "Tamil date", ta: "தமிழ் தேதி" },
  varusham: { en: "year", ta: "வருடம்" },
  method: {
    en: "All timings are calculated for {city} ({tz}) using Swiss Ephemeris with the Lahiri ayanamsa. Rahu kalam, nalla neram and horai are based on the day's actual local sunrise and sunset, not fixed clock times. Times are rounded to the nearest minute.",
    ta: "அனைத்து நேரங்களும் {city} ({tz}) நகரத்திற்கு Swiss Ephemeris மற்றும் லஹிரி அயனாம்சம் கொண்டு கணக்கிடப்பட்டவை. ராகு காலம், நல்ல நேரம், ஹோரை ஆகியவை அன்றைய உண்மையான சூரிய உதயம் மற்றும் அஸ்தமனத்தின் அடிப்படையில் கணக்கிடப்படுகின்றன.",
  },
  source: { en: "Source code (AGPL)", ta: "மூல நிரல் (AGPL)" },
  langSwitch: { en: "தமிழ்", ta: "English" },
};

export const fill = (s: string, vars: Record<string, string>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
