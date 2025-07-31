import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// POST /api/products - Adiciona produto importado
router.post("/", async (req: Request, res: Response) => {
  try {
    const produto = req.body;
    const novoProduto = await prisma.produto.create({
      data: produto
    });
    res.status(201).json(novoProduto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar produto" });
  }
});

// GET /api/products - Lista produtos
router.get("/", async (req: Request, res: Response) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});
export default router;
