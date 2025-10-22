"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { fetchProducts } from "@/app/components/products/useImportProduct"
import type { Product, ProductFilters } from "@/types/product.types"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    status: "all",
  })

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProducts()
      // Filtro simples no lado do cliente
      const filteredData = data.filter(
        (product: Product) =>
          product.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.codigo.toLowerCase().includes(filters.search.toLowerCase()),
      )
      setProducts(filteredData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido"
      setError(errorMessage)
      toast.error(`Erro ao buscar produtos: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }, [filters.search])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const deleteProduct = async (id: string) => {
    // TODO: Implementar a lógica de exclusão (API e backend)
    console.log("Excluir produto com ID:", id)
    toast.info("Funcionalidade de exclusão ainda não implementada.")
    // Após implementar, recarregue os produtos:
    // await loadProducts();
  }

  return { products, loading, error, filters, updateFilters, deleteProduct }
}