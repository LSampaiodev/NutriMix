import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000/api/auth/login"

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo nao permitido" })
  }

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    })

    const text = await response.text()
    try {
      const data = JSON.parse(text)
      return res.status(response.status).json(data)
    } catch {
      return res.status(response.status).send(text)
    }
  } catch (err) {
    console.error("Proxy error /api/auth/login:", err)
    return res.status(502).json({ error: "Erro ao encaminhar para backend", detail: (err as Error).message })
  }
}
