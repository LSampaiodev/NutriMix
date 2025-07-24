import { ProductForm } from "@/components/products/product-form"

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novo Produto</h1>
        <p className="text-muted-foreground">Cadastre um novo produto no sistema</p>
      </div>

      <ProductForm />
    </div>
  )
} 