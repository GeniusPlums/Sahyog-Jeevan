import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, Building2, MapPin, DollarSign, Clock } from "lucide-react";
import RootLayout from "@/components/layouts/RootLayout";
import { useTranslation } from "react-i18next";
import { applicationsApi, type Application } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function AcceptedJobsPage() {
  const { t } = useTranslation();
  
  const { data: applications, isLoading, isError } = useQuery<Application[]>({
    queryKey: ['accepted-applications'],
    queryFn: applicationsApi.getAccepted
  });

  return (
    <RootLayout>
      <div className="min-h-screen bg-background">
        {/* Top Header */}
        <header className="sticky top-0 bg-background border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" className="hover:bg-transparent">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center justify-center flex-1">
              <h1 className="text-xl font-bold text-primary">{t('common.acceptedJobs')}</h1>
            </div>
            <div className="w-6" /> {/* Spacer for alignment */}
          </div>
        </header>

        <main className="container mx-auto max-w-4xl p-4">
          {isLoading ? (
            // Loading state
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-48 w-full rounded-lg mb-3" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : isError ? (
            // Error state
            <div className="text-center py-8">
              <p className="text-red-500 font-medium">{t('common.errorLoading')}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                {t('common.tryAgain')}
              </Button>
            </div>
          ) : applications && applications.length > 0 ? (
            // Applications list
            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold">{application.job.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Building2 className="mr-1 h-4 w-4" />
                            {application.job.companyName}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            {application.job.location}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="mr-1 h-4 w-4" />
                            {application.job.salary}
                          </div>
                          {application.startDate && (
                            <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4" />
                              {t('common.startDate')}: {application.startDate}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => window.location.href = `/jobs/${application.jobId}`}>
                        {t('common.viewDetails')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('common.noAcceptedJobs')}</h3>
              <p className="text-muted-foreground mb-6">{t('common.noAcceptedJobsDesc')}</p>
              <Button onClick={() => window.location.href = '/'}>
                {t('common.browseJobs')}
              </Button>
            </div>
          )}
        </main>
      </div>
    </RootLayout>
  );
}