"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { History } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"

interface HistoricoRow {
  id: number
  idEtiqueta: string
  idUsuario: string
  nome: string
  codigoUnidade: string
  unidade: string
  qtd: number
  dataHora: string
  lote: string
  codigoProduto: string
  peso: string
  createdAt: string
}

export default function HistoricoPage() {
  const [rows, setRows] = useState<HistoricoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/historico")
        if (!res.ok) throw new Error("Erro ao buscar historico")
        const data = await res.json()
        setRows(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro inesperado")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Historico</h1>
        <p className="text-muted-foreground">Rastreio de impressoes por unidade</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historico de Impressoes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-6">{error}</div>
          ) : rows.length === 0 ? (
            <EmptyState
              title="Nenhuma impressao encontrada"
              description="Ainda nao ha historico de impressoes."
            />
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IdEtiquetas</TableHead>
                    <TableHead>IdUsuario</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>CodigoUnidade</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>CodigoProduto</TableHead>
                    <TableHead>Peso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((item) => {
                    const date = new Date(item.dataHora)
                    const data = date.toLocaleDateString("pt-BR")
                    const hora = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.idEtiqueta}</TableCell>
                        <TableCell>{item.idUsuario}</TableCell>
                        <TableCell>{item.nome}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.codigoUnidade}</Badge>
                        </TableCell>
                        <TableCell>{item.unidade}</TableCell>
                        <TableCell>{item.qtd}</TableCell>
                        <TableCell>{data}</TableCell>
                        <TableCell>{hora}</TableCell>
                        <TableCell className="font-mono text-sm">{item.lote}</TableCell>
                        <TableCell className="font-mono text-sm">{item.codigoProduto}</TableCell>
                        <TableCell>{item.peso}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
