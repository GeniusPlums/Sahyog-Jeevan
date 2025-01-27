import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MapPin, Briefcase, Clock, ArrowRight } from "lucide-react";
import RootLayout from "@/components/layouts/RootLayout";
import type { Application } from "@db/schema";

const MOCK_APPLICATIONS = [
  {
    id: 1,
    jobId: 1,
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
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
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
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

  const getDaysAgo = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days ago`;
  };

  return (
    <RootLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Search Header */}
        <div className="sticky top-0 bg-white px-4 py-3 shadow-sm">
          <div className="relative">
            <Input
              placeholder="Search jobs"
              className="w-full bg-gray-100 pl-10 pr-12 py-2 rounded-full border-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-gray-200"
            >
              <Filter className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>

        <main className="p-4 space-y-6">
          {/* Section Title with Lines */}
          <div className="flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-gray-200" />
            <h2 className="text-blue-600 font-semibold whitespace-nowrap">JOBS APPLIED</h2>
            <div className="h-[1px] flex-1 bg-gray-200" />
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Company Image */}
                    <div className="w-[120px] h-[80px] bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={application.job.image}
                        alt={application.job.company}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                      <h3 className="text-blue-600 font-medium">{application.job.company}</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-gray-700 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                          {application.job.location}
                        </div>
                        <div className="flex items-center text-gray-700 text-sm">
                          <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                          {application.job.title}
                        </div>
                        <div className="flex items-center text-gray-700 text-sm">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          Applied {getDaysAgo(application.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-end justify-between">
                      <div className="text-lg font-medium text-gray-900">
                        {application.job.salary}
                      </div>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => window.location.href = `/applications/${application.id}`}
                      >
                        Review
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {applications.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No applications found</p>
                <Button className="mt-4" onClick={() => window.location.href = "/"}>
                  Browse Jobs
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </RootLayout>
  );
}