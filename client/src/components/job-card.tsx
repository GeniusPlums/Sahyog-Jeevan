import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { MapPin, Building, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

type JobCardProps = {
  job: Job;
};

export default function JobCard({ job }: JobCardProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const queryClient = useQueryClient();

  const handleApply = () => {
    navigate(`/jobs/${job.id}/apply`);
  };

  // Format salary to include the translated "/month"
  const formattedSalary = job.salary ? `₹${job.salary}/month` : '';

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
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <Card className="relative overflow-hidden border-primary/10 bg-gradient-to-br from-background via-background/80 to-primary/5 backdrop-blur-sm transition-all duration-500 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/10">
        {job.previewImage && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={`/uploads/${job.previewImage}`}
              alt={`${job.title} preview`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {job.companyLogo && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={`/uploads/${job.companyLogo}`}
                      alt={`${job.employerId} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground/90 group-hover:text-primary transition-colors duration-300">
                    {job.title}
                  </h3>
                  <Badge 
                    variant={job.status === "open" ? "default" : "secondary"}
                    className="transition-all animate-in fade-in duration-300 hover:scale-105 mt-1"
                  >
                    {job.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground/90">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="flex items-center gap-3 hover:text-foreground transition-all duration-300 group/item"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                    <Building className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{job.employerId}</span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex items-center gap-3 hover:text-foreground transition-all duration-300 group/item"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span>{job.location}</span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex items-center gap-3 hover:text-foreground transition-all duration-300 group/item"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <span>{job.type}</span>
                </motion.div>

                {formattedSalary && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="flex items-center gap-3 hover:text-foreground transition-all duration-300 group/item"
                  >
                    <div className="p-1.5 rounded-md bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <span>{formattedSalary}</span>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {job.applied && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-2 rounded-md"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">Applied</span>
                </motion.div>
              )}
              <Button
                variant={job.applied ? "secondary" : "default"}
                size="lg"
                disabled={job.applied}
                onClick={handleApply}
                className={`w-full min-w-[140px] shadow-sm transition-all duration-500 ${
                  job.applied 
                    ? 'hover:shadow-md hover:bg-secondary/90'
                    : 'hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {job.applied ? 'Applied' : 'Apply Now'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}