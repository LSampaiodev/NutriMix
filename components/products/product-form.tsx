"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, CalendarDays } from "lucide-react"
import { toast } from "sonner"
import { importarXml } from "@/lib/importarXml";
import type { Ingredient, Garantia, Substitutivo, ProductFormData } from "@/types/product.types";
import { saveImportedProduct } from "@/app/components/products/useImportProduct"

export function ProductForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  // Inicializa a data com o formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState<ProductFormData>({
    codigoProduto: "",
    nomeProduto: "",
    nrRevisao: "",
    vFormula: "",
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
    data: today, // Mantém o campo data no formulário, mas note que ele não é salvo no backend atualmente.
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
        codigoProduto: String(data.codigo || ""),
        nomeProduto: String(data.nome || ""),
        classificacao: data.classificacao || "",
        formaFisica: data.formaFisica || "",
        composicao: (data.composicao || []).map((c) => ({
          order: c.ordem,
          code: "", // Se não vier do XML, deixar vazio
          nome: c.descricao,
          valor: c.valor,
          unidade: "",
        })),
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
        enriquecimento: String(data.enriquecimento || ""),
        indicacao: String(data.indicacao || ""),
        modoUsar: String(data.modoUsar || ""),
        conteudoLiquido: String(data.conteudoLiquido || ""),
        prazoValidade: String(data.prazoValidade || ""), // Garante que seja sempre uma string
        modoConservacao: String(data.modoConservacao || ""),
        restricoes: String(data.restricoes || ""),
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
    // Remove o campo 'data' do formData antes de enviar, pois ele não é mapeado no backend.
    // Se 'data' precisar ser salvo, o schema do Prisma e o backend devem ser atualizados.
    const { data, ...dataToSave } = formData; 
    try {
      setLoading(true)
      // Usando a função saveImportedProduct do useImportProduct.ts
      await saveImportedProduct(dataToSave);

      toast.success("Produto criado com sucesso!");
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

            {/* O campo 'data' é mantido no formulário para preenchimento, mas não é enviado ao backend atualmente.
                Se for necessário persistir esta data, o modelo Prisma e o backend precisarão ser atualizados. */}
            <div className="space-y-2 relative">
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
              <div className="overflow-x-auto">
                <table className="min-w-full border rounded bg-muted/50">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left">Nutriente</th>
                      <th className="px-2 py-1 text-left">Valor</th>
                      <th className="px-2 py-1 text-left">Unidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.niveisGarantia.map((g: Garantia, idx: number) => (
                      <tr
                        key={idx}
                        className="hover:bg-blue-100 cursor-pointer relative"
                        title={`Selecionado: ${g.nome}`}
                      >
                        <td className="px-2 py-1">{g.nome}</td>
                        <td className="px-2 py-1">{g.valor}</td>
                        <td className="px-2 py-1">{g.unidade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Tabela de %VRN conforme IN 75/2020 */}
              <div className="overflow-x-auto mt-4">
                <Label>Tabela de %VRN por 100g de suplemento</Label>
                <table className="min-w-full border rounded bg-muted/50 mt-2">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left">Garantia</th>
                      <th className="px-2 py-1 text-left">Valor de Referência VR¹</th>
                      <th className="px-2 py-1 text-left">Quantidade por 100g</th>
                      <th className="px-2 py-1 text-left">% do VR por 100g</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.niveisGarantia.map((g: Garantia, idx: number) => {
                      // Valores de referência da Anvisa IN 75/2020 (exemplo, pode ser expandido)
                      const valoresReferencia: Record<string, number> = {
                        "Proteína Bruta": 50,
                        "Carboidrato": 300,
                        "Fibra Alimentar": 25,
                        "Gordura Total": 55,
                        "Gordura Saturada": 22,
                        "Sódio": 2000,
                        "Vitamina A": 600,
                        "Vitamina D": 5,
                        "Vitamina C": 45,
                        "Vitamina E": 10,
                        "Vitamina K": 65,
                        "Vitamina B1": 1.2,
                        "Vitamina B2": 1.3,
                        "Vitamina B3": 16,
                        "Vitamina B6": 1.3,
                        "Vitamina B12": 2.4,
                        "Ácido Fólico": 240,
                        "Cálcio": 1000,
                        "Ferro": 14,
                        "Zinco": 7,
                        "Magnésio": 260,
                        "Fósforo": 700,
                        "Potássio": 3500,
                        // ... outros nutrientes
                      };
                      const vr = valoresReferencia[g.nome] || null;
                      const quantidade = Number(g.valor);
                      const porcentagem = vr ? ((quantidade / vr) * 100).toFixed(2) : "-"; // Calculo de porcentagem
                    
                      return (
                        <tr key={idx}
                        className="hover:bg-blue-100 cursor-pointer relative"
                        title={`Selecionado: ${g.nome}`}>
                          <td className="px-2 py-1">{g.nome}</td>
                          <td className="px-2 py-1">{vr ? `${vr} ${g.unidade}` : "-"}</td>
                          <td className="px-2 py-1">{g.valor} {g.unidade}</td>
                          <td className="px-2 py-1">{porcentagem !== "-" ? `${porcentagem}%` : "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="text-xs mt-2">VR¹: Valor de Referência Diário segundo IN nº 75/2020 Anvisa</p>
              </div>
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