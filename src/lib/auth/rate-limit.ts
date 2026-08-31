import {
  ADMIN_LOGIN_RATE_LIMIT,
  assertRateLimit,
  clearRateLimit,
} from "@/lib/rate-limit";

/**
 * Admin login throttling keyed by IP + email.
 */
export function assertLoginAllowed(key: string) {
  return assertRateLimit(key, ADMIN_LOGIN_RATE_LIMIT);
}

export function clearLoginAttempts(key: string) {
  clearRateLimit(key);
}
