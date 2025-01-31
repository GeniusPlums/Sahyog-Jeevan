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
import { Upload } from "lucide-react";
import RootLayout from "@/components/layouts/RootLayout";
import { useToast } from "@/hooks/use-toast";

const applicationSchema = z.object({
  gender: z.string().min(1, "Please select your gender"),
  experience: z.string().min(1, "Please select your experience"),
  shift: z.string().min(1, "Please select your preferred shift"),
  profileImage: z.any().optional(),
});

type FormData = z.infer<typeof applicationSchema>;

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const EXPERIENCE_OPTIONS = ["0-1 years", "1-3 years", "3-5 years", "5+ years"];
const SHIFT_OPTIONS = ["Morning", "Afternoon", "Night", "Flexible"];

export default function JobApplicationForm() {
  const { jobId } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Application data:', data);
    navigate(`/jobs/${jobId}/finish`);
  };

  return (
    <RootLayout>
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 py-8 px-4 md:px-6 lg:px-8 overflow-y-auto">
            <div className="max-w-md mx-auto">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 80 80"
                    className="text-primary"
                  >
                    {[0, 60, 120, 180, 240, 300].map((rotation) => (
                      <path
                        key={rotation}
                        d="M40 40 C40 25, 45 15, 40 0 C35 15, 40 25, 40 40"
                        transform={`rotate(${rotation} 40 40)`}
                        fill="currentColor"
                        opacity="0.8"
                      />
                    ))}
                  </svg>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Dropdowns */}
                {[
                  { label: "GENDER", options: GENDER_OPTIONS, field: "gender" },
                  { label: "EXPERIENCE", options: EXPERIENCE_OPTIONS, field: "experience" },
                  { label: "SHIFT", options: SHIFT_OPTIONS, field: "shift" },
                ].map(({ label, options, field }) => (
                  <div key={field} className="space-y-2">
                    <Select 
                      onValueChange={(value) => setValue(field as "gender" | "experience" | "shift", value)}
                    >
                      <SelectTrigger
                        className="w-full bg-gradient-to-r from-muted/50 to-muted border-primary/10 hover:border-primary/20 transition-colors"
                      >
                        <SelectValue placeholder={label} />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((option) => (
                          <SelectItem key={option} value={option.toLowerCase()}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors[field as keyof FormData] && (
                      <p className="text-sm text-destructive">
                        {errors[field as keyof FormData]?.message as string}
                      </p>
                    )}
                  </div>
                ))}

                {/* Upload Section */}
                <div 
                  className="bg-muted/50 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => document.getElementById('profile-upload')?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-muted-foreground">Upload Profile</p>
                  <input
                    type="file"
                    id="profile-upload"
                    className="hidden"
                    accept="image/*"
                    {...register("profileImage")}
                  />
                </div>

                {/* Continue Button */}
                <Button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  CONTINUE
                </Button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </RootLayout>
  );
}