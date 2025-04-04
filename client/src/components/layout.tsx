import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSidebar } from "@/hooks/use-sidebar";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Navbar } from "@/components/navbar";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { user } = useAuth();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden dark:bg-gray-900 bg-gray-50 transition-colors duration-300">
      {/* Sidebar for desktop */}
      <Sidebar user={user} isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      {/* Main Content */}
      <div className={`flex-1 overflow-auto ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top bar - Full width and fixed */}
        <Navbar 
          title={title} 
          sidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />
        
        {/* Page Content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}