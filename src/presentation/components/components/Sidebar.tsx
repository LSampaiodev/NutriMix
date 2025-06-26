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
      title: "Etiquetas",
      href: "/labels",
      icon: Tag,
      isActive: location.pathname === "/labels",
    },
    ...(isAdmin
      ? [
          {
            title: "Usuários",
            href: "/users",
            icon: Users,
            isActive: location.pathname === "/users",
          },
        ]
      : []),
    {
      title: "Auditoria",
      href: "/logs",
      icon: Clock,
      isActive: location.pathname === "/logs",
    },
  ];
  
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-primary text-primary-foreground transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">TagTwo</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary-foreground hover:bg-primary/90"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        
        <Separator className="bg-primary/80" />
        
        <ScrollArea className="flex-1 px-4 py-6">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-primary-foreground hover:bg-primary/90",
                    item.isActive && "bg-primary/80"
                  )}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>
          
          <Separator className="my-6 bg-primary/80" />
          
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-primary-foreground hover:bg-primary/90"
            >
              <Settings className="mr-2 h-5 w-5" />
              Configurações
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-primary-foreground hover:bg-primary/90"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Estatísticas
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-primary-foreground hover:bg-primary/90"
            >
              <FileText className="mr-2 h-5 w-5" />
              Documentação
            </Button>
          </div>
        </ScrollArea>
        
        <div className="p-4 text-xs text-primary-foreground opacity-70">
          <p>Sistema TagTwo</p>
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
      <span className="sr-only">Abrir menu lateral</span>
    </Button>
  );
};

export default Sidebar;
