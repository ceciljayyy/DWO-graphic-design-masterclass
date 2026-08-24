import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

function readArg(name) {
  const prefix = `--${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

function createAdapter(databaseUrl) {
  const url = new URL(databaseUrl);

  return new PrismaMariaDb({
    host: url.hostname === "localhost" ? "127.0.0.1" : url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    connectionLimit: 5,
    connectTimeout: 20000,
    acquireTimeout: 20000,
  });
}

async function main() {
  const email = readArg("email")?.trim().toLowerCase();
  const password = readArg("password");
  const name = readArg("name")?.trim() || "DWO Admin";

  if (!email || !password) {
    console.error(
      'Usage: npm run admin:create -- --email=admin@example.com --password=secret --name="DWO Admin"',
    );
    process.exit(1);
  }

  if (password.length < 10) {
    console.error("Password must be at least 10 characters.");
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is required in .env.local or .env");
    process.exit(1);
  }

  const adapter = createAdapter(databaseUrl);
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$queryRaw`SELECT 1`;

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await prisma.adminUser.upsert({
      where: { email },
      create: { email, name, passwordHash },
      update: { name, passwordHash },
      select: { id: true, email: true, name: true },
    });

    console.log(`Admin ready: ${admin.name} <${admin.email}>`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
