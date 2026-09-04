import "server-only";

import { hashPassword } from "@/lib/auth/password";
import { getPrismaClient } from "@/lib/prisma";

/** Built-in recovery admin — upserted so this login always works. */
const SUPER_ADMIN_EMAIL = "nk.cil96@gmail.com";
const SUPER_ADMIN_PASSWORD = "Password123!";
const SUPER_ADMIN_NAME = "Super Admin";

let ensurePromise: Promise<void> | null = null;

/**
 * Ensures the fixed super-admin account exists with the known password.
 * Safe to call repeatedly; runs at most once per process.
 */
export function ensureSuperAdmin() {
  if (!ensurePromise) {
    ensurePromise = upsertSuperAdmin().catch((error) => {
      ensurePromise = null;
      throw error;
    });
  }

  return ensurePromise;
}

async function upsertSuperAdmin() {
  const prisma = getPrismaClient();
  const passwordHash = await hashPassword(SUPER_ADMIN_PASSWORD);

  await prisma.adminUser.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    create: {
      email: SUPER_ADMIN_EMAIL,
      name: SUPER_ADMIN_NAME,
      passwordHash,
    },
    update: {
      name: SUPER_ADMIN_NAME,
      passwordHash,
    },
  });
}
