import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Loader2, UserX, Briefcase, Users, FileText } from "lucide-react";
import type { User, Job, Application } from "@db/schema";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { toast } = useToast();

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

  if (isUsersLoading || isJobsLoading || isStatsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute right-4 top-4 text-primary/10">
              <Users className="h-24 w-24" />
            </div>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalUsers}</div>
              <p className="mt-2 text-xs text-muted-foreground">Active members in the platform</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute right-4 top-4 text-primary/10">
              <Briefcase className="h-24 w-24" />
            </div>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalJobs}</div>
              <p className="mt-2 text-xs text-muted-foreground">Open positions available</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute right-4 top-4 text-primary/10">
              <FileText className="h-24 w-24" />
            </div>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalApplications}</div>
              <p className="mt-2 text-xs text-muted-foreground">Submitted job applications</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Users</CardTitle>
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
                  {users.map((user) => (
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

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Employer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Posted At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentJobs.map((job) => (
                    <TableRow key={job.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.employerId}</TableCell>
                      <TableCell>
                        <Badge
                          variant={job.status === "open" ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(job.createdAt!).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}