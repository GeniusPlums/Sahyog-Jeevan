import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Upload,
  ArrowLeft,
  DollarSign,
  Briefcase,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  User2,
  CalendarDays,
  Clock4
} from "lucide-react";
import RootLayout from "@/components/layouts/RootLayout";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { applicationsApi, jobsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const applicationSchema = z.object({
  gender: z.string().min(1, "Please select your gender"),
  experience: z.string().min(1, "Please select your experience"),
  shift: z.string().min(1, "Please select your preferred shift"),
});

type FormData = z.infer<typeof applicationSchema>;

const GENDER_OPTIONS = ["male", "female", "other"];
const EXPERIENCE_OPTIONS = ["zeroToOne", "oneToThree", "threeToFive", "fivePlus"];
const SHIFT_OPTIONS = ["morning", "afternoon", "night", "flexible"];

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

export default function JobApplicationForm() {
  const { jobId } = useParams();
  const [_, navigate] = useLocation();
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Fetch job details
  const { data: job } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsApi.getById(parseInt(jobId || '0')),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      gender: "",
      experience: "",
      shift: ""
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Create FormData object for the API
      const formData = new FormData();
      formData.append('gender', data.gender);
      formData.append('experience', data.experience);
      formData.append('shift', data.shift);
      
      // Handle profile image upload
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }

      console.log('Submitting application with data:', data);
      console.log('Profile image file:', profileImageFile);

      // Call the API to create the application
      const result = await applicationsApi.create(Number(jobId), formData);
      console.log('Application submitted successfully:', result);
      
      // Show success toast
      toast({
        title: "Application submitted successfully!",
        description: "Your application has been received.",
      });
      
      // Navigate to the application finish page on success
      window.location.href = `/jobs/${jobId}/finish`;
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error submitting application",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Save the file for later upload
      setProfileImageFile(file);
      
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update progress based on form completion
  const updateProgress = () => {
    const fields = ['gender', 'experience', 'shift'];
    const filledFields = fields.filter(field => form.watch(field as keyof FormData));
    const newProgress = (filledFields.length / fields.length) * 100;
    setProgress(newProgress);
  };

  // Watch form fields for changes
  form.watch(() => updateProgress());

  return (
    <RootLayout>
      <motion.div 
        className="min-h-screen bg-background pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b z-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between p-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(`/jobs/${jobId}`)}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Job Application
              </h1>
              <div className="w-10" /> {/* Spacer for alignment */}
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Application Progress</span>
              <span className="text-primary font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Job Details Cards */}
          <motion.div 
            className="px-4 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              variants={fadeInUp}
              className="bg-primary/5 rounded-2xl p-4 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Salary</span>
              </div>
              <p className="font-semibold">{job?.salary || "Not specified"}</p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-primary/5 rounded-2xl p-4 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Job Type</span>
              </div>
              <p className="font-semibold">{job?.type || "Full Time"}</p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-primary/5 rounded-2xl p-4 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Shift</span>
              </div>
              <p className="font-semibold">{job?.shift || "Not specified"}</p>
            </motion.div>
          </motion.div>

          {/* Application Form */}
          <motion.div 
            className="px-4"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <form id="applicationForm" className="space-y-6">
              {[
                { label: "Gender", options: GENDER_OPTIONS, field: "gender", icon: User2 },
                { label: "Experience", options: EXPERIENCE_OPTIONS, field: "experience", icon: CalendarDays },
                { label: "Shift", options: SHIFT_OPTIONS, field: "shift", icon: Clock4 },
              ].map(({ label, options, field, icon: Icon }) => (
                <motion.div key={field} variants={fadeInUp} className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <Select 
                    onValueChange={(value) => form.setValue(field as keyof FormData, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={label} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem 
                          key={option} 
                          value={option}
                          className="cursor-pointer"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors[field as keyof FormData] && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                      {form.formState.errors[field as keyof FormData]?.message as string}
                    </motion.p>
                  )}
                </motion.div>
              ))}

              {/* Upload Section */}
              <motion.div variants={fadeInUp}>
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Profile Image</span>
                </div>
                <div 
                  className={`relative bg-primary/5 border-2 border-dashed border-primary/20 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                    selectedImage ? 'hover:border-primary/40' : 'hover:bg-primary/10 hover:border-primary/30'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedImage ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative aspect-square w-32 mx-auto rounded-2xl overflow-hidden"
                    >
                      <img 
                        src={selectedImage} 
                        alt="Profile preview" 
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm">Change Image</p>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto mb-2 text-primary/60" />
                      <p className="text-muted-foreground">Upload Profile Image</p>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </motion.div>
            </form>
          </motion.div>
        </div>

        {/* Apply Now Button */}
        <motion.div 
          className="sticky bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t w-full z-50"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            <Button 
              type="button"
              onClick={() => window.location.href = `/jobs/${jobId}/finish`}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                "Apply Now"
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </RootLayout>
  );
}