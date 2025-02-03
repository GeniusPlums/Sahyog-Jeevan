export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी (Hindi)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "mr", name: "मराठी (Marathi)" },
  { code: "gu", name: "ગુજરાતી (Gujarati)" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
  { code: "ml", name: "മലയാളം (Malayalam)" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
];

type RegionTranslations = {
  [key: string]: {
    [lang: string]: string;
  };
};

export const INDIAN_REGIONS: RegionTranslations = {
  maharashtra: {
    en: "Maharashtra",
    hi: "महाराष्ट्र",
    bn: "মহারাষ্ট্র",
    te: "మహారాష్ట్ర",
    ta: "மகாராஷ்டிரா",
    mr: "महाराष्ट्र",
    gu: "મહારાષ્ટ્ર",
    kn: "ಮಹಾರಾಷ್ಟ್ರ",
    ml: "മഹാരാഷ്ട്ര",
    pa: "ਮਹਾਰਾਸ਼ਟਰ",
  },
  delhi: {
    en: "Delhi",
    hi: "दिल्ली",
    bn: "দিল্লি",
    te: "ఢిల్లీ",
    ta: "டெல்லி",
    mr: "दिल्ली",
    gu: "દિલ્હી",
    kn: "ದೆಹಲಿ",
    ml: "ഡൽഹി",
    pa: "ਦਿੱਲੀ",
  },
  gujarat: {
    en: "Gujarat",
    hi: "गुजरात",
    bn: "গুজরাত",
    te: "గుజరాత్",
    ta: "குஜராத்",
    mr: "गुजरात",
    gu: "ગુજરાત",
    kn: "ಗುಜರಾತ್",
    ml: "ഗുജറാത്ത്",
    pa: "ਗੁਜਰਾਤ",
  },
  karnataka: {
    en: "Karnataka",
    hi: "कर्नाटक",
    bn: "কর্ণাটক",
    te: "కర్ణాటక",
    ta: "கர்நாடகா",
    mr: "कर्नाटक",
    gu: "કર્ણાટક",
    kn: "ಕರ್ನಾಟಕ",
    ml: "കർണാടക",
    pa: "ਕਰਨਾਟਕ",
  },
  tamil_nadu: {
    en: "Tamil Nadu",
    hi: "तमिलनाडु",
    bn: "তামিলনাড়ু",
    te: "తమిళనాడు",
    ta: "தமிழ்நாடு",
    mr: "तामिळनाडू",
    gu: "તમિલનાડુ",
    kn: "ತಮಿಳುನಾಡು",
    ml: "തമിഴ്‌നാട്",
    pa: "ਤਮਿਲਨਾਡੂ",
  },
  // Add more states as needed
};
