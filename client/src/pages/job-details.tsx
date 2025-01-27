import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Menu, Filter, BookmarkIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RootLayout from "@/components/layouts/RootLayout";

// Mock job data - replace with API call later
const MOCK_JOB = {
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
  
  // For now, use mock data instead of API call
  const { data: job = MOCK_JOB } = useQuery({
    queryKey: [`/api/jobs/${jobId}`],
  });

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
            {job.category.toUpperCase()}
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
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Company Section */}
        <div className="flex flex-col items-center p-6">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary-foreground">
              {job.employerName.charAt(0)}
            </span>
          </div>
          <h2 className="text-xl font-semibold">{job.employerName}</h2>
        </div>

        {/* Job Information Pills */}
        <div className="flex justify-center gap-4 px-4 mb-6">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm">
            <div className="text-xs opacity-75">SALARY</div>
            <div>{job.salary}</div>
          </div>
          <div className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm">
            <div className="text-xs opacity-75">JOB TYPE</div>
            <div>{job.type}</div>
          </div>
          <div className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm">
            <div className="text-xs opacity-75">SHIFT</div>
            <div>{job.shift}</div>
          </div>
        </div>

        {/* Job Details Section */}
        <div className="px-4">
          <div className="border-t border-b py-4">
            <h3 className="text-center font-semibold">JOB DETAILS</h3>
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">JOB DESCRIPTION</TabsTrigger>
              <TabsTrigger value="other">OTHER DETAILS</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="mb-4">{job.description}</p>
                {job.requirements && (
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="other" className="mt-4">
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-semibold mb-2">Benefits:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {job.otherDetails.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
                <h4 className="font-semibold mt-4 mb-2">Location:</h4>
                <p>{job.otherDetails.location}</p>
                <h4 className="font-semibold mt-4 mb-2">Working Days:</h4>
                <p>{job.otherDetails.workingDays}</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Apply Button */}
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t">
          <Button 
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900"
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
