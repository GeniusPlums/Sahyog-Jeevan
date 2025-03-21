import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search,
  Filter,
  FileText,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock3,
  Download,
  ArrowUpRight
} from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import RootLayout from "@/components/layouts/RootLayout";
import { applicationsApi, type Application } from "@/lib/api";
import { format } from "date-fns";

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
  shortlisted: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  accepted: "bg-green-100 text-green-800"
};

const statusLabels = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  accepted: "Accepted"
};

export default function ViewApplications() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Application["status"] | "all">("all");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const queryClient = useQueryClient();
  
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['employer-applications'],
    queryFn: applicationsApi.getEmployerApplications
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: number; status: Application["status"] }) => 
      applicationsApi.updateStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-applications'] });
    }
  });

  const handleUpdateStatus = async (applicationId: number, status: Application["status"]) => {
    try {
      await updateStatusMutation.mutateAsync({ applicationId, status });
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  // Ensure applications is an array
  const applicationsArray = Array.isArray(applications) ? applications : [];

  const stats = {
    totalApplications: applicationsArray.length,
    pending: applicationsArray.filter(app => app.status === "pending").length,
    shortlisted: applicationsArray.filter(app => app.status === "shortlisted").length,
    rejected: applicationsArray.filter(app => app.status === "rejected").length,
    accepted: applicationsArray.filter(app => app.status === "accepted").length,
  };

  const filteredApplications = applicationsArray
    .filter(application => {
      const matchesSearch = 
        application.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (application.applicant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      const matchesStatus = 
        statusFilter === "all" || 
        application.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const nameA = a.applicant?.name || "";
        const nameB = b.applicant?.name || "";
        return sortOrder === "asc" 
          ? nameA.localeCompare(nameB) 
          : nameB.localeCompare(nameA);
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
                    Applications
                  </h1>
                  <p className="text-muted-foreground">
                    View and manage applications for your job listings
                  </p>
                </div>
                <Button variant="outline" onClick={() => navigate("/")}>
                  Back to Dashboard
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
              <div className="grid gap-6 md:grid-cols-5">
                <motion.div variants={fadeInUp}>
                  <Card className="relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-primary/10">
                      <FileText className="h-16 w-16" />
                    </div>
                    <CardHeader className="space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Applications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalApplications}</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-yellow-200">
                      <Clock3 className="h-16 w-16" />
                    </div>
                    <CardHeader className="space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Pending
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.pending}</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-blue-200">
                      <AlertCircle className="h-16 w-16" />
                    </div>
                    <CardHeader className="space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Shortlisted
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.shortlisted}</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-red-200">
                      <XCircle className="h-16 w-16" />
                    </div>
                    <CardHeader className="space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Rejected
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.rejected}</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-green-200">
                      <CheckCircle2 className="h-16 w-16" />
                    </div>
                    <CardHeader className="space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Accepted
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.accepted}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Filters and Search */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by job title or applicant name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Application Date</SelectItem>
                      <SelectItem value="name">Applicant Name</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    {sortOrder === "asc" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 rotate-180" />
                    )}
                  </Button>
                </div>
              </motion.div>

              {/* Applications List */}
              <motion.div variants={fadeInUp}>
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  </div>
                ) : filteredApplications.length === 0 ? (
                  <div className="text-center py-10">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No applications found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {searchQuery
                        ? "Try adjusting your search or filters"
                        : "You haven't received any applications yet"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApplications.map((application) => (
                      <Card key={application.id} className="overflow-hidden transition-all hover:shadow-md">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-6 justify-between">
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-xl font-medium">{application.job?.title || "Unknown Job"}</h3>
                                <p className="text-muted-foreground">{application.job?.companyName || "Unknown Company"}</p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span>{application.applicant?.name || "Applicant"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    Applied on {format(new Date(application.createdAt), "MMM dd, yyyy")}
                                  </span>
                                </div>
                              </div>

                              {application.applicant?.resume && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={application.applicant.resume} target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2 h-4 w-4" />
                                    View Resume
                                  </a>
                                </Button>
                              )}
                            </div>

                            <div className="flex flex-col gap-4 items-end justify-between">
                              <Badge className={statusColors[application.status]}>
                                {statusLabels[application.status]}
                              </Badge>

                              <div className="flex flex-wrap gap-2 justify-end">
                                {application.status !== "pending" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleUpdateStatus(application.id, "pending")}
                                  >
                                    <Clock3 className="mr-2 h-3 w-3" />
                                    Mark as Pending
                                  </Button>
                                )}
                                {application.status !== "shortlisted" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleUpdateStatus(application.id, "shortlisted")}
                                  >
                                    <AlertCircle className="mr-2 h-3 w-3" />
                                    Shortlist
                                  </Button>
                                )}
                                {application.status !== "rejected" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleUpdateStatus(application.id, "rejected")}
                                  >
                                    <XCircle className="mr-2 h-3 w-3" />
                                    Reject
                                  </Button>
                                )}
                                {application.status !== "accepted" && (
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => handleUpdateStatus(application.id, "accepted")}
                                  >
                                    <CheckCircle2 className="mr-2 h-3 w-3" />
                                    Accept
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </RootLayout>
  );
}
