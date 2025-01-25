import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Building, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import type { Job } from "@db/schema";

type JobCardProps = {
  job: Job;
};

export default function JobCard({ job }: JobCardProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ jobId: job.id }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications/worker"] });
      toast({
        title: "Success",
        description: "Application submitted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to apply",
      });
    },
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <Badge variant={job.status === "open" ? "default" : "secondary"}>
                {job.status}
              </Badge>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>Company {job.employerId}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{job.type}</span>
              </div>
              {job.salary && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{job.salary}</span>
                </div>
              )}
            </div>
          </div>

          {user?.role === "worker" && job.status === "open" && (
            <Button
              onClick={() => applyMutation.mutate()}
              disabled={applyMutation.isPending}
            >
              {applyMutation.isPending ? (
                "Applying..."
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Quick Apply
                </>
              )}
            </Button>
          )}
        </div>

        <div className="mt-4">
          <p className="text-sm">{job.description}</p>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Requirements:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Posted {new Date(job.createdAt!).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
}
