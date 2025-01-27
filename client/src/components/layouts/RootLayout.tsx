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
    <div className="min-h-screen bg-background">
      {/* Main content */}
      <main className="pb-16 md:pb-0 md:pl-[250px]">
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full",
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

      {/* Desktop sidebar */}
      <aside className="fixed top-0 left-0 h-full w-[250px] border-r bg-background hidden md:block">
        <div className="p-6">
          <h1 className="text-xl font-bold">Job Platform</h1>
        </div>
        <nav className="px-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex items-center gap-3 w-full p-3 rounded-lg mb-1",
                location === path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </div>
  );
}
