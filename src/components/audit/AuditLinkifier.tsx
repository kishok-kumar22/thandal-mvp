import React from "react";
import Link from "next/link";
import { mockLoansList } from "@/data/mockLoans";
import { mockReceiptsList } from "@/data/mockReceipts";
import { mockHandoversList } from "@/data/mockHandovers";
import { mockCustomersList } from "@/data/mockCustomers";
import { mockAgentsList } from "@/data/mockAgents";

/**
 * Checks if an entity exists in known mock data and returns its link href,
 * or null if it's a demo record or does not exist.
 */
function getExistingEntityHref(token: string): string | null {
  if (token.startsWith("LN-")) {
    const exists = mockLoansList.some((l) => l.id === token);
    return exists ? `/admin/loans/${token}` : null;
  }
  if (token.startsWith("RC-")) {
    const exists = mockReceiptsList.some((r) => r.receiptNo === token);
    return exists ? `/admin/receipts/${token}` : null;
  }
  if (token.startsWith("H-")) {
    const exists = mockHandoversList.some((h) => h.id === token);
    return exists ? `/admin/cashbook/handovers` : null;
  }
  if (token.startsWith("C-")) {
    const exists = mockCustomersList.some((c) => c.id === token);
    return exists ? `/admin/customers/${token}` : null;
  }
  if (token.startsWith("A-")) {
    const exists = mockAgentsList.some((a) => a.id === token);
    return exists ? `/admin/agents/${token}` : null;
  }
  return null;
}

/**
 * Parses details text and turns existing entity IDs into links.
 * Non-existent records (e.g. demo loans LN-1001) remain plain text.
 */
export function AuditDetailsView({ details }: { details: string }) {
  const parts = details.split(/\b(LN-\d+|RC-\d+|H-\d+|C-\d+|A-\d+|PEN-\d+|WR-\d+)\b/g);

  return (
    <span>
      {parts.map((part, index) => {
        const href = getExistingEntityHref(part);
        if (href) {
          return (
            <Link
              key={index}
              href={href}
              className="text-[#1F6BFF] hover:underline font-semibold"
            >
              {part}
            </Link>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
