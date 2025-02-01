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
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

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

  const form = useForm<FormData>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Application data:', data);
    navigate(`/jobs/${jobId}/finish`);
  };

  return (
    <RootLayout>
      <div className="min-h-screen bg-background">
        {/* Job Details */}
        <div className="px-4 py-6 space-y-4">
          <div className="w-full bg-gray-200 rounded-full p-1">
            <div className="flex items-center rounded-full overflow-hidden">
              <div className="bg-[#808080] text-white px-6 py-2 flex-1">
                <div className="text-sm">SALARY</div>
              </div>
              <div className="bg-black text-white px-6 py-2 flex-1 text-right">
                <div className="font-medium">25000/month</div>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full p-1">
            <div className="flex items-center rounded-full overflow-hidden">
              <div className="bg-[#808080] text-white px-6 py-2 flex-1">
                <div className="text-sm">JOB TYPE</div>
              </div>
              <div className="bg-black text-white px-6 py-2 flex-1 text-right">
                <div className="font-medium">FULL TIME</div>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full p-1">
            <div className="flex items-center rounded-full overflow-hidden">
              <div className="bg-[#808080] text-white px-6 py-2 flex-1">
                <div className="text-sm">SHIFT</div>
              </div>
              <div className="bg-black text-white px-6 py-2 flex-1 text-right">
                <div className="font-medium">9 AM - 5 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Responsibilities */}
        <Card className="mx-4 border-0 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Job Responsibilities:</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Drive safely and efficiently to deliver packages</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Maintain vehicle cleanliness and perform basic checks</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Follow traffic rules and company policies</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Provide excellent customer service</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Application Form */}
        <div className="p-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {[
              { label: "GENDER", options: GENDER_OPTIONS, field: "gender" },
              { label: "EXPERIENCE", options: EXPERIENCE_OPTIONS, field: "experience" },
              { label: "SHIFT", options: SHIFT_OPTIONS, field: "shift" },
            ].map(({ label, options, field }) => (
              <div key={field} className="space-y-2">
                <Select 
                  onValueChange={(value) => form.setValue(field as keyof FormData, value)}
                >
                  <SelectTrigger className="w-full bg-white border-gray-200">
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
                {form.formState.errors[field as keyof FormData] && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors[field as keyof FormData]?.message as string}
                  </p>
                )}
              </div>
            ))}

            {/* Upload Section */}
            <div 
              className="bg-white border border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => document.getElementById('profile-upload')?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">Upload Profile</p>
              <input
                type="file"
                id="profile-upload"
                className="hidden"
                accept="image/*"
                {...form.register("profileImage")}
              />
            </div>
          </form>
        </div>

        {/* Apply Now Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
          <Button 
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            className="w-full bg-black hover:bg-gray-800 text-white h-12 text-lg font-medium"
          >
            APPLY NOW
          </Button>
        </div>
      </div>
    </RootLayout>
  );
}