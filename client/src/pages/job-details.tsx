import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Clock, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  CheckCircle2,
  ArrowLeft,
  Building2,
} from "lucide-react";
import RootLayout from "@/components/layouts/RootLayout";
import { jobsApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function JobDetailsPage() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getById(parseInt(id)),
  });

  if (isLoading) {
    return (
      <RootLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </RootLayout>
    );
  }

  if (!job) {
    return (
      <RootLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
            <Button onClick={() => setLocation('/')}>Back to Home</Button>
          </div>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => setLocation('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>{job.companyName || 'Company Name'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>₹{job.salary}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{job.type}</span>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {job.requirements && job.requirements.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Job Overview</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Shift</p>
                      <p className="text-sm text-muted-foreground">{job.shift}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Working Days</p>
                      <p className="text-sm text-muted-foreground">{job.workingDays}</p>
                    </div>
                  </div>

                  {job.benefits && (
                    <div>
                      <p className="text-sm font-medium mb-2">Benefits</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(job.benefits).map(([benefit, included]) => (
                          included && (
                            <Badge key={benefit} variant="secondary">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {benefit}
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full"
                  onClick={() => setLocation(`/jobs/${job.id}/apply`)}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}