import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";
import { z } from "zod";
import { jobsApi } from "@/lib/api";
import { useEffect } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  salary: z.string().min(1, "Salary is required"),
  type: z.enum(["Full Time", "Part Time", "Gig"]),
  shift: z.string().min(1, "Shift is required"),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  workingDays: z.string().min(1, "Working days are required"),
  positions: z.string().min(1, "Number of positions is required"),
  companyLogo: z.any()
    .refine((file) => !file || (file instanceof FileList && file.length > 0), "Company logo is required")
    .refine(
      (file) => {
        if (!file) return true;
        if (!(file instanceof FileList)) return false;
        if (file.length === 0) return false;
        return file[0] && file[0].size <= MAX_FILE_SIZE;
      },
      "Max file size is 5MB"
    )
    .refine(
      (file) => {
        if (!file) return true;
        if (!(file instanceof FileList)) return false;
        if (file.length === 0) return false;
        return file[0] && ACCEPTED_IMAGE_TYPES.includes(file[0].type);
      },
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional(),
  previewImage: z.any()
    .refine(
      (file) => {
        if (!file) return true;
        if (!(file instanceof FileList)) return false;
        if (file.length === 0) return true;
        return file[0] && file[0].size <= MAX_FILE_SIZE;
      },
      "Max file size is 5MB"
    )
    .refine(
      (file) => {
        if (!file) return true;
        if (!(file instanceof FileList)) return false;
        if (file.length === 0) return true;
        return file[0] && ACCEPTED_IMAGE_TYPES.includes(file[0].type);
      },
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional(),
});

type FormData = z.infer<typeof jobSchema>;

const CATEGORIES = ["Driver", "GUARD", "GARDENER", "CLEANER", "COOK"];
const SHIFT_OPTIONS = ["9 AM - 5 PM", "2 PM - 10 PM", "10 PM - 6 AM", "Flexible"];

export default function JobPost() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const params = useParams();
  const jobId = params?.id ? parseInt(params.id) : undefined;
  const isEditMode = !!jobId;
  const queryClient = useQueryClient();

  const { data: job, isLoading: isLoadingJob } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobId ? jobsApi.getById(jobId) : null,
    enabled: !!jobId,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      location: "",
      salary: "",
      type: "Full Time",
      shift: "",
      requirements: "",
      benefits: "",
      workingDays: "",
      positions: "1",
    }
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = form;
  const companyLogo = watch("companyLogo");
  const previewImage = watch("previewImage");

  // Populate form with job data when in edit mode
  useEffect(() => {
    if (job && isEditMode) {
      // Set basic text fields
      setValue("title", job.title);
      setValue("category", job.category || "");
      setValue("description", job.description);
      setValue("location", job.location);
      setValue("salary", job.salary);
      setValue("type", job.type as "Full Time" | "Part Time" | "Gig");
      setValue("shift", job.shift);
      setValue("workingDays", job.workingDays || "");
      setValue("positions", job.positions?.toString() || "1");
      
      // Handle arrays (convert to multiline string for textarea)
      if (job.requirements && Array.isArray(job.requirements)) {
        setValue("requirements", job.requirements.join('\n'));
      }
      
      if (job.benefits && Array.isArray(job.benefits)) {
        setValue("benefits", job.benefits.join('\n'));
      }
    }
  }, [job, isEditMode, setValue]);

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      try {
        // Create FormData object for file upload
        const formData = new FormData();
        
        // Add basic text fields
        formData.append("title", data.title);
        formData.append("category", data.category);
        formData.append("description", data.description);
        formData.append("location", data.location);
        formData.append("salary", data.salary);
        formData.append("type", data.type);
        formData.append("shift", data.shift);
        formData.append("workingDays", data.workingDays);
        formData.append("positions", data.positions);
        
        // Handle multiline text fields (convert to arrays)
        if (data.requirements) {
          const requirementsArray = data.requirements
            .split("\n")
            .filter(req => req.trim() !== "");
          formData.append("requirements", JSON.stringify(requirementsArray));
        }
        
        if (data.benefits) {
          const benefitsArray = data.benefits
            .split("\n")
            .filter(benefit => benefit.trim() !== "");
          formData.append("benefits", JSON.stringify(benefitsArray));
        }

        // Add files if they exist
        if (data.companyLogo?.[0]) {
          formData.append('companyLogo', data.companyLogo[0]);
        }
        if (data.previewImage?.[0]) {
          formData.append('previewImage', data.previewImage[0]);
        }

        if (isEditMode && jobId) {
          return jobsApi.update(jobId, formData);
        } else {
          return jobsApi.create(formData);
        }
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      toast({
        title: "Success",
        description: isEditMode ? "Job updated successfully" : "Job posted successfully",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : isEditMode ? "Failed to update job" : "Failed to post job",
      });
    }
  });

  const onSubmit = async (data: FormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditMode ? "Edit Job Listing" : "Post a New Job"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingJob && isEditMode ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading job details...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                      onValueChange={(value) => setValue("type", value as "Full Time" | "Part Time" | "Gig")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full Time">Full Time</SelectItem>
                        <SelectItem value="Part Time">Part Time</SelectItem>
                        <SelectItem value="Gig">Gig</SelectItem>
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

                {/* Working Days and Positions */}
                <div className="grid gap-4 md:grid-cols-2">
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

                  <div>
                    <Label htmlFor="positions">Number of Positions</Label>
                    <Input
                      id="positions"
                      type="number"
                      min="1"
                      placeholder="e.g. 5"
                      {...register("positions")}
                    />
                    {errors.positions && (
                      <p className="text-sm text-destructive mt-1">{errors.positions.message}</p>
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
                  {errors.requirements && (
                    <p className="text-sm text-destructive mt-1">{errors.requirements.message}</p>
                  )}
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
                  {errors.benefits && (
                    <p className="text-sm text-destructive mt-1">{errors.benefits.message}</p>
                  )}
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
                      <p className="text-sm text-muted-foreground">
                        {companyLogo?.[0]?.name || "Upload Company Logo"}
                      </p>
                      <input
                        type="file"
                        id="company-logo"
                        className="hidden"
                        accept="image/*"
                        {...register("companyLogo")}
                      />
                    </div>
                    {errors.companyLogo && (
                      <p className="text-sm text-destructive mt-1">{String(errors.companyLogo.message)}</p>
                    )}
                  </div>

                  <div>
                    <Label>Job Preview Image</Label>
                    <div 
                      className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary"
                      onClick={() => document.getElementById('preview-image')?.click()}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {previewImage?.[0]?.name || "Upload Preview Image"}
                      </p>
                      <input
                        type="file"
                        id="preview-image"
                        className="hidden"
                        accept="image/*"
                        {...register("previewImage")}
                      />
                    </div>
                    {errors.previewImage && (
                      <p className="text-sm text-destructive mt-1">{String(errors.previewImage.message)}</p>
                    )}
                  </div>
                </div>

                <CardFooter className="flex justify-end gap-4 px-0">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full md:w-auto"
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditMode ? "Updating..." : "Posting..."}
                      </>
                    ) : (
                      <>{isEditMode ? "Update Job" : "Post Job"}</>
                    )}
                  </Button>
                </CardFooter>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}