import "server-only";
import crypto from "crypto";

export type UserRole = "admin" | "agent" | "customer";
export type UserStatus = "active" | "inactive" | "pending_activation";

export interface ServerUser {
  id: string;
  role: UserRole;
  agentId?: string;
  customerId?: string;
  name: string;
  email?: string;
  mobile?: string;
  status: UserStatus;
  passwordHash: string;
  salt: string;
}

/**
 * ============================================================================
 * SECURITY NOTICE - DEVELOPMENT MOCK CREDENTIALS ONLY
 * ============================================================================
 * The DEV_PASSWORD constant is provided strictly for local development and
 * offline automated testing. In production, credentials must NEVER be stored
 * in source code, and real passwords must be set via secure activation tokens
 * and stored in an encrypted database using Argon2id or bcrypt.
 *
 * DEFAULT DEVELOPMENT PASSWORD: "Password@123"
 * ============================================================================
 */
export const DEV_PASSWORD = "Password@123";

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function createSeedUser(user: {
  id: string;
  role: UserRole;
  agentId?: string;
  customerId?: string;
  name: string;
  email?: string;
  mobile?: string;
  status: UserStatus;
}): ServerUser {
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(DEV_PASSWORD, salt);
  return {
    ...user,
    salt,
    passwordHash,
  };
}

// In-memory server user database seeded at module initialization
export const mockServerUsers: ServerUser[] = [
  createSeedUser({
    id: "U-ADMIN",
    name: "Admin user",
    email: "admin@thandal.in",
    role: "admin",
    status: "active",
  }),
  createSeedUser({
    id: "U-002",
    name: "Selvam",
    email: "agent@thandal.in",
    mobile: "9876544120",
    role: "agent",
    agentId: "A-001",
    status: "active",
  }),
  createSeedUser({
    id: "U-004",
    name: "Karthik",
    email: "karthik@thandal.in",
    mobile: "9789066681",
    role: "agent",
    agentId: "A-002",
    status: "active",
  }),
  createSeedUser({
    id: "U-003",
    name: "R. Kumar",
    mobile: "9876543210",
    role: "customer",
    customerId: "C-001",
    status: "active",
  }),
];

// Dummy salt & hash for timing attack mitigation on non-existent accounts
const DUMMY_SALT = crypto.randomBytes(16).toString("hex");
const DUMMY_HASH = hashPassword(DEV_PASSWORD, DUMMY_SALT);

/**
 * Normalises user identifier (email or 10-digit Indian mobile number).
 */
export function normalizeIdentifier(raw: string): { type: "email" | "mobile" | "invalid"; value: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { type: "invalid", value: "" };

  if (trimmed.includes("@")) {
    const emailNorm = trimmed.toLowerCase();
    // Basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailNorm)) {
      return { type: "email", value: emailNorm };
    }
    return { type: "invalid", value: trimmed };
  }

  // Treat as mobile number: strip non-digits, leading 0 or +91
  let digits = trimmed.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // Must be 10 digits starting with 6, 7, 8, or 9
  if (/^[6-9]\d{9}$/.test(digits)) {
    return { type: "mobile", value: digits };
  }

  return { type: "invalid", value: trimmed };
}

/**
 * Finds user by normalized email or mobile.
 */
export function findUserByIdentifier(identifier: string): ServerUser | undefined {
  const norm = normalizeIdentifier(identifier);
  if (norm.type === "invalid") return undefined;

  return mockServerUsers.find((u) => {
    if (norm.type === "email" && u.email) {
      return u.email.toLowerCase() === norm.value;
    }
    if (norm.type === "mobile" && u.mobile) {
      return u.mobile === norm.value;
    }
    return false;
  });
}

export function getUserById(id: string): ServerUser | undefined {
  return mockServerUsers.find((u) => u.id === id);
}

/**
 * Verifies credentials using constant-time comparisons.
 * Performs a dummy scrypt computation for unknown identifiers to prevent timing-based enumeration.
 */
export function verifyCredentials(
  identifier: string,
  password: string
): { success: boolean; user?: ServerUser; isLocked?: boolean } {
  const user = findUserByIdentifier(identifier);

  if (!user) {
    // Mitigate timing difference by executing a real scrypt hash against dummy data
    const computedDummy = hashPassword(password, DUMMY_SALT);
    crypto.timingSafeEqual(Buffer.from(computedDummy, "hex"), Buffer.from(DUMMY_HASH, "hex"));
    return { success: false };
  }

  // Compute password hash with user's salt
  const computedHash = hashPassword(password, user.salt);
  const isValid = crypto.timingSafeEqual(
    Buffer.from(computedHash, "hex"),
    Buffer.from(user.passwordHash, "hex")
  );

  if (!isValid) {
    return { success: false };
  }

  // Only active accounts can sign in
  if (user.status !== "active") {
    return { success: false };
  }

  return { success: true, user };
}
