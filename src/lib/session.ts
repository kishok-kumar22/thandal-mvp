import "server-only";
import { redirect } from "next/navigation";
import { getSessionCookie, verifySessionToken } from "./auth/session";
import { getUserById, type ServerUser } from "@/server/mockUsers";
import { ROLE_HOMES, type SessionRole, type SessionUser, DEMO_USERS } from "@/config/auth";

export type { SessionRole, SessionUser };
export { DEMO_USERS };

export function serverUserToSessionUser(u: ServerUser): SessionUser {
  const avatarInitial = u.name.charAt(0).toUpperCase();
  let caption = "Administrator";
  if (u.role === "agent") {
    caption = `Collection Agent (${u.agentId || "A-001"})`;
  } else if (u.role === "customer") {
    caption = `Customer (${u.customerId || "C-001"})`;
  }
  return {
    id: u.id,
    name: u.name,
    role: u.role,
    agentId: u.agentId,
    customerId: u.customerId,
    avatarInitial,
    caption,
  };
}

/**
 * Reads and verifies the signed session cookie.
 * Performs constant-time signature verification, expiry check, and confirms user is active.
 * Returns null if no cookie or invalid/expired session.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const token = await getSessionCookie();
    if (!token) return null;

    const payload = verifySessionToken(token);
    if (!payload) return null;

    const user = getUserById(payload.uid);
    if (!user || user.status !== "active") return null;

    return serverUserToSessionUser(user);
  } catch (err) {
    return null;
  }
}

/**
 * Requires an authenticated user session.
 * If not authenticated, redirects to /login with next path preserved.
 */
export async function requireUser(pathname?: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    const nextParam = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
    redirect(`/login${nextParam}`);
  }
  return user;
}

/**
 * Requires a specific authenticated role.
 * If unauthenticated -> redirects to /login.
 * If authenticated but with the wrong role -> redirects to the user's authorized role home.
 */
export async function requireRole(role: SessionRole, pathname?: string): Promise<SessionUser> {
  const user = await requireUser(pathname);
  if (user.role !== role) {
    const home = ROLE_HOMES[user.role] || "/login";
    redirect(home);
  }
  return user;
}
