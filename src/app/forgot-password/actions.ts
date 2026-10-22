"use server";

import { headers } from "next/headers";
import { checkRateLimit, recordFailedAttempt } from "@/lib/auth/rateLimit";
import { normalizeIdentifier } from "@/server/mockUsers";

export interface ForgotPasswordFormState {
  submitted?: boolean;
  message?: string;
  error?: string;
}

/**
 * Server action to request a password reset link.
 * 
 * SECURITY & PRIVACY CONTROLS:
 * - Always returns the identical confirmation message regardless of whether the account exists
 *   to prevent account enumeration attacks.
 * - Rate limited by IP / identifier to protect against SMS/email flood attacks.
 * 
 * PRODUCTION INTEGRATION POINT:
 * 1. Generate a cryptographically secure random token (e.g. crypto.randomBytes(32).toString('hex')).
 * 2. Hash the token and store it in the database with a 15-minute expiry and single-use flag.
 * 3. Dispatch the reset URL with the plain token via SMS (Twilio/Gupshup) or transactional email (SendGrid/Postmark).
 */
export async function requestPasswordReset(
  _prevState: ForgotPasswordFormState,
  formData: FormData
): Promise<ForgotPasswordFormState> {
  const rawIdentifier = (formData.get("identifier") as string) || "";
  const norm = normalizeIdentifier(rawIdentifier);

  if (!rawIdentifier.trim() || norm.type === "invalid") {
    return {
      error: "Enter a valid mobile number or email address",
    };
  }

  // Rate limiting check
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown-ip";
  const rateLimitKey = `forgot:${clientIp}:${norm.value}`;

  const rlCheck = checkRateLimit(rateLimitKey);
  if (!rlCheck.allowed) {
    return {
      error: "Too many attempts. Try again in 15 minutes.",
    };
  }

  // Record attempt to throttle automated requests
  recordFailedAttempt(rateLimitKey);

  // Uniform response
  return {
    submitted: true,
    message: "If this account exists, a reset link has been sent.",
  };
}
