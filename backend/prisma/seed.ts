import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const login = "losampaio"
  const email = "losampaio@nutrimix.local"
  const password = "123MUdar456"

  const existing = await prisma.user.findUnique({ where: { login } })
  if (existing) {
    console.log("Admin já existe. Nenhuma ação necessária.")
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      login,
      email,
      passwordHash,
      name: "Admin",
      isActive: true,
      isAdmin: true,
      permission: "AMBOS",
      canAccessOtherUnits: true,
      isResponsibleTechnician: false,
      unitCode: "89"
    }
  })

  console.log("Admin criado com sucesso.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
