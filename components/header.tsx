"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation"
import { Bell, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const pageNames: Record<string, string> = {
  "/": "Dashboard",
  "/produtos": "Gestão de Produtos",
  "/rotulos": "Designer de Rótulos",
  "/impressao": "Central de Impressão",
  "/usuarios": "Gerenciar Usuários",
  "/certificados": "Certificados",
  "/listagens": "Listagens",
  "/xml": "Importação XML",
  "/historico": "Histórico do Sistema",
  "/relatorios": "Relatórios",
  "/cadastros": "Cadastros Auxiliares",
  "/configuracoes": "Configurações",
}

export function Header() {
  const pathname = usePathname()
  const currentPageName = pageNames[pathname] || "Página"

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{currentPageName}</h1>
          <Badge variant="outline" className="text-xs">
            v2.0
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
