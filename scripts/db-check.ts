import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.$queryRaw`SELECT 1`;
  const users = await prisma.user.count();
  console.log(`Database connection OK (User rows: ${users})`);
}

main()
  .catch((err) => {
    console.error("Database connection failed:", err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
