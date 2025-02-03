import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Briefcase } from "lucide-react";

interface HomeLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function HomeLayout({ children, className, ...props }: HomeLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div
        className={cn(
          "relative mx-auto w-full max-w-7xl px-6 py-6 md:px-8 lg:px-12",
          className
        )}
        {...props}
      >
        {/* Hero Section with Modern Design */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-12 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 py-12 md:py-16 lg:py-20"
        >
          {/* Background Pattern */}
          <div className="pointer-events-none absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />

          {/* Floating Elements */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute right-4 top-4 text-primary/20 md:right-8 md:top-8"
          >
            <Briefcase className="h-24 w-24 md:h-32 md:w-32" />
          </motion.div>

          <div className="relative z-10 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8 space-y-4"
            >
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Find Your Next{" "}
                <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                  Blue-Collar Job
                </span>
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Connect with top employers and discover opportunities that match your skills and experience.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content with Enhanced Animations */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative space-y-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}