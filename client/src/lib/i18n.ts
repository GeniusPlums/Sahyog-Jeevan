import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      common: {
        search: "Search jobs",
        filter: "Filter",
        searchJobs: "Search jobs",
        viewAll: "View all",
        selectJobType: "Select job type",
        regularJob: "Regular Job",
        gigWork: "Gig Work",
        featuredJobs: "Featured Jobs",
        quickApply: "Quick Apply",
        quickApplyDesc: "Apply quickly to multiple jobs with your saved profile",
        browseJobs: "Browse Jobs",
        noJobsFound: "No jobs found",
        categories: {
          driver: "Driver",
          guard: "Guard",
          gardener: "Gardener",
          cook: "Cook",
          maid: "Maid",
          carpenter: "Carpenter"
        }
      }
    }
  },
  hi: {
    translation: {
      common: {
        search: "नौकरी खोजें",
        filter: "फ़िल्टर",
        searchJobs: "नौकरी खोजें",
        viewAll: "सभी देखें",
        selectJobType: "नौकरी का प्रकार चुनें",
        regularJob: "नियमित नौकरी",
        gigWork: "गिग वर्क",
        featuredJobs: "विशेष नौकरियां",
        quickApply: "त्वरित आवेदन",
        quickApplyDesc: "अपनी सहेजी गई प्रोफ़ाइल के साथ कई नौकरियों के लिए जल्दी से आवेदन करें",
        browseJobs: "नौकरियां ब्राउज़ करें",
        noJobsFound: "कोई नौकरी नहीं मिली",
        categories: {
          driver: "ड्राइवर",
          guard: "गार्ड",
          gardener: "माली",
          cook: "रसोइया",
          maid: "घरेलू सहायक",
          carpenter: "बढ़ई"
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;