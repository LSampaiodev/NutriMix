import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Printer, Settings, Play, Pause, RotateCcw } from "lucide-react"

export default function ImpressaoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Central de Impressão</h1>
        <p className="text-muted-foreground">Gerencie impressoras e filas de impressão</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Impressora 1</CardTitle>
              <Badge variant="default">Online</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              <span className="text-sm">Zebra ZT230</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Fila: 12 trabalhos</p>
              <p>Status: Imprimindo</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Pause className="h-4 w-4 mr-1" />
                Pausar
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4 mr-1" />
                Config
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Impressora 2</CardTitle>
              <Badge variant="destructive">Offline</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              <span className="text-sm">Zebra ZT410</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Fila: 0 trabalhos</p>
              <p>Status: Desconectada</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <RotateCcw className="h-4 w-4 mr-1" />
                Reconectar
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4 mr-1" />
                Config
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">USB</CardTitle>
              <Badge variant="secondary">Standby</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              <span className="text-sm">Impressora USB</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Fila: 0 trabalhos</p>
              <p>Status: Aguardando</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Play className="h-4 w-4 mr-1" />
                Ativar
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4 mr-1" />
                Config
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
