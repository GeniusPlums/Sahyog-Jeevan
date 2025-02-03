import { useUser } from "@/hooks/use-user";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Menu, 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  DollarSign,
  ArrowRight,
  BriefcaseIcon,
  Clock,
  Sparkles
} from "lucide-react";
import RootLayout from "@/components/layouts/RootLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { jobsApi, type Job } from "@/lib/api";

const JOB_CATEGORIES = [
  { id: 'driver', icon: '🚗' },
  { id: 'guard', icon: '🛡️' },
  { id: 'gardener', icon: '🌿' },
  { id: 'cook', icon: '👨‍🍳' },
  { id: 'maid', icon: '🧹' },
  { id: 'carpenter', icon: '🔨' },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [jobType, setJobType] = useState<string>("");
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getFeaturedJobs
  });

  return (
    <RootLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Input
            placeholder={t('common.search')}
            className="flex-1"
            startContent={<Search className="w-4 h-4 text-gray-500" />}
          />
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {JOB_CATEGORIES.map((category) => (
            <motion.div
              key={category.id}
              variants={fadeInUp}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-white shadow-sm"
            >
              <span className="text-2xl mb-2">{category.icon}</span>
              <span className="text-sm text-gray-600">
                {t(`common.categories.${category.id}`)}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mb-8">
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger>
              <SelectValue placeholder={t('common.selectJobType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">{t('common.regularJob')}</SelectItem>
              <SelectItem value="gig">{t('common.gigWork')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">{t('common.featuredJobs')}</h2>
            </div>
            <Button variant="ghost" className="text-blue-500">
              {t('common.viewAll')} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/4 mb-4" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : jobs?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">{t('common.noJobsFound')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs?.map((job: Job) => (
                <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{job.title}</h3>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/jobs/${job.id}`)}
                      >
                        {t('common.quickApply')}
                      </Button>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.postedAt}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">{t('common.quickApply')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('common.quickApplyDesc')}</p>
            <Button className="w-full">
              {t('common.browseJobs')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </RootLayout>
  );
}