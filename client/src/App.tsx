import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";

import AuthPage from "@/pages/auth-page";
import Home from "@/pages/home";
import JobListing from "@/pages/job-listing";
import JobPost from "@/pages/job-post";
import Profile from "@/pages/profile";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/navbar";
import AppliedJobs from "@/pages/applied-jobs";
import AcceptedJobs from "@/pages/accepted-jobs";

function Router() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/jobs" component={JobListing} />
          <Route path="/job/post" component={JobPost} />
          <Route path="/profile" component={Profile} />
          <Route path="/applied-jobs" component={AppliedJobs} />
          <Route path="/accepted-jobs" component={AcceptedJobs} />
          {user.role === "admin" && (
            <Route path="/admin" component={AdminDashboard} />
          )}
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
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