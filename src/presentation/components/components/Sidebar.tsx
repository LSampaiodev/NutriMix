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
} from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { hasRole } from "@/infrastructure/api/auth";

const SidebarContent: React.FC = () => {
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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span className="text-xl font-bold">TagTwo</span>
        </Link>
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
  );
};

export default SidebarContent;
