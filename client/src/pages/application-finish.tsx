import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  DollarSign,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import RootLayout from "@/components/layouts/RootLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { jobsApi, applicationsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

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

export default function ApplicationFinishPage() {
  const { jobId } = useParams();
  const [_, navigate] = useLocation();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser(); // Get current user

  // Fetch job details properly
  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsApi.getById(parseInt(jobId || '0')),
    enabled: !!jobId,
  });

  const handleFinish = async () => {
    if (!termsAccepted) {
      toast({
        title: "Please accept the terms",
        description: "You must accept the terms to submit your application",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Direct API call without mutation
      const formData = new FormData();
      const result = await applicationsApi.create(Number(jobId), formData);
      
      // Success handling
      toast({
        title: "Application submitted successfully!",
        description: "Your application has been received.",
      });
      
      // Invalidate applications query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      
      // Navigate to applied jobs page
      window.location.href = "/applied";
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error submitting application",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (jobLoading) {
    return (
      <RootLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-md p-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
            <div className="h-20 bg-gray-200 rounded mx-auto"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </RootLayout>
    );
  }

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
                onClick={() => navigate(`/jobs/${jobId}`)}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Finish Application
              </h1>
              <div className="w-10" /> {/* Spacer for alignment */}
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Success Icon */}
          <motion.div 
            className="flex justify-center mb-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
          </motion.div>

          {/* Job Details Cards */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
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
                <span className="text-sm text-muted-foreground">Salary</span>
              </div>
              <p className="font-semibold">{job?.salary || 'Not Specified'}</p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-primary/5 rounded-2xl p-4 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Job Type</span>
              </div>
              <p className="font-semibold">{job?.type || 'Not Specified'}</p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-primary/5 rounded-2xl p-4 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Shift</span>
              </div>
              <p className="font-semibold">{job?.shift || 'Not Specified'}</p>
            </motion.div>
          </motion.div>

          {/* Terms & Conditions */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mb-8"
          >
            <Card className="bg-primary/5 border-0">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Terms and Conditions
                  </h2>
                </div>

                <div className="space-y-4 text-muted-foreground">
                  <p>Please read and agree to our terms and conditions.</p>
                  <ul className="space-y-2">
                    {[
                      'I understand that submitting this application does not guarantee employment.',
                      'I confirm that all information provided is accurate and complete.',
                      'I agree to be contacted regarding this job application.',
                    ].map((term, index) => (
                      <motion.li 
                        key={index}
                        variants={fadeInUp}
                        className="flex items-start gap-2"
                      >
                        <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{term}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="terms" 
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      I agree to the terms and conditions.
                    </label>
                    <p className="text-sm text-muted-foreground">
                      View our policy{" "}
                      <button 
                        className="text-primary hover:underline focus:outline-none"
                        onClick={() => {/* Open policy */}}
                      >
                        here
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Finish Button */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleFinish}
              disabled={isSubmitting || !termsAccepted}
            >
              {isSubmitting ? "Submitting..." : "Finish Application"}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </RootLayout>
  );
}
