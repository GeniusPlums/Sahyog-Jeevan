import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, MapPin, Building } from "lucide-react";
import RootLayout from "@/components/layouts/RootLayout";
import { useLocation } from "wouter";

// Mock data - replace with actual API data later
const JOBS_BY_CATEGORY = {
  driver: [
    {
      id: 1,
      title: "Senior Driver",
      company: "Company A",
      location: "Mumbai",
      salary: "₹35,000/month",
      experience: "3+ years",
      type: "Full Time",
    },
    {
      id: 2,
      title: "Delivery Driver",
      company: "Company B",
      location: "Delhi",
      salary: "₹28,000/month",
      experience: "1+ years",
      type: "Full Time",
    },
  ],
  guard: [
    {
      id: 3,
      title: "Security Guard",
      company: "Company C",
      location: "Bangalore",
      salary: "₹30,000/month",
      experience: "2+ years",
      type: "Full Time",
    },
  ],
  gardener: [
    {
      id: 4,
      title: "Head Gardener",
      company: "Company D",
      location: "Chennai",
      salary: "₹25,000/month",
      experience: "2+ years",
      type: "Full Time",
    },
  ],
};

export default function CategoryJobsPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const category = params.category as keyof typeof JOBS_BY_CATEGORY;

  // In a real implementation, this would fetch from an API
  const { data: jobs = JOBS_BY_CATEGORY[category] || [], isLoading } = useQuery({
    queryKey: ["/api/jobs", category],
    enabled: false, // Disable actual API call for now
  });

  const categoryEmoji = {
    driver: "🚗",
    guard: "👮",
    gardener: "🌿",
  }[category] || "💼";

  return (
    <RootLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 bg-background border-b p-4 z-50">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-transparent"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold capitalize">
              {category} Jobs
            </h1>
          </div>
        </header>

        <main className="p-4">
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{categoryEmoji}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium">{job.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Building className="h-4 w-4" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <span className="text-sm px-2 py-1 bg-muted rounded-full">
                              {job.experience}
                            </span>
                            <span className="text-sm px-2 py-1 bg-muted rounded-full">
                              {job.type}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{job.salary}</p>
                          <Button 
                            className="mt-2 bg-black text-white hover:bg-gray-800"
                            onClick={() => navigate(`/jobs/${job.id}`)}
                          >
                            CLICK HERE TO APPLY
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {jobs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No jobs found in this category
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </RootLayout>
  );
}
