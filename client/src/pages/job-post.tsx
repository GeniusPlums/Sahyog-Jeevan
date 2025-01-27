import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  salary: z.string().min(1, "Salary is required"),
  type: z.enum(["FULL TIME", "PART TIME", "CONTRACT"]),
  shift: z.string().min(1, "Shift is required"),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  workingDays: z.string().min(1, "Working days are required"),
  companyLogo: z.any().optional(),
  previewImage: z.any().optional(),
});

type FormData = z.infer<typeof jobSchema>;

const CATEGORIES = ["DRIVER", "GUARD", "GARDENER", "CLEANER", "COOK"];
const SHIFT_OPTIONS = ["9 AM - 5 PM", "2 PM - 10 PM", "10 PM - 6 AM", "Flexible"];

export default function JobPost() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      location: "",
      salary: "",
      type: "FULL TIME",
      shift: "",
      requirements: "",
      benefits: "",
      workingDays: "",
    }
  });

  const { register, handleSubmit, formState: { errors }, setValue } = form;

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'requirements' || key === 'benefits') {
          formData.append(key, JSON.stringify(value.split('\n').filter(Boolean)));
        } else if (key === 'companyLogo' || key === 'previewImage') {
          if (value?.[0]) formData.append(key, value[0]);
        } else {
          formData.append(key, value);
        }
      });

      const response = await fetch("/api/jobs", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: "Success",
        description: "Job posted successfully",
      });
      navigate("/employer/dashboard");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post job",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Post a New Job</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    defaultValue={form.getValues("category")}
                    onValueChange={(value) => setValue("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="type">Job Type</Label>
                  <Select 
                    defaultValue={form.getValues("type")}
                    onValueChange={(value) => setValue("type", value as "FULL TIME" | "PART TIME" | "CONTRACT")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL TIME">FULL TIME</SelectItem>
                      <SelectItem value="PART TIME">PART TIME</SelectItem>
                      <SelectItem value="CONTRACT">CONTRACT</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-destructive mt-1">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="shift">Shift</Label>
                  <Select 
                    defaultValue={form.getValues("shift")}
                    onValueChange={(value) => setValue("shift", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      {SHIFT_OPTIONS.map((shift) => (
                        <SelectItem key={shift} value={shift}>
                          {shift}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.shift && (
                    <p className="text-sm text-destructive mt-1">{errors.shift.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="workingDays">Working Days</Label>
                  <Input
                    id="workingDays"
                    placeholder="e.g. Monday to Saturday"
                    {...register("workingDays")}
                  />
                  {errors.workingDays && (
                    <p className="text-sm text-destructive mt-1">{errors.workingDays.message}</p>
                  )}
                </div>
              </div>

              {/* Location and Salary */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...register("location")}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    placeholder="e.g. ₹25,000/month"
                    {...register("salary")}
                  />
                  {errors.salary && (
                    <p className="text-sm text-destructive mt-1">{errors.salary.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Requirements */}
              <div>
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea
                  id="requirements"
                  rows={4}
                  {...register("requirements")}
                  placeholder="Valid driver's license&#10;2+ years experience&#10;Clean driving record"
                />
              </div>

              {/* Benefits */}
              <div>
                <Label htmlFor="benefits">Benefits (one per line)</Label>
                <Textarea
                  id="benefits"
                  rows={4}
                  {...register("benefits")}
                  placeholder="Health Insurance&#10;Vehicle Provided&#10;Fuel Allowance"
                />
              </div>

              {/* Media Upload */}
              <div className="space-y-4">
                <div>
                  <Label>Company Logo</Label>
                  <div 
                    className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary"
                    onClick={() => document.getElementById('company-logo')?.click()}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload Company Logo</p>
                    <input
                      type="file"
                      id="company-logo"
                      className="hidden"
                      accept="image/*"
                      {...register("companyLogo")}
                    />
                  </div>
                </div>

                <div>
                  <Label>Job Preview Image</Label>
                  <div 
                    className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary"
                    onClick={() => document.getElementById('preview-image')?.click()}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload Preview Image</p>
                    <input
                      type="file"
                      id="preview-image"
                      className="hidden"
                      accept="image/*"
                      {...register("previewImage")}
                    />
                  </div>
                </div>
              </div>

              <CardFooter className="flex justify-end gap-4 px-0">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full md:w-auto"
                >
                  {mutation.isPending ? "Posting..." : "Post Job"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}