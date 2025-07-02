import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/presentation/components/components/ui/card";
import { Input } from "@/presentation/components/components/ui/input";
import { Button } from "@/presentation/components/components/ui/button";
import { Label } from "@/presentation/components/components/ui/label";
import { parseXML, extractLabelData } from "@/core/services/xmlUtils";
import { toast } from "sonner";

const ProductImport: React.FC = () => {
  const [productCode, setProductCode] = useState("");
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setXmlFile(files[0]);
    } else {
      setXmlFile(null);
    }
  };

  const handleImport = async () => {
    if (!productCode) {
      toast.error("Digite ou selecione o código do produto.");
      return;
    }
    if (!xmlFile) {
      toast.error("Selecione um arquivo XML.");
      return;
    }
    setLoading(true);
    try {
      const content = await xmlFile.text();
      const parsed = await parseXML(content);
      const data = extractLabelData(parsed);
      setProductData(data);
      toast.success("Dados do produto carregados com sucesso!");
    } catch (err) {
      toast.error("Erro ao importar XML: " + (err instanceof Error ? err.message : String(err)));
      setProductData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col px-4 md:px-8 mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro/Consulta de Produto via XML</CardTitle>
          <CardDescription>
            Digite o código do produto e faça upload do XML correspondente. Os dados serão exibidos abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
            <div className="flex-1">
              <Label htmlFor="product-code">Código do Produto</Label>
              <Input
                id="product-code"
                value={productCode}
                onChange={e => setProductCode(e.target.value)}
                placeholder="Ex: GCM4120"
                disabled={loading}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="xml-file">Upload XML</Label>
              <Input
                id="xml-file"
                type="file"
                accept=".xml,text/xml"
                onChange={handleFileChange}
                disabled={loading}
              />
            </div>
            <Button onClick={handleImport} disabled={loading || !productCode || !xmlFile} className="mt-4 md:mt-0">
              {loading ? "Carregando..." : "Importar"}
            </Button>
          </div>

          {productData && (
            <Card className="mt-6 bg-muted/10">
              <CardHeader>
                <CardTitle>Dados do Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome do Produto</Label>
                    <Input value={productData.productName || "-"} readOnly />
                  </div>
                  <div>
                    <Label>Código</Label>
                    <Input value={productCode} readOnly />
                  </div>
                  <div>
                    <Label>Categoria</Label>
                    <Input value={productData.category || "-"} readOnly />
                  </div>
                  <div>
                    <Label>Subcategoria</Label>
                    <Input value={productData.subCategory || "-"} readOnly />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Ingredientes</Label>
                    <Input value={Array.isArray(productData.ingredients) ? productData.ingredients.join(", ") : "-"} readOnly />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Garantias</Label>
                    <Input value={Array.isArray(productData.guaranteedAnalysis) ? productData.guaranteedAnalysis.map((g: any) => g["@attributes"]?.name + (g["@attributes"]?.minimum ? ` Min: ${g["@attributes"].minimum}` : "") + (g["@attributes"]?.maximum ? ` Max: ${g["@attributes"].maximum}` : "") + (g["@attributes"]?.unit ? ` ${g["@attributes"].unit}` : "")).join(" | ") : "-"} readOnly />
                  </div>
                  <div>
                    <Label>Validade</Label>
                    <Input value={productData.shelfLife || "-"} readOnly />
                  </div>
                  <div>
                    <Label>Fabricante</Label>
                    <Input value={productData.manufacturer || "-"} readOnly />
                  </div>
                  <div>
                    <Label>Endereço</Label>
                    <Input value={productData.address || "-"} readOnly />
                  </div>
                  <div>
                    <Label>Registro</Label>
                    <Input value={productData.registrationNumber || "-"} readOnly />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Instruções de Armazenamento</Label>
                    <Input value={productData.storageInstructions || "-"} readOnly />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Instruções de Alimentação</Label>
                    <Input value={productData.feedingDirections?.specialInstructions || "-"} readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductImport; 