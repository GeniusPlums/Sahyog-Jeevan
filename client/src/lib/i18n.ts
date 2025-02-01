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
    acceptedJobs: "Accepted Jobs",
    startDate: "Start Date",
    viewDetails: "View Details",
    noJobsFound: "No accepted jobs found",
    browseJobs: "Browse Jobs",
    welcome: "Welcome to SahyogJeevan",
    home: "Home",
    dashboard: "Dashboard",
    postJob: "Post Job",
    appliedJobs: "Applied Jobs",
    signedInAs: "Signed in as",
    logout: "Logout"
  },
  categories: {
    driver: "DRIVER",
    guard: "GUARD",
    gardener: "GARDENER"
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
    acceptedJobs: "स्वीकृत नौकरियां",
    startDate: "आरंभ तिथि",
    viewDetails: "विवरण देखें",
    noJobsFound: "कोई स्वीकृत नौकरी नहीं मिली",
    browseJobs: "नौकरियां ब्राउज़ करें",
    welcome: "सह्योगजीवन में आपका स्वागत है",
    home: "होम",
    dashboard: "डैशबोर्ड",
    postJob: "नौकरी पोस्ट करें",
    appliedJobs: "आवेदित नौकरियां",
    signedInAs: "इस रूप में साइन इन",
    logout: "लॉग आउट"
  },
  categories: {
    driver: "ड्राइवर",
    guard: "गार्ड",
    gardener: "माली"
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
    }
  });

export default i18n;