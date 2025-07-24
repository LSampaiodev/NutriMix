"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, MoreHorizontal, Edit, Eye, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useProducts } from "@/hooks/use-products"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { useRouter } from "next/navigation"

export function ProductsTable() {
  const router = useRouter()
  const { products, loading, error, filters, updateFilters, deleteProduct } = useProducts()

  const handleSearch = (value: string) => {
    updateFilters({ search: value })
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      await deleteProduct(id)
    }
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">Erro ao carregar produtos: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Produtos Cadastrados</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 w-full sm:w-[300px]"
              />
            </div>
            <Button onClick={() => router.push("/produtos/novo")}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="Nenhum produto encontrado"
            description="Não há produtos que correspondam aos filtros aplicados."
          />
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>ID Etiqueta</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome do Produto</TableHead>
                  <TableHead>Revisão</TableHead>
                  <TableHead>Fórmula</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.idEtiqueta}</TableCell>
                    <TableCell className="font-mono text-sm">{product.codigoProduto}</TableCell>
                    <TableCell>{product.nomeProduto}</TableCell>
                    <TableCell>{product.nrRevisao}</TableCell>
                    <TableCell>{product.vFormula}</TableCell>
                    <TableCell>{product.data}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.bloqueada && <Badge variant="destructive">Bloqueado</Badge>}
                        {product.assinatura && <Badge variant="default">Assinado</Badge>}
                        {!product.bloqueada && !product.assinatura && <Badge variant="secondary">Ativo</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
