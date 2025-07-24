import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { ProductsTable } from "@/components/products/products-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock, AlertTriangle } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema de automação e rotulagem</p>
        </div>
      </div>

      <DashboardStats />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductsTable />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Rótulo impresso</p>
                  <p className="text-xs text-muted-foreground">ROYALMIX TERRA LB - 50 unidades</p>
                  <p className="text-xs text-muted-foreground">há 5 minutos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Produto cadastrado</p>
                  <p className="text-xs text-muted-foreground">POWER LAC 40 MB</p>
                  <p className="text-xs text-muted-foreground">há 15 minutos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">XML importado</p>
                  <p className="text-xs text-muted-foreground">produtos_lote_001.xml</p>
                  <p className="text-xs text-muted-foreground">há 1 hora</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Alertas do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Impressora offline</p>
                  <p className="text-xs text-muted-foreground">Impressora 2 não responde</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Backup agendado</p>
                  <p className="text-xs text-muted-foreground">Próximo backup em 2 horas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
