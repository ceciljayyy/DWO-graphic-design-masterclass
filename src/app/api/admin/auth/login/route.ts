import { NextResponse } from "next/server";

import {
  authenticateAdmin,
  createAdminSession,
  writeAdminAuditLog,
} from "@/lib/auth/admin";
import { assertLoginAllowed, clearLoginAttempts } from "@/lib/auth/rate-limit";

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => null)) as {
      email?: unknown;
      password?: unknown;
    } | null;

    const email = typeof payload?.email === "string" ? payload.email : "";
    const password = typeof payload?.password === "string" ? payload.password : "";

    if (!email.trim() || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Email and password are required.",
          },
        },
        { status: 400 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateKey = `${ip}:${email.trim().toLowerCase()}`;
    const rate = assertLoginAllowed(rateKey);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too many login attempts. Please try again shortly.",
          },
        },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        },
      );
    }

    let admin;

    try {
      admin = await authenticateAdmin(email, password);
    } catch (error) {
      console.error("[admin/login] authenticate failed", error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DATABASE_UNAVAILABLE",
            message:
              "Unable to reach the database. Confirm MySQL is running and restart the dev server.",
          },
        },
        { status: 503 },
      );
    }

    if (!admin) {
      await writeAdminAuditLog({
        action: "LOGIN_FAILED",
        metadata: { email: email.trim().toLowerCase() },
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password.",
          },
        },
        { status: 401 },
      );
    }

    clearLoginAttempts(rateKey);

    try {
      await createAdminSession(admin);
    } catch (error) {
      console.error("[admin/login] session failed", error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SESSION_CONFIG_ERROR",
            message:
              "Admin session is not configured. Set ADMIN_SESSION_SECRET (32+ chars) in .env.local and restart the dev server.",
          },
        },
        { status: 500 },
      );
    }

    await writeAdminAuditLog({
      adminId: admin.id,
      action: "LOGIN_SUCCESS",
    });

    return NextResponse.json({
      success: true,
      data: {
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("[admin/login] unexpected error", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "LOGIN_ERROR",
          message: "Unable to sign in right now. Please try again.",
        },
      },
      { status: 500 },
    );
  }
}
