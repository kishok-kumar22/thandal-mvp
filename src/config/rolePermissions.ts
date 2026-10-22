import type { Role } from "./navigation";

/**
 * NOTE: This configuration provides explanatory copy and UI helper bullets
 * (e.g. for agent creation forms). The single source of truth for runtime access control
 * and enforcement is PERMISSION_MATRIX in '@/config/permissions' and can() in '@/lib/permissions'.
 */
export const rolePermissionsConfig: Record<Role, string[]> = {
  admin: [
    "Full access to all borrower records, loans, and schedules",
    "Can create, approve, and disburse loans",
    "Can configure collection agents, branches, and routes",
    "Can waive penalties and manage financial cashbooks",
  ],
  agent: [
    "Assigned customers only",
    "Can record payments and submit handovers",
    "Cannot change loan terms or waive penalties",
  ],
  customer: [
    "Can view personal loan statements and active schedules",
    "Can view payment receipts and collection history",
    "Can contact assigned collection agent",
  ],
};
