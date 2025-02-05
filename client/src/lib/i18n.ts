import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      common: {
        welcome: "Welcome to Sahyog Jeevan",
        home: "Home",
        login: "Login",
        register: "Register",
        iAmA: "I am a",
        worker: "Worker",
        employer: "Employer",
        username: "Username",
        password: "Password",
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
        acceptedJobs: "Accepted Jobs",
        acceptedJobsDesc: "View and manage your accepted job applications here",
        trackApplications: "Track your job applications",
        searchApplications: "Search applications",
        all: "All",
        pending: "Pending",
        shortlisted: "Shortlisted",
        rejected: "Rejected",
        accepted: "Accepted",
        withdraw: "Withdraw Application",
        viewDetails: "View Details",
        viewJob: "View Job",
        startDate: "Start Date",
        noApplications: "No Applications Found",
        noApplicationsDesc: "You haven't applied to any jobs yet. Start exploring and applying to jobs!",
        noAcceptedJobs: "No Accepted Jobs",
        noAcceptedJobsDesc: "You don't have any accepted jobs yet. Keep applying and showcasing your skills!",
        employerDashboard: "Employer Dashboard",
        manageJobListings: "Manage your job listings and view applications",
        postNewJob: "Post New Job",
        activeJobs: "Active Jobs",
        totalJobs: "Total Jobs",
        totalApplications: "Total Applications",
        totalViews: "Total Views",
        applicationsToday: "Applications Today",
        searchJobs: "Search jobs...",
        filterByStatus: "Filter by status",
        sortBy: "Sort by",
        datePosted: "Date Posted",
        applications: "Applications",
        ascending: "Ascending",
        descending: "Descending",
        editJob: "Edit Job",
        viewApplications: "View Applications",
        deleteJob: "Delete Job",
        jobTitle: "Job Title",
        location: "Location",
        status: "Status",
        postedDate: "Posted Date",
        noJobsPosted: "No Jobs Posted",
        noJobsPostedDesc: "You haven't posted any jobs yet. Click 'Post New Job' to get started!",
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
        welcome: "सह्योग जीवन में आपका स्वागत है",
        home: "होम",
        login: "लॉगिन",
        register: "पंजीकरण",
        iAmA: "मैं हूँ",
        worker: "कर्मचारी",
        employer: "नियोक्ता",
        username: "उपयोगकर्ता नाम",
        password: "पासवर्ड",
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
        acceptedJobs: "स्वीकृत नौकरियां",
        acceptedJobsDesc: "अपने स्वीकृत नौकरी आवेदनों को यहां देखें और प्रबंधित करें",
        trackApplications: "अपने नौकरी आवेदनों को ट्रैक करें",
        searchApplications: "आवेदन खोजें",
        all: "सभी",
        pending: "लंबित",
        shortlisted: "शॉर्टलिस्ट",
        rejected: "अस्वीकृत",
        accepted: "स्वीकृत",
        withdraw: "आवेदन वापस लें",
        viewDetails: "विवरण देखें",
        viewJob: "नौकरी देखें",
        startDate: "आरंभ तिथि",
        noApplications: "कोई आवेदन नहीं मिला",
        noApplicationsDesc: "आपने अभी तक किसी नौकरी के लिए आवेदन नहीं किया है। नौकरियां खोजें और आवेदन करना शुरू करें!",
        noAcceptedJobs: "कोई स्वीकृत नौकरी नहीं",
        noAcceptedJobsDesc: "आपके पास अभी तक कोई स्वीकृत नौकरी नहीं है। आवेदन करना जारी रखें और अपनी योग्यताएं दिखाएं!",
        employerDashboard: "नियोक्ता डैशबोर्ड",
        manageJobListings: "अपनी नौकरी सूचियों को प्रबंधित करें और आवेदन देखें",
        postNewJob: "नई नौकरी पोस्ट करें",
        activeJobs: "सक्रिय नौकरियां",
        totalJobs: "कुल नौकरियां",
        totalApplications: "कुल आवेदन",
        totalViews: "कुल दृश्य",
        applicationsToday: "आज के आवेदन",
        searchJobs: "नौकरियां खोजें...",
        filterByStatus: "स्थिति द्वारा फ़िल्टर करें",
        sortBy: "द्वारा सॉर्ट करें",
        datePosted: "पोस्ट की तिथि",
        applications: "आवेदन",
        ascending: "आरोही",
        descending: "अवरोही",
        editJob: "नौकरी संपादित करें",
        viewApplications: "आवेदन देखें",
        deleteJob: "नौकरी हटाएं",
        jobTitle: "नौकरी का शीर्षक",
        location: "स्थान",
        status: "स्थिति",
        postedDate: "पोस्ट की तिथि",
        noJobsPosted: "कोई नौकरी पोस्ट नहीं की गई",
        noJobsPostedDesc: "आपने अभी तक कोई नौकरी पोस्ट नहीं की है। 'नई नौकरी पोस्ट करें' पर क्लिक करके शुरू करें!",
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
    debug: false,
    interpolation: {
      escapeValue: false
    },
    load: 'languageOnly',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;