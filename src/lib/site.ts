export const SITE = {
  name: { en: "Dhina Panchangam", ta: "தின பஞ்சாங்கம்" },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dhinapanchangam.com",
  repo: "https://github.com/venkeyy/dhinapanchangam", // public source link required by AGPL
  email: "dhinapanchangam@gmail.com", // public contact address (Contact + Privacy pages)
  gaId: process.env.NEXT_PUBLIC_GA_ID, // Google Analytics 4 measurement ID (G-…)
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
      en: "Today Panchangam {city} – Tamil Panchangam | Dhina Panchangam",
      ta: "இன்றைய பஞ்சாங்கம் {city} | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "Check today's Tamil panchangam for {city}: tithi, natchathiram, yogam, karanam, nalla neram, rahu kalam and sunrise, updated every day for your city.",
      ta: "{city} இன்றைய தமிழ் பஞ்சாங்கம்: திதி, நட்சத்திரம், யோகம், கரணம், நல்ல நேரம், ராகு காலம், சூரிய உதயம். உங்கள் நகரத்திற்கு தினமும் புதுப்பிக்கப்படுகிறது.",
    },
  },
  "nalla-neram-today": {
    nav: { en: "Nalla Neram", ta: "நல்ல நேரம்" },
    h1: { en: "Nalla Neram Today in {city}", ta: "இன்றைய நல்ல நேரம் — {city}" },
    title: {
      en: "Nalla Neram Today {city} – Gowri Panchangam | Dhina Panchangam",
      ta: "இன்றைய நல்ல நேரம் {city} – கௌரி பஞ்சாங்கம் | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "Find today's nalla neram (good time) in {city} with the full Gowri panchangam for day and night, updated daily from your city's sunrise and sunset.",
      ta: "{city} இன்றைய நல்ல நேரம் மற்றும் கௌரி பஞ்சாங்கம் (காலை, மாலை), உங்கள் நகர சூரிய உதயத்தின்படி தினமும் புதுப்பிக்கப்படுகிறது.",
    },
  },
  "rahu-kalam-today": {
    nav: { en: "Rahu Kalam", ta: "ராகு காலம்" },
    h1: { en: "Rahu Kalam Today in {city}", ta: "இன்றைய ராகு காலம் — {city}" },
    title: {
      en: "Rahu Kalam Today {city} – Yamagandam & Kuligai | Dhina Panchangam",
      ta: "இன்றைய ராகு காலம் {city} – எமகண்டம், குளிகை | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "Know today's rahu kalam, yamagandam and kuligai timings in {city} before you start anything important. Updated daily from local sunrise and sunset.",
      ta: "முக்கியமான காரியம் தொடங்கும் முன் {city} இன்றைய ராகு காலம், எமகண்டம், குளிகை நேரங்களைத் தெரிந்துகொள்ளுங்கள். தினமும் புதுப்பிக்கப்படுகிறது.",
    },
  },
  "horai-today": {
    nav: { en: "Horai", ta: "ஹோரை" },
    h1: { en: "Horai Today in {city}", ta: "இன்றைய ஹோரை — {city}" },
    title: {
      en: "Horai Today {city} – Horai Timings in Tamil | Dhina Panchangam",
      ta: "இன்றைய ஹோரை {city} – ஹோரை நேரங்கள் | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "See today's horai (planetary hours) in {city} for day and night, starting from your local sunrise. Updated every day.",
      ta: "{city} இன்றைய ஹோரை நேரங்கள் (பகல், இரவு), உள்ளூர் சூரிய உதயத்திலிருந்து. தினமும் புதுப்பிக்கப்படுகிறது.",
    },
  },
  "panchangam-tomorrow": {
    nav: { en: "Panchangam", ta: "பஞ்சாங்கம்" },
    h1: { en: "Tomorrow's Panchangam in {city}", ta: "நாளைய பஞ்சாங்கம் — {city}" },
    title: {
      en: "Tomorrow Panchangam {city} – Tamil Panchangam | Dhina Panchangam",
      ta: "நாளைய பஞ்சாங்கம் {city} | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "Plan ahead with tomorrow's Tamil panchangam for {city}: tithi, natchathiram, nalla neram, rahu kalam and sunrise, calculated for your city.",
      ta: "நாளைக்கு முன்கூட்டியே திட்டமிடுங்கள்: {city} நாளைய தமிழ் பஞ்சாங்கம், திதி, நட்சத்திரம், நல்ல நேரம், ராகு காலம், சூரிய உதயம்.",
    },
  },
  "nalla-neram-tomorrow": {
    nav: { en: "Nalla Neram", ta: "நல்ல நேரம்" },
    h1: { en: "Nalla Neram Tomorrow in {city}", ta: "நாளை நல்ல நேரம் — {city}" },
    title: {
      en: "Nalla Neram Tomorrow {city} – Gowri Panchangam | Dhina Panchangam",
      ta: "நாளை நல்ல நேரம் {city} – கௌரி பஞ்சாங்கம் | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "Planning something tomorrow? Find tomorrow's nalla neram in {city} with the full Gowri panchangam for day and night.",
      ta: "நாளை ஏதாவது திட்டமிடுகிறீர்களா? {city} நாளைய நல்ல நேரம் மற்றும் கௌரி பஞ்சாங்கம் (காலை, மாலை) இங்கே.",
    },
  },
  "rahu-kalam-tomorrow": {
    nav: { en: "Rahu Kalam", ta: "ராகு காலம்" },
    h1: { en: "Rahu Kalam Tomorrow in {city}", ta: "நாளை ராகு காலம் — {city}" },
    title: {
      en: "Rahu Kalam Tomorrow {city} – Yamagandam & Kuligai | Dhina Panchangam",
      ta: "நாளை ராகு காலம் {city} – எமகண்டம், குளிகை | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "Check tomorrow's rahu kalam, yamagandam and kuligai in {city} and plan your day around them.",
      ta: "{city} நாளைய ராகு காலம், எமகண்டம், குளிகை நேரங்கள். உங்கள் நாளை முன்கூட்டியே திட்டமிடுங்கள்.",
    },
  },
  "horai-tomorrow": {
    nav: { en: "Horai", ta: "ஹோரை" },
    h1: { en: "Horai Tomorrow in {city}", ta: "நாளைய ஹோரை — {city}" },
    title: {
      en: "Horai Tomorrow {city} – Horai Timings in Tamil | Dhina Panchangam",
      ta: "நாளைய ஹோரை {city} – ஹோரை நேரங்கள் | தின பஞ்சாங்கம்",
    },
    desc: {
      en: "Tomorrow's horai (planetary hours) in {city} for day and night, from the local sunrise. Plan your important work ahead.",
      ta: "{city} நாளைய ஹோரை நேரங்கள் (பகல், இரவு). முக்கிய வேலைகளை முன்கூட்டியே திட்டமிடுங்கள்.",
    },
  },
};

// Any-date page ("Tamil daily calendar"): /{lang}/panchangam/{city}/{yyyy-mm-dd}
export const DATE_TEXT: { h1: L; title: L; desc: L } = {
  h1: { en: "Tamil Daily Calendar – {date}, {city}", ta: "தமிழ் தினசரி காலண்டர் — {date}, {city}" },
  title: {
    en: "Tamil Daily Calendar {date} {city} – Nalla Neram, Rahu Kalam, Panchangam | Dhina Panchangam",
    ta: "தமிழ் தினசரி காலண்டர் {date} {city} – நல்ல நேரம், ராகு காலம், பஞ்சாங்கம் | தின பஞ்சாங்கம்",
  },
  desc: {
    en: "Tamil daily calendar for {city} on {date}: tithi, natchathiram, yogam, karanam, nalla neram (Gowri), rahu kalam, horai and sunrise.",
    ta: "{city} {date} தமிழ் தினசரி காலண்டர்: திதி, நட்சத்திரம், யோகம், கரணம், நல்ல நேரம், ராகு காலம், ஹோரை மற்றும் சூரிய உதயம்.",
  },
};

// Tamil monthly calendar: /{lang}/tamil-calendar/{year}/{month}[/{city}] and /{lang}/tamil-calendar/{year}
export const CAL_TEXT: Record<string, L> = {
  nav: { en: "Tamil Calendar", ta: "தமிழ் காலண்டர்" },
  monthTitle: {
    en: "{month} {year} Tamil Calendar{cityPart} – Nalla Neram, Tithi, Natchathiram | Dhina Panchangam",
    ta: "{month} {year} தமிழ் காலண்டர்{cityPart} – நல்ல நேரம், திதி, நட்சத்திரம் | தின பஞ்சாங்கம்",
  },
  monthH1: { en: "{month} {year} Tamil Calendar{cityPart} ({tamilMonths})", ta: "{month} {year} தமிழ் காலண்டர்{cityPart} ({tamilMonths})" },
  monthDesc: {
    en: "{month} {year} Tamil calendar for {city}: daily tithi, natchathiram and Tamil date, with Amavasai, Pournami, Pradosham, Ekadasi, Sashti, Kiruthigai and Sankatahara Chaturthi days. Tamil calendar {year} {monthLower}.",
    ta: "{city} {month} {year} தமிழ் காலண்டர்: தினசரி திதி, நட்சத்திரம், தமிழ் தேதி, அமாவாசை, பௌர்ணமி, பிரதோஷம், ஏகாதசி, சஷ்டி, கிருத்திகை, சங்கடஹர சதுர்த்தி நாட்கள்.",
  },
  yearTitle: {
    en: "Tamil Calendar {year} – Monthly Tamil Calendar with Nalla Neram | Dhina Panchangam",
    ta: "தமிழ் காலண்டர் {year} – மாதாந்திர தமிழ் காலண்டர், நல்ல நேரம் | தின பஞ்சாங்கம்",
  },
  yearH1: { en: "Tamil Calendar {year} – Monthly Tamil Calendar", ta: "தமிழ் காலண்டர் {year} – மாதாந்திர காலண்டர்" },
  yearDesc: {
    en: "Tamil monthly calendar {year} (calendar {year} Tamil): every month with tithi, natchathiram, Tamil dates, Amavasai and Pournami days, calculated for Chennai.",
    ta: "தமிழ் காலண்டர் {year}: ஒவ்வொரு மாதத்தின் திதி, நட்சத்திரம், தமிழ் தேதி, அமாவாசை, பௌர்ணமி நாட்கள் — சென்னை நேரப்படி.",
  },
  forCity: { en: "Calculated for {city}.", ta: "{city} நேரப்படி கணக்கிடப்பட்டது." },
  observances: { en: "Vratham and observance days", ta: "விரத நாட்கள்" },
  prevMonth: { en: "Previous month", ta: "முந்தைய மாதம்" },
  nextMonth: { en: "Next month", ta: "அடுத்த மாதம்" },
  allMonths: { en: "All months of {year}", ta: "{year} அனைத்து மாதங்கள்" },
  faq: { en: "Frequently asked questions", ta: "அடிக்கடி கேட்கப்படும் கேள்விகள்" },
  qTamilMonth: { en: "What is the Tamil month in {month} {year}?", ta: "{month} {year}-இல் தமிழ் மாதம் என்ன?" },
  aTamilMonth: { en: "{month} {year} runs from {from} to {to}.", ta: "{month} {year} {from} முதல் {to} வரை." },
  aMonthStarts: { en: "{tm} begins on {date}.", ta: "{tm} மாதம் {date} அன்று தொடங்குகிறது." },
  qAmavasai: { en: "When is Amavasai in {month} {year}?", ta: "{month} {year} அமாவாசை எப்போது?" },
  qPournami: { en: "When is Pournami in {month} {year}?", ta: "{month} {year} பௌர்ணமி எப்போது?" },
  aObs: { en: "{name} in {month} {year} ({city}): {dates}.", ta: "{month} {year} {name} ({city}): {dates}." },
  aNone: { en: "There is no {name} in {month} {year} ({city}).", ta: "{month} {year}-இல் {name} இல்லை ({city})." },
  monthCalendar: { en: "{month} {year} Tamil calendar", ta: "{month} {year} தமிழ் காலண்டர்" },
};
// Months with calendar pages (inclusive)
export const CAL_FIRST = "2026-10";
export const CAL_LAST = "2027-12";
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
  staleUpdating: { en: "Updating to the latest panchangam…", ta: "சமீபத்திய பஞ்சாங்கத்தைப் புதுப்பிக்கிறது…" },
  staleShown: { en: "This page is showing an older date.", ta: "இந்தப் பக்கம் பழைய தேதியைக் காட்டுகிறது." },
  staleOpen: { en: "Open the correct date", ta: "சரியான தேதியைத் திறக்கவும்" },
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
  contact: { en: "Contact", ta: "தொடர்பு கொள்ள" },
  privacy: { en: "Privacy Policy", ta: "தனியுரிமைக் கொள்கை" },
  langSwitch: { en: "தமிழ்", ta: "English" },
};

export const fill = (s: string, vars: Record<string, string>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
