import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings } from "lucide-react"

const tabs = [
  { key: "importadores", label: "Importadores" },
  { key: "registrantes", label: "Registrantes" },
  { key: "responsavel", label: "Responsavel Tecnico" },
  { key: "certificados-es", label: "Certificados Espanhol" },
  { key: "frase-origem", label: "Frase Origem Animal" },
  { key: "pesos", label: "Pesos" },
  { key: "frases", label: "Frases" },
  { key: "bobinas", label: "Bobinas" },
  { key: "emails", label: "Emails" },
]

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuracoes</h1>
        <p className="text-muted-foreground">Parametros e cadastros auxiliares do sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuracoes do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="importadores" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.key} value={tab.key} className="mt-4">
                <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground">
                  Conteudo de {tab.label} sera configurado nesta aba.
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
