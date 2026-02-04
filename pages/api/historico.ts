import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000/api/historico"

  try {
    const response = await fetch(backendUrl, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "GET" ? undefined : JSON.stringify(req.body),
    })

    const text = await response.text()
    try {
      const data = JSON.parse(text)
      return res.status(response.status).json(data)
    } catch {
      return res.status(response.status).send(text)
    }
  } catch (err) {
    console.error("Proxy error /api/historico:", err)
    return res.status(502).json({ error: "Erro ao encaminhar para backend", detail: (err as Error).message })
  }
}
