import {
  Home,
  Package,
  FileText,
  Users,
  History,
  Printer,
  Award,
  List,
  FileX,
  BarChart3,
  Settings,
  Database,
} from "lucide-react"
import type { NavigationGroup } from "@/types/navigation.types"

export const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    label: "Principal",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Home,
      },
      {
        title: "Produtos",
        url: "/produtos",
        icon: Package,
      },
      {
        title: "Rótulos",
        url: "/rotulos",
        icon: FileText,
      },
      {
        title: "Impressão",
        url: "/impressao",
        icon: Printer,
      },
    ],
  },
  {
    label: "Gerenciamento",
    items: [
      {
        title: "Usuários",
        url: "/usuarios",
        icon: Users,
      },
      {
        title: "Certificados",
        url: "/certificados",
        icon: Award,
      },
      {
        title: "Listagens",
        url: "/listagens",
        icon: List,
      },
      {
        title: "XML",
        url: "/xml",
        icon: FileX,
      },
    ],
  },
  {
    label: "Sistema",
    items: [
      {
        title: "Histórico",
        url: "/historico",
        icon: History,
      },
      {
        title: "Relatórios",
        url: "/relatorios",
        icon: BarChart3,
      },
      {
        title: "Cadastros",
        url: "/cadastros",
        icon: Database,
      },
      {
        title: "Configurações",
        url: "/configuracoes",
        icon: Settings,
      },
    ],
  },
]

export const PAGE_TITLES: Record<string, string> = {
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
