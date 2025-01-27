import { useUser } from "@/hooks/use-user";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu, Search, Filter } from "lucide-react";
import RootLayout from "@/components/layouts/RootLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    image: '/path/to/driver-job.jpg'
  },
  {
    id: 2,
    title: 'Security Guard',
    company: 'Company B',
    salary: '30,000/month',
    location: 'Delhi',
    image: '/path/to/security-job.jpg'
  },
];

export default function HomePage() {
  const [location, navigate] = useLocation();

  return (
    <RootLayout>
      <div className="min-h-screen bg-background">
        {/* Top Header with Menu and Logo */}
        <header className="sticky top-0 bg-background border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" className="hover:bg-transparent">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center justify-center flex-1">
              <h1 className="text-xl font-bold text-primary">SahyogJeevan</h1>
            </div>
            <div className="w-6" /> {/* Spacer for alignment */}
          </div>

          {/* Search Bar with Internal Filter */}
          <div className="relative mb-4">
            <Input
              placeholder="SEARCH INDUSTRY"
              className="pl-9 pr-12"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Job Categories */}
          <div className="grid grid-cols-3 gap-2">
            {JOB_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className="w-full"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </header>

        <main className="p-4 space-y-6">
          {/* Advertisement Boxes */}
          <section className="grid grid-cols-2 gap-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Ad Space 1</span>
            </div>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Ad Space 2</span>
            </div>
          </section>

          {/* Video Section */}
          <section>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Job Preview Video</span>
            </div>
          </section>

          {/* Jobs Section with Type Selection and Filter */}
          <section>
            <div className="space-y-4">
              {/* Job Type Selector */}
              <Select defaultValue="job">
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job">Regular Job</SelectItem>
                  <SelectItem value="gig">Gig Work</SelectItem>
                </SelectContent>
              </Select>

              {/* Jobs Header with Filter */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Jobs around you</h2>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Job Cards */}
              <div className="space-y-4">
                {FEATURED_JOBS.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-3">
                        {/* Job Image */}
                        <img
                          src={job.image}
                          alt={`${job.title} preview`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
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
            </div>
          </section>
        </main>
      </div>
    </RootLayout>
  );
}