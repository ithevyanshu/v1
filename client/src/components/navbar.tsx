import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Menu, ChevronLeft, Bell, LogOut, Settings as SettingsIcon, User, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";

interface NavbarProps {
  title: string;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function Navbar({ title, sidebarOpen, toggleSidebar }: NavbarProps) {
  const { user, logoutMutation } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [location, navigate] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleNavigateToProfile = () => {
    navigate("/profile");
  };

  const handleNavigateToSettings = () => {
    navigate("/settings");
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm z-20 sticky top-0 w-full transition-colors duration-300">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="mr-2" 
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
        </div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
          <Link 
            href="/dashboard"
            className="flex items-center"
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 21v-7m0 0V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
                <path d="M9 17h0M9 12h0" />
                <path d="M15 12h0" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden md:inline-block">
              socialitics<span className="text-primary dark:text-blue-400">.</span>
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Theme toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          {/* Notifications button */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 bg-primary rounded-full w-2 h-2"></span>
          </Button>
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-8 px-2">
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <img 
                    className="h-full w-full object-cover" 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "User")}&background=random`} 
                    alt="User avatar" 
                  />
                </div>
                <span className="text-sm hidden md:inline-block">{user?.fullName || user?.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start p-2">
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{user?.fullName || user?.username}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer flex items-center" 
                onClick={handleNavigateToProfile}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer flex items-center" 
                onClick={handleNavigateToSettings}
              >
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer flex items-center text-destructive focus:text-destructive" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}