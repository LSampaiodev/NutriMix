"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"

// TODO: Buscar dados reais do back-end
const especies: any[] = []
const ingredientes: any[] = []
const principiosAtivos: any[] = []

const classificacaoFrases = [
  { id: 1, descricao: "Suplemento Mineral Proteico para Bovinos - Pronto uso" },
  { id: 2, descricao: "Suplemento Mineral Proteico para Bovinos - Pronto uso" },
  { id: 3, descricao: "Suplemento Mineral Proteico para Bovinos - Para mistura" },
  { id: 4, descricao: "Suplemento Mineral Proteico para Bovinos - Para mistura" },
]

interface RegisterFormProps {
  type: "especies" | "ingredientes" | "principios" | "classificacao"
  onSave: (data: any) => void
}

function RegisterForm({ type, onSave }: RegisterFormProps) {
  const [formData, setFormData] = useState<any>({})

  const getFormFields = () => {
    switch (type) {
      case "especies":
        return (
          <div>
            <Label htmlFor="descricao">Nome da Espécie</Label>
            <Input
              id="descricao"
              value={formData.descricao || ""}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Ex: Aves"
            />
          </div>
        )
      case "ingredientes":
        return (
          <div>
            <Label htmlFor="ingrediente">Nome do Ingrediente</Label>
            <Input
              id="ingrediente"
              value={formData.ingrediente || ""}
              onChange={(e) => setFormData({ ...formData, ingrediente: e.target.value })}
              placeholder="Ex: Extrato de Cálcio"
            />
          </div>
        )
      case "principios":
        return (
          <div>
            <Label htmlFor="principioAtivo">Princípio Ativo</Label>
            <Input
              id="principioAtivo"
              value={formData.principioAtivo || ""}
              onChange={(e) => setFormData({ ...formData, principioAtivo: e.target.value })}
              placeholder="Ex: Amoxicilina"
            />
          </div>
        )
      case "classificacao":
        return (
          <div>
            <Label htmlFor="descricao">Classificação - Frase</Label>
            <Input
              id="descricao"
              value={formData.descricao || ""}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Ex: Suplemento Mineral..."
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {getFormFields()}
      <div className="flex gap-2 pt-4">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={() => onSave(formData)}>Salvar</Button>
      </div>
    </div>
  )
}

export function AuxiliaryRegisters() {
  const [selectedTab, setSelectedTab] = useState("especies")

  const renderTable = (data: any[], columns: string[], type: string) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {type === "especies" && "Cadastro de Espécies"}
            {type === "ingredientes" && "Cadastro de Ingredientes"}
            {type === "principios" && "Cadastro de Princípios Ativos"}
            {type === "classificacao" && "Cadastro de Classificação - Frases"}
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {type === "especies" && "Nova Espécie"}
                  {type === "ingredientes" && "Novo Ingrediente"}
                  {type === "principios" && "Novo Princípio Ativo"}
                  {type === "classificacao" && "Nova Classificação"}
                </DialogTitle>
              </DialogHeader>
              <RegisterForm type={type as any} onSave={(data) => console.log(data)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      {item[column.toLowerCase().replace(" ", "")] ||
                        item[column.toLowerCase().replace(" ", "_")] ||
                        item.descricao ||
                        item.ingrediente ||
                        item.principioAtivo}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cadastros Auxiliares</CardTitle>
          <p className="text-sm text-muted-foreground">
            Gerencie os dados auxiliares utilizados no sistema de rotulagem
          </p>
        </CardHeader>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="especies">Espécies</TabsTrigger>
          <TabsTrigger value="ingredientes">Ingredientes</TabsTrigger>
          <TabsTrigger value="principios">Princípios Ativos</TabsTrigger>
          <TabsTrigger value="classificacao">Classificação</TabsTrigger>
        </TabsList>

        <TabsContent value="especies">{renderTable(especies, ["Descrição"], "especies")}</TabsContent>

        <TabsContent value="ingredientes">{renderTable(ingredientes, ["Ingrediente"], "ingredientes")}</TabsContent>

        <TabsContent value="principios">{renderTable(principiosAtivos, ["Princípio Ativo"], "principios")}</TabsContent>

        <TabsContent value="classificacao">
          {renderTable(classificacaoFrases, ["Descrição"], "classificacao")}
        </TabsContent>
      </Tabs>
    </div>
  )
}
