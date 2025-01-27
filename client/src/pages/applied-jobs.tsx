import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import type { Application } from "@db/schema";

const MOCK_APPLICATIONS = [
  {
    id: 1,
    jobId: 1,
    status: "pending",
    job: {
      title: "Driver",
      company: "Company A",
      location: "Mumbai",
      salary: "₹25,000/month",
      image: "/path/to/driver-job.jpg"
    }
  },
  {
    id: 2,
    jobId: 2,
    status: "shortlisted",
    job: {
      title: "Security Guard",
      company: "Company B",
      location: "Delhi",
      salary: "₹30,000/month",
      image: "/path/to/security-job.jpg"
    }
  }
];

export default function AppliedJobsPage() {
  const { data: applications = MOCK_APPLICATIONS, isLoading } = useQuery<typeof MOCK_APPLICATIONS>({
    queryKey: ["/api/applications/worker"],
  });

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Top Header */}
      <header className="sticky top-0 bg-background border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" className="hover:bg-transparent">
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center justify-center flex-1">
            <h1 className="text-xl font-bold text-primary">Applied Jobs</h1>
          </div>
          <div className="w-6" /> {/* Spacer for alignment */}
        </div>
      </header>

      <main className="p-4">
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-lg mb-3">
                  <img
                    src={application.job.image}
                    alt={`${application.job.title} preview`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{application.job.title}</h3>
                    <p className="text-sm text-muted-foreground">{application.job.company}</p>
                    <p className="text-sm">{application.job.location}</p>
                    <p className="text-sm font-medium">{application.job.salary}</p>
                    <div className="mt-2">
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        application.status === "shortlisted" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {application.status === "shortlisted" ? "Shortlisted" : "Pending"}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {applications.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No applications found</p>
              <Button className="mt-4" onClick={() => window.location.href = "/"}>
                Browse Jobs
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}