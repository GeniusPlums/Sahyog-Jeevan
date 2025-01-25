import { Link } from "wouter";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BriefcaseIcon, UserCircle, LogOut, Menu } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <BriefcaseIcon className="h-6 w-6" />
          <span className="font-bold">Blue Collar Jobs</span>
        </Link>

        <div className="flex-1" />

        <div className="hidden md:flex items-center space-x-4">
          <Link href="/jobs">
            <Button variant="ghost">Browse Jobs</Button>
          </Link>

          {user?.role === "employer" && (
            <Link href="/job/post">
              <Button variant="ghost">Post Job</Button>
            </Link>
          )}

          {user?.role === "admin" && (
            <Link href="/admin">
              <Button variant="ghost">Admin Dashboard</Button>
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href="/profile">
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
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
              <Link href="/jobs">
                <DropdownMenuItem>
                  <BriefcaseIcon className="mr-2 h-4 w-4" />
                  Browse Jobs
                </DropdownMenuItem>
              </Link>
              
              {user?.role === "employer" && (
                <Link href="/job/post">
                  <DropdownMenuItem>
                    <BriefcaseIcon className="mr-2 h-4 w-4" />
                    Post Job
                  </DropdownMenuItem>
                </Link>
              )}

              {user?.role === "admin" && (
                <Link href="/admin">
                  <DropdownMenuItem>
                    <BriefcaseIcon className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                </Link>
              )}

              <Link href="/profile">
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
