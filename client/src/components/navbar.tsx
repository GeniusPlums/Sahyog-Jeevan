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
          <span className="font-bold">SahyogJeevan</span>
        </Link>

        <div className="flex-1" />

        <div className="hidden md:flex items-center space-x-4">
          {user?.role === "worker" && (
            <>
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link href="/applied">
                <Button variant="ghost">Applied Jobs</Button>
              </Link>
            </>
          )}

          {user?.role === "employer" && (
            <>
              <Link href="/">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/employer/jobs/new">
                <Button variant="ghost">Post Job</Button>
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
                Signed in as {user?.username}
              </DropdownMenuItem>
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
              {user?.role === "worker" && (
                <>
                  <Link href="/">
                    <DropdownMenuItem>
                      <BriefcaseIcon className="mr-2 h-4 w-4" />
                      Home
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/applied">
                    <DropdownMenuItem>
                      <BriefcaseIcon className="mr-2 h-4 w-4" />
                      Applied Jobs
                    </DropdownMenuItem>
                  </Link>
                </>
              )}

              {user?.role === "employer" && (
                <>
                  <Link href="/">
                    <DropdownMenuItem>
                      <BriefcaseIcon className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/employer/jobs/new">
                    <DropdownMenuItem>
                      <BriefcaseIcon className="mr-2 h-4 w-4" />
                      Post Job
                    </DropdownMenuItem>
                  </Link>
                </>
              )}

              <DropdownMenuItem className="text-sm text-muted-foreground">
                Signed in as {user?.username}
              </DropdownMenuItem>

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