import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
  neonAdapter: PrismaNeon | undefined;
};

const adapter =
  globalForPrisma.neonAdapter ||
  new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  });

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.neonAdapter = adapter;
}
