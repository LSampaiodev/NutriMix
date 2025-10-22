import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000/api/products"; // Use variável de ambiente

  try {
    const response = await fetch(backendUrl, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "GET" ? undefined : JSON.stringify(req.body),
    });

    const text = await response.text();
    // tenta parsear JSON, senão envia como texto
    try {
      const data = JSON.parse(text);
      res.status(response.status).json(data);
    } catch {
      res.status(response.status).send(text);
    }
  } catch (err) {
    console.error("Proxy error /api/products:", err);
    res.status(502).json({ error: "Erro ao encaminhar para backend", detail: (err as Error).message });
  }
}
