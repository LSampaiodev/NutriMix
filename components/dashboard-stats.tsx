import { Package, FileText, Printer, Users } from "lucide-react"
import { StatCard } from "./dashboard-cards"

// TODO: Buscar dados reais do back-end
const stats = {
  produtos: 0,
  rotulos: 0,
  impressoes: 0,
  usuarios: 0,
  online: 0,
}

export function DashboardStats() {
  // TODO: Buscar dados reais do back-end
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Produtos Cadastrados"
        value={stats.produtos.toString()}
        description="Total no sistema"
        icon={<Package className="h-4 w-4" />}
        trend={{ value: 0, isPositive: true }}
        status="success"
      />
      <StatCard
        title="Rótulos Gerados"
        value={stats.rotulos.toString()}
        description="Este mês"
        icon={<FileText className="h-4 w-4" />}
        trend={{ value: 0, isPositive: true }}
        status="success"
      />
      <StatCard
        title="Impressões Realizadas"
        value={stats.impressoes.toString()}
        description="Últimos 30 dias"
        icon={<Printer className="h-4 w-4" />}
        trend={{ value: 0, isPositive: true }}
        status="success"
      />
      <StatCard
        title="Usuários Ativos"
        value={stats.usuarios.toString()}
        description={`Online agora: ${stats.online}`}
        icon={<Users className="h-4 w-4" />}
        status="warning"
      />
    </div>
  )
}
