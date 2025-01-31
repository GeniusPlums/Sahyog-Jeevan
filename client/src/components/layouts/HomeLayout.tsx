import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HomeLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function HomeLayout({ children, className, ...props }: HomeLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        className={cn(
          "relative mx-auto w-full max-w-7xl px-4 py-4 md:px-6 lg:px-8",
          className
        )}
        {...props}
      >
        {/* Hero Section with Gradient Background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 shadow-lg"
        >
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-4 text-4xl font-bold tracking-tight"
            >
              Find Your Next Blue-Collar Job
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-xl text-lg text-muted-foreground"
            >
              Connect with top employers and discover opportunities that match your skills
            </motion.p>
          </div>
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
        </motion.div>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
