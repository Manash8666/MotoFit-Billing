require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const clients = await prisma.apiClient.findMany();
  console.log("API Clients:", clients);
  if (clients.length === 0) {
    const newKey = await prisma.apiClient.create({
      data: {
        name: "MotoFit Main Website",
        apiKey: "motofit_ext_" + Math.random().toString(36).substring(2, 15)
      }
    });
    console.log("Created new key:", newKey);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
