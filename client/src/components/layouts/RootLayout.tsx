import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Briefcase, CheckSquare } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Briefcase, label: "Applied Jobs", path: "/applied" },
  { icon: CheckSquare, label: "Accepted Jobs", path: "/accepted" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [location, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {/* Main content */}
      <main className="h-[calc(100vh-4rem)] overflow-y-auto">
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full px-2",
                location === path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}