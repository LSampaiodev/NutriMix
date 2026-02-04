import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

router.get("/", async (_req: Request, res: Response) => {
  try {
    const [totalImpressoes, totalProdutos, totalAlteracoes] = await Promise.all([
      prisma.impressaoHistorico.count(),
      prisma.produto.count(),
      prisma.xmlImportacao.count()
    ])

    return res.json({
      totalImpressoes,
      totalProdutos,
      totalAlteracoes
    })
  } catch (error) {
    console.error("Erro ao gerar relatorios:", error)
    return res.status(500).json({ error: "Erro ao buscar relatorios" })
  }
})

export default router
