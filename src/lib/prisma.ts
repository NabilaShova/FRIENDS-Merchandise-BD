import { PrismaClient } from "@prisma/client";

/**
 * Prisma singleton. In dev, Next.js hot-reloads can create many clients and
 * exhaust DB connections — so we cache the instance on `globalThis`.
 *
 * `isDbConfigured()` lets the data-access layer fall back to mock data when no
 * DATABASE_URL is present (e.g. local demo without a Supabase project).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * Lazily construct the client so that importing `isDbConfigured` (e.g. in API
 * routes running in mock mode) never instantiates Prisma.
 */
export function getPrisma(): PrismaClient {
  const client =
    globalForPrisma.prisma ??
    new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["error", "warn"]
          : ["error"],
    });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}
