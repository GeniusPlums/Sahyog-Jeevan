import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit2, Eye, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import RootLayout from "@/components/layouts/RootLayout";
import type { Job } from "@db/schema";

// Mock data - will be replaced with API call
const MOCK_JOBS = [
  {
    id: 1,
    title: "Delivery Driver",
    status: "active",
    applications: 5,
    postedDate: "2025-01-20",
    location: "Mumbai Central",
  },
  {
    id: 2,
    title: "Security Guard",
    status: "draft",
    applications: 0,
    postedDate: "2025-01-25",
    location: "Delhi NCR",
  },
];

export default function EmployerDashboard() {
  const [_, navigate] = useLocation();
  
  const { data: jobs = MOCK_JOBS, isLoading } = useQuery<typeof MOCK_JOBS>({
    queryKey: ["/api/employer/jobs"],
  });

  return (
    <RootLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Job Listings</h1>
            <Button onClick={() => navigate("/employer/jobs/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
          </div>

          <div className="grid gap-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.location}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {job.applications} applications
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Posted on {new Date(job.postedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => navigate(`/employer/jobs/${job.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => navigate(`/employer/jobs/${job.id}/edit`)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No jobs posted yet</h3>
              <p className="text-muted-foreground mt-1">Click the button above to post your first job</p>
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  );
}
