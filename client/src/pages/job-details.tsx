import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Menu, BookmarkIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RootLayout from "@/components/layouts/RootLayout";

interface JobDetails {
  id: number;
  title: string;
  category: string;
  employerName: string;
  location: string;
  salary: string;
  type: string;
  shift: string;
  description: string;
  requirements: string[];
  otherDetails: {
    benefits: string[];
    location: string;
    workingDays: string;
  };
}

// Mock job data - replace with API call later
const MOCK_JOB: JobDetails = {
  id: 1,
  title: "Delivery Driver",
  category: "driver",
  employerName: "FastDeliver Co",
  location: "Mumbai Central",
  salary: "₹25,000/month",
  type: "FULL TIME",
  shift: "9 AM - 5 PM",
  description: "Full-time delivery driver needed for local deliveries. Must have valid license and 2+ years experience.",
  requirements: [
    "Valid driving license",
    "2+ years of experience",
    "Clean driving record",
    "Knowledge of local routes"
  ],
  otherDetails: {
    benefits: ["Health Insurance", "Vehicle Provided", "Fuel Allowance"],
    location: "Mumbai Central Area",
    workingDays: "Monday to Saturday"
  }
};

export default function JobDetailsPage() {
  const { jobId } = useParams();

  const { data: job, isLoading, error } = useQuery<JobDetails>({
    queryKey: [`/api/jobs/${jobId}`],
  });

  if (isLoading) {
    return (
      <RootLayout>
        <div className="min-h-screen bg-background p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-24 bg-muted rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </div>
        </div>
      </RootLayout>
    );
  }

  if (error) {
    return (
      <RootLayout>
        <div className="min-h-screen bg-background p-4">
          <p>Error loading job details.</p>
        </div>
      </RootLayout>
    );
  }

  const jobData = job || MOCK_JOB;
  const employerInitial = jobData?.employerName?.charAt(0) || '?';

  return (
    <RootLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 bg-background border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <h1 className="text-lg font-semibold">SahyogJeevan</h1>
              </Link>
            </div>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </header>

        {/* Navigation Bar */}
        <div className="flex items-center justify-between p-4 gap-2">
          <Button variant="outline" className="rounded-full">
            {(jobData?.category || '').toUpperCase()}
          </Button>
          <Select defaultValue="jobs">
            <SelectTrigger className="w-[100px] bg-gray-900 text-white hover:bg-gray-800">
              <SelectValue>JOBS</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jobs">JOBS</SelectItem>
              <SelectItem value="gigs">GIGS</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="rounded-full">
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Company Section */}
        <div className="flex flex-col items-center p-6">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary-foreground">
              {employerInitial}
            </span>
          </div>
          <h2 className="text-xl font-semibold">{jobData?.employerName || 'Company Name'}</h2>
        </div>

        {/* Job Information Pills - Matching the provided design */}
        <div className="px-4 mb-6 space-y-4">
          <div className="w-full bg-gray-200 rounded-full p-1">
            <div className="flex items-center rounded-full overflow-hidden">
              <div className="bg-[#808080] text-white px-6 py-2 flex-1">
                <div className="text-sm">SALARY</div>
              </div>
              <div className="bg-black text-white px-6 py-2 flex-1 text-right">
                <div className="font-medium">{jobData?.salary || 'Not specified'}</div>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full p-1">
            <div className="flex items-center rounded-full overflow-hidden">
              <div className="bg-[#808080] text-white px-6 py-2 flex-1">
                <div className="text-sm">JOB TYPE</div>
              </div>
              <div className="bg-black text-white px-6 py-2 flex-1 text-right">
                <div className="font-medium">{jobData?.type || 'Not specified'}</div>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full p-1">
            <div className="flex items-center rounded-full overflow-hidden">
              <div className="bg-[#808080] text-white px-6 py-2 flex-1">
                <div className="text-sm">SHIFT</div>
              </div>
              <div className="bg-black text-white px-6 py-2 flex-1 text-right">
                <div className="font-medium">{jobData?.shift || 'Not specified'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Job Details Section */}
        <div className="px-4">
          <div className="border-t border-b py-4">
            <h3 className="text-center font-semibold">JOB DETAILS</h3>
          </div>

          <div className="mt-4 bg-muted rounded-lg p-4 space-y-6">
            {/* Description Section */}
            <div>
              <h4 className="font-semibold mb-2">Job Description</h4>
              <p>{jobData?.description || 'No description available'}</p>
            </div>

            {/* Requirements Section */}
            {jobData?.requirements && jobData.requirements.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Requirements</h4>
                <ul className="list-disc list-inside space-y-1">
                  {jobData.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits Section */}
            <div>
              <h4 className="font-semibold mb-2">Benefits</h4>
              <ul className="list-disc list-inside space-y-1">
                {jobData?.otherDetails?.benefits?.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                )) || <li>No benefits listed</li>}
              </ul>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Location</h4>
                <p>{jobData?.otherDetails?.location || 'Location not specified'}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Working Days</h4>
                <p>{jobData?.otherDetails?.workingDays || 'Working days not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t">
          <Button
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            size="lg"
          >
            <BookmarkIcon className="mr-2 h-5 w-5" />
            APPLY NOW
          </Button>
        </div>
      </div>
    </RootLayout>
  );
}