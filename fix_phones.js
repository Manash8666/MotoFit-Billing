const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  // Delete the old Test and Akshat accounts
  await prisma.user.deleteMany({
    where: {
      id: { in: ['98e44803-f75b-4be3-a771-5a30f7aab3bc', 'f58e4b80-3eb1-4e3b-9ac7-80713665c3e1'] }
    }
  });
  
  // Get remaining users
  const users = await prisma.user.findMany();
  for (const u of users) {
    if (u.phone.startsWith('+91')) {
      const newPhone = u.phone.replace('+91', '');
      await prisma.user.update({
        where: { id: u.id },
        data: { phone: newPhone }
      });
      console.log(`Updated ${u.name} from ${u.phone} to ${newPhone}`);
    }
  }
}

fix().then(() => console.log("Done")).catch(console.error).finally(() => prisma.$disconnect());
