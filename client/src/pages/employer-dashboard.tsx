import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  ArrowUpRight
} from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
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
  active: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-800",
  closed: "bg-red-100 text-red-800",
  paused: "bg-yellow-100 text-yellow-800"
};

export default function EmployerDashboard() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "applications">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: jobsApi.getEmployerJobs
  });

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => job.status === "active").length,
    totalApplications: jobs.reduce((acc, job) => acc + job.applications, 0),
    totalViews: jobs.reduce((acc, job) => acc + job.views, 0),
    applicationsToday: jobs.reduce((acc, job) => acc + job.applicationsToday, 0)
  };

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = 
        !statusFilter || 
        job.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.postedDate).getTime();
        const dateB = new Date(b.postedDate).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === "asc" 
          ? a.applications - b.applications 
          : b.applications - a.applications;
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
                  <h1 className="text-2xl font-bold tracking-tight">
                    {t('common.employerDashboard')}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {t('common.manageJobListings')}
                  </p>
                </div>
                <Button onClick={() => navigate("/employer/jobs/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('common.postNewJob')}
                </Button>
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
                        {t('common.activeJobs')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.activeJobs}</div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {t('common.totalJobs')}: {stats.totalJobs}
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
                        {t('common.totalApplications')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalApplications}</div>
                      <div className="mt-2 flex items-center text-xs text-green-600">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        +{stats.applicationsToday} {t('common.today')}
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
                        {t('common.totalViews')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalViews}</div>
                      <div className="mt-2 flex items-center text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {t('common.lastMonth')}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="relative overflow-hidden bg-primary text-primary-foreground">
                    <CardHeader className="space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {t('common.quickActions')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button 
                          variant="secondary" 
                          className="w-full justify-start"
                          onClick={() => navigate("/employer/applications")}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          {t('common.viewApplications')}
                        </Button>
                        <Button 
                          variant="secondary" 
                          className="w-full justify-start"
                          onClick={() => navigate("/employer/analytics")}
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          {t('common.viewAnalytics')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Filters and Search */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Input
                    placeholder={t('common.searchJobs')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder={t('common.filterByStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null}>{t('common.allStatus')}</SelectItem>
                      <SelectItem value="active">{t('common.active')}</SelectItem>
                      <SelectItem value="draft">{t('common.draft')}</SelectItem>
                      <SelectItem value="closed">{t('common.closed')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value: "date" | "applications") => setSortBy(value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder={t('common.sortBy')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">{t('common.date')}</SelectItem>
                      <SelectItem value="applications">{t('common.applications')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
                                {job.applications} {t('common.applications')}
                              </div>
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                {new Date(job.postedDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-sm">
                                <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                                {job.views} {t('common.views')}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
                              <Button
                                variant="default"
                                onClick={() => navigate(`/employer/jobs/${job.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                {t('common.viewDetails')}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => navigate(`/employer/jobs/${job.id}/edit`)}
                              >
                                <Edit2 className="h-4 w-4 mr-2" />
                                {t('common.edit')}
                              </Button>
                              <Button variant="destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('common.delete')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
                      {searchQuery || statusFilter 
                        ? t('common.noJobsMatchFilter')
                        : t('common.noJobsPosted')}
                    </p>
                    {searchQuery || statusFilter ? (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter(null);
                        }}
                        className="mt-4"
                      >
                        {t('common.clearFilters')}
                      </Button>
                    ) : (
                      <Button 
                        variant="default"
                        onClick={() => navigate("/employer/jobs/new")}
                        className="mt-4"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {t('common.postFirstJob')}
                      </Button>
                    )}
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
