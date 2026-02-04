"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Package, Printer } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface RelatorioResumo {
  totalImpressoes: number
  totalProdutos: number
  totalAlteracoes: number
}

export default function RelatoriosPage() {
  const [data, setData] = useState<RelatorioResumo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/relatorios")
        if (!res.ok) throw new Error("Erro ao buscar relatorios")
        const json = await res.json()
        setData(json)
      } catch {
        setData({ totalImpressoes: 0, totalProdutos: 0, totalAlteracoes: 0 })
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const kpis = [
    { title: "Impressoes no mes", value: data?.totalImpressoes ?? 0, icon: Printer },
    { title: "Produtos ativos", value: data?.totalProdutos ?? 0, icon: Package },
    { title: "Alteracoes de formula", value: data?.totalAlteracoes ?? 0, icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatorios</h1>
        <p className="text-muted-foreground">Indicadores e metricas por unidade</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner />
                  <span className="text-sm text-muted-foreground">Carregando</span>
                </div>
              ) : (
                <div className="text-2xl font-bold">{kpi.value}</div>
              )}
              <Badge variant="outline" className="mt-2">Admin</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Resumo de Impressao por Unidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground">
            Grafico sera conectado aos dados reais em breve.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
