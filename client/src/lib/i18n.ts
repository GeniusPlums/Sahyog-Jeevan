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
    appliedJobs: "Applied Jobs",
    acceptedJobs: "Accepted Jobs",
    trackApplications: "Track your job applications",
    applications: "Applications",
    searchApplications: "Search applications",
    all: "All",
    pending: "Pending",
    shortlisted: "Shortlisted",
    rejected: "Rejected",
    accepted: "Accepted",
    startDate: "Start Date",
    noApplications: "No applications found",
    noApplicationsDesc: "You haven't applied to any jobs yet",
    noAcceptedJobs: "No accepted jobs found",
    noAcceptedJobsDesc: "You don't have any accepted jobs yet",
    noJobsFound: "No jobs found",
    viewAll: "View All",
    categories: {
      driver: "Driver",
      guard: "Guard",
      gardener: "Gardener",
      cook: "Cook",
      maid: "Maid",
      carpenter: "Carpenter"
    },
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
    },
    locations: {
      mumbai: "Mumbai",
      delhi: "Delhi",
      bangalore: "Bangalore",
      mumbaicentral: "Mumbai Central"
    }
  }
};

// Hindi translations
const hiTranslations = {
  common: {
    search: "नौकरी खोजें",
    filter: "फ़िल्टर",
    apply: "आवेदन करने के लिए यहां क्लिक करें",
    jobsAround: "आपके आस-पास की नौकरियां",
    login: "लॉगिन",
    register: "रजिस्टर",
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
    open: "खुला",
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
    quickApplyDesc: "अपनी सहेजी गई प्रोफ़ाइल के साथ कई नौकरियों के लिए जल्दी से आवेदन करें",
    browseJobs: "नौकरियां ब्राउज़ करें",
    home: "होम",
    jobApplication: "नौकरी आवेदन",
    applicationProgress: "आवेदन की प्रगति",
    appliedJobs: "आवेदित नौकरियां",
    acceptedJobs: "स्वीकृत नौकरियां",
    trackApplications: "अपने नौकरी आवेदनों को ट्रैक करें",
    applications: "आवेदन",
    searchApplications: "आवेदन खोजें",
    all: "सभी",
    pending: "लंबित",
    shortlisted: "शॉर्टलिस्ट",
    rejected: "अस्वीकृत",
    accepted: "स्वीकृत",
    startDate: "आरंभ तिथि",
    noApplications: "कोई आवेदन नहीं मिला",
    noApplicationsDesc: "आपने अभी तक किसी नौकरी के लिए आवेदन नहीं किया है",
    noAcceptedJobs: "कोई स्वीकृत नौकरी नहीं मिली",
    noAcceptedJobsDesc: "आपके पास अभी तक कोई स्वीकृत नौकरी नहीं है",
    noJobsFound: "कोई नौकरी नहीं मिली",
    viewAll: "सभी देखें",
    categories: {
      driver: "ड्राइवर",
      guard: "गार्ड",
      gardener: "माली",
      cook: "रसोइया",
      maid: "घरेलू सहायक",
      carpenter: "बढ़ई"
    },
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
    },
    locations: {
      mumbai: "मुंबई",
      delhi: "दिल्ली",
      bangalore: "बैंगलोर",
      mumbaicentral: "मुंबई सेंट्रल"
    }
  }
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: enTranslations,
      hi: hiTranslations
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;