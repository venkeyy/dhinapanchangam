import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InfoPage, { Email, type Section } from "@/components/InfoPage";
import { LANGS, SITE, isLang, type Lang } from "@/lib/site";

const TEXT: Record<Lang, { title: string; desc: string; intro: React.ReactNode; sections: Section[] }> = {
  en: {
    title: "Contact Us",
    desc: "Contact Dhina Panchangam with corrections, city requests or suggestions for our Tamil panchangam and calendar.",
    intro: (
      <>
        We would love to hear from you. Write to us at <Email />.
      </>
    ),
    sections: [
      {
        h: "Found a timing that looks different?",
        p: [
          "Every timing on this site is calculated for your city. If a tithi, natchathiram, nalla neram or vratham date differs from the printed panchangam or calendar you follow, please tell us the city, the date and what your panchangam says. Many traditions follow slightly different rules, and your notes help us make the site more accurate.",
        ],
      },
      {
        h: "Want your city added?",
        p: ["Tell us the city and country, and we will add it to the list."],
      },
      {
        h: "Suggestions",
        p: ["Ideas for new features, or anything that was hard to find or understand, are always welcome."],
      },
      {
        h: "Please note",
        p: [
          "We are a small team and reply by email as soon as we can, usually within a few days. We cannot answer personal astrology questions or prepare individual horoscopes by email.",
        ],
      },
    ],
  },
  ta: {
    title: "எங்களைத் தொடர்பு கொள்ள",
    desc: "தின பஞ்சாங்கத்திற்கு திருத்தங்கள், புதிய நகரக் கோரிக்கைகள் அல்லது ஆலோசனைகளை அனுப்புங்கள்.",
    intro: (
      <>
        உங்கள் கருத்துகளை வரவேற்கிறோம். எங்களுக்கு மின்னஞ்சல் அனுப்புங்கள்: <Email />
      </>
    ),
    sections: [
      {
        h: "நேரம் வேறுபடுகிறதா?",
        p: [
          "இந்தத் தளத்தின் அனைத்து நேரங்களும் உங்கள் நகரத்திற்காகக் கணக்கிடப்படுகின்றன. திதி, நட்சத்திரம், நல்ல நேரம் அல்லது விரத நாள் நீங்கள் பின்பற்றும் அச்சுப் பஞ்சாங்கத்திலிருந்து வேறுபட்டால், நகரம், தேதி மற்றும் உங்கள் பஞ்சாங்கத்தில் உள்ளதை எங்களுக்குத் தெரிவியுங்கள். உங்கள் குறிப்புகள் தளத்தை மேலும் துல்லியமாக்க உதவும்.",
        ],
      },
      {
        h: "உங்கள் நகரம் சேர்க்கப்பட வேண்டுமா?",
        p: ["நகரம் மற்றும் நாட்டின் பெயரை அனுப்புங்கள்; பட்டியலில் சேர்க்கிறோம்."],
      },
      {
        h: "ஆலோசனைகள்",
        p: ["புதிய வசதிகளுக்கான யோசனைகள் அல்லது புரிந்துகொள்ளக் கடினமாக இருந்தவை பற்றி எழுதுங்கள்."],
      },
      {
        h: "கவனிக்க",
        p: [
          "நாங்கள் ஒரு சிறிய குழு; பொதுவாக சில நாட்களுக்குள் மின்னஞ்சல் மூலம் பதிலளிப்போம். தனிப்பட்ட ஜோதிடக் கேள்விகளுக்கோ ஜாதகம் கணிப்பதற்கோ மின்னஞ்சலில் பதிலளிக்க இயலாது.",
        ],
      },
    ],
  },
};

const languages = Object.fromEntries([...LANGS.map((l) => [l === "ta" ? "ta-IN" : "en", `/${l}/contact`]), ["x-default", "/en/contact"]]);

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return {
    title: `${TEXT[lang].title} | ${SITE.name[lang]}`,
    description: TEXT[lang].desc,
    alternates: { canonical: `/${lang}/contact`, languages },
  };
}

export default async function Contact({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = TEXT[lang];
  return <InfoPage lang={lang} path={`/${lang}/contact`} title={t.title} intro={t.intro} sections={t.sections} />;
}
