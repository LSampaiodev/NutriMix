"use client"

import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { NAVIGATION_GROUPS, PAGE_TITLES } from "@/constants/navigation.constants"

export function useNavigation() {
  const pathname = usePathname()

  const navigationGroups = useMemo(() => {
    return NAVIGATION_GROUPS.map((group) => ({
      ...group,
      items: group.items.map((item) => ({
        ...item,
        isActive: pathname === item.url,
      })),
    }))
  }, [pathname])

  const currentPageTitle = useMemo(() => {
    return PAGE_TITLES[pathname] || "Página"
  }, [pathname])

  const activeItem = useMemo(() => {
    for (const group of NAVIGATION_GROUPS) {
      const item = group.items.find((item) => item.url === pathname)
      if (item) return item
    }
    return null
  }, [pathname])

  return {
    navigationGroups,
    currentPageTitle,
    activeItem,
    pathname,
  }
}
