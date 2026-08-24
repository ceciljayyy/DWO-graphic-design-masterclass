import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
