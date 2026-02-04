"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigation } from "@/hooks/use-navigation"
import { useSidebarResponsive } from "@/hooks/use-sidebar-responsive"
import { Bell, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function AppHeader() {
  const { currentPageTitle } = useNavigation()
  const { isMobile, toggleDesktopSidebar } = useSidebarResponsive()
  const router = useRouter()
  const [displayName, setDisplayName] = useState("Admin")

  const handleSidebarToggle = () => {
    if (!isMobile) {
      toggleDesktopSidebar()
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("nutrimix.user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setDisplayName(user?.name || user?.login || "Admin")
      } catch {
        setDisplayName("Admin")
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("nutrimix.user")
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" onClick={handleSidebarToggle} />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{currentPageTitle}</h1>
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
                <span className="hidden md:inline ml-2">{displayName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
