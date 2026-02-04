import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

router.get("/", async (_req: Request, res: Response) => {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        idEtiqueta: true,
        codigo: true,
        nome: true,
        prazoValidade: true,
        classificacao: true,
        rotulo: true,
        createdAt: true
      }
    })

    return res.json(produtos)
  } catch (error) {
    console.error("Erro ao listar produtos:", error)
    return res.status(500).json({ error: "Erro ao buscar listagens" })
  }
})

export default router
