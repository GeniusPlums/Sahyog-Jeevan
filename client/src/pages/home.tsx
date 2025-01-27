import { useUser } from "@/hooks/use-user";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RootLayout from "@/components/layouts/RootLayout";

const TOP_COMPANIES = [
  { id: 'comdata', name: 'Comdata' },
  { id: 'cepto', name: 'Cepto' },
  { id: 'company3', name: 'Company 3' },
];

const FEATURED_JOBS = [
  {
    id: 1,
    title: 'Driver Position',
    company: 'Comdata',
    location: 'Mumbai',
    image: '/path/to/image1.jpg',
    salary: '30K - 40K',
  },
  {
    id: 2,
    title: 'Security Guard',
    company: 'Cepto',
    location: 'Delhi',
    image: '/path/to/image2.jpg',
    salary: '25K - 35K',
  },
];

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <RootLayout>
      <div className="p-4 space-y-6">
        {/* Top Companies Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Top Paying Companies</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {TOP_COMPANIES.map((company) => (
              <div
                key={company.id}
                className="flex flex-col items-center min-w-[80px]"
              >
                <div className="w-[60px] h-[60px] rounded-full bg-gray-200 mb-2" />
                <span className="text-sm text-center">{company.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Jobs Section */}
        <section className="space-y-4">
          {FEATURED_JOBS.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-4">
                <div className="aspect-video w-full bg-gray-100 rounded-lg mb-3" />
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    View Job
                  </Button>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{job.location}</span>
                  <span className="font-medium">{job.salary}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </RootLayout>
  );
}