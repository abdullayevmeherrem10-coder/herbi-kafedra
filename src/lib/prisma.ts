import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["warn", "error"]
          : ["error"],
    });
  } catch {
    // Build zamanı DATABASE_URL olmadıqda xəta verməsin
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error("Verilənlər bazası bağlantısı konfiqurasiya olunmayıb");
      },
    });
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
