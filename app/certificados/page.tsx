"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Printer } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"

interface Certificado {
  id: number
  idEtiqueta: string
  lote: string
  codigoProduto: string
  nomeProduto: string
  dataFabricacao: string
  createdAt: string
}

export default function CertificadosPage() {
  const [certificados, setCertificados] = useState<Certificado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/certificados")
        if (!res.ok) throw new Error("Erro ao buscar certificados")
        const data = await res.json()
        setCertificados(data)
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
        <h1 className="text-3xl font-bold tracking-tight">Certificados</h1>
        <p className="text-muted-foreground">Emissao de certificado de conformidade por lote</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certificados de Conformidade
            </CardTitle>
            <Badge variant="outline">Acesso Avancado</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-6">{error}</div>
          ) : certificados.length === 0 ? (
            <EmptyState
              title="Nenhum certificado encontrado"
              description="Ainda nao ha certificados emitidos."
            />
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IdEtiquetas</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>CodigoProduto</TableHead>
                    <TableHead>Nome do Produto</TableHead>
                    <TableHead>Data Fabricacao</TableHead>
                    <TableHead className="w-[120px]">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificados.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-medium">{cert.idEtiqueta}</TableCell>
                      <TableCell>{cert.lote}</TableCell>
                      <TableCell className="font-mono text-sm">{cert.codigoProduto}</TableCell>
                      <TableCell>{cert.nomeProduto}</TableCell>
                      <TableCell>
                        {new Date(cert.dataFabricacao).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Printer className="h-4 w-4 mr-2" />
                          Imprimir
                        </Button>
                      </TableCell>
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
