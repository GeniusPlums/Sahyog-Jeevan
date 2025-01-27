import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import AppliedJobsPage from "@/pages/applied-jobs";
import AcceptedJobsPage from "@/pages/accepted-jobs";
import CategoryJobsPage from "@/pages/category-jobs";
import JobDetailsPage from "@/pages/job-details";
import JobApplicationForm from "@/pages/job-application-form";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/applied" component={AppliedJobsPage} />
      <Route path="/accepted" component={AcceptedJobsPage} />
      <Route path="/jobs/category/:category" component={CategoryJobsPage} />
      <Route path="/jobs/:jobId" component={JobDetailsPage} />
      <Route path="/jobs/:jobId/apply" component={JobApplicationForm} />
      <Route component={NotFound} />
    </Switch>
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