import {
  type Role,
  type PermissionValue,
  type ActionKey,
  type AdminCapability,
  type SpecialCapability,
  type PermissionMatrix,
  DEFAULT_PERMISSION_MATRIX,
} from "@/config/permissions";
import type { SessionUser } from "./session";

export class ForbiddenError extends Error {
  public readonly code = "FORBIDDEN";
  public readonly status = 403;

  constructor(message: string = "Access denied: You do not have permission to perform this action.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

// In-memory permission matrix state for mock environment
let currentMatrix: PermissionMatrix = JSON.parse(
  JSON.stringify(DEFAULT_PERMISSION_MATRIX)
);

/**
 * Returns current active permission matrix.
 */
export function getPermissionMatrix(): PermissionMatrix {
  return JSON.parse(JSON.stringify(currentMatrix));
}

/**
 * Validates permission matrix constraints:
 * 1. Admin cells cannot be changed from default
 * 2. Customer cells cannot be changed from default
 * 3. Agent cells can only be changed for record_collections and view_loans within their allowed values
 * 4. Dependency rule: an agent cannot have record_collections = assigned while view_loans = no
 */
export function validatePermissionChanges(
  proposedMatrix: PermissionMatrix
): { valid: boolean; error?: string } {
  // Check dependency rule
  const agentRecord = proposedMatrix.record_collections.agent.value;
  const agentView = proposedMatrix.view_loans.agent.value;

  if (agentRecord === "assigned" && agentView === "no") {
    return {
      valid: false,
      error: "Recording collections requires viewing assigned loans. Agent cannot have Record collections = Assigned while View loans = No.",
    };
  }

  // Check editable cells against allowed list
  for (const action of Object.keys(DEFAULT_PERMISSION_MATRIX) as ActionKey[]) {
    for (const role of ["admin", "agent", "customer"] as Role[]) {
      const defaultCell = DEFAULT_PERMISSION_MATRIX[action][role];
      const proposedCell = proposedMatrix[action][role];

      if (!defaultCell.editable && proposedCell.value !== defaultCell.value) {
        return {
          valid: false,
          error: `Cell ${action} for role ${role} is locked for security and cannot be changed.`,
        };
      }

      if (!defaultCell.allowed.includes(proposedCell.value)) {
        return {
          valid: false,
          error: `Value "${proposedCell.value}" is not permitted for ${action} (${role}).`,
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Updates the active permission matrix in memory after validation.
 */
export function setPermissionMatrix(newMatrix: PermissionMatrix): void {
  const validation = validatePermissionChanges(newMatrix);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid permission matrix");
  }
  currentMatrix = JSON.parse(JSON.stringify(newMatrix));
}

export interface ResourceScope {
  agentId?: string;
  customerId?: string;
}

/**
 * Centralized authorization check: returns boolean.
 *
 * Rules:
 * - Admin capabilities (view_reports, view_audit_log, manage_settings) are admin-only.
 * - Matrix actions check currentMatrix[action][user.role]:
 *   - "yes" -> allowed
 *   - "no" -> forbidden
 *   - "all" -> allowed
 *   - "assigned" -> allowed if resource.agentId === user.agentId (or general capability check when resource is undefined)
 *   - "own" -> allowed if resource.customerId === user.id or matches customer identity
 */
export function can(
  user: SessionUser | null | undefined,
  action: ActionKey | SpecialCapability,
  resource?: ResourceScope
): boolean {
  if (!user) return false;

  // Admin-only capabilities outside the matrix
  if (
    action === "view_reports" ||
    action === "view_audit_log" ||
    action === "manage_settings" ||
    action === "manage_support"
  ) {
    return user.role === "admin";
  }

  // Customer-only capabilities outside the matrix
  if (action === "submit_support_request") {
    return user.role === "customer";
  }

  // Admins always have full permissions
  if (user.role === "admin") {
    return true;
  }

  const cell = currentMatrix[action as ActionKey]?.[user.role];
  if (!cell) return false;

  const permValue: PermissionValue = cell.value;

  switch (permValue) {
    case "yes":
    case "all":
      return true;

    case "no":
      return false;

    case "assigned":
      if (!resource) return true; // General access check to the section
      if (!user.agentId) return false;
      return resource.agentId === user.agentId;

    case "own":
      if (!resource) return true;
      const targetCid = resource.customerId;
      return Boolean(
        targetCid &&
        (targetCid === user.id || targetCid === user.customerId || targetCid === user.name)
      );

    default:
      return false;
  }
}

/**
 * Asserts permission, throwing ForbiddenError if not allowed.
 */
export function assertCan(
  user: SessionUser | null | undefined,
  action: ActionKey | SpecialCapability,
  resource?: ResourceScope
): void {
  if (!can(user, action, resource)) {
    throw new ForbiddenError(
      `User ${user?.name || "anonymous"} does not have permission for '${action}'.`
    );
  }
}
