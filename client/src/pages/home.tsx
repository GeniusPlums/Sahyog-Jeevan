import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Search, Briefcase, ShieldCheck, Car, HardHat, Wrench, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import WorkerNavigation from "@/components/worker-navigation";

const INDUSTRY_CATEGORIES = [
  { id: 'driver', icon: Car, label: 'Driver' },
  { id: 'security', icon: ShieldCheck, label: 'Guard' },
  { id: 'construction', icon: HardHat, label: 'Construction' },
  { id: 'maintenance', icon: Wrench, label: 'Maintenance' },
];

export default function Home() {
  const { user } = useUser();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-8">
      {user?.role === "worker" && <WorkerNavigation />}

      {/* Hero Section with Search */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Find Your Next Career Opportunity
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Thousands of jobs available across India
        </p>
        <div className="max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-muted" : ""}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
        {showFilters && (
          <div className="max-w-md mx-auto p-4 bg-muted rounded-lg mt-2">
            <p className="text-sm text-muted-foreground">Filters coming soon...</p>
          </div>
        )}
      </section>

      {/* Industry Categories */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INDUSTRY_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id}
                className="hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/jobs?category=${category.id}`)}
              >
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Icon className="h-8 w-8 mb-2" />
                  <span className="font-medium">{category.label}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Top Paying Companies */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Top Paying Companies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Comdata', 'Cepto'].map((company) => (
            <Card key={company}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 bg-muted rounded-full mb-2" />
                <span className="font-medium">{company}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Jobs Near You</h2>
          <Button variant="ghost" onClick={() => navigate("/jobs")}>
            View All
          </Button>
        </div>
        <div className="grid gap-4">
          {/* Job cards will be dynamically loaded here */}
        </div>
      </section>

      {/* Video Content Section */}
      <section className="bg-muted rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Featured Job Videos</h2>
        <div className="aspect-video rounded-lg bg-black/10 flex items-center justify-center">
          <p className="text-muted-foreground">Video content will be displayed here</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
        <p className="text-muted-foreground">Join thousands of workers finding great opportunities</p>
        <Button asChild size="lg">
          <Link href="/jobs">Find Jobs Now</Link>
        </Button>
      </section>
    </div>
  );
}