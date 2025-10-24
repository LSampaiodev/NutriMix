"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Printer, Download, Eye, Settings, AlertTriangle } from "lucide-react"
import { ZPLGeneratorService } from "@/services/zpl-generator.service"
import type { Product } from "@/types/product.types"

interface LabelPreviewProps {
  product: Product
  onPrint?: (zplCode: string) => void
  onDownload?: (zplCode: string) => void
}

export function LabelPreview({ product, onPrint, onDownload }: LabelPreviewProps) {
  const [zplCode, setZplCode] = useState<string>("")
  const [showZPL, setShowZPL] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Gerar código ZPL baseado nos dados do produto
  useEffect(() => {
    try {
      const zpl = ZPLGeneratorService.generateZPL(product)
      setZplCode(zpl)
    } catch (error) {
      console.error("Erro ao gerar código ZPL:", error)
      setZplCode("^XA\n^FO20,20^FDErro ao gerar rótulo^FS\n^XZ\n")
    }
  }, [product])

  const handlePrint = () => {
    if (onPrint) {
      onPrint(zplCode)
    } else {
      // Fallback: tentar imprimir diretamente
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Impressão ZPL</title></head>
            <body>
              <pre>${zplCode}</pre>
              <script>
                window.print();
                setTimeout(() => window.close(), 1000);
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    }
  }

  const handleDownload = () => {
    if (onDownload) {
      onDownload(zplCode)
    } else {
      // Fallback: download do arquivo ZPL
      const blob = new Blob([zplCode], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rotulo_${product.nome.replace(/\s+/g, '_')}.zpl`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleConfirmPrint = () => {
    setShowConfirmation(true)
  }

  const handleFinalPrint = () => {
    handlePrint()
    setShowConfirmation(false)
  }

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview do Rótulo - {product.nome}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowZPL(!showZPL)}>
                <Settings className="h-4 w-4 mr-2" />
                {showZPL ? "Visualizar" : "ZPL"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download ZPL
              </Button>
              <Button size="sm" onClick={handleConfirmPrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Confirmação de impressão */}
      {showConfirmation && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-orange-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-800 mb-2">
                  Confirmar Impressão
                </h3>
                <p className="text-orange-700 mb-4">
                  Deseja realmente imprimir o rótulo do produto <strong>{product.nome}</strong>?
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleFinalPrint} className="bg-orange-600 hover:bg-orange-700">
                    <Printer className="h-4 w-4 mr-2" />
                    Sim, Imprimir
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showZPL ? (
        // Visualização do código ZPL
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Código ZPL</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96">
              {zplCode}
            </pre>
          </CardContent>
        </Card>
      ) : (
        // Visualização do rótulo
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Preview do rótulo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preview do Rótulo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 bg-white min-h-[500px]">
                <div className="space-y-3">
                  {/* Logo e nome do produto */}
                  <div className="text-center border-b pb-3">
                    <div className="mb-2">
                      <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">TH</span>
                      </div>
                    </div>
                    <h2 className="font-bold text-lg">{product.nome}</h2>
                    <Badge variant="outline" className="text-xs mt-1">
                      {product.classificacao || "Alimento"}
                    </Badge>
                  </div>

                  {/* Composição */}
                  <div>
                    <h4 className="font-semibold text-sm">Composição:</h4>
                    <p className="text-xs text-muted-foreground">
                      {product.composicao?.map(ing => `${ing.nome} ${ing.valor}${ing.unidade}`).join(", ") || "Não especificada"}
                    </p>
                  </div>

                  {/* Substitutivos */}
                  {product.substitutivos && product.substitutivos.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm">Substitutivos:</h4>
                      <p className="text-xs text-muted-foreground">
                        {product.substitutivos.map(sub => sub.descricao).join(", ")}
                      </p>
                    </div>
                  )}

                  {/* Níveis de garantia */}
                  <div>
                    <h4 className="font-semibold text-sm">Níveis de Garantia:</h4>
                    <p className="text-xs text-muted-foreground">
                      {product.niveisGarantia?.map(gar => `${gar.nome}: ${gar.valor}${gar.unidade}`).join(", ") || "Não especificada"}
                    </p>
                  </div>

                  {/* Peso líquido */}
                  <div>
                    <h4 className="font-semibold text-sm">Peso Líquido:</h4>
                    <p className="text-xs">{product.conteudoLiquido || "Não especificado"}</p>
                  </div>

                  {/* Indicação de uso */}
                  <div>
                    <h4 className="font-semibold text-sm">Indicação de Uso:</h4>
                    <p className="text-xs text-muted-foreground">{product.indicacao || "Para alimentação animal"}</p>
                  </div>

                  {/* Modo de usar */}
                  <div>
                    <h4 className="font-semibold text-sm">Modo de Usar:</h4>
                    <p className="text-xs text-muted-foreground">{product.modoUsar || "Conforme orientação técnica"}</p>
                  </div>

                  <Separator />

                  {/* Restrições */}
                  <div>
                    <h4 className="font-semibold text-sm">Restrições:</h4>
                    <p className="text-xs text-muted-foreground">{product.restricoes || "Manter em local seco e arejado"}</p>
                  </div>

                  {/* Dados da empresa */}
                  <div className="border-t pt-3">
                    <h4 className="font-semibold text-sm">Fabricante:</h4>
                    <p className="text-xs">TagTwo Indústria e Comércio Ltda</p>
                    <p className="text-xs text-muted-foreground">Rua Exemplo, 123, Centro, Cidade - UF</p>
                    <p className="text-xs text-muted-foreground">CNPJ: 12.345.678/0001-90</p>
                    <p className="text-xs text-muted-foreground">Tel: (11) 1234-5678</p>
                  </div>

                  {/* Origem */}
                  <div>
                    <p className="text-xs font-semibold">Indústria Brasileira</p>
                  </div>

                  {/* Datas e lote */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-semibold">Fabricado:</span> {new Date().toLocaleDateString("pt-BR")}
                    </div>
                    <div>
                      <span className="font-semibold">Validade:</span> {product.prazoValidade || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold">Lote:</span> LOTE-{product.codigo}-{Date.now().toString().slice(-6)}
                    </div>
                  </div>

                  {/* Condições de conservação */}
                  <div>
                    <h4 className="font-semibold text-sm">Conservação:</h4>
                    <p className="text-xs text-muted-foreground">{product.modoConservacao || "Manter em local seco, arejado e protegido da luz solar"}</p>
                  </div>

                  {/* Código de barras */}
                  {product.codigo && (
                    <div className="text-center">
                      <div className="inline-block bg-white p-2 border">
                        {/* Placeholder para código de barras */}
                        <div className="h-8 bg-black w-32 mx-auto"></div>
                        <p className="text-xs mt-1">{product.codigo}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações técnicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações Técnicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Configuração da Impressora</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Modelo:</span>
                    <span>Zebra ZM600</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Linguagem:</span>
                    <span>ZPL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolução:</span>
                    <span>300 DPI</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tamanho:</span>
                    <span>100mm x 50mm</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-sm mb-2">Campos Obrigatórios</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Nome do produto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Classificação do produto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Composição</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Níveis de garantia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Peso líquido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Indicação de uso</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Modo de usar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Restrições</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Dados da empresa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Data fabricação</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Data validade</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Identificação do lote</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Condições de conservação</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
