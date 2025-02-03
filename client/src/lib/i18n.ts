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
        appliedJobs: "Applied Jobs",
        trackApplications: "Track your job applications",
        searchApplications: "Search applications",
        all: "All",
        pending: "Pending",
        shortlisted: "Shortlisted",
        rejected: "Rejected",
        accepted: "Accepted",
        withdraw: "Withdraw Application",
        viewDetails: "View Details",
        noApplications: "No Applications Found",
        noApplicationsDesc: "You haven't applied to any jobs yet. Start exploring and applying to jobs!",
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
        appliedJobs: "आवेदित नौकरियां",
        trackApplications: "अपने नौकरी आवेदनों को ट्रैक करें",
        searchApplications: "आवेदन खोजें",
        all: "सभी",
        pending: "लंबित",
        shortlisted: "शॉर्टलिस्ट",
        rejected: "अस्वीकृत",
        accepted: "स्वीकृत",
        withdraw: "आवेदन वापस लें",
        viewDetails: "विवरण देखें",
        noApplications: "कोई आवेदन नहीं मिला",
        noApplicationsDesc: "आपने अभी तक किसी नौकरी के लिए आवेदन नहीं किया है। नौकरियां खोजें और आवेदन करना शुरू करें!",
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