import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";
import {
  assertRateLimit,
  getRequestClientIp,
  PUBLIC_API_RATE_LIMITS,
} from "@/lib/rate-limit";

async function hasValidAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (!token || !secret || secret.length < 32) {
    return false;
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}

function rateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please wait a moment and try again.",
      },
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "Cache-Control": "no-store",
      },
    },
  );
}

function enforcePublicRateLimit(
  request: NextRequest,
  scope: keyof typeof PUBLIC_API_RATE_LIMITS,
) {
  const ip = getRequestClientIp(request);
  const key = `${scope}:${ip}`;
  const result = assertRateLimit(key, PUBLIC_API_RATE_LIMITS[scope]);

  if (result.allowed === false) {
    return rateLimitResponse(result.retryAfterSeconds);
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  if (pathname === "/api/registrations" && method === "POST") {
    const limited = enforcePublicRateLimit(request, "registrations");
    if (limited) {
      return limited;
    }
  }

  if (pathname === "/api/payments/initialize" && method === "POST") {
    const limited = enforcePublicRateLimit(request, "paymentInitialize");
    if (limited) {
      return limited;
    }
  }

  if (
    pathname === "/api/payments/verify" &&
    (method === "POST" || method === "GET")
  ) {
    const limited = enforcePublicRateLimit(request, "paymentVerify");
    if (limited) {
      return limited;
    }
  }

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/auth/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin/auth/logout")) {
    return NextResponse.next();
  }

  const authenticated = await hasValidAdminSession(request);

  if (!authenticated) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required.",
          },
        },
        { status: 401 },
      );
    }

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/registrations",
    "/api/payments/initialize",
    "/api/payments/verify",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
