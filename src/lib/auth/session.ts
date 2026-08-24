import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/constants";

export { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE_SECONDS };

export type AdminSessionPayload = {
  sub: string;
  email: string;
  name: string;
};

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set to a secure value of at least 32 characters.",
    );
  }

  return new TextEncoder().encode(secret);
}

export async function createAdminSessionToken(payload: AdminSessionPayload) {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSessionSecret());
}

export async function verifyAdminSessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSessionSecret(), {
    algorithms: ["HS256"],
  });

  if (
    typeof payload.sub !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.name !== "string"
  ) {
    return null;
  }

  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
  } satisfies AdminSessionPayload;
}

export function getAdminSessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  };
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, getAdminSessionCookieOptions());
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  });
}

export async function getAdminSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifyAdminSessionToken(token);
  } catch {
    return null;
  }
}
