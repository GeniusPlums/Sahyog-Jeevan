import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "@/hooks/use-user";
import { Loader2, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import AuthPage from "@/pages/auth-page";
import AppliedJobsPage from "@/pages/applied-jobs";
import AcceptedJobsPage from "@/pages/accepted-jobs";
import CategoryJobsPage from "@/pages/category-jobs";
import JobDetailsPage from "@/pages/job-details";
import JobApplicationForm from "@/pages/job-application-form";
import ApplicationFinishPage from "@/pages/application-finish";
import EmployerDashboard from "@/pages/employer-dashboard";
import JobPost from "@/pages/job-post";
import Navbar from "@/components/navbar";
import { ErrorBoundary } from "@/components/error-boundary";

function LoadingScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm"
    >
      <div className="relative">
        {/* Animated gradient background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-xl animate-pulse" />
        
        {/* Logo and loading spinner */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="relative flex flex-col items-center gap-4"
        >
          <Briefcase className="h-12 w-12 text-primary" />
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function Router() {
  const { user, isLoading } = useUser();

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen key="loading" />
      ) : !user ? (
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AuthPage />
        </motion.div>
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-background"
        >
          <Navbar />
          {user.role === "employer" ? (
            <Switch>
              <Route path="/" component={EmployerDashboard} />
              <Route path="/employer/jobs/new" component={JobPost} />
              <Route component={NotFound} />
            </Switch>
          ) : (
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/applied" component={AppliedJobsPage} />
              <Route path="/accepted" component={AcceptedJobsPage} />
              <Route path="/jobs/category/:category" component={CategoryJobsPage} />
              <Route path="/jobs/:jobId" component={JobDetailsPage} />
              <Route path="/jobs/:jobId/apply" component={JobApplicationForm} />
              <Route path="/jobs/:jobId/finish" component={ApplicationFinishPage} />
              <Route component={NotFound} />
            </Switch>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Background gradient effects */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          {/* Main content */}
          <div className="relative">
            <Router />
            <Toaster />
          </div>
        </motion.div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;