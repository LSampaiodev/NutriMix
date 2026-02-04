"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { List, Download } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"

interface Listagem {
  idEtiqueta: string | null
  codigo: string
  nome: string
  prazoValidade: string
  classificacao: string
  rotulo: string | null
  createdAt: string
}

export default function ListagensPage() {
  const [listagens, setListagens] = useState<Listagem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/listagens")
        if (!res.ok) throw new Error("Erro ao buscar listagens")
        const data = await res.json()
        setListagens(data)
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
        <h1 className="text-3xl font-bold tracking-tight">Listagens</h1>
        <p className="text-muted-foreground">Exportacao e validacao de dados do NutriMix</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Produtos Cadastrados
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-6">{error}</div>
          ) : listagens.length === 0 ? (
            <EmptyState
              title="Nenhum produto encontrado"
              description="Ainda nao ha produtos cadastrados para listagem."
            />
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IDEtiqueta</TableHead>
                    <TableHead>CodigoProduto</TableHead>
                    <TableHead>NomeProduto</TableHead>
                    <TableHead>PrazoValidade</TableHead>
                    <TableHead>Classificacao</TableHead>
                    <TableHead>Rotulo</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listagens.map((item) => (
                    <TableRow key={`${item.codigo}-${item.createdAt}`}>
                      <TableCell className="font-medium">{item.idEtiqueta || "—"}</TableCell>
                      <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>{item.prazoValidade}</TableCell>
                      <TableCell>{item.classificacao}</TableCell>
                      <TableCell>{item.rotulo || "—"}</TableCell>
                      <TableCell>{new Date(item.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
