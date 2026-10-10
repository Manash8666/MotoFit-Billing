import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting PIN migration script...");
  
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} total users.`);
  
  let migratedCount = 0;
  
  for (const user of users) {
    const isBcrypt = user.pinHash.startsWith("$2a$") || user.pinHash.startsWith("$2b$");
    
    if (!isBcrypt) {
      console.log(`Migrating plaintext PIN for user ${user.name} (${user.id})...`);
      const hashed = await bcrypt.hash(user.pinHash, 10);
      
      await prisma.user.update({
        where: { id: user.id },
        data: { pinHash: hashed }
      });
      migratedCount++;
    }
  }
  
  console.log(`\nMigration complete! Successfully hashed ${migratedCount} plaintext PINs.`);
}

main()
  .catch(e => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
