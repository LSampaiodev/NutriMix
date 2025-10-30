"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Printer, Download, Eye, Settings, AlertTriangle } from "lucide-react";
import { ZPLGeneratorService } from "@/services/zpl-generator.service";
import type { Product } from "@/types/product.types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
interface LabelPreviewProps {
  product: Product;
  onPrint?: (zplCode: string) => void;
  onDownload?: (zplCode: string) => void;
}

export function LabelPreview({
  product,
  onPrint,
  onDownload,
}: LabelPreviewProps) {
  const [zplCode, setZplCode] = useState<string>("");
  const [showZPL, setShowZPL] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);

  // Gerar código ZPL baseado nos dados do produto
  useEffect(() => {
    try {
      const zpl = ZPLGeneratorService.generateZPL(product);
      setZplCode(zpl);
    } catch (error) {
      console.error("Erro ao gerar código ZPL:", error);
      setZplCode("^XA\n^FO20,20^FDErro ao gerar rótulo^FS\n^XZ\n");
    }
  }, [product]);

  // Gerar preview da imagem usando a API Labelary
  useEffect(() => {
    if (!zplCode || showZPL) return;

    setImageLoading(true);
    setImageError(null);

    // se já existe uma URL antiga, liberar pra evitar vazamento de memória
    if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
    setPreviewImageUrl(null);

    const generatePreview = async () => {
      try {
        const dpi = 8; // 203 DPI
        const width = 4; // polegadas
        const height = 6;
        const url = `https://api.labelary.com/v1/printers/${dpi}dpmm/labels/${width}x${height}/0/`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "image/png",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: zplCode,
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(
            `Erro da API Labelary: ${response.status} - ${errText}`
          );
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setPreviewImageUrl(imageUrl);
      } catch (error: any) {
        setImageError(error.message);
      } finally {
        setImageLoading(false);
      }
    };

    generatePreview();
  }, [zplCode, showZPL]);

  const handlePrint = () => {
    if (onPrint) {
      onPrint(zplCode);
    } else {
      // Fallback: tentar imprimir diretamente
      const printWindow = window.open("", "_blank");
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
        `);
        printWindow.document.close();
      }
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(zplCode);
    } else {
      // Fallback: download do arquivo ZPL
      const blob = new Blob([zplCode], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = '${selectedProduct?.nome || "etiqueta"}.zpl';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  const handleConfirmPrint = () => {
    setShowConfirmation(true);
  };

  const handleFinalPrint = () => {
    handlePrint();
    setShowConfirmation(false);
  };

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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowZPL(!showZPL)}
              >
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
                  Deseja realmente imprimir o rótulo do produto{" "}
                  <strong>{product.nome}</strong>?
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleFinalPrint}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
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
              <CardDescription className="text-xs">
                Imagem gerada via Labelary API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 bg-white min-h-[250px] flex items-center justify-center">
                {imageLoading && <LoadingSpinner />}
                {imageError && (
                  <div className="text-center text-destructive">
                    <p>Erro ao gerar preview:</p>
                    <p className="text-xs">{imageError}</p>
                  </div>
                )}
                {previewImageUrl && !imageLoading && (
                  <img
                    src={previewImageUrl}
                    alt={`Preview do rótulo para ${product.nome}`}
                    className="max-w-full h-auto"
                  />
                )}
                {!previewImageUrl && !imageLoading && !imageError && (
                  <p className="text-muted-foreground">
                    Gerando imagem do rótulo...
                  </p>
                )}
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
                <h4 className="font-semibold text-sm mb-2">
                  Configuração da Impressora
                </h4>
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
                    <span>203 DPI</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tamanho:</span>
                    <span>100mm x 150mm</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-sm mb-2">
                  Campos Obrigatórios
                </h4>
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
  );
}
