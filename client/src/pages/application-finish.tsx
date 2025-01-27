import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import RootLayout from "@/components/layouts/RootLayout";
import { useQuery } from "@tanstack/react-query";

export default function ApplicationFinishPage() {
  const { jobId } = useParams();
  const [_, navigate] = useLocation();

  const { data: job } = useQuery({
    queryKey: [`/api/jobs/${jobId}`],
  });

  return (
    <RootLayout>
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-md mx-auto space-y-8">
          {/* Header with Menu */}
          <div className="flex justify-end">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Logo */}
          <div className="flex justify-center">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              className="text-blue-500"
            >
              {/* Six curved petals with gradient */}
              {[0, 60, 120, 180, 240, 300].map((rotation) => (
                <path
                  key={rotation}
                  d="M40 40 C40 25, 45 15, 40 0 C35 15, 40 25, 40 40"
                  transform={`rotate(${rotation} 40 40)`}
                  fill="url(#blue-gradient)"
                  opacity="0.8"
                />
              ))}
              <defs>
                <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E40AF" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Salary Pill */}
          <div className="w-full bg-gray-200 rounded-full p-1">
            <div className="flex items-center rounded-full overflow-hidden">
              <div className="bg-[#808080] text-white px-6 py-2 flex-1">
                <div className="text-sm">SALARY</div>
              </div>
              <div className="bg-black text-white px-6 py-2 flex-1 text-right">
                <div className="font-medium">{job?.salary || 'Not specified'}</div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-4">
            <h2 className="text-center text-blue-600 font-semibold">
              TERMS & CONDITIONS
            </h2>
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" className="mt-1" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I've read the terms & conditions and agree to the
                </label>
                <p className="text-sm">
                  above clauses and{" "}
                  <span className="text-blue-600 cursor-pointer">policy</span>
                </p>
              </div>
            </div>
          </div>

          {/* Finish Button */}
          <Button 
            className="w-full bg-[#00FF00] hover:bg-[#00DD00] text-black rounded-lg py-6 text-lg font-medium"
            onClick={() => navigate("/applied")}
          >
            FINISH APPLICATION
          </Button>
        </div>
      </div>
    </RootLayout>
  );
}
