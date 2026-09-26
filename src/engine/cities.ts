import type { Name } from "./names";
import type { Place } from "./panchang";

export type City = Place & { slug: string; name: Name; country: string };

const c = (slug: string, en: string, ta: string, lat: number, lon: number, tz: string, country: string): City => ({
  slug,
  name: { en, ta },
  lat,
  lon,
  tz,
  country,
});

// Launch set: Tamil Nadu districts + Puducherry, big Indian metros, and the Tamil diaspora.
// Coordinates are city centres (±1 km is plenty: 1 km ≈ 2–3 seconds of sunrise time).
export const CITIES: City[] = [
  // Tamil Nadu & Puducherry
  c("chennai", "Chennai", "சென்னை", 13.0827, 80.2707, "Asia/Kolkata", "IN"),
  c("coimbatore", "Coimbatore", "கோயம்புத்தூர்", 11.0168, 76.9558, "Asia/Kolkata", "IN"),
  c("madurai", "Madurai", "மதுரை", 9.9252, 78.1198, "Asia/Kolkata", "IN"),
  c("tiruchirappalli", "Tiruchirappalli", "திருச்சிராப்பள்ளி", 10.7905, 78.7047, "Asia/Kolkata", "IN"),
  c("salem", "Salem", "சேலம்", 11.6643, 78.146, "Asia/Kolkata", "IN"),
  c("tirunelveli", "Tirunelveli", "திருநெல்வேலி", 8.7139, 77.7567, "Asia/Kolkata", "IN"),
  c("erode", "Erode", "ஈரோடு", 11.341, 77.7172, "Asia/Kolkata", "IN"),
  c("tiruppur", "Tiruppur", "திருப்பூர்", 11.1085, 77.3411, "Asia/Kolkata", "IN"),
  c("vellore", "Vellore", "வேலூர்", 12.9165, 79.1325, "Asia/Kolkata", "IN"),
  c("thanjavur", "Thanjavur", "தஞ்சாவூர்", 10.787, 79.1378, "Asia/Kolkata", "IN"),
  c("thoothukudi", "Thoothukudi", "தூத்துக்குடி", 8.7642, 78.1348, "Asia/Kolkata", "IN"),
  c("dindigul", "Dindigul", "திண்டுக்கல்", 10.3624, 77.9695, "Asia/Kolkata", "IN"),
  c("kanchipuram", "Kanchipuram", "காஞ்சிபுரம்", 12.8342, 79.7036, "Asia/Kolkata", "IN"),
  c("kumbakonam", "Kumbakonam", "கும்பகோணம்", 10.9617, 79.3881, "Asia/Kolkata", "IN"),
  c("nagercoil", "Nagercoil", "நாகர்கோவில்", 8.1833, 77.4119, "Asia/Kolkata", "IN"),
  c("tiruvannamalai", "Tiruvannamalai", "திருவண்ணாமலை", 12.2253, 79.0747, "Asia/Kolkata", "IN"),
  c("karur", "Karur", "கரூர்", 10.9601, 78.0766, "Asia/Kolkata", "IN"),
  c("namakkal", "Namakkal", "நாமக்கல்", 11.2189, 78.1674, "Asia/Kolkata", "IN"),
  c("cuddalore", "Cuddalore", "கடலூர்", 11.748, 79.7714, "Asia/Kolkata", "IN"),
  c("hosur", "Hosur", "ஓசூர்", 12.7409, 77.8253, "Asia/Kolkata", "IN"),
  c("pudukkottai", "Pudukkottai", "புதுக்கோட்டை", 10.3833, 78.8001, "Asia/Kolkata", "IN"),
  c("rameswaram", "Rameswaram", "இராமேஸ்வரம்", 9.2876, 79.3129, "Asia/Kolkata", "IN"),
  c("ooty", "Ooty", "உதகமண்டலம்", 11.4102, 76.695, "Asia/Kolkata", "IN"),
  c("puducherry", "Puducherry", "புதுச்சேரி", 11.9416, 79.8083, "Asia/Kolkata", "IN"),
  // Rest of India
  c("bengaluru", "Bengaluru", "பெங்களூரு", 12.9716, 77.5946, "Asia/Kolkata", "IN"),
  c("hyderabad", "Hyderabad", "ஹைதராபாத்", 17.385, 78.4867, "Asia/Kolkata", "IN"),
  c("mumbai", "Mumbai", "மும்பை", 19.076, 72.8777, "Asia/Kolkata", "IN"),
  c("new-delhi", "New Delhi", "புது தில்லி", 28.6139, 77.209, "Asia/Kolkata", "IN"),
  c("kolkata", "Kolkata", "கொல்கத்தா", 22.5726, 88.3639, "Asia/Kolkata", "IN"),
  c("pune", "Pune", "புனே", 18.5204, 73.8567, "Asia/Kolkata", "IN"),
  c("thiruvananthapuram", "Thiruvananthapuram", "திருவனந்தபுரம்", 8.5241, 76.9366, "Asia/Kolkata", "IN"),
  c("kochi", "Kochi", "கொச்சி", 9.9312, 76.2673, "Asia/Kolkata", "IN"),
  // Sri Lanka
  c("colombo", "Colombo", "கொழும்பு", 6.9271, 79.8612, "Asia/Colombo", "LK"),
  c("jaffna", "Jaffna", "யாழ்ப்பாணம்", 9.6615, 80.0255, "Asia/Colombo", "LK"),
  c("batticaloa", "Batticaloa", "மட்டக்களப்பு", 7.7102, 81.6924, "Asia/Colombo", "LK"),
  // South-East Asia
  c("singapore", "Singapore", "சிங்கப்பூர்", 1.3521, 103.8198, "Asia/Singapore", "SG"),
  c("kuala-lumpur", "Kuala Lumpur", "கோலாலம்பூர்", 3.139, 101.6869, "Asia/Kuala_Lumpur", "MY"),
  c("penang", "Penang", "பினாங்கு", 5.4141, 100.3288, "Asia/Kuala_Lumpur", "MY"),
  c("ipoh", "Ipoh", "ஈப்போ", 4.5975, 101.0901, "Asia/Kuala_Lumpur", "MY"),
  c("yangon", "Yangon", "யாங்கோன்", 16.8409, 96.1735, "Asia/Yangon", "MM"),
  // Middle East
  c("dubai", "Dubai", "துபாய்", 25.2048, 55.2708, "Asia/Dubai", "AE"),
  c("abu-dhabi", "Abu Dhabi", "அபுதாபி", 24.4539, 54.3773, "Asia/Dubai", "AE"),
  c("doha", "Doha", "தோஹா", 25.2854, 51.531, "Asia/Qatar", "QA"),
  c("muscat", "Muscat", "மஸ்கட்", 23.588, 58.3829, "Asia/Muscat", "OM"),
  c("riyadh", "Riyadh", "ரியாத்", 24.7136, 46.6753, "Asia/Riyadh", "SA"),
  c("kuwait-city", "Kuwait City", "குவைத்", 29.3759, 47.9774, "Asia/Kuwait", "KW"),
  // Europe
  c("london", "London", "லண்டன்", 51.5074, -0.1278, "Europe/London", "GB"),
  c("paris", "Paris", "பாரிஸ்", 48.8566, 2.3522, "Europe/Paris", "FR"),
  c("zurich", "Zurich", "சூரிச்", 47.3769, 8.5417, "Europe/Zurich", "CH"),
  c("berlin", "Berlin", "பெர்லின்", 52.52, 13.405, "Europe/Berlin", "DE"),
  // Americas
  c("toronto", "Toronto", "டொரன்டோ", 43.6532, -79.3832, "America/Toronto", "CA"),
  c("new-york", "New York", "நியூயார்க்", 40.7128, -74.006, "America/New_York", "US"),
  c("new-jersey", "Edison, New Jersey", "எடிசன், நியூ ஜெர்சி", 40.5187, -74.4121, "America/New_York", "US"),
  c("chicago", "Chicago", "சிகாகோ", 41.8781, -87.6298, "America/Chicago", "US"),
  c("dallas", "Dallas", "டல்லாஸ்", 32.7767, -96.797, "America/Chicago", "US"),
  c("houston", "Houston", "ஹியூஸ்டன்", 29.7604, -95.3698, "America/Chicago", "US"),
  c("san-francisco", "San Francisco Bay Area", "சான் பிரான்சிஸ்கோ", 37.3382, -121.8863, "America/Los_Angeles", "US"),
  c("seattle", "Seattle", "சியாட்டில்", 47.6062, -122.3321, "America/Los_Angeles", "US"),
  // Oceania & Africa
  c("sydney", "Sydney", "சிட்னி", -33.8688, 151.2093, "Australia/Sydney", "AU"),
  c("melbourne", "Melbourne", "மெல்பேர்ன்", -37.8136, 144.9631, "Australia/Melbourne", "AU"),
  c("auckland", "Auckland", "ஆக்லாந்து", -36.8485, 174.7633, "Pacific/Auckland", "NZ"),
  c("durban", "Durban", "டர்பன்", -29.8587, 31.0218, "Africa/Johannesburg", "ZA"),
  c("port-louis", "Port Louis", "போர்ட் லூயிஸ்", -20.1609, 57.5012, "Indian/Mauritius", "MU"),
];

export const DEFAULT_CITY = CITIES[0];
export const cityBySlug = (slug: string) => CITIES.find((x) => x.slug === slug);
