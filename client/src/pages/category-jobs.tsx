import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RootLayout from "@/components/layouts/RootLayout";
import type { Job } from "@db/schema";

// Mock company data - replace with actual API data later
const TOP_COMPANIES = [
  { id: 1, name: "Company A", logo: "/company-a-logo.svg" },
  { id: 2, name: "Company B", logo: "/company-b-logo.svg" },
  { id: 3, name: "Company C", logo: "/company-c-logo.svg" },
  { id: 4, name: "Company D", logo: "/company-d-logo.svg" },
  { id: 5, name: "Company E", logo: "/company-e-logo.svg" },
  { id: 6, name: "Company F", logo: "/company-f-logo.svg" },
];

export default function CategoryJobsPage() {
  const { category } = useParams();
  const decodedCategory = category ? decodeURIComponent(category) : '';

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: [`/api/jobs/category/${category}`],
  });

  return (
    <RootLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 bg-background border-b p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="hover:bg-transparent">
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-lg font-semibold">JOBS</h1>
            </div>
            <Select defaultValue="job">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="job">Regular Job</SelectItem>
                <SelectItem value="gig">Gig Work</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon">
              <Filter className="h-6 w-6" />
            </Button>
          </div>
        </header>

        <main className="p-4 space-y-6">
          {/* Top Paying Companies */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Top Paying Companies</h2>
            <div className="grid grid-cols-3 gap-4">
              {TOP_COMPANIES.map((company) => (
                <div 
                  key={company.id} 
                  className="aspect-square bg-muted rounded-lg flex items-center justify-center p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-sm text-center">{company.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Jobs */}
          <section>
            <h2 className="text-lg font-semibold mb-4">RECOMMENDED FOR YOU</h2>
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeleton
                [...Array(5)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg animate-pulse" />
                      <div className="mt-3 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                        <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                jobs.map((job) => (
                  <Card key={job.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-3">
                        <img
                          src={job.image || `/job-images/${job.category}.jpg`}
                          alt={`${job.title} preview`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {job.employerName}
                          </p>
                          <p className="text-sm">{job.location}</p>
                          <p className="text-sm font-medium">{job.salary}</p>
                        </div>
                        <Button 
                          className="whitespace-nowrap bg-black text-white hover:bg-gray-800"
                        >
                          CLICK HERE TO APPLY
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </RootLayout>
  );
}