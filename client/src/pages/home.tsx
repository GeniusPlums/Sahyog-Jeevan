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
  { id: 'driver', label: 'DRIVER', icon: '🚗' },
  { id: 'guard', label: 'GUARD', icon: '👮' },
  { id: 'gardener', label: 'GARDENER', icon: '🌿' },
];

const TOP_COMPANIES = [
  { id: 1, name: 'Company A', logo: '/company-a-logo.svg' },
  { id: 2, name: 'Company B', logo: '/company-b-logo.svg' },
  { id: 3, name: 'Company C', logo: '/company-c-logo.svg' },
  { id: 4, name: 'Company D', logo: '/company-d-logo.svg' },
  { id: 5, name: 'Company E', logo: '/company-e-logo.svg' },
  { id: 6, name: 'Company F', logo: '/company-f-logo.svg' },
];

const FEATURED_JOBS = [
  {
    id: 1,
    title: 'Senior Driver',
    company: 'Company A',
    salary: '₹35,000/month',
    location: 'Mumbai',
    image: '/path/to/driver-job.jpg'
  },
  {
    id: 2,
    title: 'Security Guard',
    company: 'Company B',
    salary: '₹30,000/month',
    location: 'Delhi',
    image: '/path/to/security-job.jpg'
  },
  {
    id: 3,
    title: 'Head Gardener',
    company: 'Company C',
    salary: '₹28,000/month',
    location: 'Bangalore',
    image: '/path/to/gardener-job.jpg'
  },
];

export default function HomePage() {
  const [, navigate] = useLocation();

  return (
    <RootLayout>
      <div className="min-h-screen bg-background">
        {/* Top Header with Menu and Logo */}
        <header className="sticky top-0 bg-background border-b p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" className="hover:bg-transparent">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-primary">JOBS</h1>
              <Filter className="h-5 w-5" />
            </div>
          </div>

          {/* Search Bar with Internal Filter */}
          <div className="relative mb-4">
            <Input
              placeholder="Search jobs..."
              className="pl-9 pr-12"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>

          {/* Job Categories */}
          <div className="grid grid-cols-3 gap-2">
            {JOB_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className="w-full flex flex-col gap-1 h-auto py-2"
                onClick={() => navigate(`/jobs/category/${category.id}`)}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="text-sm">{category.label}</span>
              </Button>
            ))}
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
                  className="aspect-square bg-muted rounded-lg flex items-center justify-center p-4"
                >
                  <div className="text-2xl">🏢</div>
                  {/* Replace with actual company logos */}
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Jobs */}
          <section>
            <h2 className="text-lg font-semibold mb-4">RECOMMENDED FOR YOU</h2>
            <div className="space-y-4">
              {FEATURED_JOBS.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded-lg mb-3">
                      {/* Job Image */}
                      <div className="w-full h-full bg-secondary rounded-lg flex items-center justify-center">
                        <span className="text-2xl">
                          {job.title.includes('Driver') ? '🚗' : 
                           job.title.includes('Guard') ? '👮' : '🌿'}
                        </span>
                      </div>
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
                        className="whitespace-nowrap bg-black text-white hover:bg-gray-800"
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
    </RootLayout>
  );
}