"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, UserCog, Edit, Trash2 } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"

type UserPermission = "Cadastro" | "Impressao" | "Avancado" | "Ambos"

interface ApiUser {
  id: number
  login: string
  email: string
  name: string
  isActive: boolean
  isAdmin: boolean
  permission: "CADASTRO" | "IMPRESSAO" | "AVANCADO" | "AMBOS"
  canAccessOtherUnits: boolean
  isResponsibleTechnician: boolean
  unitCode: string
  createdAt: string
}

export function UsersTable() {
  const [search, setSearch] = useState("")
  const [users, setUsers] = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/users")
        if (!res.ok) throw new Error("Erro ao buscar usuarios")
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro inesperado")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const filtered = users.filter((user) => {
    const term = search.toLowerCase()
    return (
      user.name.toLowerCase().includes(term) ||
      user.login.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.unitCode.toLowerCase().includes(term)
    )
  })

  const formatPermission = (permission: ApiUser["permission"]): UserPermission => {
    switch (permission) {
      case "CADASTRO":
        return "Cadastro"
      case "IMPRESSAO":
        return "Impressao"
      case "AVANCADO":
        return "Avancado"
      case "AMBOS":
      default:
        return "Ambos"
    }
  }

  const formatUnit = (code: string) => {
    const map: Record<string, string> = {
      "89": "89 - Rio Claro 1",
      "90": "90 - Rio Claro 2",
      "85": "85 - Guararapes",
      "88": "88 - Apucarana",
      "87": "87 - Toledo",
      "83": "83 - Itaberai",
    }
    return map[code] || code
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Usuarios</h1>
        <p className="text-muted-foreground">Controle de acesso por unidade e perfil</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Usuarios</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[300px]"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <UserCog className="h-5 w-5" />
                      Cadastro de Usuarios
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Codigo</label>
                        <Input placeholder="1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Unidade Local</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar unidade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="89">89 - Rio Claro 1</SelectItem>
                            <SelectItem value="90">90 - Rio Claro 2</SelectItem>
                            <SelectItem value="85">85 - Guararapes</SelectItem>
                            <SelectItem value="88">88 - Apucarana</SelectItem>
                            <SelectItem value="87">87 - Toledo</SelectItem>
                            <SelectItem value="83">83 - Itaberai</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Nome</label>
                        <Input placeholder="ADMIN" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Login</label>
                        <Input placeholder="admin" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input placeholder="admin@nutrimix.local" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Senha</label>
                        <Input type="password" placeholder="********" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Acesso</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar permissao" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cadastro">Cadastro</SelectItem>
                            <SelectItem value="impressao">Impressao</SelectItem>
                            <SelectItem value="avancado">Avancado</SelectItem>
                            <SelectItem value="ambos">Ambos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox id="admin" />
                        <label htmlFor="admin" className="text-sm">Administrador</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="other-units" />
                        <label htmlFor="other-units" className="text-sm">Usuario pode acessar outra unidade</label>
                      </div>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Checkbox id="rt" />
                        <label htmlFor="rt" className="text-sm font-medium">Responsavel Tecnico</label>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Nome RT</label>
                        <Input placeholder="Nome do responsavel tecnico" />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancelar</Button>
                      <Button>Salvar</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-6">{error}</div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Nenhum usuario encontrado"
              description="Nao ha usuarios que correspondam aos filtros aplicados."
            />
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IdUsuario</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Login</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Permissao</TableHead>
                    <TableHead>Administrador</TableHead>
                    <TableHead>Ativo</TableHead>
                    <TableHead>RT</TableHead>
                    <TableHead className="w-[90px]">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.login}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{formatUnit(user.unitCode)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{formatPermission(user.permission)}</Badge>
                      </TableCell>
                      <TableCell>
                        {user.isAdmin ? <Badge>Sim</Badge> : <Badge variant="secondary">Nao</Badge>}
                      </TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Badge className="bg-emerald-600">Ativo</Badge>
                        ) : (
                          <Badge variant="destructive">Inativo</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.isResponsibleTechnician ? (
                          <Badge variant="default">Sim</Badge>
                        ) : (
                          <Badge variant="secondary">Nao</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
