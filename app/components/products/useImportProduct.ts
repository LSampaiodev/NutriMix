import { ProdutoImportado } from "@/lib/importarXml";

export async function saveImportedProduct(produto: ProdutoImportado) {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produto)
  });
  if (!res.ok) throw new Error("Erro ao salvar produto");
  return await res.json();
}

export async function fetchProducts() {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Erro ao buscar produtos");
  return await res.json();
}
