import { Link, useLocation } from "wouter";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function WorkerNavigation() {
  const [location, navigate] = useLocation();
  
  return (
    <div className="border-b">
      <div className="container">
        <Tabs value={location} onValueChange={navigate} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="/home">Home</TabsTrigger>
            <TabsTrigger value="/applied-jobs">Applied Jobs</TabsTrigger>
            <TabsTrigger value="/accepted-jobs">Accepted Jobs</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
