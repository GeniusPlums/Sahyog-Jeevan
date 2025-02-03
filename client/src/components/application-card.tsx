import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Building, MapPin, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
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

  const getStatusBg = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-success/10";
      case "rejected":
        return "bg-destructive/10";
      default:
        return "bg-primary/10";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className={`overflow-hidden border-primary/10 transition-all duration-300 hover:border-primary/20 hover:shadow-lg ${getStatusBg(application.status)}`}>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors duration-300"
                >
                  {job.title}
                </motion.h3>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge 
                    variant={getStatusColor(application.status)}
                    className="transition-all duration-300 hover:scale-105"
                  >
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </motion.div>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 group/item"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                    <Building className="h-4 w-4 text-primary" />
                  </div>
                  <span className="group-hover/item:text-foreground transition-colors duration-300">
                    {job.employerId}
                  </span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 group/item"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span className="group-hover/item:text-foreground transition-colors duration-300">
                    {job.location}
                  </span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 group/item"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <span className="group-hover/item:text-foreground transition-colors duration-300">
                    ₹{job.salary}/month
                  </span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3 group/item"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                    <CalendarDays className="h-4 w-4 text-primary" />
                  </div>
                  <span className="group-hover/item:text-foreground transition-colors duration-300">
                    Applied on {new Date(application.createdAt!).toLocaleDateString()}
                  </span>
                </motion.div>
              </div>
            </div>
          </div>

          {application.note && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 p-4 rounded-lg bg-background/80 backdrop-blur-sm border border-primary/10"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {application.note}
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
