"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import { toast } from "sonner"
import { importarXml } from "@/lib/importarXml";
import type { Ingredient, Garantia, Substitutivo, ProductFormData } from "@/types/product.types";

export function ProductForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    codigoProduto: "",
    nomeProduto: "",
    nrRevisao: "",
    vFormula: "",
    data: "",
    // campos extras
    classificacao: "",
    formaFisica: "",
    composicao: [],
    enriquecimento: "",
    substitutivos: [],
    niveisGarantia: [],
    indicacao: "",
    modoUsar: "",
    conteudoLiquido: "",
    prazoValidade: "",
    modoConservacao: "",
    restricoes: ""
  });

  const handleXMLImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) {
        console.log("Nenhum arquivo selecionado")
        return
      }

      // Verifica se é um arquivo XML
      if (!file.name.toLowerCase().endsWith('.xml')) {
        toast.error("Por favor, selecione um arquivo XML")
        return
      }

      setLoading(true)
      // Lê o conteúdo do arquivo XML
      const text = await file.text();
      // Faz o parse e extrai os campos customizados
      const data = importarXml(text);
      if (!data) {
        toast.error("Erro ao importar XML: formato inválido");
        setLoading(false);
        return;
      }
      // Adaptar campos para ProductFormData
      setFormData((prev) => ({
        ...prev,
        codigoProduto: data.codigo || "",
        nomeProduto: data.nome || "",
        classificacao: data.classificacao || "",
        formaFisica: data.formaFisica || "",
        composicao: (data.composicao || []).map((c) => ({
          order: c.ordem,
          code: "", // Se não vier do XML, deixar vazio
          nome: c.descricao,
          valor: c.valor,
          unidade: "",
        })),
        enriquecimento: data.enriquecimento || "",
        substitutivos: (data.substitutivos || []).map((s, idx) => ({
          code: "",
          descricao: s,
          sequence: String(idx + 1),
        })),
        niveisGarantia: (data.niveisGarantia || []).map((n, idx) => ({
          order: String(idx + 1),
          code: "",
          nome: n.nome,
          valor: n.valor,
          unidade: n.unidade,
          minimo: n.min,
          maximo: n.max,
        })),
        indicacao: data.indicacao || "",
        modoUsar: data.modoUsar || "",
        conteudoLiquido: data.conteudoLiquido || "",
        prazoValidade: data.prazoValidade || "",
        modoConservacao: data.modoConservacao || "",
        restricoes: data.restricoes || "",
      }));
      toast.success("XML importado com sucesso!")
    } catch (error) {
      console.error("Erro ao importar XML:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao importar XML")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar produto")
      }

      toast.success("Produto criado com sucesso!")
      router.push("/produtos")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar produto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-end">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".xml"
                onChange={handleXMLImport}
                className="hidden"
                id="xml-import"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("xml-import")?.click()}
                disabled={loading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar XML
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigoProduto">Código do Produto</Label>
              <Input
                id="codigoProduto"
                value={formData.codigoProduto}
                onChange={(e) => setFormData({ ...formData, codigoProduto: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomeProduto">Nome do Produto</Label>
              <Input
                id="nomeProduto"
                value={formData.nomeProduto}
                onChange={(e) => setFormData({ ...formData, nomeProduto: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nrRevisao">Número da Revisão</Label>
              <Input
                id="nrRevisao"
                value={formData.nrRevisao}
                onChange={(e) => setFormData({ ...formData, nrRevisao: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vFormula">Fórmula</Label>
              <Input
                id="vFormula"
                value={formData.vFormula}
                onChange={(e) => setFormData({ ...formData, vFormula: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Campos extras do XML */}
          {formData.classificacao && (
            <div className="space-y-2">
              <Label>Classificação</Label>
              <Input value={formData.classificacao} onChange={e => setFormData({ ...formData, classificacao: e.target.value })} />
            </div>
          )}
          {formData.formaFisica && (
            <div className="space-y-2">
              <Label>Forma Física</Label>
              <Input value={formData.formaFisica} onChange={e => setFormData({ ...formData, formaFisica: e.target.value })} />
            </div>
          )}
          {formData.composicao && formData.composicao.length > 0 && (
            <div className="space-y-2">
              <Label>Composição</Label>
              <ul className="border rounded p-2 bg-muted/50">
                {formData.composicao.map((ing: Ingredient, idx: number) => (
                  <li key={idx} className="mb-1">
                    <b>{ing.order}.</b> {ing.nome} ({ing.code}) - {ing.valor}{ing.unidade}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {formData.niveisGarantia && formData.niveisGarantia.length > 0 && (
            <div className="space-y-2">
              <Label>Níveis de Garantia</Label>
              <ul className="border rounded p-2 bg-muted/50">
                {formData.niveisGarantia.map((g: Garantia, idx: number) => (
                  <li key={idx} className="mb-1">
                    <b>{g.order}.</b> {g.nome} ({g.code}) - {g.valor}{g.unidade} {g.minimo && `(Mín: ${g.minimo})`} {g.maximo && `(Máx: ${g.maximo})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {formData.substitutivos && formData.substitutivos.length > 0 && (
            <div className="space-y-2">
              <Label>Substitutivos</Label>
              <ul className="border rounded p-2 bg-muted/50">
                {formData.substitutivos.map((s: Substitutivo, idx: number) => (
                  <li key={idx} className="mb-1">
                    <b>{s.sequence}.</b> {s.descricao} ({s.code})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {formData.enriquecimento && (
            <div className="space-y-2">
              <Label>Enriquecimento</Label>
              <Textarea value={formData.enriquecimento} onChange={e => setFormData({ ...formData, enriquecimento: e.target.value })} />
            </div>
          )}
          {formData.indicacao && (
            <div className="space-y-2">
              <Label>Indicação</Label>
              <Textarea value={formData.indicacao} onChange={e => setFormData({ ...formData, indicacao: e.target.value })} />
            </div>
          )}
          {formData.modoUsar && (
            <div className="space-y-2">
              <Label>Modo de Usar</Label>
              <Textarea value={formData.modoUsar} onChange={e => setFormData({ ...formData, modoUsar: e.target.value })} />
            </div>
          )}
          {formData.conteudoLiquido && (
            <div className="space-y-2">
              <Label>Conteúdo Líquido</Label>
              <Input value={formData.conteudoLiquido} onChange={e => setFormData({ ...formData, conteudoLiquido: e.target.value })} />
            </div>
          )}
          {formData.prazoValidade && (
            <div className="space-y-2">
              <Label>Prazo de Validade</Label>
              <Input value={formData.prazoValidade} onChange={e => setFormData({ ...formData, prazoValidade: e.target.value })} />
            </div>
          )}
          {formData.modoConservacao && (
            <div className="space-y-2">
              <Label>Modo de Conservação</Label>
              <Textarea value={formData.modoConservacao} onChange={e => setFormData({ ...formData, modoConservacao: e.target.value })} />
            </div>
          )}
          {formData.restricoes && (
            <div className="space-y-2">
              <Label>Restrições</Label>
              <Textarea value={formData.restricoes} onChange={e => setFormData({ ...formData, restricoes: e.target.value })} />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Produto"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
} 