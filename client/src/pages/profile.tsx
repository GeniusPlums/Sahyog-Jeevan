import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicationCard from "@/components/application-card";
import { Loader2 } from "lucide-react";
import type { Profile, Application } from "@db/schema";

type ProfileFormData = {
  name: string;
  bio: string;
  skills: string;
  location: string;
  contact: string;
  companyName?: string;
  companyDescription?: string;
};

export default function ProfilePage() {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{user?.role === "employer" ? "Company Profile" : "Worker Profile"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                {user?.role === "employer" ? "Contact Name" : "Full Name"}
              </Label>
              <Input id="name" {...register("name")} required />
            </div>

            {user?.role === "employer" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" {...register("companyName")} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyDescription">Company Description</Label>
                  <Textarea
                    id="companyDescription"
                    {...register("companyDescription")}
                    rows={4}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (one per line)</Label>
                <Textarea
                  id="skills"
                  {...register("skills")}
                  rows={4}
                  placeholder="Forklift operation&#10;HVAC maintenance&#10;Electrical work"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Information</Label>
              <Input
                id="contact"
                {...register("contact")}
                placeholder="Phone number or email"
              />
            </div>

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {user?.role === "worker" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">My Applications</h2>
          {isApplicationsLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4">
              {applications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
              {applications.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No applications yet
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
