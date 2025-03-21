import { useEffect } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { jobsApi, applicationsApi } from '@/lib/api';
import RootLayout from '@/components/layouts/RootLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  Eye, 
  FileText, 
  UserPlus,
  ArrowLeft
} from 'lucide-react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

// Define custom badge variants for application status
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'pending':
      return 'outline';
    case 'shortlisted':
      return 'default';
    case 'accepted':
      return 'default'; // Using default instead of success
    case 'rejected':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function EmployerJobDetails() {
  const params = useParams();
  const jobId = params?.id ? parseInt(params.id) : 0;
  const [, navigate] = useLocation();

  // Fetch job details
  const { data: job, isLoading: isLoadingJob, error: jobError } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsApi.getById(jobId),
    enabled: !!jobId,
  });

  // Fetch applications for this job
  const { data: applications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['jobApplications', jobId],
    queryFn: () => applicationsApi.getJobApplications(jobId),
    enabled: !!jobId,
  });

  // Handle error state
  useEffect(() => {
    if (jobError) {
      console.error('Error loading job:', jobError);
    }
  }, [jobError]);

  if (isLoadingJob) {
    return (
      <RootLayout>
        <div className="container py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </RootLayout>
    );
  }

  if (jobError || !job) {
    return (
      <RootLayout>
        <div className="container py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
                <p className="text-muted-foreground mb-4">The job you're looking for doesn't exist or you don't have permission to view it.</p>
                <Button onClick={() => navigate('/employer')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container py-8"
      >
        <div className="mb-6 flex items-center">
          <Button variant="ghost" onClick={() => navigate('/employer')} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Job Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main job details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                    <div className="flex items-center mt-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="mr-4">{job.location}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                    {job.status === 'open' ? 'Open' : 'Closed'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="applications">
                      Applications ({applications?.length || 0})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2 flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Posted Date
                        </h3>
                        <p>{new Date(job.postedDate || job.createdAt).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2 flex items-center">
                          <Briefcase className="h-4 w-4 mr-2" />
                          Job Type
                        </h3>
                        <p>{job.type} • {job.shift}</p>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2 flex items-center">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Positions
                        </h3>
                        <p>Hiring {job.positions || 1} {job.positions && parseInt(String(job.positions)) > 1 ? 'people' : 'person'}</p>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2 flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Working Days
                        </h3>
                        <p>{job.workingDays || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Job Description</h3>
                      <div className="prose max-w-none">
                        <p>{job.description}</p>
                      </div>
                    </div>
                    
                    {job.requirements && job.requirements.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-3">Requirements</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {job.benefits && job.benefits.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-3">Benefits</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {job.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-3 mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/employer/jobs/${job.id}/edit`)}
                      >
                        Edit Job
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="applications">
                    {isLoadingApplications ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : applications && applications.length > 0 ? (
                      <div className="space-y-4">
                        {applications.map((application) => (
                          <Card key={application.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <h3 className="font-medium">{application.applicant?.name || 'Applicant'}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Applied on {new Date(application.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={getStatusBadgeVariant(application.status)}>
                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                  </Badge>
                                  <Button 
                                    size="sm" 
                                    onClick={() => navigate(`/employer/applications/${application.id}`)}
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
                        <p className="text-muted-foreground">When candidates apply for this job, they'll appear here.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Stats sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Job Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      <span>Total Applications</span>
                    </div>
                    <Badge variant="outline" className="text-lg font-medium">
                      {applications?.length || 0}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-primary" />
                      <span>Total Views</span>
                    </div>
                    <Badge variant="outline" className="text-lg font-medium">
                      {job.views || 0}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      <span>Days Active</span>
                    </div>
                    <Badge variant="outline" className="text-lg font-medium">
                      {Math.ceil((new Date().getTime() - new Date(job.postedDate || job.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-4">Application Status</h3>
                  <div className="space-y-3">
                    {['pending', 'shortlisted', 'accepted', 'rejected'].map((status) => {
                      const count = applications?.filter(app => app.status === status).length || 0;
                      const total = applications?.length || 1; // Avoid division by zero
                      const percentage = Math.round((count / total) * 100) || 0;
                      
                      return (
                        <div key={status}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{status}</span>
                            <span>{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${status === 'pending' ? 'bg-blue-500' : 
                                status === 'shortlisted' ? 'bg-primary' : 
                                status === 'accepted' ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </RootLayout>
  );
}
