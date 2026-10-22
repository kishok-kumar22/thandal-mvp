import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import type { UserRole } from "@/server/mockUsers";
import { SESSION_COOKIE_NAME } from "@/config/auth";
export { SESSION_COOKIE_NAME };

export interface SessionPayload {
  uid: string;
  role: UserRole;
  iat: number;
  exp: number;
}

function getSessionSecret(): string {
  const envSecret = process.env.SESSION_SECRET;
  if (envSecret && envSecret.trim().length > 0) {
    return envSecret.trim();
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "CRITICAL SECURITY CONFIGURATION ERROR: process.env.SESSION_SECRET must be set in production!"
    );
  }
  // Fall back to a per-process in-memory secret in development with warning
  const globalObj = globalThis as unknown as { __THANDAL_DEV_SECRET__?: string };
  if (!globalObj.__THANDAL_DEV_SECRET__) {
    console.warn(
      "[Auth Warning] SESSION_SECRET not set in environment. Falling back to an in-memory per-process secret for development."
    );
    globalObj.__THANDAL_DEV_SECRET__ = crypto.randomBytes(32).toString("hex");
  }
  return globalObj.__THANDAL_DEV_SECRET__;
}

/**
 * Creates an HMAC-SHA256 signed session token in the format:
 * `base64url(payload).signature`
 */
export function createSessionToken(
  data: { uid: string; role: UserRole },
  rememberMe: boolean
): string {
  const secret = getSessionSecret();
  const now = Math.floor(Date.now() / 1000);
  // If rememberMe: 30 days; else session-only token valid for 12 hours
  const ttl = rememberMe ? 30 * 24 * 60 * 60 : 12 * 60 * 60;
  const payload: SessionPayload = {
    uid: data.uid,
    role: data.role,
    iat: now,
    exp: now + ttl,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies an HMAC-SHA256 signed session token.
 * Uses timingSafeEqual to guard against timing analysis.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedPayload, providedSignature] = parts;
  if (!encodedPayload || !providedSignature) return null;

  try {
    const secret = getSessionSecret();
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(encodedPayload)
      .digest("base64url");

    const expectedBuffer = Buffer.from(expectedSignature, "utf-8");
    const providedBuffer = Buffer.from(providedSignature, "utf-8");

    if (expectedBuffer.length !== providedBuffer.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(expectedBuffer, providedBuffer)) {
      return null;
    }

    const payloadJson = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson) as SessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      // Token has expired
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Writes the thandal_session cookie onto the response.
 */
export async function setSessionCookie(token: string, rememberMe: boolean): Promise<void> {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProduction,
    // 30 days if rememberMe, otherwise session cookie (expires on browser close)
    maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined,
  });
}

/**
 * Clears the thandal_session cookie.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Reads the raw thandal_session cookie from incoming request.
 */
export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}
