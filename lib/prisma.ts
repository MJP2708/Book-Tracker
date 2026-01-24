import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
  neonSql: ReturnType<typeof neon> | undefined;
};

const sql = globalForPrisma.neonSql || neon(process.env.DATABASE_URL ?? "");
const adapter = new PrismaNeon(sql);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.neonSql = sql;
}
