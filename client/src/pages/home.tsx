import { useUser } from "@/hooks/use-user";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RootLayout from "@/components/layouts/RootLayout";
import { Search, Filter } from "lucide-react";

const JOB_CATEGORIES = [
  { id: 'driver', label: 'DRIVER' },
  { id: 'guard', label: 'GUARD' },
  { id: 'gardener', label: 'GARDENER' },
];

const FEATURED_JOBS = [
  {
    id: 1,
    title: 'Driver',
    company: 'Company A',
    salary: '25,000/month',
    location: 'Mumbai',
  },
  {
    id: 2,
    title: 'Security Guard',
    company: 'Company B',
    salary: '30,000/month',
    location: 'Delhi',
  },
];

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Search and Filter Header */}
      <header className="sticky top-0 bg-background border-b p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="SEARCH INDUSTRY"
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Job Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {JOB_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              className="whitespace-nowrap"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Video Section */}
        <section>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">Job Preview Video</span>
          </div>
        </section>

        {/* Jobs Around You */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Jobs around you</h2>
          <div className="space-y-4">
            {FEATURED_JOBS.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                      <p className="text-sm">{job.location}</p>
                      <p className="text-sm font-medium">{job.salary}</p>
                    </div>
                    <Button 
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="whitespace-nowrap"
                    >
                      CLICK HERE TO APPLY
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}