import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

router.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.impressaoHistorico.findMany({
      orderBy: { dataHora: "desc" }
    })
    return res.json(rows)
  } catch (error) {
    console.error("Erro ao listar historico:", error)
    return res.status(500).json({ error: "Erro ao buscar historico" })
  }
})

export default router
