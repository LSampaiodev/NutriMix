"use client"

import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"

interface AppProviderProps {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      {children}
      <Toaster />
    </SidebarProvider>
  )
}
