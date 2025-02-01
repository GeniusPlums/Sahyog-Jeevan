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

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <BriefcaseIcon className="h-6 w-6" />
          <span className="font-bold">SahyogJeevan</span>
        </Link>

        <div className="flex-1" />

        <div className="hidden md:flex items-center space-x-4">
          {user?.role === "worker" && (
            <>
              <Link href="/">
                <Button variant="ghost">{t('common.home')}</Button>
              </Link>
              <Link href="/applied">
                <Button variant="ghost">{t('common.appliedJobs')}</Button>
              </Link>
            </>
          )}

          {user?.role === "employer" && (
            <>
              <Link href="/">
                <Button variant="ghost">{t('common.dashboard')}</Button>
              </Link>
              <Link href="/employer/jobs/new">
                <Button variant="ghost">{t('common.postJob')}</Button>
              </Link>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-sm text-muted-foreground">
                {t('common.signedInAs')} {user?.username}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleLanguage}>
                <Globe className="mr-2 h-4 w-4" />
                {i18n.language === 'en' ? 'हिंदी में देखें' : 'View in English'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                {t('common.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user?.role === "worker" && (
                <>
                  <Link href="/">
                    <DropdownMenuItem>
                      <BriefcaseIcon className="mr-2 h-4 w-4" />
                      {t('common.home')}
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/applied">
                    <DropdownMenuItem>
                      <BriefcaseIcon className="mr-2 h-4 w-4" />
                      {t('common.appliedJobs')}
                    </DropdownMenuItem>
                  </Link>
                </>
              )}

              {user?.role === "employer" && (
                <>
                  <Link href="/">
                    <DropdownMenuItem>
                      <BriefcaseIcon className="mr-2 h-4 w-4" />
                      {t('common.dashboard')}
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/employer/jobs/new">
                    <DropdownMenuItem>
                      <BriefcaseIcon className="mr-2 h-4 w-4" />
                      {t('common.postJob')}
                    </DropdownMenuItem>
                  </Link>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm text-muted-foreground">
                {t('common.signedInAs')} {user?.username}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleLanguage}>
                <Globe className="mr-2 h-4 w-4" />
                {i18n.language === 'en' ? 'हिंदी में देखें' : 'View in English'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                {t('common.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}