import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const enTranslations = {
  common: {
    search: "SEARCH INDUSTRY",
    filter: "Filter",
    apply: "CLICK HERE TO APPLY",
    jobsAround: "Jobs around you",
    login: "Login",
    register: "Register",
    username: "Username",
    password: "Password",
    worker: "Worker",
    employer: "Employer",
    salary: "SALARY",
    termsConditions: "TERMS & CONDITIONS",
    finish: "FINISH APPLICATION",
    month: "/month",
    location: "Location",
    company: "Company",
    clickToApply: "CLICK HERE TO APPLY",
    applying: "Applying...",
    requirements: "Requirements",
    posted: "Posted",
    open: "Open",
    draft: "Draft",
    fulltime: "Full Time",
    parttime: "Part Time",
    selectJobType: "Select job type",
    regularJob: "Regular Job",
    gigWork: "Gig Work",
    filter: "Filter",
    featuredJobs: "Featured Jobs",
    viewDetails: "View Details",
    quickApply: "Quick Apply",
    quickApplyDesc: "Apply quickly to multiple jobs with your saved profile",
    browseJobs: "Browse Jobs",
    home: "Home",
    jobApplication: "Job Application",
    applicationProgress: "Application Progress",
    gender: {
      label: "Gender",
      male: "Male",
      female: "Female",
      other: "Other"
    },
    experience: {
      label: "Experience",
      zeroToOne: "0-1 years",
      oneToThree: "1-3 years",
      threeToFive: "3-5 years",
      fivePlus: "5+ years"
    },
    shift: {
      label: "Shift",
      morning: "Morning",
      afternoon: "Afternoon",
      night: "Night",
      flexible: "Flexible"
    }
  },
  categories: {
    driver: "Driver",
    deliverydriver: "Delivery Driver",
    guard: "Guard",
    gardener: "Gardener",
    cook: "Cook",
    maid: "Maid",
    sweeper: "Sweeper",
    securityguard: "Security Guard"
  },
  locations: {
    mumbai: "Mumbai",
    delhi: "Delhi",
    bangalore: "Bangalore",
    mumbaicentral: "Mumbai Central"
  }
};

// Hindi translations
const hiTranslations = {
  common: {
    search: "उद्योग खोजें",
    filter: "फ़िल्टर",
    apply: "आवेदन करने के लिए यहां क्लिक करें",
    jobsAround: "आस-पास की नौकरियां",
    login: "लॉग इन",
    register: "पंजीकरण",
    username: "उपयोगकर्ता नाम",
    password: "पासवर्ड",
    worker: "कर्मचारी",
    employer: "नियोक्ता",
    salary: "वेतन",
    termsConditions: "नियम और शर्तें",
    finish: "आवेदन समाप्त करें",
    month: "/महीना",
    location: "स्थान",
    company: "कंपनी",
    clickToApply: "आवेदन करने के लिए यहां क्लिक करें",
    applying: "आवेदन किया जा रहा है...",
    requirements: "आवश्यकताएं",
    posted: "पोस्ट किया गया",
    open: "खुला हुआ",
    draft: "ड्राफ्ट",
    fulltime: "पूर्णकालिक",
    parttime: "अंशकालिक",
    selectJobType: "नौकरी का प्रकार चुनें",
    regularJob: "नियमित नौकरी",
    gigWork: "गिग वर्क",
    filter: "फ़िल्टर",
    featuredJobs: "विशेष नौकरियां",
    viewDetails: "विवरण देखें",
    quickApply: "त्वरित आवेदन",
    quickApplyDesc: "अपने सहेजे गए प्रोफाइल के साथ कई नौकरियों के लिए त्वरित आवेदन करें",
    browseJobs: "नौकरियां ब्राउज़ करें",
    home: "होम",
    jobApplication: "नौकरी आवेदन",
    applicationProgress: "आवेदन प्रगति",
    gender: {
      label: "लिंग",
      male: "पुरुष",
      female: "महिला",
      other: "अन्य"
    },
    experience: {
      label: "अनुभव",
      zeroToOne: "0-1 वर्ष",
      oneToThree: "1-3 वर्ष",
      threeToFive: "3-5 वर्ष",
      fivePlus: "5+ वर्ष"
    },
    shift: {
      label: "शिफ्ट",
      morning: "सुबह",
      afternoon: "दोपहर",
      night: "रात",
      flexible: "लचीला"
    }
  },
  categories: {
    driver: "ड्राइवर",
    deliverydriver: "डिलीवरी ड्राइवर",
    guard: "गार्ड",
    gardener: "माली",
    cook: "रसोइया",
    maid: "घरेलू सहायक",
    sweeper: "सफाई कर्मचारी",
    securityguard: "सुरक्षा गार्ड"
  },
  locations: {
    mumbai: "मुंबई",
    delhi: "दिल्ली",
    bangalore: "बैंगलोर",
    mumbaicentral: "मुंबई सेंट्रल"
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      hi: {
        translation: hiTranslations
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;