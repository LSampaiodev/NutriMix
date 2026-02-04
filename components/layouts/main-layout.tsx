"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AppSidebar } from "@/components/navigation/app-sidebar"
import { AppHeader } from "@/components/navigation/app-header"
import { SidebarInset } from "@/components/ui/sidebar"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const isAuthRoute = pathname.startsWith("/login")

  useEffect(() => {
    if (isAuthRoute) {
      setCheckingAuth(false)
      return
    }

    const storedUser = localStorage.getItem("nutrimix.user")
    if (!storedUser) {
      router.replace("/login")
      return
    }

    setCheckingAuth(false)
  }, [isAuthRoute, router])

  if (checkingAuth) {
    return <div className="min-h-screen bg-muted/30" />
  }

  if (isAuthRoute) {
    return <div className="min-h-screen bg-muted/30">{children}</div>
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 bg-muted/30">{children}</main>
      </SidebarInset>
    </div>
  )
}
