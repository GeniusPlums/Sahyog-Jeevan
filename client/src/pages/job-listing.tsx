import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { jobsApi, type Job } from "@/lib/api";
import JobCard from "@/components/job-card";
import RootLayout from "@/components/layouts/RootLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Search, 
  Filter, 
  MapPin, 
  ArrowUpDown,
  LayoutGrid,
  LayoutList,
  Briefcase,
  Clock,
  Calendar
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

const LOCATIONS = ["mumbai", "delhi", "bangalore", "hyderabad", "chennai"];
const JOB_TYPES = ["FULL TIME", "PART TIME", "CONTRACT"];
const SHIFTS = ["day", "night", "flexible"];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function JobListing() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("list");
  const [filters, setFilters] = useState({
    type: "all",
    location: "all",
    shift: "all",
    salary: [0, 100000]
  });

  const { data: jobs = [], isLoading, error } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      console.log('Fetching jobs...');
      try {
        const result = await jobsApi.getAll();
        console.log('Fetched jobs:', result);
        return result;
      } catch (error) {
        console.error('Error in job listing query:', error);
        throw error;
      }
    }
  });

  if (error) {
    console.error('Job listing error:', error);
  }

  const filteredJobs = jobs.filter(job => {
    console.log('Filtering job:', job);
    const matchesSearch = 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = 
      filters.type === "all" || 
      job.type.toLowerCase() === filters.type.toLowerCase();

    const matchesLocation =
      filters.location === "all" ||
      job.location.toLowerCase() === filters.location.toLowerCase();

    const matchesShift =
      filters.shift === "all" ||
      job.shift.toLowerCase() === filters.shift.toLowerCase();

    const matchesSalary =
      parseInt(job.salary) >= filters.salary[0] &&
      parseInt(job.salary) <= filters.salary[1];

    return matchesSearch && matchesType && matchesLocation && matchesShift && matchesSalary;
  });

  return (
    <RootLayout>
      <motion.div 
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/10">
          <div className="container mx-auto max-w-7xl py-4">
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold tracking-tight">
                    {t('common.availableJobs')}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {t('common.jobListingDesc')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setView(view === "grid" ? "list" : "grid")}
                    className="hover:bg-primary/10"
                  >
                    {view === "grid" ? (
                      <LayoutGrid className="h-5 w-5" />
                    ) : (
                      <LayoutList className="h-5 w-5" />
                    )}
                  </Button>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="hover:bg-primary/10">
                        <Filter className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>{t('common.filters')}</SheetTitle>
                      </SheetHeader>
                      <div className="py-6 space-y-6">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">{t('common.jobType')}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {JOB_TYPES.map((type) => (
                              <Button
                                key={type}
                                variant={filters.type === type ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilters({ ...filters, type })}
                                className="justify-start"
                              >
                                <Briefcase className="mr-2 h-4 w-4" />
                                {t(`common.${type.toLowerCase()}`)}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">{t('common.location')}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {LOCATIONS.map((location) => (
                              <Button
                                key={location}
                                variant={filters.location === location ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilters({ ...filters, location })}
                                className="justify-start"
                              >
                                <MapPin className="mr-2 h-4 w-4" />
                                {t(`locations.${location}`)}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">{t('common.shift')}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {SHIFTS.map((shift) => (
                              <Button
                                key={shift}
                                variant={filters.shift === shift ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilters({ ...filters, shift })}
                                className="justify-start"
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                {t(`common.${shift}`)}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">{t('common.salaryRange')}</h4>
                          <Slider
                            defaultValue={[0, 100000]}
                            max={100000}
                            step={5000}
                            onValueChange={(value) => setFilters({ ...filters, salary: value })}
                            className="w-full"
                          />
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>₹{filters.salary[0]}</span>
                            <span>₹{filters.salary[1]}</span>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Input
                    placeholder={t('common.searchJobs')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {filteredJobs.length} {t('common.jobsFound')}
                  </Badge>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        <main className="container mx-auto max-w-7xl py-8 px-4">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                variants={stagger}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 gap-4"
              >
                {[1, 2, 3].map((i) => (
                  <motion.div key={i} variants={fadeInUp}>
                    <Skeleton className="h-48 w-full rounded-lg" />
                  </motion.div>
                ))}
              </motion.div>
            ) : error ? (
              <motion.div
                variants={fadeInUp}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('common.errorOccurred')}</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {t('common.errorOccurredDesc')}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                variants={stagger}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 gap-4"
              >
                {filteredJobs.map((job) => (
                  <motion.div key={job.id} variants={fadeInUp}>
                    <JobCard job={job} />
                  </motion.div>
                ))}
                {filteredJobs.length === 0 && (
                  <motion.div
                    variants={fadeInUp}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">{t('common.noJobsFound')}</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      {t('common.noJobsFoundDesc')}
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSearch("");
                        setFilters({
                          type: "all",
                          location: "all",
                          shift: "all",
                          salary: [0, 100000]
                        });
                      }}
                      className="mt-4"
                    >
                      {t('common.clearFilters')}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </motion.div>
    </RootLayout>
  );
}
