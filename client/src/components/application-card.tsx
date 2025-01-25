import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import type { Application, Job } from "@db/schema";

type ApplicationCardProps = {
  application: Application;
};

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const { data: job } = useQuery<Job>({
    queryKey: [`/api/jobs/${application.jobId}`],
  });

  if (!job) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "success";
      case "rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{job.title}</h3>
              <Badge variant={getStatusColor(application.status)}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Applied on {new Date(application.createdAt!).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {application.note && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">{application.note}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
