import React from "react";
import { requireRole } from "@/lib/session";
import { getNotifications } from "@/lib/notifications";
import { getSupportRequests } from "@/lib/mockApi";
import { getMockLoans } from "@/data/mockLoans";
import { CustomerSupportClient } from "@/components/support/CustomerSupportClient";

export const metadata = {
  title: "Notifications & Support | THANDAL",
  description: "View payment alerts, upcoming instalments, and contact support.",
};

export default async function CustomerSupportPage() {
  const user = await requireRole("customer", "/customer/support");

  const customerId = user.customerId || "C-001";
  const notifications = getNotifications(user);
  const requests = getSupportRequests({ customerId });
  const loans = getMockLoans().filter((l) => l.customerId === customerId);

  return (
    <div className="max-w-6xl mx-auto">
      <CustomerSupportClient
        initialNotifications={notifications}
        initialRequests={requests}
        customerLoans={loans}
        user={user}
      />
    </div>
  );
}
