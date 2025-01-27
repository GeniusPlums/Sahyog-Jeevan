import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import WorkerNavigation from "@/components/worker-navigation";
import ApplicationCard from "@/components/application-card";
import { Loader2 } from "lucide-react";
import type { Application } from "@db/schema";

export default function AppliedJobs() {
  const { user } = useUser();
  
  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications/worker"],
    enabled: user?.role === "worker",
  });

  const pendingApplications = applications.filter(app => 
    app.status === "pending" || app.status === "shortlisted"
  );

  return (
    <div className="space-y-8">
      <WorkerNavigation />
      
      <div className="container">
        <h1 className="text-2xl font-bold mb-6">Applied Jobs</h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingApplications.map((application) => (
              <ApplicationCard 
                key={application.id} 
                application={application}
              />
            ))}
            {pendingApplications.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No pending applications found. Start applying to jobs!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
