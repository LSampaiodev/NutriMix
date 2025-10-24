"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Check, Tag, Eye } from "lucide-react"
import { useProducts } from "@/hooks/use-products"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import type { Product } from "@/types/product.types"

interface ProductSelectionDialogProps {
  children: React.ReactNode
  onProductSelected: (product: Product) => void
}

export function ProductSelectionDialog({ children, onProductSelected }: ProductSelectionDialogProps) {
  const { products, loading, error, filters, updateFilters } = useProducts()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    updateFilters({ search: value })
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleConfirmSelection = () => {
    if (selectedProduct) {
      onProductSelected(selectedProduct)
      setIsOpen(false)
      setSelectedProduct(null)
    }
  }

  const handlePreview = (product: Product) => {
    // Preview individual do produto
    console.log("Preview do produto:", product)
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Selecionar Produto para Rótulo</DialogTitle>
          </DialogHeader>
          <div className="text-center text-red-600 py-8">
            Erro ao carregar produtos: {error}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Selecionar Produto para Rótulo
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Lista de produtos */}
          <div className="max-h-[400px] overflow-auto border rounded-lg">
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Selecionar</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome do Produto</TableHead>
                    <TableHead>Classificação</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow 
                      key={product.id}
                      className={selectedProduct?.id === product.id ? "bg-muted/50" : ""}
                    >
                      <TableCell>
                        <Button
                          variant={selectedProduct?.id === product.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleProductSelect(product)}
                        >
                          {selectedProduct?.id === product.id ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            "Selecionar"
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{product.id}</TableCell>
                      <TableCell className="font-mono text-sm">{product.codigo}</TableCell>
                      <TableCell>{product.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {product.classificacao || "Alimento"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(product)}
                          title="Visualizar produto"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Produto selecionado */}
          {selectedProduct && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold mb-2">Produto Selecionado:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Nome:</span> {selectedProduct.nome}
                </div>
                <div>
                  <span className="font-medium">Código:</span> {selectedProduct.codigo}
                </div>
                <div>
                  <span className="font-medium">Classificação:</span> {selectedProduct.classificacao || "Alimento"}
                </div>
                <div>
                  <span className="font-medium">ID:</span> {selectedProduct.id}
                </div>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmSelection}
              disabled={!selectedProduct}
            >
              <Tag className="h-4 w-4 mr-2" />
              Criar Rótulo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
