import type { Product, ProductFilters, ProductFormData } from "@/types/product.types"

export class ProductService {
  static async getProducts(): Promise<Product[]> {
    // TODO: Integrar com API REST do back-end
    return []
  }

  static async getProductById(id: string): Promise<Product | null> {
    // TODO: Integrar com API REST do back-end
    return null
  }

  static async createProduct(data: ProductFormData): Promise<Product> {
    // TODO: Integrar com API REST do back-end
    throw new Error("Não implementado")
  }

  static async updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product> {
    // TODO: Integrar com API REST do back-end
    throw new Error("Não implementado")
  }

  static async deleteProduct(id: string): Promise<void> {
    // TODO: Integrar com API REST do back-end
    throw new Error("Não implementado")
  }

  static filterProducts(products: Product[], filters: ProductFilters): Product[] {
    // Mantém lógica de filtro local
    return products.filter((product) => {
      const matchesSearch =
        !filters.search ||
        product.nomeProduto.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.codigoProduto.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.id.includes(filters.search)

      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "active" && !product.bloqueada && !product.assinatura) ||
        (filters.status === "blocked" && product.bloqueada) ||
        (filters.status === "signed" && product.assinatura)

      return matchesSearch && matchesStatus
    })
  }
}
