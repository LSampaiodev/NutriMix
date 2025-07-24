import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/providers/app-provider"
import { MainLayout } from "@/components/layouts/main-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NutriMix - Sistema de Automação e Rotulagem",
  description: "Sistema moderno para gestão de rótulos, etiquetas e certificados",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AppProvider>
          <MainLayout>{children}</MainLayout>
        </AppProvider>
      </body>
    </html>
  )
}
