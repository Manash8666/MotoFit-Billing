const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const users = [
    { name: 'Akshat Mohanty', phone: '+91 72596 25881', role: 'SUPER_ADMIN', pinHash: '1234' },
    { name: 'Samael Morningstar', phone: '+91 63596 35416', role: 'SUPER_ADMIN', pinHash: '1234' },
    { name: 'Munna Hezbollah', phone: '+91 91232 93450', role: 'SENIOR_MECHANIC', pinHash: '1234' },
    { name: 'Kunal Chota Thakor', phone: '+91 63544 73666', role: 'SENIOR_MECHANIC', pinHash: '1234' },
  ];

  for (const u of users) {
    const phoneClean = u.phone.replace(/[^0-9+]/g, '');
    
    // check if exists
    const existing = await prisma.user.findUnique({ where: { phone: phoneClean } });
    if (!existing) {
      await prisma.user.create({
        data: {
          name: u.name,
          phone: phoneClean,
          role: u.role,
          pinHash: u.pinHash,
          isActive: true
        }
      });
      console.log(`Created ${u.name}`);
    } else {
      console.log(`${u.name} already exists. Updating...`);
      await prisma.user.update({
        where: { phone: phoneClean },
        data: { role: u.role }
      });
    }
  }
  console.log("Done");
}

seed().catch(console.error).finally(() => prisma.$disconnect());
