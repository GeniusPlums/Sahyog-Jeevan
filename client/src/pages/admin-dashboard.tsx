import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Loader2, 
  UserX, 
  Briefcase, 
  Users, 
  FileText, 
  Search,
  ArrowUpDown,
  Calendar,
  ChevronUp,
  ChevronDown,
  Filter,
  RefreshCcw,
  UserPlus,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RootLayout from "@/components/layouts/RootLayout";
import type { User, Job, Application } from "@db/schema";

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

export default function AdminDashboard() {
  const { toast } = useToast();
  const [userSearch, setUserSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [userSort, setUserSort] = useState<"asc" | "desc">("desc");
  const [jobSort, setJobSort] = useState<"asc" | "desc">("desc");
  const [userFilter, setUserFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");

  const { data: users = [], isLoading: isUsersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: recentJobs = [], isLoading: isJobsLoading } = useQuery<Job[]>({
    queryKey: ["/api/admin/jobs"],
  });

  const { data: stats = { totalUsers: 0, totalJobs: 0, totalApplications: 0 }, 
    isLoading: isStatsLoading 
  } = useQuery<{
    totalUsers: number;
    totalJobs: number;
    totalApplications: number;
  }>({
    queryKey: ["/api/admin/stats"],
  });

  const handleDeactivateUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/deactivate`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error(await response.text());

      toast({
        title: "Success",
        description: "User has been deactivated",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to deactivate user",
      });
    }
  };

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.username.toLowerCase().includes(userSearch.toLowerCase());
      const matchesFilter = 
        userFilter === "all" || 
        user.role === userFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt!).getTime();
      const dateB = new Date(b.createdAt!).getTime();
      return userSort === "asc" ? dateA - dateB : dateB - dateA;
    });

  const filteredJobs = recentJobs
    .filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(jobSearch.toLowerCase());
      const matchesFilter = 
        jobFilter === "all" || 
        job.status === jobFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt!).getTime();
      const dateB = new Date(b.createdAt!).getTime();
      return jobSort === "asc" ? dateA - dateB : dateB - dateA;
    });

  if (isUsersLoading || isJobsLoading || isStatsLoading) {
    return (
      <RootLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </RootLayout>
    );
  }

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
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Manage users and applications
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="default" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
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
              <div className="grid gap-6 md:grid-cols-3">
                <motion.div variants={fadeInUp}>
                  <Card className="relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-primary/10">
                      <Users className="h-24 w-24" />
                    </div>
                    <CardHeader className="space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.totalUsers}</div>
                      <p className="mt-2 text-xs text-muted-foreground">Active Members</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-primary/10">
                      <Briefcase className="h-24 w-24" />
                    </div>
                    <CardHeader className="space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.totalJobs}</div>
                      <p className="mt-2 text-xs text-muted-foreground">Open Positions</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-primary/10">
                      <FileText className="h-24 w-24" />
                    </div>
                    <CardHeader className="space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.totalApplications}</div>
                      <p className="mt-2 text-xs text-muted-foreground">Submitted Applications</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Users Table */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold">Recent Users</CardTitle>
                      <Button variant="outline" size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Search Users"
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          className="pl-10 pr-4"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      </div>
                      <Select value={userFilter} onValueChange={setUserFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="worker">Worker</SelectItem>
                          <SelectItem value="employer">Employer</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUserSort(userSort === "asc" ? "desc" : "asc")}
                      >
                        {userSort === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user) => (
                            <TableRow key={user.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">{user.username}</TableCell>
                              <TableCell>
                                <Badge variant={user.role === "worker" ? "default" : "secondary"} className="capitalize">
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(user.createdAt!).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeactivateUser(user.id)}
                                  className="hover:bg-destructive/90"
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Deactivate
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Jobs Table */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold">Recent Jobs</CardTitle>
                      <Button variant="outline" size="sm">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Add Job
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Search Jobs"
                          value={jobSearch}
                          onChange={(e) => setJobSearch(e.target.value)}
                          className="pl-10 pr-4"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      </div>
                      <Select value={jobFilter} onValueChange={setJobFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setJobSort(jobSort === "asc" ? "desc" : "asc")}
                      >
                        {jobSort === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Employer ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredJobs.map((job) => (
                            <TableRow key={job.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">{job.title}</TableCell>
                              <TableCell>{job.employerId}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    job.status === "open" ? "default" : 
                                    job.status === "closed" ? "secondary" : 
                                    "outline"
                                  } 
                                  className="capitalize"
                                >
                                  {job.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(job.createdAt!).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.location.href = `/jobs/${job.id}`}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </RootLayout>
  );
}