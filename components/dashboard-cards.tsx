import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Activity, TrendingUp } from "lucide-react"

interface DashboardCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

function DashboardCard({ title, value, description, icon, trend }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className={`flex items-center text-xs mt-2 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend.isPositive ? "+" : ""}
            {trend.value}% em relação ao mês anterior
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Total de Usuários"
        value={1234}
        description="Usuários ativos no sistema"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: 12, isPositive: true }}
      />
      <DashboardCard
        title="Rótulos Gerados"
        value="8,432"
        description="Este mês"
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: 8, isPositive: true }}
      />
      <DashboardCard
        title="Certificados Impressos"
        value="2,156"
        description="Este mês"
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: 23, isPositive: true }}
      />
      <DashboardCard
        title="Taxa de Sucesso"
        value="98.2%"
        description="Impressões bem-sucedidas"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: 2, isPositive: true }}
      />
    </div>
  )
}
