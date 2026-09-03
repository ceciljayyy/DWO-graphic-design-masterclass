type AttemptState = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, AttemptState>();

export type RateLimitConfig = {
  maxAttempts: number;
  windowMs: number;
};

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

/**
 * Lightweight in-memory rate limiting for single-instance and edge middleware.
 * For multi-instance production deploys, also configure CDN/host throttling.
 */
export function assertRateLimit(
  key: string,
  { maxAttempts, windowMs }: RateLimitConfig,
): RateLimitResult {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (current.count >= maxAttempts) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  buckets.set(key, current);
  return { allowed: true };
}

export function getRequestClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    const firstHop = forwarded.split(",")[0]?.trim();
    if (firstHop) {
      return firstHop;
    }
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export const PUBLIC_API_RATE_LIMITS = {
  registrations: {
    maxAttempts: 10,
    windowMs: 15 * 60 * 1000,
  },
  paymentInitialize: {
    maxAttempts: 20,
    windowMs: 15 * 60 * 1000,
  },
  paymentVerify: {
    maxAttempts: 40,
    windowMs: 15 * 60 * 1000,
  },
  paymentManualSubmit: {
    maxAttempts: 20,
    windowMs: 15 * 60 * 1000,
  },
} as const satisfies Record<string, RateLimitConfig>;

export const ADMIN_LOGIN_RATE_LIMIT = {
  maxAttempts: 8,
  windowMs: 15 * 60 * 1000,
} as const satisfies RateLimitConfig;

export function clearRateLimit(key: string) {
  buckets.delete(key);
}
