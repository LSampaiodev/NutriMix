"use client"

import { useState, useEffect, useCallback } from "react"
import { ProductService } from "@/services/product.service"
import type { Product, ProductFilters } from "@/types/product.types"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    status: "all",
  })

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ProductService.getProducts()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar produtos")
    } finally {
      setLoading(false)
    }
  }, [])

  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const deleteProduct = useCallback(
    async (id: string) => {
      try {
        await ProductService.deleteProduct(id)
        await loadProducts() // Recarrega a lista
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao excluir produto")
      }
    },
    [loadProducts],
  )

  // Aplica filtros sempre que produtos ou filtros mudarem
  useEffect(() => {
    const filtered = ProductService.filterProducts(products, filters)
    setFilteredProducts(filtered)
  }, [products, filters])

  // Carrega produtos na inicialização
  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return {
    products: filteredProducts,
    loading,
    error,
    filters,
    updateFilters,
    deleteProduct,
    refreshProducts: loadProducts,
  }
}
