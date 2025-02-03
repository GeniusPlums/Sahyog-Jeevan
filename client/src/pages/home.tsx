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
  const [, navigate] = useLocation();
  const [jobType, setJobType] = useState("regular");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getAll
  });

  const filteredJobs = jobs.filter(job => 
    job.status === 'active' && 
    (!selectedCategory || job.title.toLowerCase().includes(selectedCategory.toLowerCase()))
  );

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <RootLayout>
      <motion.div 
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Header with Search */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/10">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col space-y-4 p-4">
              {/* Logo and Menu */}
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <Menu className="h-5 w-5" />
                </Button>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center space-x-2"
                >
                  <BriefcaseIcon className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    SahyogJeevan
                  </span>
                </motion.div>
                <div className="w-5" /> {/* Spacer */}
              </div>

              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t('common.search')}
                    className="pl-9 bg-muted/50"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto max-w-7xl p-4">
          {/* Categories */}
          <motion.section 
            variants={stagger}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            <motion.div variants={fadeInUp}>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {JOB_CATEGORIES.map((category) => (
                  <motion.div
                    key={category.id}
                    variants={fadeInUp}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`cursor-pointer text-center p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-primary/5'
                    }`}
                  >
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <div className="text-xs font-medium">
                      {t(`common.categories.${category.id}`)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Featured Jobs Section */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">{t('common.featuredJobs')}</h2>
                </div>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder={t('common.selectJobType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">{t('common.regularJob')}</SelectItem>
                    <SelectItem value="gig">{t('common.gigWork')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Job Cards */}
              <div className="grid gap-4">
                {isLoading ? (
                  // Loading skeletons
                  Array(3).fill(null).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <div className="flex gap-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <Card key={job.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <h3 className="text-lg font-semibold">{job.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Building2 className="mr-1 h-4 w-4" />
                                {job.companyName}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <MapPin className="mr-1 h-4 w-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="mr-1 h-4 w-4" />
                                {job.salary}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" onClick={() => navigate(`/jobs/${job.id}`)}>
                            {t('common.viewDetails')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">{t('common.noJobsFound')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.section>

          {/* Quick Apply Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{t('common.quickApply')}</h3>
                <p className="text-muted-foreground mb-4">{t('common.quickApplyDesc')}</p>
                <Button onClick={() => navigate('/jobs')}>
                  {t('common.browseJobs')}
                </Button>
              </CardContent>
            </Card>
          </motion.section>
        </main>
      </motion.div>
    </RootLayout>
  );
}