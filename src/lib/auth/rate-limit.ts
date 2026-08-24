type AttemptState = {
  count: number;
  resetAt: number;
};

const loginAttempts = new Map<string, AttemptState>();

const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

/**
 * Lightweight in-memory login throttling.
 * Recommended production hardening: move to host/CDN rate limiting for multi-instance deploys.
 */
export function assertLoginAllowed(key: string) {
  const now = Date.now();
  const current = loginAttempts.get(key);

  if (!current || current.resetAt <= now) {
    loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true as const };
  }

  if (current.count >= MAX_ATTEMPTS) {
    return {
      allowed: false as const,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  loginAttempts.set(key, current);
  return { allowed: true as const };
}

export function clearLoginAttempts(key: string) {
  loginAttempts.delete(key);
}
