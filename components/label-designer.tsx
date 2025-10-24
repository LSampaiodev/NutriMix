"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Printer, Save, Eye, NotepadTextDashed, Settings, Palette, Type, ImageIcon } from "lucide-react"

export function LabelDesigner() {
  const [labelData, setLabelData] = useState({
    codigo: "",
    idRotulo: "",
    descricao: "",
    idioma: "Português",
    quantidade: 1,
    data: new Date().toISOString().split("T")[0],
    lote: "",
    peso: ""
  });
  return (
    <div className="space-y-6">
      {/* Header com ações principais */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Rotulos
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Crie e edite rótulos personalizados para seus produtos
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <NotepadTextDashed className="h-4 w-4 mr-2" />
                Selecionar Produto
              </Button>
              <div className="relative group">
                <Button size="sm" type="button">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-10 hidden group-hover:block">
                  <button className="w-full text-left px-4 py-2 hover:bg-muted/50" type="button">Ficha Técnica</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-muted/50" type="button">Croqui de Rótulo</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-muted/50" type="button">Imprimir Rótulo</button>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Painel de configurações */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações do Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    value={labelData.codigo}
                    onChange={(e) => setLabelData({ ...labelData, codigo: e.target.value })}
                    placeholder="Ex: GCP3118-T"
                  />
                </div>
                <div>
                  <Label htmlFor="idRotulo">ID Rótulo</Label>
                  <Input
                    id="idRotulo"
                    value={labelData.idRotulo}
                    onChange={(e) => setLabelData({ ...labelData, idRotulo: e.target.value })}
                    placeholder="Ex: 4529"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={labelData.descricao}
                  onChange={(e) => setLabelData({ ...labelData, descricao: e.target.value })}
                  placeholder="Descrição do produto..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="idioma">Idioma</Label>
                <Select
                  value={labelData.idioma}
                  onValueChange={(value) => setLabelData({ ...labelData, idioma: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Português">Português</SelectItem>
                    <SelectItem value="Espanhol">Espanhol</SelectItem>
                    <SelectItem value="Inglês">Inglês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Parâmetros de Impressão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    value={labelData.quantidade}
                    onChange={(e) => setLabelData({ ...labelData, quantidade: Number.parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={labelData.data}
                    onChange={(e) => setLabelData({ ...labelData, data: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lote">Lote</Label>
                  <Input
                    id="lote"
                    value={labelData.lote}
                    onChange={(e) => setLabelData({ ...labelData, lote: e.target.value })}
                    placeholder="089020250001"
                  />
                </div>
                <div>
                  <Label htmlFor="peso">Peso</Label>
                  <Input
                    id="peso"
                    value={labelData.peso}
                    onChange={(e) => setLabelData({ ...labelData, peso: e.target.value })}
                    placeholder="25kg"
                  />
                </div>
              </div>

              <div>
                <Label>Impressoras</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="usb" name="impressora" className="w-4 h-4" />
                    <Label htmlFor="usb">USB</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="impressora1" name="impressora" className="w-4 h-4" defaultChecked />
                    <Label htmlFor="impressora1">Impressora 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="impressora2" name="impressora" className="w-4 h-4" />
                    <Label htmlFor="impressora2">Impressora 2</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Área de design do rótulo */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Preview do Rótulo</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Couche</Badge>
                  <Badge variant="outline">24mm</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="design" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="dados">Dados</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  
                </TabsList>

                <TabsContent value="design" className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 min-h-[400px] bg-white">
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="mx-auto h-12 w-12 mb-4" />
                      <p className="text-lg font-medium">Área de Design do Rótulo</p>
                      <p className="text-sm">Arraste elementos aqui para criar seu rótulo</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurações
                    </Button>
                  </div>
                  <div className="relative group mt-4">
                    <Button size="sm" type="button">
                      <Printer className="h-4 w-4 mr-2" />
                      Imprimir
                    </Button>
                    <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-10 hidden group-hover:block">
                      <button className="w-full text-left px-4 py-2 hover:bg-muted/50" type="button">Ficha Técnica</button>
                      <button className="w-full text-left px-4 py-2 hover:bg-muted/50" type="button">Croqui de Rótulo</button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="dados" className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <Label>Empresa</Label>
                      <Input value="DE HEUS INDUSTRIA E COMERCIO DE NUTRICAO ANIMAL LTDA" readOnly />
                    </div>
                    <div>
                      <Label>Endereço</Label>
                      <Input value="AV BRASIL, 6624, DISTRITO INDUSTRIAL, RIO CLARO, SP, CEP: 13505-600" readOnly />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>CNPJ</Label>
                        <Input value="02.513.991/0001-31" readOnly />
                      </div>
                      <div>
                        <Label>I.E.</Label>
                        <Input value="639.125.201.16" readOnly />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  <div className="border rounded-lg p-6 bg-white min-h-[400px]">
                    <div className="text-center">
                      <div className="mb-4">
                        <img
                          src="/images/tag-company-logo.png" // TODO: Alterar para o logo da empresa
                          alt="NutriMix"
                          className="mx-auto h-16 object-contain"
                        />
                      </div>
                      <h3 className="font-bold text-lg mb-2">ROYALMIX TERRA LB</h3>
                      <p className="text-sm mb-4">Código: GCP3118-T</p>
                      <div className="text-xs space-y-1">
                        <p>Lote: 089020250001</p>
                        <p>Data: {labelData.data}</p>
                        <p>Peso: 25kg</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
