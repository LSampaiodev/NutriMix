import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/presentation/components/components/ui/button";
import { ScrollArea } from "@/presentation/components/components/ui/scroll-area";
import { Separator } from "@/presentation/components/components/ui/separator";
import {
  BarChart3,
  FileText,
  Home,
  Settings,
  Shield,
  Tag,
  Users,
  Clock,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { hasRole } from "@/infrastructure/api/auth";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const isAdmin = hasRole("admin");
  
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      isActive: location.pathname === "/dashboard",
    },
    {
      title: "Labels",
      href: "/labels",
      icon: Tag,
      isActive: location.pathname === "/labels",
    },
    ...(isAdmin
      ? [
          {
            title: "Users",
            href: "/users",
            icon: Users,
            isActive: location.pathname === "/users",
          },
        ]
      : []),
    {
      title: "Audit Logs",
      href: "/logs",
      icon: Clock,
      isActive: location.pathname === "/logs",
    },
  ];
  
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-ration-primary text-white transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">RationGuard</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-ration-dark-blue"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        
        <Separator className="bg-ration-dark-blue" />
        
        <ScrollArea className="flex-1 px-4 py-6">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:bg-ration-dark-blue",
                    item.isActive && "bg-ration-dark-blue"
                  )}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>
          
          <Separator className="my-6 bg-ration-dark-blue" />
          
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-ration-dark-blue"
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-ration-dark-blue"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Statistics
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-ration-dark-blue"
            >
              <FileText className="mr-2 h-5 w-5" />
              Documentation
            </Button>
          </div>
        </ScrollArea>
        
        <div className="p-4 text-xs text-ration-light opacity-70">
          <p>Ration Guardian System</p>
          <p>v1.0.0 • &copy; 2025</p>
        </div>
      </div>
    </aside>
  );
};

// Mobile sidebar toggle button
export const SidebarToggle: React.FC<{ toggleSidebar: () => void }> = ({
  toggleSidebar,
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={toggleSidebar}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Open sidebar</span>
    </Button>
  );
};

export default Sidebar;
