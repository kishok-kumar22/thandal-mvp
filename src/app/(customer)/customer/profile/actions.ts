"use server";

import crypto from "crypto";
import { requireUser } from "@/lib/session";
import { can } from "@/lib/permissions";
import { getUserById, hashPassword, updateUserPassword } from "@/server/mockUsers";
import { checkRateLimit, recordFailedAttempt, resetAttempts } from "@/lib/auth/rateLimit";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { appendAudit } from "@/lib/mockStore";
import {
  type CustomerEventKind,
  CUSTOMER_EVENTS,
  updateUserPreferences,
  getUserPreferences,
} from "@/lib/notifications";

/**
 * Role-agnostic password change action.
 * Can serve customer, agent, and administrator accounts alike.
 */
export async function changePassword(formData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ success: boolean; error?: string }> {
  const user = await requireUser();

  if (!can(user, "change_own_password")) {
    return { success: false, error: "Unauthorized to change password." };
  }

  // 1. Rate limiting: 5 failed attempts per 15 minutes per user ID
  const rateLimitKey = `change_pw:${user.id}`;
  const rlCheck = checkRateLimit(rateLimitKey);
  if (!rlCheck.allowed) {
    return { success: false, error: "Too many attempts. Try again in 15 minutes." };
  }

  const serverUser = getUserById(user.id);
  if (!serverUser) {
    return { success: false, error: "User record not found." };
  }

  // 2. Verify current password with scrypt + timingSafeEqual
  const computedCurrentHash = hashPassword(formData.currentPassword, serverUser.salt);
  let isCurrentValid = false;
  try {
    isCurrentValid = crypto.timingSafeEqual(
      Buffer.from(computedCurrentHash, "hex"),
      Buffer.from(serverUser.passwordHash, "hex")
    );
  } catch {
    isCurrentValid = false;
  }

  if (!isCurrentValid) {
    recordFailedAttempt(rateLimitKey);
    return { success: false, error: "Current password is incorrect." };
  }

  // 3. Server-side validation of new password
  const newPw = formData.newPassword;
  if (!newPw || newPw.length < 8 || newPw.length > 128) {
    return { success: false, error: "New password must be between 8 and 128 characters." };
  }

  if (newPw === formData.currentPassword) {
    return { success: false, error: "New password must be different from the current password." };
  }

  if (newPw !== formData.confirmPassword) {
    return { success: false, error: "Password confirmation does not match." };
  }

  // Check that password does not contain customer's mobile number
  if (serverUser.mobile) {
    const mobileDigits = serverUser.mobile.replace(/\D/g, "");
    if (mobileDigits.length >= 6 && newPw.includes(mobileDigits)) {
      return { success: false, error: "Password must not contain your mobile number." };
    }
  }

  // 4. Success: reset rate limiter
  resetAttempts(rateLimitKey);

  // 5. Generate fresh cryptographically secure salt & hash (In production: persist to PostgreSQL via Argon2id)
  const newSalt = crypto.randomBytes(16).toString("hex");
  const newPasswordHash = hashPassword(newPw, newSalt);
  const updateRes = updateUserPassword(user.id, newPasswordHash, newSalt);

  if (!updateRes.success) {
    return { success: false, error: "Failed to update password." };
  }

  // 6. Reissue session cookie with fresh iat (timestamp) so current device stays authenticated
  // while any other sessions issued prior to passwordChangedAt are automatically rejected by getCurrentUser()
  const freshSessionToken = createSessionToken(
    { uid: serverUser.id, role: serverUser.role },
    true
  );
  await setSessionCookie(freshSessionToken, true);

  // 7. Append audit log (ID and actor only, NEVER log or echo passwords)
  const auditTargetId = serverUser.customerId || serverUser.agentId || serverUser.id;
  appendAudit({
    action: "password_changed",
    entityType: "user",
    entityId: serverUser.id,
    details: `Password changed for ${auditTargetId}`,
    actorOverride: user,
  });

  return { success: true };
}

/**
 * Updates customer's in-app notification preferences.
 */
export async function updateMyNotificationPrefs(params: {
  prefs: Partial<Record<CustomerEventKind, boolean>>;
  version: number;
}): Promise<{ success: boolean; version?: number; error?: string }> {
  const user = await requireUser();

  if (!can(user, "update_own_preferences")) {
    return { success: false, error: "Unauthorized to update preferences." };
  }

  // Validate all keys against CUSTOMER_EVENTS enum
  for (const key of Object.keys(params.prefs)) {
    if (!CUSTOMER_EVENTS.includes(key as CustomerEventKind)) {
      return { success: false, error: `Invalid notification preference key: ${key}` };
    }
  }

  const result = updateUserPreferences(user.id, params.prefs, params.version);
  if (!result.success) {
    return { success: false, error: result.error, version: result.preferences?.version };
  }

  return { success: true, version: result.preferences?.version };
}
