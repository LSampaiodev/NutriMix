import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// POST /api/products - Adiciona produto importado
// ...existing code...
router.post("/", async (req: Request, res: Response) => {
  try {
    const produtoRecebido = req.body;
    console.log("POST /api/products payload:", JSON.stringify(produtoRecebido, null, 2));

    // Mapear campos do frontend -> campos do Prisma
    const data = {
      codigo: produtoRecebido.codigoProduto || produtoRecebido.codigo || "",
      versao: produtoRecebido.nrRevisao || produtoRecebido.versao || produtoRecebido.vFormula || "",
      nome: produtoRecebido.nomeProduto || produtoRecebido.nome || "",
      classificacao: produtoRecebido.classificacao || "", // Alterado de null para "" para consistência com o schema Prisma (String não-nula)
      formaFisica: produtoRecebido.formaFisica || "", // Alterado de null para ""
      enriquecimento: produtoRecebido.enriquecimento || "", // Alterado de null para ""
      indicacao: produtoRecebido.indicacao || "", // Alterado de null para ""
      modoUsar: produtoRecebido.modoUsar || "", // Alterado de null para ""
      conteudoLiquido: produtoRecebido.conteudoLiquido || "", // Alterado de null para ""
      prazoValidade: produtoRecebido.prazoValidade || "", // Alterado de null para ""
      modoConservacao: produtoRecebido.modoConservacao || "", // Alterado de null para ""
      restricoes: produtoRecebido.restricoes || "", // Alterado de null para ""
      // garantir que campos complexos sejam JSON válidos
      composicao: produtoRecebido.composicao || [],
      substitutivos: produtoRecebido.substitutivos || [],
      niveisGarantia: produtoRecebido.niveisGarantia || [],
    };

    const novoProduto = await prisma.produto.create({
      data
    });
    res.status(201).json(novoProduto);
  } catch (error) {
    console.error("Erro ao salvar produto:", error);
    // Em desenvolvimento, envie detalhes para facilitar o debug. Em produção, evite expor detalhes sensíveis.
    res.status(500).json({ error: "Erro ao salvar produto", detail: (error as Error).message });
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
