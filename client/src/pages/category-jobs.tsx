import { useParams, useLocation } from "wouter";
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

// Mock company data
const TOP_COMPANIES = [
  { id: 1, name: "Company A", logo: "/company-a-logo.svg" },
  { id: 2, name: "Company B", logo: "/company-b-logo.svg" },
  { id: 3, name: "Company C", logo: "/company-c-logo.svg" },
  { id: 4, name: "Company D", logo: "/company-d-logo.svg" },
  { id: 5, name: "Company E", logo: "/company-e-logo.svg" },
  { id: 6, name: "Company F", logo: "/company-f-logo.svg" },
];

// Mock jobs data with more comprehensive details
const MOCK_JOBS = [
  {
    id: 1,
    title: "Delivery Driver",
    employerName: "FastDeliver Co",
    location: "Mumbai Central",
    salary: "₹25,000/month",
    description: "Full-time delivery driver needed for local deliveries",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80",
    category: "driver",
    type: "FULL TIME",
    shift: "9 AM - 5 PM",
    requirements: [
      "Valid driving license",
      "2+ years experience",
      "Clean driving record"
    ]
  },
  {
    id: 2,
    title: "Truck Driver",
    employerName: "Logistics Plus",
    location: "Delhi NCR",
    salary: "₹35,000/month",
    description: "Experienced truck driver for interstate routes",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80",
    category: "driver",
    type: "FULL TIME",
    shift: "8 PM - 5 AM",
    requirements: [
      "Heavy vehicle license",
      "5+ years experience",
      "Interstate route knowledge"
    ]
  }
];

export default function CategoryJobsPage() {
  const { category } = useParams();
  const decodedCategory = category ? decodeURIComponent(category) : '';
  const [_, navigate] = useLocation();

  // Filter jobs based on category
  const filteredJobs = MOCK_JOBS.filter(job => job.category === decodedCategory);

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

          {/* Jobs List */}
          <section>
            <h2 className="text-lg font-semibold mb-4">RECOMMENDED FOR YOU</h2>
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card 
                  key={job.id} 
                  className="overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-lg cursor-pointer"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded-lg mb-3">
                      <img
                        src={job.image}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/jobs/${job.id}`);
                        }}
                      >
                        CLICK HERE TO APPLY
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredJobs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No jobs found in this category</p>
                  <Button className="mt-4" onClick={() => navigate("/")}>
                    Browse All Jobs
                  </Button>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </RootLayout>
  );
}