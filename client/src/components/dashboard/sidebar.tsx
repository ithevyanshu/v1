import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Link, useLocation } from "wouter";
import { User } from "@shared/schema";
import { X, Moon, Sun, LogOut, ChevronLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialIcons } from "@/components/social-icons";

interface SidebarProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Main navigation links
  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: "layout-dashboard" },
    { href: "/content", label: "Content Calendar", icon: "calendar" },
    { href: "/analytics", label: "Analytics", icon: "bar-chart-2" },
    { href: "/accounts", label: "Accounts", icon: "users" },
  ];

  // Manager-only links
  const managerLinks = [
    { href: "/clients", label: "Client Accounts", icon: "briefcase" },
    { href: "/reports", label: "Reports", icon: "file-text" },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  // Create Icon component
  const Icon = ({ name }: { name: string }) => {
    const iconMap: Record<string, React.ReactNode> = {
      "layout-dashboard": (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      "calendar": (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      "bar-chart-2": (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      "users": (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      "briefcase": (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      "file-text": (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    };

    return <>{iconMap[name] || null}</>;
  };

  // Sidebar content
  const sidebarContent = (
    <>
      <div className="px-4 py-6 flex items-center border-b border-gray-200 dark:border-gray-700">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 21v-7m0 0V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
            <path d="M9 17h0M9 12h0" />
            <path d="M15 12h0" />
          </svg>
        </div>
        <span className="text-xl font-bold dark:text-white text-black">
          socialitics<span className="text-primary dark:text-blue-400">.</span>
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive(link.href)
                  ? "bg-primary/10 text-primary dark:text-primary-foreground"
                  : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              } transition-colors`}
            >
              <span className={`mr-3 ${isActive(link.href) ? "text-primary" : "text-gray-500 dark:text-gray-400"}`}>
                <Icon name={link.icon} />
              </span>
              {link.label}
            </Link>
          ))}
          
          {/* Manager-only section */}
          {user?.role === "manager" && (
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Management
              </h3>
              <div className="mt-2 space-y-1">
                {managerLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(link.href)
                        ? "bg-primary/10 text-primary dark:text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    } transition-colors`}
                  >
                    <span className={`mr-3 ${isActive(link.href) ? "text-primary" : "text-gray-500 dark:text-gray-400"}`}>
                      <Icon name={link.icon} />
                    </span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>
      
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <Link 
          href="/profile"
          className="flex items-center"
        >
          <img
            className="h-8 w-8 rounded-full"
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "User")}&background=random`}
            alt="User avatar"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.fullName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.role === "professional" ? "Professional" : 
               user?.role === "brand" ? "Brand" : "Social Media Manager"}
            </p>
          </div>
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-600" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-1 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar - conditionally shown based on isOpen state */}
      {isOpen && (
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:dark:border-gray-700 lg:bg-white lg:dark:bg-gray-800 lg:pt-5 lg:pb-4 lg:z-20">
          {sidebarContent}
        </div>
      )}
      
      {/* Mobile sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 flex z-40 transition-all duration-300">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <Button variant="ghost" size="icon" className="text-white" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
