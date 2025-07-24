import { Badge } from "@/components/ui/badge"

// TODO: Consumir logs reais do back-end
const recentLogs: any[] = []

type LogStatus = "success" | "error" | "warning"

type BadgeVariant = "default" | "destructive" | "secondary" | "outline"

function getStatusBadge(status: LogStatus) {
  const variants: Record<LogStatus, BadgeVariant> = {
    success: "default",
    error: "destructive",
    warning: "secondary",
  }

  const labels: Record<LogStatus, string> = {
    success: "Sucesso",
    error: "Erro",
    warning: "Aviso",
  }

  return <Badge variant={variants[status]}>{labels[status]}</Badge>
}

export function RecentLogs() {
  // TODO: Buscar logs reais do back-end
  return (
    <div>
      {/* Renderizar logs reais aqui */}
      {recentLogs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">Nenhum log encontrado.</div>
      )}
    </div>
  )
}
