// Bilingual names used across the site. `en` is the romanised Tamil form
// people actually search for ("nalla neram", "thiruvonam"), `ta` is Tamil script.
export type Name = { en: string; ta: string };
const n = (en: string, ta: string): Name => ({ en, ta });

export const WEEKDAYS: Name[] = [
  n("Sunday (Nyayiru)", "ஞாயிறு"),
  n("Monday (Thingal)", "திங்கள்"),
  n("Tuesday (Sevvai)", "செவ்வாய்"),
  n("Wednesday (Budhan)", "புதன்"),
  n("Thursday (Viyazhan)", "வியாழன்"),
  n("Friday (Velli)", "வெள்ளி"),
  n("Saturday (Sani)", "சனி"),
];

// 15 tithi names; index 14 is Pournami in Valarpirai and Amavasai in Theipirai
export const TITHIS: Name[] = [
  n("Prathamai", "பிரதமை"),
  n("Dvitiyai", "துவிதியை"),
  n("Tritiyai", "திருதியை"),
  n("Chathurthi", "சதுர்த்தி"),
  n("Panchami", "பஞ்சமி"),
  n("Shashti", "சஷ்டி"),
  n("Sapthami", "சப்தமி"),
  n("Ashtami", "அஷ்டமி"),
  n("Navami", "நவமி"),
  n("Dasami", "தசமி"),
  n("Ekadasi", "ஏகாதசி"),
  n("Dvadasi", "துவாதசி"),
  n("Thrayodasi", "திரயோதசி"),
  n("Chaturdasi", "சதுர்த்தசி"),
];
export const POURNAMI = n("Pournami", "பௌர்ணமி");
export const AMAVASAI = n("Amavasai", "அமாவாசை");
export const PAKSHAS: Name[] = [n("Valarpirai (Shukla Paksha)", "வளர்பிறை"), n("Theipirai (Krishna Paksha)", "தேய்பிறை")];

export const NAKSHATRAS: Name[] = [
  n("Ashwini", "அசுவினி"),
  n("Bharani", "பரணி"),
  n("Karthigai", "கார்த்திகை"),
  n("Rohini", "ரோகிணி"),
  n("Mirugaseeridam", "மிருகசீரிடம்"),
  n("Thiruvathirai", "திருவாதிரை"),
  n("Punarpoosam", "புனர்பூசம்"),
  n("Poosam", "பூசம்"),
  n("Ayilyam", "ஆயில்யம்"),
  n("Magam", "மகம்"),
  n("Pooram", "பூரம்"),
  n("Uthiram", "உத்திரம்"),
  n("Hastham", "அஸ்தம்"),
  n("Chithirai", "சித்திரை"),
  n("Swathi", "சுவாதி"),
  n("Visakam", "விசாகம்"),
  n("Anusham", "அனுஷம்"),
  n("Kettai", "கேட்டை"),
  n("Moolam", "மூலம்"),
  n("Pooradam", "பூராடம்"),
  n("Uthiradam", "உத்திராடம்"),
  n("Thiruvonam", "திருவோணம்"),
  n("Avittam", "அவிட்டம்"),
  n("Sadayam", "சதயம்"),
  n("Poorattathi", "பூரட்டாதி"),
  n("Uthirattathi", "உத்திரட்டாதி"),
  n("Revathi", "ரேவதி"),
];

export const YOGAS: Name[] = [
  n("Vishkambam", "விஷ்கம்பம்"),
  n("Preethi", "ப்ரீதி"),
  n("Ayushman", "ஆயுஷ்மான்"),
  n("Saubhagyam", "சௌபாக்கியம்"),
  n("Sobhanam", "சோபனம்"),
  n("Athigandam", "அதிகண்டம்"),
  n("Sukarmam", "சுகர்மம்"),
  n("Dhruthi", "திருதி"),
  n("Soolam", "சூலம்"),
  n("Gandam", "கண்டம்"),
  n("Vruddhi", "விருத்தி"),
  n("Dhruvam", "துருவம்"),
  n("Vyaghatham", "வியாகாதம்"),
  n("Harshanam", "ஹர்ஷணம்"),
  n("Vajram", "வஜ்ரம்"),
  n("Siddhi", "சித்தி"),
  n("Vyatheepatham", "வியதீபாதம்"),
  n("Variyan", "வரியான்"),
  n("Parigham", "பரிகம்"),
  n("Sivam", "சிவம்"),
  n("Siddham", "சித்தம்"),
  n("Sadhyam", "சாத்தியம்"),
  n("Subham", "சுபம்"),
  n("Sukla", "சுக்லம்"),
  n("Brahmam", "பிரம்மம்"),
  n("Aindhram", "ஐந்திரம்"),
  n("Vaidhruthi", "வைதிருதி"),
];

// Karanam: 60 half-tithis per lunar month. Index 0 = Kimstughnam, 1..56 cycle
// through the 7 movable karanas, 57..59 are the fixed ones.
const MOVABLE: Name[] = [
  n("Bavam", "பவம்"),
  n("Balavam", "பாலவம்"),
  n("Kaulavam", "கௌலவம்"),
  n("Taitilam", "தைதுலம்"),
  n("Garasai", "கரசை"),
  n("Vanijai", "வணிசை"),
  n("Bhadrai (Vishti)", "பத்திரை"),
];
export function karanaName(i: number): Name {
  if (i === 0) return n("Kimstughnam", "கிம்ஸ்துக்னம்");
  if (i === 57) return n("Sakuni", "சகுனி");
  if (i === 58) return n("Chathushpadam", "சதுஷ்பாதம்");
  if (i === 59) return n("Nagavam", "நாகவம்");
  return MOVABLE[(i - 1) % 7];
}

export const RASIS: Name[] = [
  n("Mesham", "மேஷம்"),
  n("Rishabam", "ரிஷபம்"),
  n("Mithunam", "மிதுனம்"),
  n("Kadagam", "கடகம்"),
  n("Simmam", "சிம்மம்"),
  n("Kanni", "கன்னி"),
  n("Thulam", "துலாம்"),
  n("Viruchigam", "விருச்சிகம்"),
  n("Dhanusu", "தனுசு"),
  n("Magaram", "மகரம்"),
  n("Kumbam", "கும்பம்"),
  n("Meenam", "மீனம்"),
];

// Tamil solar months, indexed by the Sun's sidereal sign (Mesham = Chithirai)
export const TAMIL_MONTHS: Name[] = [
  n("Chithirai", "சித்திரை"),
  n("Vaikasi", "வைகாசி"),
  n("Aani", "ஆனி"),
  n("Aadi", "ஆடி"),
  n("Avani", "ஆவணி"),
  n("Purattasi", "புரட்டாசி"),
  n("Aippasi", "ஐப்பசி"),
  n("Karthigai", "கார்த்திகை"),
  n("Margazhi", "மார்கழி"),
  n("Thai", "தை"),
  n("Maasi", "மாசி"),
  n("Panguni", "பங்குனி"),
];

// 60-year cycle; index 0 = Prabhava (began April 1987)
const Y = (s: string) => s.split(",").map((x) => x.trim());
const YEAR_EN = Y(
  "Prabhava,Vibhava,Sukla,Pramodhoota,Prajorpathi,Aangirasa,Srimukha,Bhava,Yuva,Dhaathu,Eesvara,Vehudhanya,Pramathi,Vikrama,Vishu,Chitrabhanu,Subhanu,Dhaarana,Paarthiba,Viya,Sarvajith,Sarvadhari,Virodhi,Vikruthi,Kara,Nandhana,Vijaya,Jaya,Manmatha,Dhunmuki,Hevilambi,Vilambi,Vikari,Sarvari,Plava,Subakrith,Sobakrith,Krodhi,Visuvavasu,Parabhava,Plavanga,Keelaka,Saumya,Sadharana,Virodhikruthu,Paridhaabi,Pramaadhisa,Aanandha,Rakshasa,Nala,Pingala,Kalayukthi,Siddharthi,Raudhri,Dhunmathi,Dhundubhi,Rudhrodhgaari,Raktakshi,Krodhana,Akshaya",
);
const YEAR_TA = Y(
  "பிரபவ,விபவ,சுக்ல,பிரமோதூத,பிரசோற்பத்தி,ஆங்கீரச,ஸ்ரீமுக,பவ,யுவ,தாது,ஈஸ்வர,வெகுதானிய,பிரமாதி,விக்கிரம,விஷு,சித்திரபானு,சுபானு,தாரண,பார்த்திப,விய,சர்வசித்து,சர்வதாரி,விரோதி,விக்ருதி,கர,நந்தன,விஜய,ஜய,மன்மத,துன்முகி,ஹேவிளம்பி,விளம்பி,விகாரி,சார்வரி,பிலவ,சுபகிருது,சோபகிருது,குரோதி,விசுவாசுவ,பராபவ,பிலவங்க,கீலக,சௌமிய,சாதாரண,விரோதகிருது,பரிதாபி,பிரமாதீச,ஆனந்த,ராட்சச,நள,பிங்கள,காளயுக்தி,சித்தார்த்தி,ரௌத்திரி,துன்மதி,துந்துபி,ருத்ரோத்காரி,ரக்தாட்சி,குரோதன,அட்சய",
);
export const TAMIL_YEARS: Name[] = YEAR_EN.map((en, i) => n(en, YEAR_TA[i]));

export type GowriKey = "amirtham" | "uthi" | "laabam" | "dhanam" | "sugam" | "rogam" | "soram" | "visham";
export const GOWRI: Record<GowriKey, Name & { good: boolean }> = {
  amirtham: { ...n("Amirtham", "அமிர்தம்"), good: true },
  uthi: { ...n("Uthi", "உத்தி"), good: true },
  laabam: { ...n("Laabam", "லாபம்"), good: true },
  dhanam: { ...n("Dhanam", "தனம்"), good: true },
  sugam: { ...n("Sugam", "சுகம்"), good: true },
  rogam: { ...n("Rogam", "ரோகம்"), good: false },
  soram: { ...n("Soram", "சோரம்"), good: false },
  visham: { ...n("Visham", "விஷம்"), good: false },
};

// Planetary hour lords (Horai). Index = weekday lord order Sun..Sat.
export type Planet = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";
export const PLANETS: Record<Planet, Name> = {
  sun: n("Suriyan", "சூரியன்"),
  moon: n("Chandran", "சந்திரன்"),
  mars: n("Sevvai", "செவ்வாய்"),
  mercury: n("Budhan", "புதன்"),
  jupiter: n("Guru", "குரு"),
  venus: n("Sukran", "சுக்கிரன்"),
  saturn: n("Sani", "சனி"),
};
