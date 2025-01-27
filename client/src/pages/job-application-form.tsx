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
    // Here you would typically submit the application data to your API
    console.log('Application data:', data);
    navigate(`/jobs/${jobId}/finish`);
  };

  return (
    <RootLayout>
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-md mx-auto space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              className="text-blue-500"
            >
              {/* Six curved petals */}
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

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Dropdowns */}
            {[
              { label: "GENDER", options: GENDER_OPTIONS, field: "gender" },
              { label: "EXPERIENCE", options: EXPERIENCE_OPTIONS, field: "experience" },
              { label: "SHIFT", options: SHIFT_OPTIONS, field: "shift" },
            ].map(({ label, options, field }) => (
              <div key={field}>
                <Select onValueChange={(value) => setValue(field, value)}>
                  <SelectTrigger
                    className="w-full rounded-lg overflow-hidden"
                    style={{
                      background: "linear-gradient(to right, #808080 70%, #000000 30%)",
                      color: "white",
                      border: "none",
                    }}
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
                  <p className="text-sm text-red-500 mt-1">
                    {errors[field as keyof FormData]?.message}
                  </p>
                )}
              </div>
            ))}

            {/* Upload Section */}
            <div 
              className="bg-[#F5F5F5] rounded-2xl p-6 text-center cursor-pointer"
              onClick={() => document.getElementById('profile-upload')?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p className="text-gray-600">Upload Profile</p>
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
              className="w-full bg-[#00FF00] hover:bg-[#00DD00] text-black rounded-lg py-6 text-lg font-medium"
            >
              CONTINUE
            </Button>
          </form>
        </div>
      </div>
    </RootLayout>
  );
}