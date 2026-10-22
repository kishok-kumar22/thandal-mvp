import type { Role } from "./permissions";

export const SESSION_COOKIE_NAME = "thandal_session";

export type SessionRole = "admin" | "agent" | "customer";

export interface SessionUser {
  id: string;
  name: string;
  role: SessionRole;
  agentId?: string;
  customerId?: string;
  avatarInitial: string;
  caption: string;
}

export const DEMO_USERS: Record<string, SessionUser> = {
  admin: {
    id: "U-ADMIN",
    name: "Admin user",
    role: "admin",
    avatarInitial: "A",
    caption: "Administrator",
  },
  selvam: {
    id: "U-002",
    name: "Selvam",
    role: "agent",
    agentId: "A-001",
    avatarInitial: "S",
    caption: "Collection Agent (A-001)",
  },
  karthik: {
    id: "U-004",
    name: "Karthik",
    role: "agent",
    agentId: "A-002",
    avatarInitial: "K",
    caption: "Collection Agent (A-002)",
  },
  customer: {
    id: "U-003",
    name: "R. Kumar",
    role: "customer",
    customerId: "C-001",
    avatarInitial: "R",
    caption: "Customer (C-001)",
  },
};

export const ROLE_HOMES: Record<Role, string> = {
  admin: "/admin/overview",
  agent: "/agent/my-day",
  customer: "/customer/home",
};

/**
 * Validates and sanitizes a post-login redirect path.
 * 
 * Open Redirect Prevention Rules:
 * - Must start with a single "/"
 * - Must NOT start with "//" (protocol-relative URL)
 * - Must NOT contain backslashes "\"
 * - Must NOT contain control characters
 * - Must NOT contain URI scheme prefixes (e.g. "https:", "javascript:")
 * - Must match the authorized role's application section prefix (/admin, /agent, /customer)
 */
export function safeNextPath(next: string | null | undefined, role: Role): string {
  const defaultHome = ROLE_HOMES[role] || "/admin/overview";

  if (!next || typeof next !== "string") {
    return defaultHome;
  }

  const trimmed = next.trim();

  // Reject invalid or deceptive relative paths
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return defaultHome;
  }

  // Reject control characters and scheme indicators
  if (/[\u0000-\u001F\u007F]/.test(trimmed) || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return defaultHome;
  }

  // Ensure role prefix match
  const allowedPrefix = `/${role}`;
  if (!trimmed.startsWith(allowedPrefix)) {
    return defaultHome;
  }

  return trimmed;
}
