require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({ 
    where: { phone: '6359635416' }, 
    data: { pinHash: '$2b$10$/WzjcELTWofIFunoWHamROld6FCeDd3row7yiS0.9QnxG2WcKCrpy' } 
  });
  console.log('Samael PIN updated');
}

main().catch(console.error).finally(() => prisma.$disconnect());
