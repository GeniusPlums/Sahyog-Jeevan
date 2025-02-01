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
import { BriefcaseIcon, UserCircle, LogOut, Menu, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useUser();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
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
            <BriefcaseIcon className="h-6 w-6 text-primary relative" />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-xl font-bold text-transparent relative">
              SahyogJeevan
            </span>
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
                    {t('common.home')}
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={navItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                <Link href="/applied">
                  <Button 
                    variant="ghost" 
                    className="px-4 font-medium transition-all duration-300 hover:text-primary hover:bg-primary/10 rounded-full"
                  >
                    {t('common.appliedJobs')}
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
                    {t('common.dashboard')}
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={navItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                <Link href="/employer/jobs/new">
                  <Button 
                    variant="ghost" 
                    className="px-4 font-medium transition-all duration-300 hover:text-primary hover:bg-primary/10 rounded-full"
                  >
                    {t('common.postJob')}
                  </Button>
                </Link>
              </motion.div>
            </>
          )}

          {/* Language toggle button */}
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
              onClick={toggleLanguage}
              className="w-20 gap-2 rounded-full border-primary/20 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md hover:shadow-primary/20"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium">
                {i18n.language === 'en' ? 'हिं' : 'EN'}
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
                  {t('common.signedInAs')} {user?.username}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 transition-colors duration-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('common.logout')}
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
                      {t('common.home')}
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/applied">
                    <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-300">
                      <BriefcaseIcon className="mr-2 h-4 w-4 text-primary" />
                      {t('common.appliedJobs')}
                    </DropdownMenuItem>
                  </Link>
                </>
              )}

              {user?.role === "employer" && (
                <>
                  <Link href="/">
                    <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-300">
                      <BriefcaseIcon className="mr-2 h-4 w-4 text-primary" />
                      {t('common.dashboard')}
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/employer/jobs/new">
                    <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-300">
                      <BriefcaseIcon className="mr-2 h-4 w-4 text-primary" />
                      {t('common.postJob')}
                    </DropdownMenuItem>
                  </Link>
                </>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem 
                onClick={toggleLanguage}
                className="hover:bg-primary/10 transition-colors duration-300"
              >
                <Globe className="mr-2 h-4 w-4 text-primary" />
                {i18n.language === 'en' ? 'हिंदी में देखें' : 'View in English'}
              </DropdownMenuItem>

              <DropdownMenuItem className="text-sm font-medium text-muted-foreground">
                {t('common.signedInAs')} {user?.username}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 transition-colors duration-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t('common.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.nav>
  );
}