import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, DollarSign, Clock, BriefcaseIcon } from "lucide-react";
import RootLayout from "@/components/layouts/RootLayout";
import { applicationsApi, type Application } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function AcceptedJobsPage() {
  
  const { data, isLoading } = useQuery<Application[]>({
    queryKey: ['accepted-applications'],
    queryFn: applicationsApi.getAccepted,
    initialData: [] // Set initial data to empty array
  });

  const applications = data || []; // Ensure applications is always an array

  return (
    <RootLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Accepted Jobs
          </h1>
          <p className="text-muted-foreground">
            View and manage your accepted job applications here
          </p>
        </div>

        {/* Content */}
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
        ) : applications.length === 0 ? (
          <Card className="bg-gray-50">
            <CardContent className="p-8 text-center">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No accepted jobs
              </h3>
              <p className="text-gray-600 mb-4">
                You have not accepted any job applications yet.
              </p>
              <Button onClick={() => window.location.href = '/jobs'}>
                Browse Jobs
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Company Logo */}
                    <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center">
                      {application.job.companyLogo ? (
                        <img
                          src={application.job.companyLogo}
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
                        {application.startDate && (
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Start Date: {new Date(application.startDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{application.job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{application.job.salary}</span>
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
                          onClick={() => window.location.href = `/jobs/${application.jobId}`}
                        >
                          View Job
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </RootLayout>
  );
}