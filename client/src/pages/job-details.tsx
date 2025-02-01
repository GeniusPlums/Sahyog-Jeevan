import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  BookmarkIcon, 
  MapPin, 
  Clock, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  CheckCircle2,
  ArrowLeft,
  Building2,
  XCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RootLayout from "@/components/layouts/RootLayout";
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface JobDetails {
  id: number;
  title: string;
  category: string;
  employerName: string;
  location: string;
  salary: string;
  type: string;
  shift: string;
  description: string;
  requirements: string[];
  otherDetails: {
    benefits: string[];
    location: string;
    workingDays: string;
  };
}

// Mock job data - replace with API call later
const MOCK_JOB: JobDetails = {
  id: 1,
  title: "Delivery Driver",
  category: "driver",
  employerName: "FastDeliver Co",
  location: "Mumbai Central",
  salary: "₹25,000/month",
  type: "FULL TIME",
  shift: "9 AM - 5 PM",
  description: "Full-time delivery driver needed for local deliveries. Must have valid license and 2+ years experience.",
  requirements: [
    "Valid driving license",
    "2+ years of experience",
    "Clean driving record",
    "Knowledge of local routes"
  ],
  otherDetails: {
    benefits: ["Health Insurance", "Vehicle Provided", "Fuel Allowance"],
    location: "Mumbai Central Area",
    workingDays: "Monday to Saturday"
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const [activeTab, setActiveTab] = useState('description');
  const [_, navigate] = useLocation();
  const { t } = useTranslation();

  const { data: job, isLoading, error } = useQuery<JobDetails>({
    queryKey: [`/api/jobs/${jobId}`],
  });

  if (isLoading) {
    return (
      <RootLayout>
        <div className="min-h-screen bg-background p-4">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-primary/10 rounded-full w-1/4" />
              <div className="h-24 bg-primary/10 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-4 bg-primary/10 rounded-full w-3/4" />
                <div className="h-4 bg-primary/10 rounded-full w-1/2" />
              </div>
            </div>
          </motion.div>
        </div>
      </RootLayout>
    );
  }

  if (error) {
    return (
      <RootLayout>
        <motion.div 
          className="min-h-screen bg-background p-4 flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t('common.error')}</h2>
          <p className="text-muted-foreground mb-4">{t('common.errorLoadingJob')}</p>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.goBack')}
          </Button>
        </motion.div>
      </RootLayout>
    );
  }

  const jobData = job || MOCK_JOB;
  const employerInitial = jobData?.employerName?.charAt(0) || '?';

  return (
    <RootLayout>
      <motion.div 
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b z-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between p-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t('common.jobDetails')}
              </h1>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-primary/10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Company Section */}
          <motion.div 
            className="flex flex-col items-center p-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10" />
              <span className="relative text-2xl font-bold text-primary">
                {employerInitial}
              </span>
            </motion.div>
            <motion.div className="text-center">
              <h2 className="text-xl font-semibold mb-2">{jobData?.employerName}</h2>
              <p className="text-muted-foreground flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4" />
                {jobData?.location}
              </p>
            </motion.div>
          </motion.div>

          {/* Job Information Cards */}
          <motion.div 
            className="px-4 mb-8 grid grid-cols-2 gap-4"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              variants={fadeInUp}
              className="bg-primary/5 rounded-2xl p-4 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{t('common.salary')}</span>
              </div>
              <p className="font-semibold">{jobData?.salary}</p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-primary/5 rounded-2xl p-4 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{t('common.jobType')}</span>
              </div>
              <p className="font-semibold">{jobData?.type}</p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-primary/5 rounded-2xl p-4 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{t('common.shift')}</span>
              </div>
              <p className="font-semibold">{jobData?.shift}</p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-primary/5 rounded-2xl p-4 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{t('common.workingDays')}</span>
              </div>
              <p className="font-semibold">{jobData?.otherDetails.workingDays}</p>
            </motion.div>
          </motion.div>

          {/* Job Details Section */}
          <motion.div 
            className="px-4"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            {/* Section Header */}
            <div className="flex items-center gap-4 py-6">
              <div className="h-[1px] flex-1 bg-primary/10" />
              <h3 className="text-primary/70 font-semibold whitespace-nowrap">
                {t('common.jobDetails')}
              </h3>
              <div className="h-[1px] flex-1 bg-primary/10" />
            </div>

            {/* Tab Container */}
            <div className="bg-primary/5 p-1 rounded-2xl mb-4">
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  onClick={() => setActiveTab('description')}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'description'
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:bg-primary/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('common.jobDescription')}
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('other')}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'other'
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:bg-primary/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('common.otherDetails')}
                </motion.button>
              </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-primary/5 rounded-2xl p-6"
              >
                {activeTab === 'description' ? (
                  <motion.div 
                    className="space-y-6"
                    variants={stagger}
                    initial="initial"
                    animate="animate"
                  >
                    <motion.section variants={fadeInUp}>
                      <h4 className="text-foreground font-semibold mb-4 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        {t('common.jobResponsibilities')}
                      </h4>
                      <ul className="space-y-3">
                        {['Drive safely and efficiently to deliver packages',
                          'Maintain vehicle cleanliness and perform basic checks',
                          'Follow traffic rules and company policies',
                          'Provide excellent customer service'].map((resp, index) => (
                          <motion.li 
                            key={index}
                            className="flex items-start gap-2 text-muted-foreground"
                            variants={fadeInUp}
                          >
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>{resp}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.section>

                    <motion.section variants={fadeInUp}>
                      <h4 className="text-foreground font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {t('common.requirements')}
                      </h4>
                      <ul className="space-y-3">
                        {jobData?.requirements.map((req, index) => (
                          <motion.li 
                            key={index}
                            className="flex items-start gap-2 text-muted-foreground"
                            variants={fadeInUp}
                          >
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.section>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="space-y-6"
                    variants={stagger}
                    initial="initial"
                    animate="animate"
                  >
                    <motion.section variants={fadeInUp}>
                      <h4 className="text-foreground font-semibold mb-4 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        {t('common.benefits')}
                      </h4>
                      <ul className="space-y-3">
                        {jobData?.otherDetails?.benefits?.map((benefit, index) => (
                          <motion.li 
                            key={index}
                            className="flex items-start gap-2 text-muted-foreground"
                            variants={fadeInUp}
                          >
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.section>

                    <motion.section variants={fadeInUp}>
                      <h4 className="text-foreground font-semibold mb-4 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        {t('common.additionalInfo')}
                      </h4>
                      <ul className="space-y-3">
                        <motion.li 
                          className="flex items-start gap-2 text-muted-foreground"
                          variants={fadeInUp}
                        >
                          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{jobData?.otherDetails?.location || t('common.locationNotSpecified')}</span>
                        </motion.li>
                        <motion.li 
                          className="flex items-start gap-2 text-muted-foreground"
                          variants={fadeInUp}
                        >
                          <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{jobData?.otherDetails?.workingDays || t('common.workingDaysNotSpecified')}</span>
                        </motion.li>
                      </ul>
                    </motion.section>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Apply Button */}
        <motion.div 
          className="fixed bottom-20 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
              onClick={() => navigate(`/jobs/${jobId}/apply`)}
            >
              <BookmarkIcon className="mr-2 h-5 w-5" />
              {t('common.applyNow')}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </RootLayout>
  );
}