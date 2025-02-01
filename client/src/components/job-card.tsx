import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Building, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Job } from "@db/schema";

type JobCardProps = {
  job: Job;
};

export default function JobCard({ job }: JobCardProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

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

  // Format salary to include the translated "/month"
  const formattedSalary = job.salary ? `₹${job.salary}${t('common.month')}` : '';

  // Helper to format location for translation key
  const getLocationKey = (location: string) => {
    return location.toLowerCase().replace(/\s+/g, '');
  };

  // Helper to format category/title for translation key
  const getTitleKey = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-background to-primary/5 transition-colors hover:border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {t(`categories.${getTitleKey(job.title)}`)}
                </h3>
                <Badge 
                  variant={job.status === "open" ? "default" : "secondary"}
                  className="transition-colors"
                >
                  {t(`common.${job.status}`)}
                </Badge>
              </div>

              <div className="space-y-1 text-sm text-muted-foreground">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2"
                >
                  <Building className="h-4 w-4 text-primary" />
                  <span>{t('common.company')}: {job.employerId}</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{t(`locations.${getLocationKey(job.location)}`)}</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{t(`common.${job.type.toLowerCase()}`)}</span>
                </motion.div>
                {formattedSalary && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>{formattedSalary}</span>
                  </motion.div>
                )}
              </div>
            </div>

            {user?.role === "worker" && job.status === "open" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={() => applyMutation.mutate()}
                  disabled={applyMutation.isPending}
                  className="relative overflow-hidden"
                >
                  {applyMutation.isPending ? (
                    t('common.applying')
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {t('common.clickToApply')}
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4"
          >
            <p className="text-sm">{job.description}</p>
          </motion.div>

          {job.requirements && job.requirements.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4"
            >
              <h4 className="text-sm font-semibold mb-2">{t('common.requirements')}:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {job.requirements.map((req, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {req}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground border-t border-primary/10">
          {t('common.posted')} {new Date(job.createdAt!).toLocaleDateString()}
        </CardFooter>
      </Card>
    </motion.div>
  );
}