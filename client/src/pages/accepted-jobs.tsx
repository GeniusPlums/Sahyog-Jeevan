import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import RootLayout from "@/components/layouts/RootLayout";
import { useTranslation } from "react-i18next";
import { applicationsApi, type Application } from "@/lib/api";

export default function AcceptedJobsPage() {
  const { t } = useTranslation();
  
  const { data: applications = [], isLoading } = useQuery<Application[]>({
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

        <main className="p-4">
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardContent className="p-4">
                  <div className="aspect-video bg-muted rounded-lg mb-3">
                    <img
                      src={application.job.previewImage}
                      alt={`${application.job.title} preview`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{t(`categories.${application.job.title.toLowerCase()}`)}</h3>
                      <p className="text-sm text-muted-foreground">{application.job.companyName}</p>
                      <p className="text-sm">{application.job.location}</p>
                      <p className="text-sm font-medium">{application.job.salary}</p>
                      <div className="mt-2">
                        <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-800">
                          {t('common.accepted')} - {t('common.startDate')}: {application.startDate}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline">
                      {t('common.viewDetails')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {applications.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t('common.noAcceptedJobs')}</p>
                <p className="text-sm text-muted-foreground mt-1">{t('common.noAcceptedJobsDesc')}</p>
                <Button className="mt-4" onClick={() => window.location.href = "/"}>
                  {t('common.browseJobs')}
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </RootLayout>
  );
}