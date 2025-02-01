import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ApplicationCard from "@/components/application-card";
import { Loader2, User2, Building2, FileText, MapPin, Phone, Briefcase, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Profile, Application } from "@db/schema";
import { useTranslation } from "react-i18next";

type ProfileFormData = {
  name: string;
  bio: string;
  skills: string;
  location: string;
  contact: string;
  companyName?: string;
  companyDescription?: string;
};

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function ProfilePage() {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { register, handleSubmit, reset } = useForm<ProfileFormData>();

  const { data: profile, isLoading: isProfileLoading } = useQuery<Profile>({
    queryKey: [`/api/profiles/${user?.id}`],
    enabled: !!user,
  });

  const { data: applications = [], isLoading: isApplicationsLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications/worker"],
    enabled: user?.role === "worker",
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        bio: profile.bio || "",
        skills: profile.skills?.join("\n") || "",
        location: profile.location || "",
        contact: profile.contact || "",
        companyName: profile.companyName,
        companyDescription: profile.companyDescription,
      });
    }
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const skills = data.skills.split("\n").map(s => s.trim()).filter(Boolean);
      
      const response = await fetch("/api/profiles", {
        method: profile ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...data, skills }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/${user?.id}`] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
      });
    },
  });

  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
          </div>
          <p className="text-muted-foreground animate-pulse">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 max-w-4xl mx-auto px-4 py-8">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl animate-pulse" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="relative"
      >
        <Card className="backdrop-blur-sm border-primary/10 shadow-2xl shadow-primary/5">
          <CardHeader className="space-y-2">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
            >
              {user?.role === "employer" ? (
                <Building2 className="h-8 w-8 text-primary" />
              ) : (
                <User2 className="h-8 w-8 text-primary" />
              )}
            </motion.div>
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {user?.role === "employer" ? t('profile.companyProfile') : t('profile.workerProfile')}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {user?.role === "employer" 
                ? t('profile.companyProfileDesc')
                : t('profile.workerProfileDesc')
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
              <motion.div 
                className="space-y-2"
                variants={formVariants}
                transition={{ delay: 0.1 }}
              >
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User2 className="h-4 w-4" />
                  {user?.role === "employer" ? t('profile.contactName') : t('profile.fullName')}
                </Label>
                <Input 
                  id="name" 
                  {...register("name")} 
                  required
                  className="bg-background/60 border-primary/20 focus:border-primary/40 transition-colors"
                />
              </motion.div>

              {user?.role === "employer" ? (
                <>
                  <motion.div 
                    className="space-y-2"
                    variants={formVariants}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="companyName" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {t('profile.companyName')}
                    </Label>
                    <Input 
                      id="companyName" 
                      {...register("companyName")} 
                      required
                      className="bg-background/60 border-primary/20 focus:border-primary/40 transition-colors"
                    />
                  </motion.div>
                  <motion.div 
                    className="space-y-2"
                    variants={formVariants}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="companyDescription" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t('profile.companyDescription')}
                    </Label>
                    <Textarea
                      id="companyDescription"
                      {...register("companyDescription")}
                      rows={4}
                      className="bg-background/60 border-primary/20 focus:border-primary/40 transition-colors resize-none"
                    />
                  </motion.div>
                </>
              ) : (
                <motion.div 
                  className="space-y-2"
                  variants={formVariants}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="skills" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    {t('profile.skills')}
                  </Label>
                  <Textarea
                    id="skills"
                    {...register("skills")}
                    rows={4}
                    placeholder="Forklift operation&#10;HVAC maintenance&#10;Electrical work"
                    className="bg-background/60 border-primary/20 focus:border-primary/40 transition-colors resize-none"
                  />
                </motion.div>
              )}

              <motion.div 
                className="space-y-2"
                variants={formVariants}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="bio" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t('profile.bio')}
                </Label>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  rows={4}
                  placeholder={t('profile.bioPlaceholder')}
                  className="bg-background/60 border-primary/20 focus:border-primary/40 transition-colors resize-none"
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                variants={formVariants}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('profile.location')}
                </Label>
                <Input 
                  id="location" 
                  {...register("location")}
                  className="bg-background/60 border-primary/20 focus:border-primary/40 transition-colors"
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                variants={formVariants}
                transition={{ delay: 0.5 }}
              >
                <Label htmlFor="contact" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t('profile.contact')}
                </Label>
                <Input
                  id="contact"
                  {...register("contact")}
                  placeholder={t('profile.contactPlaceholder')}
                  className="bg-background/60 border-primary/20 focus:border-primary/40 transition-colors"
                />
              </motion.div>

              <motion.div
                variants={formVariants}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  type="submit" 
                  className="w-full bg-primary/90 hover:bg-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Briefcase className="h-4 w-4 mr-2" />
                  )}
                  {t('profile.saveProfile')}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {user?.role === "worker" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('profile.myApplications')}
          </h2>
          
          {isApplicationsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="grid gap-4">
                {applications.map((application, index) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ApplicationCard application={application} />
                  </motion.div>
                ))}
                {applications.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-muted-foreground py-8"
                  >
                    {t('profile.noApplications')}
                  </motion.p>
                )}
              </div>
            </AnimatePresence>
          )}
        </motion.div>
      )}
    </div>
  );
}
