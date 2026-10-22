interface RateLimitRecord {
  attempts: number;
  lastAttemptAt: number;
  lockedUntil?: number;
}

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Checks if an identifier or IP is currently rate-limited.
 */
export function checkRateLimit(key: string): { allowed: boolean; retryAfterMinutes?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record) {
    return { allowed: true };
  }

  // Check lockout
  if (record.lockedUntil && now < record.lockedUntil) {
    const remainingMs = record.lockedUntil - now;
    return {
      allowed: false,
      retryAfterMinutes: Math.max(1, Math.ceil(remainingMs / (60 * 1000))),
    };
  }

  // If window expired, reset attempts
  if (now - record.lastAttemptAt > WINDOW_MS) {
    rateLimitStore.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

/**
 * Records a failed sign-in attempt and triggers lockout if max attempts exceeded.
 * Returns true if this attempt triggered a new lockout.
 */
export function recordFailedAttempt(key: string): { isNowLocked: boolean; retryAfterMinutes?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { attempts: 0, lastAttemptAt: now };

  // If previous window has passed, reset counter
  if (now - record.lastAttemptAt > WINDOW_MS) {
    record.attempts = 1;
    record.lockedUntil = undefined;
  } else {
    record.attempts += 1;
  }

  record.lastAttemptAt = now;

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    rateLimitStore.set(key, record);
    return { isNowLocked: true, retryAfterMinutes: 15 };
  }

  rateLimitStore.set(key, record);
  return { isNowLocked: false };
}

/**
 * Resets failed attempts after a successful login.
 */
export function resetAttempts(key: string): void {
  rateLimitStore.delete(key);
}
