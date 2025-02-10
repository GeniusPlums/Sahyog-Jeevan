import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Building2, 
  Clock,
  CheckCircle2,
  XCircle,
  Clock4
} from "lucide-react";
import RootLayout from "@/components/layouts/RootLayout";
import { applicationsApi, type Application } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  accepted: "bg-blue-100 text-blue-800"
} as const;

const STATUS_ICONS = {
  pending: Clock4,
  shortlisted: CheckCircle2,
  rejected: XCircle,
  accepted: Building2
} as const;

export default function AppliedJobsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: applicationsApi.getAll
  });

  const filteredApplications = applications.filter(application => {
    const matchesStatus = 
      statusFilter === "all" || 
      application.status === statusFilter;

    return matchesStatus;
  });

  return (
    <RootLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Applied Jobs
          </h1>
          <p className="text-muted-foreground">
            Track your job applications
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <Card className="bg-gray-50">
            <CardContent className="p-8 text-center">
              <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications found</h3>
              <p className="text-gray-600 mb-4">You haven't applied to any jobs yet.</p>
              <Button onClick={() => window.location.href = '/jobs'}>
                Browse jobs
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const StatusIcon = STATUS_ICONS[application.status];
              return (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Company Logo */}
                      <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center">
                        {application.job.image ? (
                          <img
                            src={application.job.image}
                            alt={application.job.companyName}
                            className="h-12 w-12 object-contain"
                          />
                        ) : (
                          <Building2 className="h-8 w-8 text-gray-400" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{application.job.title}</h3>
                            <p className="text-sm text-gray-600">{application.job.companyName}</p>
                          </div>
                          <Badge className={STATUS_COLORS[application.status]}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{application.job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(application.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => window.location.href = `/applications/${application.id}`}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            Withdraw
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </RootLayout>
  );
}