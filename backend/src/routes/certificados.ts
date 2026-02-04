import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

router.get("/", async (_req: Request, res: Response) => {
  try {
    const certificados = await prisma.certificado.findMany({
      orderBy: { createdAt: "desc" }
    })
    return res.json(certificados)
  } catch (error) {
    console.error("Erro ao listar certificados:", error)
    return res.status(500).json({ error: "Erro ao buscar certificados" })
  }
})

export default router
