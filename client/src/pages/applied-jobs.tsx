import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock4,
  Building2
} from "lucide-react";
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
  pending: "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  accepted: "bg-blue-100 text-blue-800"
};

const statusIcons = {
  pending: <Clock4 className="h-4 w-4" />,
  shortlisted: <CheckCircle2 className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
  accepted: <Building2 className="h-4 w-4" />
};

export default function AppliedJobsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: applications = MOCK_APPLICATIONS, isLoading } = useQuery<typeof MOCK_APPLICATIONS>({
    queryKey: ["/api/applications/worker"],
  });

  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      application.job.title.toLowerCase().includes(search.toLowerCase()) ||
      application.job.company.toLowerCase().includes(search.toLowerCase()) ||
      application.job.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getDaysAgo = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return t('common.today');
    if (days === 1) return t('common.yesterday');
    return t('common.daysAgo', { days });
  };

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
                    {t('common.appliedJobs')}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {t('common.trackApplications')}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {filteredApplications.length} {t('common.applications')}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Input
                    placeholder={t('common.searchApplications')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                </div>
                <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
                  <TabsList className="grid w-full sm:w-[400px] grid-cols-4">
                    <TabsTrigger value="all">{t('common.all')}</TabsTrigger>
                    <TabsTrigger value="pending">{t('common.pending')}</TabsTrigger>
                    <TabsTrigger value="shortlisted">{t('common.shortlisted')}</TabsTrigger>
                    <TabsTrigger value="rejected">{t('common.rejected')}</TabsTrigger>
                  </TabsList>
                </Tabs>
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
              className="space-y-4"
            >
              {filteredApplications.map((application) => (
                <motion.div key={application.id} variants={fadeInUp}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Company Image */}
                        <div className="w-full sm:w-[180px] h-[120px] bg-muted rounded-lg overflow-hidden">
                          <img
                            src={application.job.image}
                            alt={application.job.company}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h3 className="text-lg font-semibold">{application.job.company}</h3>
                              <p className="text-muted-foreground">{application.job.title}</p>
                            </div>
                            <Badge 
                              variant="secondary" 
                              className={`${statusColors[application.status]} flex items-center gap-1 px-3 py-1`}
                            >
                              {statusIcons[application.status]}
                              {t(`common.${application.status}`)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              {application.job.location}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2" />
                              {t('common.applied')} {getDaysAgo(application.createdAt)}
                            </div>
                            <div className="flex items-center text-sm font-medium">
                              <Briefcase className="h-4 w-4 mr-2" />
                              {application.job.salary}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
                            <Button
                              variant="default"
                              className="w-full sm:w-auto"
                              onClick={() => window.location.href = `/applications/${application.id}`}
                            >
                              {t('common.viewDetails')}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full sm:w-auto"
                              onClick={() => window.location.href = `/jobs/${application.jobId}`}
                            >
                              {t('common.viewJob')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {filteredApplications.length === 0 && (
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t('common.noApplications')}</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {t('common.noApplicationsDesc')}
                  </p>
                  <Button 
                    variant="default"
                    onClick={() => window.location.href = "/"}
                    className="mt-6"
                  >
                    {t('common.browseJobs')}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </RootLayout>
  );
}