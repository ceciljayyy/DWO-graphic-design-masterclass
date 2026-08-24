import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/prisma";
import {
  clearAdminSessionCookie,
  createAdminSessionToken,
  getAdminSessionFromCookies,
  setAdminSessionCookie,
  type AdminSessionPayload,
} from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";

export type AdminActor = AdminSessionPayload;

export async function getCurrentAdmin() {
  const session = await getAdminSessionFromCookies();

  if (!session) {
    return null;
  }

  const admin = await getPrismaClient().adminUser.findUnique({
    where: { id: session.sub },
    select: { id: true, email: true, name: true },
  });

  if (!admin) {
    return null;
  }

  return {
    sub: admin.id,
    email: admin.email,
    name: admin.name,
  } satisfies AdminActor;
}

export async function requireAdminPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}

export async function requireAdminApi() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return {
      admin: null,
      error: NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required.",
          },
        },
        { status: 401 },
      ),
    };
  }

  return { admin, error: null };
}

export async function authenticateAdmin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const admin = await getPrismaClient().adminUser.findUnique({
    where: { email: normalizedEmail },
  });

  if (!admin) {
    return null;
  }

  const valid = await verifyPassword(password, admin.passwordHash);

  if (!valid) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
  };
}

export async function createAdminSession(admin: {
  id: string;
  email: string;
  name: string;
}) {
  const token = await createAdminSessionToken({
    sub: admin.id,
    email: admin.email,
    name: admin.name,
  });

  await setAdminSessionCookie(token);
}

export async function destroyAdminSession() {
  await clearAdminSessionCookie();
}

export async function writeAdminAuditLog(input: {
  adminId?: string | null;
  action: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await getPrismaClient().adminAuditLog.create({
      data: {
        adminId: input.adminId ?? null,
        action: input.action,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      },
    });
  } catch {
    // Audit logging must not break the primary admin flow.
  }
}
