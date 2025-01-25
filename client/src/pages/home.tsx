import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Link } from "wouter";

export default function Home() {
  const { user } = useUser();
  const [, navigate] = useLocation();

  const heroImages = [
    "https://images.unsplash.com/photo-1425421669292-0c3da3b8f529",
    "https://images.unsplash.com/photo-1626885930974-4b69aa21bbf9",
    "https://images.unsplash.com/photo-1622127739239-1905bbaa21b8"
  ];

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Find Your Next Career Opportunity
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connecting skilled workers with great employers. Your next job is just a click away.
        </p>
        <div className="flex justify-center gap-4">
          {user?.role === "worker" && (
            <Button size="lg" onClick={() => navigate("/jobs")}>
              Browse Jobs
            </Button>
          )}
          {user?.role === "employer" && (
            <Button size="lg" onClick={() => navigate("/job/post")}>
              Post a Job
            </Button>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {heroImages.map((src, idx) => (
          <div key={idx} className="relative overflow-hidden rounded-lg aspect-[4/3]">
            <img
              src={src}
              alt="Workers"
              className="object-cover w-full h-full transition-transform hover:scale-105"
            />
          </div>
        ))}
      </section>

      <section className="bg-muted p-8 rounded-lg">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Easy Application</h3>
              <p className="text-muted-foreground">Apply to multiple jobs with just one click</p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Verified Employers</h3>
              <p className="text-muted-foreground">Work with trusted companies in your area</p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Track Progress</h3>
              <p className="text-muted-foreground">Monitor your applications in real-time</p>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
        <p className="text-muted-foreground">Join thousands of workers and employers on our platform</p>
        <Button asChild size="lg">
          <Link href="/jobs">Find Jobs Now</Link>
        </Button>
      </section>
    </div>
  );
}
