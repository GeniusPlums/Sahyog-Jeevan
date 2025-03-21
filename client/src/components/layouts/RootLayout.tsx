import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Briefcase, label: "Applied Jobs", path: "/applied" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [location, navigate] = useLocation();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-background/95 pb-16 md:pb-0">
      {/* Background grid pattern */}
      <div className="pointer-events-none absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />

      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Main content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/30"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* Mobile bottom navigation */}
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      >
        <div className="bg-background/80 backdrop-blur-lg border-t border-primary/10 shadow-lg shadow-primary/5">
          <div className="flex h-16 items-center justify-around px-4">
            {navItems.map(({ icon: Icon, label, path }, index) => (
              <motion.button
                key={path}
                onClick={() => navigate(path)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                className={cn(
                  "group relative flex flex-col items-center justify-center w-20 h-full",
                  location === path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {location === path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative flex flex-col items-center space-y-1">
                  <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-xs font-medium transition-colors duration-200">
                    {label}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>
    </div>
  );
}