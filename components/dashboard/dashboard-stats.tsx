import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FileText, Printer, Users, TrendingUp } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  status?: "success" | "warning" | "error"
}

function StatCard({ title, value, description, icon, trend, status }: StatCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={getStatusColor()}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className={`flex items-center text-xs mt-2 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend.isPositive ? "+" : ""}
            {trend.value}% este mês
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Produtos Cadastrados"
        value="0"
        description="Total no sistema"
        icon={<Package className="h-4 w-4" />}
        trend={{ value: 12, isPositive: true }}
        status="success"
      />
      <StatCard
        title="Rótulos Gerados"
        value="0"
        description="Este mês"
        icon={<FileText className="h-4 w-4" />}
        trend={{ value: 8, isPositive: true }}
        status="success"
      />
      <StatCard
        title="Impressões Realizadas"
        value="0"
        description="Últimos 30 dias"
        icon={<Printer className="h-4 w-4" />}
        trend={{ value: 23, isPositive: true }}
        status="success"
      />
      <StatCard
        title="Usuários Ativos"
        value="0"
        description="Online agora: 12"
        icon={<Users className="h-4 w-4" />}
        status="warning"
      />
    </div>
  )
}
