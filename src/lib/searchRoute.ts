import type { Role } from "@/config/permissions";
import { normaliseRef } from "./format";

/**
 * Pure, unit-testable routing function for top-bar search queries based on role and query format.
 * - Trims input
 * - Returns null/empty if query is blank
 * - Caps input at 80 characters
 * - Admin:
 *     - Loan ref (e.g. "ln1052" / "LN-1052") -> /admin/loans?q=LN-1052
 *     - Receipt ref (e.g. "rc0001" / "RC-0001") -> /admin/collections/all?q=RC-0001
 *     - Customer ref (e.g. "c001" / "C-001") or general text -> /admin/customers?q=<text>
 * - Agent: -> /agent/customers?q=<text>
 * - Customer: -> /customer/receipts?q=<text>
 */
export function routeSearch(role: Role, rawInput: string | null | undefined): string | null {
  if (!rawInput) return null;
  const trimmed = rawInput.trim();
  if (!trimmed) return null;

  const capped = trimmed.slice(0, 80);
  const norm = normaliseRef(capped);

  if (role === "admin") {
    if (norm.startsWith("LN-")) {
      const params = new URLSearchParams({ q: norm });
      return `/admin/loans?${params.toString()}`;
    }
    if (norm.startsWith("RC-")) {
      const params = new URLSearchParams({ q: norm });
      return `/admin/collections/all?${params.toString()}`;
    }
    if (norm.startsWith("C-")) {
      const params = new URLSearchParams({ q: norm });
      return `/admin/customers?${params.toString()}`;
    }
    const params = new URLSearchParams({ q: capped });
    return `/admin/customers?${params.toString()}`;
  }

  if (role === "agent") {
    const params = new URLSearchParams({ q: capped });
    return `/agent/customers?${params.toString()}`;
  }

  // Customer role
  const params = new URLSearchParams({ q: capped });
  return `/customer/receipts?${params.toString()}`;
}

// ============================================================================
// PLAIN-TYPESCRIPT RUNTIME ASSERTIONS
// ============================================================================
function runAssertions() {
  console.assert(routeSearch("admin", "") === null, "Empty input should return null");
  console.assert(routeSearch("admin", "   ") === null, "Whitespace input should return null");

  // Admin loan ref matching
  console.assert(
    routeSearch("admin", "ln1052") === "/admin/loans?q=LN-1052",
    "Admin 'ln1052' should route to /admin/loans?q=LN-1052"
  );
  console.assert(
    routeSearch("admin", "LN-1052") === "/admin/loans?q=LN-1052",
    "Admin 'LN-1052' should route to /admin/loans?q=LN-1052"
  );

  // Admin receipt ref matching
  console.assert(
    routeSearch("admin", "rc0001") === "/admin/collections/all?q=RC-0001",
    "Admin 'rc0001' should route to /admin/collections/all?q=RC-0001"
  );
  console.assert(
    routeSearch("admin", "RC-0001") === "/admin/collections/all?q=RC-0001",
    "Admin 'RC-0001' should route to /admin/collections/all?q=RC-0001"
  );

  // Admin customer ref or text matching
  console.assert(
    routeSearch("admin", "c001") === "/admin/customers?q=C-001",
    "Admin 'c001' should route to /admin/customers?q=C-001"
  );
  console.assert(
    routeSearch("admin", "C-001") === "/admin/customers?q=C-001",
    "Admin 'C-001' should route to /admin/customers?q=C-001"
  );
  console.assert(
    routeSearch("admin", "Kumar") === "/admin/customers?q=Kumar",
    "Admin 'Kumar' should route to /admin/customers?q=Kumar"
  );

  // Agent role
  console.assert(
    routeSearch("agent", "Kumar") === "/agent/customers?q=Kumar",
    "Agent 'Kumar' should route to /agent/customers?q=Kumar"
  );

  // Customer role
  console.assert(
    routeSearch("customer", "rc0001") === "/customer/receipts?q=rc0001",
    "Customer 'rc0001' should route to /customer/receipts?q=rc0001"
  );
}

runAssertions();
