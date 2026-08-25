import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to connect to MySQL.");
  }

  const url = new URL(databaseUrl);

  const adapter = new PrismaMariaDb({
    host: url.hostname === "localhost" ? "127.0.0.1" : url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    connectionLimit: 10,
    connectTimeout: 10000,
    acquireTimeout: 10000,
    // Helps MySQL 8 auth when connecting from Windows/Node through Docker.
    allowPublicKeyRetrieval: true,
  });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
}

export function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}

/** Drop a broken pool so the next request can reconnect (e.g. after Docker restart). */
export async function resetPrismaClient() {
  const existing = globalForPrisma.prisma;

  if (existing) {
    try {
      await existing.$disconnect();
    } catch {
      // Ignore disconnect failures on a dead pool.
    }
  }

  globalForPrisma.prisma = undefined;
}

export function isDatabaseConnectionError(error: unknown) {
  const message =
    error instanceof Error
      ? `${error.message} ${error.name}`
      : String(error);

  const haystack = message.toLowerCase();

  return (
    haystack.includes("pool timeout") ||
    haystack.includes("econnrefused") ||
    haystack.includes("connect econnrefused") ||
    haystack.includes("can't connect") ||
    haystack.includes("cannot connect") ||
    haystack.includes("connection lost") ||
    haystack.includes("server has gone away") ||
    haystack.includes("45028") ||
    haystack.includes("p1001") ||
    haystack.includes("p1017") ||
    haystack.includes("p2039")
  );
}
