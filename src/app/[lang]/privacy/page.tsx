import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InfoPage, { Email, type Section } from "@/components/InfoPage";
import { LANGS, SITE, isLang, type Lang } from "@/lib/site";

// Keep this in step with what the site actually does. Update it (and the date)
// before adding ads, forms, accounts or any new third-party service.
const UPDATED = { en: "Last updated: 4 October 2026", ta: "கடைசியாக புதுப்பிக்கப்பட்டது: 4 அக்டோபர் 2026" };

const ext = (href: string, text: string) => (
  <a href={href} className="text-maroon underline" rel="noopener noreferrer" target="_blank">
    {text}
  </a>
);
const GOOGLE_PRIVACY = "https://policies.google.com/privacy";
const GA_OPTOUT = "https://tools.google.com/dlpage/gaoptout";

const TEXT: Record<Lang, { title: string; desc: string; intro: React.ReactNode; sections: Section[] }> = {
  en: {
    title: "Privacy Policy",
    desc: "How Dhina Panchangam handles your information: no accounts, no forms, and Google Analytics to understand how the site is used.",
    intro: (
      <>
        Dhina Panchangam (dhinapanchangam.com) shows daily panchangam timings and the Tamil calendar. This page explains what information is collected when you
        use the site and how it is used. If you have any questions, write to <Email />.
      </>
    ),
    sections: [
      {
        h: "What we do not collect",
        p: [
          "You do not need an account to use this site, and there are no sign-up or payment forms. We do not ask for your name, phone number, date of birth or any other personal details, and we do not sell any information.",
        ],
      },
      {
        h: "Google Analytics",
        p: [
          "We use Google Analytics to understand how many people visit, which pages and cities are most useful, and how visitors find the site (for example from a search or a shared link). Google Analytics uses cookies to tell visits apart and reports information such as your approximate location (country or city), device and browser type, and the pages you view. We see this only as combined statistics, not as information about you personally.",
          <>
            This information is processed by Google under {ext(GOOGLE_PRIVACY, "Google's Privacy Policy")}. You can stop Google Analytics from collecting your
            visits by blocking cookies in your browser or by installing the {ext(GA_OPTOUT, "Google Analytics opt-out browser add-on")}.
          </>,
        ],
      },
      {
        h: "Hosting and server logs",
        p: [
          "The site is hosted by Netlify. Like most websites, its servers automatically keep short-term technical logs of requests (such as IP address, browser type and the page requested) to deliver pages and protect the site from abuse.",
        ],
      },
      {
        h: "Storage in your browser",
        p: [
          "Today and tomorrow pages may keep a small counter in your browser's session storage so that, if an out-of-date copy of a page is shown, it can refresh itself a few times and then stop. It contains no personal information and is removed when you close the tab.",
        ],
      },
      {
        h: "If you email us",
        p: ["If you write to us, we use your email address and message only to reply to you and to improve the site. We do not add you to any mailing list."],
      },
      {
        h: "Advertising",
        p: [
          "The site does not show advertising at present. If we add advertising in future (for example Google AdSense), we will update this policy before it starts and, where required, ask for your consent.",
        ],
      },
      {
        h: "Children",
        p: ["The site is suitable for all ages and does not knowingly collect personal information from children."],
      },
      {
        h: "Changes to this policy",
        p: ["We will update this page if the way the site handles information changes. The date at the top shows when it was last updated."],
      },
      {
        h: "Contact",
        p: [
          <>
            Questions about this policy: <Email />
          </>,
        ],
      },
    ],
  },
  ta: {
    title: "தனியுரிமைக் கொள்கை",
    desc: "தின பஞ்சாங்கம் உங்கள் தகவல்களை எவ்வாறு கையாள்கிறது: கணக்குகள் இல்லை, படிவங்கள் இல்லை; தளப் பயன்பாட்டைப் புரிந்துகொள்ள Google Analytics.",
    intro: (
      <>
        தின பஞ்சாங்கம் (dhinapanchangam.com) தினசரி பஞ்சாங்க நேரங்களையும் தமிழ் காலண்டரையும் காட்டுகிறது. இந்தத் தளத்தைப் பயன்படுத்தும்போது என்ன தகவல்
        சேகரிக்கப்படுகிறது, அது எவ்வாறு பயன்படுத்தப்படுகிறது என்பதை இந்தப் பக்கம் விளக்குகிறது. கேள்விகளுக்கு: <Email />
      </>
    ),
    sections: [
      {
        h: "நாங்கள் சேகரிக்காதவை",
        p: [
          "இந்தத் தளத்தைப் பயன்படுத்த கணக்கு தேவையில்லை; பதிவு அல்லது பணம் செலுத்தும் படிவங்கள் இல்லை. உங்கள் பெயர், தொலைபேசி எண், பிறந்த தேதி போன்ற தனிப்பட்ட விவரங்களை நாங்கள் கேட்பதில்லை; எந்தத் தகவலையும் விற்பதில்லை.",
        ],
      },
      {
        h: "Google Analytics",
        p: [
          "எத்தனை பேர் வருகிறார்கள், எந்தப் பக்கங்களும் நகரங்களும் பயனுள்ளவை, பார்வையாளர்கள் தளத்தை எவ்வாறு கண்டடைகிறார்கள் (தேடல் அல்லது பகிரப்பட்ட இணைப்பு) என்பதைப் புரிந்துகொள்ள Google Analytics பயன்படுத்துகிறோம். இது குக்கீகளைப் பயன்படுத்தி, உங்கள் தோராயமான இருப்பிடம் (நாடு அல்லது நகரம்), சாதனம், உலாவி வகை, நீங்கள் பார்க்கும் பக்கங்கள் போன்றவற்றைத் தெரிவிக்கிறது. இவற்றை மொத்தப் புள்ளிவிவரங்களாக மட்டுமே நாங்கள் பார்க்கிறோம்.",
          <>
            இந்தத் தகவல் {ext(GOOGLE_PRIVACY, "Google தனியுரிமைக் கொள்கை")}யின்படி Google ஆல் கையாளப்படுகிறது. உலாவியில் குக்கீகளைத் தடுப்பதன் மூலமோ{" "}
            {ext(GA_OPTOUT, "Google Analytics opt-out add-on")} நிறுவுவதன் மூலமோ உங்கள் வருகைகள் சேகரிக்கப்படுவதை நிறுத்தலாம்.
          </>,
        ],
      },
      {
        h: "இணையச் சேவையகப் பதிவுகள்",
        p: [
          "இந்தத் தளம் Netlify மூலம் இயக்கப்படுகிறது. பெரும்பாலான இணையதளங்களைப் போல, பக்கங்களை வழங்கவும் தவறான பயன்பாட்டிலிருந்து பாதுகாக்கவும் அதன் சேவையகங்கள் IP முகவரி, உலாவி வகை, கோரப்பட்ட பக்கம் போன்ற குறுகிய கால தொழில்நுட்பப் பதிவுகளைத் தானாக வைத்திருக்கின்றன.",
        ],
      },
      {
        h: "உங்கள் உலாவியில் சேமிப்பு",
        p: [
          "இன்று, நாளை பக்கங்கள் பழைய பக்கம் காட்டப்பட்டால் சில முறை தானாகப் புதுப்பிக்க, உலாவியின் session storage-இல் ஒரு சிறிய எண்ணிக்கையை வைத்திருக்கலாம். அதில் தனிப்பட்ட தகவல் இல்லை; tab-ஐ மூடியதும் நீக்கப்படும்.",
        ],
      },
      {
        h: "நீங்கள் மின்னஞ்சல் அனுப்பினால்",
        p: ["உங்கள் மின்னஞ்சல் முகவரியையும் செய்தியையும் பதிலளிக்கவும் தளத்தை மேம்படுத்தவும் மட்டுமே பயன்படுத்துவோம். எந்த அஞ்சல் பட்டியலிலும் சேர்க்க மாட்டோம்."],
      },
      {
        h: "விளம்பரங்கள்",
        p: [
          "தற்போது இந்தத் தளத்தில் விளம்பரங்கள் இல்லை. எதிர்காலத்தில் விளம்பரங்களைச் சேர்த்தால் (எ.கா. Google AdSense), அதற்கு முன் இந்தக் கொள்கையைப் புதுப்பிப்போம்; தேவைப்படும் இடங்களில் உங்கள் ஒப்புதலைக் கேட்போம்.",
        ],
      },
      {
        h: "குழந்தைகள்",
        p: ["இந்தத் தளம் அனைத்து வயதினருக்கும் ஏற்றது; குழந்தைகளிடமிருந்து தனிப்பட்ட தகவல்களை வேண்டுமென்றே சேகரிப்பதில்லை."],
      },
      {
        h: "இந்தக் கொள்கையில் மாற்றங்கள்",
        p: ["தகவல்களைக் கையாளும் முறை மாறினால் இந்தப் பக்கத்தைப் புதுப்பிப்போம். மேலே உள்ள தேதி கடைசியாகப் புதுப்பிக்கப்பட்ட நாளைக் காட்டுகிறது."],
      },
      {
        h: "தொடர்பு",
        p: [
          <>
            இந்தக் கொள்கை பற்றிய கேள்விகளுக்கு: <Email />
          </>,
        ],
      },
    ],
  },
};

const languages = Object.fromEntries([...LANGS.map((l) => [l === "ta" ? "ta-IN" : "en", `/${l}/privacy`]), ["x-default", "/en/privacy"]]);

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return {
    title: `${TEXT[lang].title} | ${SITE.name[lang]}`,
    description: TEXT[lang].desc,
    alternates: { canonical: `/${lang}/privacy`, languages },
  };
}

export default async function Privacy({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = TEXT[lang];
  return <InfoPage lang={lang} path={`/${lang}/privacy`} title={t.title} intro={t.intro} sections={t.sections} updated={UPDATED[lang]} />;
}
