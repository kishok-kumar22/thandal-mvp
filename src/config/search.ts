import type { Role } from "./permissions";

export const SEARCH_PLACEHOLDERS: Record<Role, string> = {
  admin: "Search customers, loans or receipts...",
  agent: "Search my customers...",
  customer: "Search my loans and receipts...",
};
