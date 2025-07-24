"use client"

import type React from "react"
import { AppSidebar } from "@/components/navigation/app-sidebar"
import { AppHeader } from "@/components/navigation/app-header"
import { SidebarInset } from "@/components/ui/sidebar"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
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
