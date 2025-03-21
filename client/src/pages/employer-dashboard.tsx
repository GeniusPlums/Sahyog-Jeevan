import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit2, 
  Eye, 
  Trash2,
  Search,
  Filter,
  Briefcase,
  MapPin,
  Users,
  Calendar,
  ChevronUp,
  ChevronDown,
  Clock,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  FileText,
  UserPlus
} from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import RootLayout from "@/components/layouts/RootLayout";
import { jobsApi, type Job } from "@/lib/api";

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

const statusColors = {
  open: "bg-green-100 text-green-800",
  closed: "bg-red-100 text-red-800"
};

export default function EmployerDashboard() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "applications">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const queryClient = useQueryClient();
  
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: jobsApi.getEmployerJobs
  });

  const deleteJobMutation = useMutation({
    mutationFn: jobsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
    }
  });

  const handleDeleteJob = async (jobId: number) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJobMutation.mutateAsync(jobId);
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => job.status === "open").length,
    totalApplications: jobs.reduce((acc, job) => acc + (job.applications || 0), 0),
    totalViews: jobs.reduce((acc, job) => acc + (job.views || 0), 0),
    applicationsToday: jobs.reduce((acc, job) => acc + (job.applicationsToday || 0), 0)
  };

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = 
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = 
        !statusFilter || 
        job.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.postedDate || a.createdAt).getTime();
        const dateB = new Date(b.postedDate || b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const appsA = a.applications || 0;
        const appsB = b.applications || 0;
        return sortOrder === "asc" 
          ? appsA - appsB 
          : appsB - appsA;
      }
    });

  return (
    <RootLayout>
      <motion.div 
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
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
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Employer Dashboard
                  </h1>
                  <p className="text-muted-foreground">
                    Manage your job listings and view applications
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => navigate("/employer/applications")}>
                    <FileText className="mr-2 h-4 w-4" />
                    View Applications
                  </Button>
                  <Button onClick={() => navigate("/employer/jobs/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Post New Job
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        <main className="container mx-auto max-w-7xl py-8 px-4">
          <AnimatePresence mode="wait">
            <motion.div 
              variants={stagger}
              initial="initial"
              animate="animate"
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid gap-6 md:grid-cols-4">
                <motion.div variants={fadeInUp}>
                  <Card className="relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-primary/10">
                      <Briefcase className="h-16 w-16" />
                    </div>
                    <CardHeader className="space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Active Jobs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.activeJobs}</div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Total Jobs: {stats.totalJobs}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-primary/10">
                      <Users className="h-16 w-16" />
                    </div>
                    <CardHeader className="space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Applications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalApplications}</div>
                      <div className="mt-2 flex items-center text-xs text-green-600">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        +{stats.applicationsToday} Today
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-primary/10">
                      <BarChart3 className="h-16 w-16" />
                    </div>
                    <CardHeader className="space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Views
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalViews}</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp} onClick={() => navigate("/employer/applications")} className="cursor-pointer">
                  <Card className="relative overflow-hidden hover:border-primary/50 transition-all">
                    <div className="absolute right-4 top-4 text-primary/10">
                      <FileText className="h-16 w-16" />
                    </div>
                    <CardHeader className="space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Applications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalApplications}</div>
                      <p className="mt-2 text-xs text-primary">
                        Click to view all applications
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Filters and Search */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search Jobs"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={statusFilter || "all"}
                    onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter by Status
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as "date" | "applications")}
                  >
                    <SelectTrigger className="w-[180px]">
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      Sort By
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date Posted</SelectItem>
                      <SelectItem value="applications">Applications</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    {sortOrder === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </motion.div>

              {/* Job Cards */}
              <motion.div variants={fadeInUp} className="space-y-4">
                {filteredJobs.map((job) => (
                  <motion.div key={job.id} variants={fadeInUp}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                          <div className="flex-1 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <h3 className="text-lg font-semibold">{job.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <MapPin className="h-4 w-4" />
                                  {job.location}
                                </div>
                              </div>
                              <Badge 
                                variant="secondary" 
                                className={`${statusColors[job.status]} flex items-center gap-1 px-3 py-1`}
                              >
                                {job.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="flex items-center text-sm">
                                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                {job.applications || 0} Applications
                              </div>
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                {new Date(job.postedDate || job.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-sm">
                                <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                                {job.views || 0} Views
                              </div>
                            </div>

                            <div className="flex items-center text-sm mt-2 text-primary-600">
                              <UserPlus className="h-4 w-4 mr-2" />
                              <span className="font-medium">Hiring {job.positions || 1} {job.positions && parseInt(String(job.positions)) > 1 ? 'people' : 'person'}</span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
                              <Button
                                variant="default"
                                onClick={() => navigate(`/employer/jobs/${job.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => navigate(`/employer/jobs/${job.id}/edit`)}
                              >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive"
                                onClick={() => handleDeleteJob(job.id)}
                                disabled={deleteJobMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {deleteJobMutation.isPending ? 'Deleting' : 'Delete'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {filteredJobs.length === 0 && (
                  <motion.div variants={fadeInUp}>
                    <Card className="p-6 text-center">
                      <p className="text-muted-foreground">No jobs found. Try adjusting your filters or post a new job.</p>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </RootLayout>
  );
}
