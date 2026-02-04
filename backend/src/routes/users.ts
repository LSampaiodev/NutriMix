import { Router, Request, Response } from "express"
import { PrismaClient, UserPermission } from "@prisma/client"
import bcrypt from "bcryptjs"

const router = Router()
const prisma = new PrismaClient()

router.get("/", async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        login: true,
        email: true,
        name: true,
        isActive: true,
        isAdmin: true,
        permission: true,
        canAccessOtherUnits: true,
        isResponsibleTechnician: true,
        unitCode: true,
        createdAt: true
      }
    })
    return res.json(users)
  } catch (error) {
    console.error("Erro ao listar usuarios:", error)
    return res.status(500).json({ error: "Erro ao buscar usuarios" })
  }
})

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      login,
      email,
      name,
      password,
      isActive = true,
      isAdmin = false,
      permission = "CADASTRO",
      canAccessOtherUnits = false,
      isResponsibleTechnician = false,
      unitCode
    } = req.body as {
      login?: string
      email?: string
      name?: string
      password?: string
      isActive?: boolean
      isAdmin?: boolean
      permission?: UserPermission
      canAccessOtherUnits?: boolean
      isResponsibleTechnician?: boolean
      unitCode?: string
    }

    if (!login || !email || !name || !password || !unitCode) {
      return res.status(400).json({ error: "Campos obrigatorios ausentes" })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        login,
        email,
        name,
        passwordHash,
        isActive,
        isAdmin,
        permission,
        canAccessOtherUnits,
        isResponsibleTechnician,
        unitCode
      },
      select: {
        id: true,
        login: true,
        email: true,
        name: true,
        isActive: true,
        isAdmin: true,
        permission: true,
        canAccessOtherUnits: true,
        isResponsibleTechnician: true,
        unitCode: true,
        createdAt: true
      }
    })

    return res.status(201).json(user)
  } catch (error) {
    console.error("Erro ao criar usuario:", error)
    return res.status(500).json({ error: "Erro ao criar usuario" })
  }
})

export default router
