"use client"

import { useEffect } from "react"
import { useSidebar } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

export function useSidebarResponsive() {
  const { setOpenMobile, openMobile, setOpen, open } = useSidebar()
  const isMobile = useIsMobile()

  // Fecha a sidebar no mobile quando navegar
  const closeMobileSidebar = () => {
    if (isMobile && openMobile) {
      setOpenMobile(false)
    }
  }

  // Toggle sidebar no desktop - fecha completamente
  const toggleDesktopSidebar = () => {
    if (!isMobile) {
      setOpen(!open)
    }
  }

  // Fecha a sidebar no mobile quando clicar fora
  useEffect(() => {
    if (!isMobile) return

    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('[data-sidebar="sidebar"]')
      const trigger = document.querySelector('[data-sidebar="trigger"]')

      if (
        openMobile &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        trigger &&
        !trigger.contains(event.target as Node)
      ) {
        setOpenMobile(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobile, openMobile, setOpenMobile])

  // Fecha a sidebar no mobile quando pressionar ESC
  useEffect(() => {
    if (!isMobile) return

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openMobile) {
        setOpenMobile(false)
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => document.removeEventListener("keydown", handleEscapeKey)
  }, [isMobile, openMobile, setOpenMobile])

  return {
    closeMobileSidebar,
    toggleDesktopSidebar,
    isMobile,
    openMobile,
    isDesktopOpen: open,
  }
}
