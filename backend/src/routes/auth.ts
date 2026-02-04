import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const router = Router()
const prisma = new PrismaClient()

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body as { login?: string; password?: string }

    if (!login || !password) {
      return res.status(400).json({ error: "Login e senha são obrigatórios" })
    }

    const user = await prisma.user.findUnique({ where: { login } })
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" })
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Usuário inativo" })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ error: "Credenciais inválidas" })
    }

    return res.json({
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        permission: user.permission,
        canAccessOtherUnits: user.canAccessOtherUnits,
        isResponsibleTechnician: user.isResponsibleTechnician,
        unitCode: user.unitCode,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error("Erro no login:", error)
    return res.status(500).json({ error: "Erro interno no login" })
  }
})

export default router
