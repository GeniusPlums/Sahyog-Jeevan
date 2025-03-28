import { Link } from "wouter";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { BriefcaseIcon, UserCircle, LogOut, Menu, Globe, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="sticky top-0 z-50 border-b border-primary/10 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm shadow-primary/5"
    >
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2 relative group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 relative"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-primary/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <img 
              src={`${window.location.origin}/uploads/app-assets/WhatsApp Image 2025-01-10 at 21.36.47_0b27d639.jpg`}
              alt="SahyogJeevan" 
              className="h-24 w-24 object-contain rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/Feb_6,_2025_at_34928 PM[1].pdf.png';
              }}
            />
          </motion.div>
        </Link>

        <div className="flex-1" />

        <div className="hidden md:flex items-center space-x-3">
          {user?.role === "worker" && (
            <>
              <motion.div variants={navItemVariants} initial="hidden" animate="visible">
                <Link href="/">
                  <Button 
                    variant="ghost" 
                    className="px-4 font-medium transition-all duration-300 hover:text-primary hover:bg-primary/10 rounded-full"
                  >
                    Home
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={navItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                <Link href="/applied">
                  <Button 
                    variant="ghost" 
                    className="px-4 font-medium transition-all duration-300 hover:text-primary hover:bg-primary/10 rounded-full"
                  >
                    Applied Jobs
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={navItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                <Link href="/profile">
                  <Button 
                    variant="ghost" 
                    className="px-4 font-medium transition-all duration-300 hover:text-primary hover:bg-primary/10 rounded-full"
                  >
                    Profile
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={navItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                <Link href="/help">
                  <Button 
                    variant="ghost" 
                    className="px-4 font-medium transition-all duration-300 hover:text-primary hover:bg-primary/10 rounded-full"
                  >
                    Help
                  </Button>
                </Link>
              </motion.div>
            </>
          )}

          {user?.role === "employer" && (
            <>
              <motion.div variants={navItemVariants} initial="hidden" animate="visible">
                <Link href="/">
                  <Button 
                    variant="ghost" 
                    className="px-4 font-medium transition-all duration-300 hover:text-primary hover:bg-primary/10 rounded-full"
                  >
                    Dashboard
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={navItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                <Link href="/employer/jobs/new">
                  <Button 
                    variant="ghost" 
                    className="px-4 font-medium transition-all duration-300 hover:text-primary hover:bg-primary/10 rounded-full"
                  >
                    Post Job
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={navItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                <Link href="/profile">
                  <Button 
                    variant="ghost" 
                    className="px-4 font-medium transition-all duration-300 hover:text-primary hover:bg-primary/10 rounded-full"
                  >
                    Profile
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={navItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                <Link href="/help">
                  <Button 
                    variant="ghost" 
                    className="px-4 font-medium transition-all duration-300 hover:text-primary hover:bg-primary/10 rounded-full"
                  >
                    Help
                  </Button>
                </Link>
              </motion.div>
            </>
          )}

          <motion.div 
            variants={navItemVariants} 
            initial="hidden" 
            animate="visible" 
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              size="icon"
              className="w-20 gap-2 rounded-full border-primary/20 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md hover:shadow-primary/20"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium">
                English
              </span>
            </Button>
          </motion.div>

          <motion.div 
            variants={navItemVariants} 
            initial="hidden" 
            animate="visible" 
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:shadow-primary/20"
                >
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                <DropdownMenuItem className="text-sm font-medium text-muted-foreground">
                  Signed in as {user?.username}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 transition-colors duration-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-primary/10 transition-all duration-300"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 animate-in slide-in-from-top-2 fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            >
              {user?.role === "worker" && (
                <>
                  <Link href="/">
                    <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-300">
                      <BriefcaseIcon className="mr-2 h-4 w-4 text-primary" />
                      Home
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/applied">
                    <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-300">
                      <BriefcaseIcon className="mr-2 h-4 w-4 text-primary" />
                      Applied Jobs
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile">
                    <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-300">
                      <UserCircle className="mr-2 h-4 w-4 text-primary" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/help">
                    <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-300">
                      <HelpCircle className="mr-2 h-4 w-4 text-primary" />
                      Help
                    </DropdownMenuItem>
                  </Link>
                </>
              )}

              {user?.role === "employer" && (
                <>
                  <Link href="/">
                    <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-300">
                      <BriefcaseIcon className="mr-2 h-4 w-4 text-primary" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/employer/jobs/new">
                    <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-300">
                      <BriefcaseIcon className="mr-2 h-4 w-4 text-primary" />
                      Post Job
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile">
                    <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-300">
                      <UserCircle className="mr-2 h-4 w-4 text-primary" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/help">
                    <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-300">
                      <HelpCircle className="mr-2 h-4 w-4 text-primary" />
                      Help
                    </DropdownMenuItem>
                  </Link>
                </>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem 
                className="hover:bg-primary/10 transition-colors duration-300"
              >
                <Globe className="mr-2 h-4 w-4 text-primary" />
                English
              </DropdownMenuItem>

              <DropdownMenuItem className="text-sm font-medium text-muted-foreground">
                Signed in as {user?.username}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 transition-colors duration-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.nav>
  );
}