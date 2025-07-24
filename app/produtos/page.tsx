import { ProductsTable } from "@/components/products/products-table"

export default function ProdutosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Produtos</h1>
        <p className="text-muted-foreground">Gerencie todos os produtos cadastrados no sistema</p>
      </div>

      <ProductsTable />
    </div>
  )
}
