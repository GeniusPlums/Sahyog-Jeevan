import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";
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

function Router() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Routes based on user role
  if (user.role === "employer") {
    return (
      <>
        <Navbar />
        <Switch>
          <Route path="/" component={EmployerDashboard} />
          <Route path="/employer/jobs/new" component={JobPost} />
          <Route component={NotFound} />
        </Switch>
      </>
    );
  }

  return (
    <>
      <Navbar />
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
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;