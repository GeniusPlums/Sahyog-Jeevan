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
  { id: 'driver', label: 'driver', icon: '🚗' },
  { id: 'guard', label: 'guard', icon: '🛡️' },
  { id: 'gardener', label: 'gardener', icon: '🌿' },
  { id: 'cook', label: 'cook', icon: '👨‍🍳' },
  { id: 'maid', label: 'maid', icon: '🧹' },
  { id: 'carpenter', label: 'carpenter', icon: '🔨' },
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
  const [jobType, setJobType] = useState("job");
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
                <div className="w-10" />
              </div>

              {/* Search Bar */}
              <motion.div 
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="relative"
              >
                <Input
                  placeholder={t('common.searchJobs')}
                  className="pl-10 pr-12 h-12 bg-background border-primary/20 hover:border-primary/40 focus:border-primary transition-colors duration-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-primary/10"
                >
                  <Filter className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </header>

        <main className="container mx-auto max-w-7xl p-4 space-y-8">
          {/* Categories */}
          <motion.section 
            variants={stagger}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t('common.categories')}</h2>
              <Button variant="link" className="text-primary hover:text-primary/80">
                {t('common.viewAll')} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div 
              variants={stagger}
              className="grid grid-cols-3 sm:grid-cols-6 gap-4"
            >
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
                    {t(`common.categories.${category.label}`)}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Featured Section */}
          <motion.section 
            variants={stagger}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">{t('common.featuredJobs')}</h2>
              </div>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job">{t('common.regularJob')}</SelectItem>
                  <SelectItem value="gig">{t('common.gigWork')}</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div variants={stagger} className="grid gap-4">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 2 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4 space-y-4">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-4">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Job cards
                filteredJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    variants={fadeInUp}
                    whileHover={{ y: -2 }}
                    className="group"
                  >
                    <Card className="overflow-hidden border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                                {t(`categories.${job.title}`)}
                              </h3>
                              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                {job.type}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Building2 className="h-4 w-4" />
                                <span>{job.company}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{t(`locations.${job.location}`)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                <span>₹{job.salary}{t('common.month')}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{job.shift}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <Button
                              onClick={() => navigate(`/jobs/${job.id}`)}
                              className="w-full md:w-auto shadow-sm hover:shadow-md transition-all duration-300"
                            >
                              {t('common.viewDetails')}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </motion.section>

          {/* Quick Apply Section */}
          <motion.section
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{t('common.quickApply')}</h2>
                <p className="text-muted-foreground">{t('common.quickApplyDesc')}</p>
              </div>
              <Button 
                size="lg"
                onClick={() => navigate('/jobs')}
                className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {t('common.browseJobs')}
              </Button>
            </div>
          </motion.section>
        </main>
      </motion.div>
    </RootLayout>
  );
}