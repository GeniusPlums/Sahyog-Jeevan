import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import RootLayout from "@/components/layouts/RootLayout";
import { jobsApi } from "@/lib/api";
import { Building2, MapPin, Clock, Calendar, Car, Shield, HardHat, Brush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import JobCard from "@/components/job-card";
import { motion } from "framer-motion";

const JOB_CATEGORIES = [
  { id: "DRIVER", icon: <Car className="w-6 h-6" />, label: "Driver" },
  { id: "SECURITY", icon: <Shield className="w-6 h-6" />, label: "Security" },
  { id: "CONSTRUCTION", icon: <HardHat className="w-6 h-6" />, label: "Construction" },
  { id: "CLEANER", icon: <Brush className="w-6 h-6" />, label: "Cleaner" },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [jobType, setJobType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: jobs = [], isError, error, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      console.log('Fetching jobs...');
      const jobs = await jobsApi.getAll();
      console.log('Got jobs:', jobs);
      return jobs;
    }
  });

  if (isLoading) {
    return (
      <RootLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </RootLayout>
    );
  }

  if (isError) {
    return (
      <RootLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <p className="text-destructive">Error loading jobs. Please try again later.</p>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </RootLayout>
    );
  }

  // Sort jobs by date (most recent first) and filter based on search and job type
  const filteredJobs = jobs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter(job => {
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = jobType === 'ALL' || job.category === jobType;
    return matchesSearch && matchesType;
  });

  return (
    <RootLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Category Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.button
              key="all"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`flex flex-col items-center justify-center p-4 rounded-lg hover:bg-accent transition-colors ${
                jobType === 'ALL' ? 'bg-accent' : 'bg-card'
              }`}
              onClick={() => setJobType('ALL')}
            >
              <Building2 className="w-6 h-6" />
              <span className="mt-2 text-sm font-medium">All Jobs</span>
            </motion.button>
            {JOB_CATEGORIES.map((category) => (
              <motion.button
                key={category.id}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`flex flex-col items-center justify-center p-4 rounded-lg hover:bg-accent transition-colors ${
                  jobType === category.id ? 'bg-accent' : 'bg-card'
                }`}
                onClick={() => setJobType(category.id)}
              >
                {category.icon}
                <span className="mt-2 text-sm font-medium">{category.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                {JOB_CATEGORIES.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}

            {filteredJobs.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No jobs found matching your criteria
              </div>
            )}
          </div>
        </div>
      </div>
    </RootLayout>
  );
}