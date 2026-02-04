"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FileX, Upload } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"

interface XmlRow {
  id: number
  idEmpresa: string
  idRTPI: string
  revisao: string
  idEtiqueta: string
  codigoProduto: string
  nomeProduto: string
  lingua: string
  nomeArquivo: string
  dataInclusao: string
  arquivo: string
  createdAt: string
}

export default function XmlPage() {
  const [rows, setRows] = useState<XmlRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/xml")
        if (!res.ok) throw new Error("Erro ao buscar XML")
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
        <h1 className="text-3xl font-bold tracking-tight">XML</h1>
        <p className="text-muted-foreground">Importacao e revisao de formulas por unidade</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileX className="h-5 w-5" />
              Arquivos XML
            </CardTitle>
            <Button size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Importar Selecionados
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
          ) : rows.length === 0 ? (
            <EmptyState
              title="Nenhum XML encontrado"
              description="Ainda nao ha arquivos XML importados."
            />
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Selecionar</TableHead>
                    <TableHead>Id</TableHead>
                    <TableHead>idEmpresa</TableHead>
                    <TableHead>idRTPI</TableHead>
                    <TableHead>Revisao</TableHead>
                    <TableHead>IDEtiqueta</TableHead>
                    <TableHead>codigoproduto</TableHead>
                    <TableHead>nomeproduto</TableHead>
                    <TableHead>Lingua</TableHead>
                    <TableHead>nomedoarquivo</TableHead>
                    <TableHead>datainclusao</TableHead>
                    <TableHead>arquivo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">{row.id}</TableCell>
                      <TableCell>{row.idEmpresa}</TableCell>
                      <TableCell>{row.idRTPI}</TableCell>
                      <TableCell>{row.revisao}</TableCell>
                      <TableCell>{row.idEtiqueta}</TableCell>
                      <TableCell className="font-mono text-sm">{row.codigoProduto}</TableCell>
                      <TableCell>{row.nomeProduto}</TableCell>
                      <TableCell>{row.lingua}</TableCell>
                      <TableCell>{row.nomeArquivo}</TableCell>
                      <TableCell>{new Date(row.dataInclusao).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{row.arquivo}</TableCell>
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
