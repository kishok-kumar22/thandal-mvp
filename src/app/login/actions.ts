"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  verifyCredentials,
  normalizeIdentifier,
  getUserById,
  type ServerUser,
} from "@/server/mockUsers";
import { createSessionToken, setSessionCookie, clearSessionCookie } from "@/lib/auth/session";
import { checkRateLimit, recordFailedAttempt, resetAttempts } from "@/lib/auth/rateLimit";
import { safeNextPath, ROLE_HOMES } from "@/config/auth";
import { appendAudit } from "@/lib/mockStore";
import { serverUserToSessionUser } from "@/lib/session";

export interface SignInFormState {
  error?: string;
  fieldErrors?: {
    identifier?: string;
    password?: string;
  };
  identifier?: string;
}

/**
 * Server action for user authentication.
 * 
 * SECURITY & PRIVACY CONTROLS:
 * - Constant-time credential checks via crypto.timingSafeEqual and scrypt.
 * - Uniform failure error message prevents account enumeration.
 * - Rate limiting: 5 failed attempts locks identifier/IP for 15 minutes.
 * - Rate limit failure messages are identical for known and unknown accounts.
 * - Passwords and raw input identifiers are NEVER logged or echoed in audit trails.
 * - Protected by Next.js Server Actions origin check against CSRF attacks.
 */
export async function signIn(
  _prevState: SignInFormState,
  formData: FormData
): Promise<SignInFormState> {
  const rawIdentifier = (formData.get("identifier") as string) || "";
  const password = (formData.get("password") as string) || "";
  const rememberMe = formData.get("rememberMe") === "on" || formData.get("rememberMe") === "true";
  const nextPath = (formData.get("next") as string) || "";

  // 1. Field validation
  const norm = normalizeIdentifier(rawIdentifier);
  const fieldErrors: { identifier?: string; password?: string } = {};

  if (!rawIdentifier.trim() || norm.type === "invalid") {
    fieldErrors.identifier = "Enter a valid mobile number or email";
  }

  if (!password) {
    fieldErrors.password = "Enter your password";
  } else if (password.length > 128) {
    fieldErrors.password = "Password cannot exceed 128 characters";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      identifier: rawIdentifier,
    };
  }

  // 2. Client IP extraction
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown-ip";

  const rateLimitKey = `${clientIp}:${norm.value}`;

  // 3. Rate limit check
  const rlCheck = checkRateLimit(rateLimitKey);
  if (!rlCheck.allowed) {
    return {
      error: "Too many attempts. Try again in 15 minutes.",
      identifier: rawIdentifier,
    };
  }

  // 4. Constant-time credential verification
  const verification = verifyCredentials(rawIdentifier, password);

  if (!verification.success || !verification.user) {
    const rlRecord = recordFailedAttempt(rateLimitKey);

    // If an existing registered user hit the lockout threshold, append account_locked audit
    if (rlRecord.isNowLocked) {
      const existingUser = getUserById(norm.value);
      if (existingUser) {
        appendAudit({
          action: "account_locked",
          entityType: "user",
          entityId: existingUser.id,
          details: "Account locked after repeated failed sign-ins",
          actorOverride: serverUserToSessionUser(existingUser),
        });
      }
      return {
        error: "Too many attempts. Try again in 15 minutes.",
        identifier: rawIdentifier,
      };
    }

    // Generic response prevents account enumeration
    return {
      error: "Invalid credentials. Check your details and try again.",
      identifier: rawIdentifier,
    };
  }

  const authenticatedUser = verification.user;

  // 5. Successful login: reset failed counters
  resetAttempts(rateLimitKey);

  // 6. Issue HMAC-SHA256 signed session cookie
  const sessionToken = createSessionToken(
    { uid: authenticatedUser.id, role: authenticatedUser.role },
    rememberMe
  );
  await setSessionCookie(sessionToken, rememberMe);

  // 7. Audit log (ID and role only, never credentials)
  appendAudit({
    action: "user_signed_in",
    entityType: "user",
    entityId: authenticatedUser.id,
    details: "User signed in",
    actorOverride: serverUserToSessionUser(authenticatedUser),
  });

  // 8. Open-redirect protected navigation
  const targetPath = safeNextPath(nextPath, authenticatedUser.role);
  redirect(targetPath);
}

/**
 * Server action to destroy the authenticated session.
 */
export async function signOut(): Promise<void> {
  await clearSessionCookie();
  redirect("/login?reason=signed-out");
}

/**
 * Development-only server action for DevUserSwitcher.
 * Explicitly prohibited and blocked in production environments.
 */
export async function devSwitchUser(userId: string): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("DevUserSwitcher is disabled in production.");
  }

  const user = getUserById(userId);
  if (!user) {
    throw new Error(`User ${userId} not found.`);
  }

  const token = createSessionToken({ uid: user.id, role: user.role }, true);
  await setSessionCookie(token, true);

  const home = ROLE_HOMES[user.role] || "/admin/overview";
  redirect(home);
}
