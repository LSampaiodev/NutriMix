import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/presentation/components/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/presentation/components/components/ui/avatar";
import { Bell, ChevronDown, Shield, LogOut, Settings, User as UserIcon } from "lucide-react";
import { useAuth, getCurrentUser, logAuditEvent } from "@/infrastructure/api/auth";
import { toast } from "sonner";

const Header: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const user = getCurrentUser();
  
  const handleLogout = () => {
    logAuditEvent("logout", { username: user?.username });
    logout();
    toast.success("Logout realizado com sucesso");
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">TagTwo</span>
            </Link>
            
            <div className="hidden md:flex items-center ml-8 space-x-1">
              <Link to="/dashboard">
                <Button
                  variant={location.pathname === "/dashboard" ? "default" : "ghost"}
                  size="sm"
                >
                  Dashboard
                </Button>
              </Link>
              <Link to="/labels">
                <Button
                  variant={location.pathname === "/labels" ? "default" : "ghost"}
                  size="sm"
                >
                  Etiquetas
                </Button>
              </Link>
              {user?.role === "admin" && (
                <Link to="/users">
                  <Button
                    variant={location.pathname === "/users" ? "default" : "ghost"}
                    size="sm"
                  >
                    Usuários
                  </Button>
                </Link>
              )}
              <Link to="/logs">
                <Button
                  variant={location.pathname === "/logs" ? "default" : "ghost"}
                  size="sm"
                >
                  Auditoria
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 rounded-full bg-ration-warning w-2 h-2"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user ? getInitials(user.username) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center">
                    <div className="text-sm font-medium mr-1">{user?.username}</div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
