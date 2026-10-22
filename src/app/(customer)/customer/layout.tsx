import React from "react";
import { PortalShell } from "@/components/layout/PortalShell";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("customer", "/customer/home");

  return (
    <PortalShell role="customer" user={user}>
      {children}
    </PortalShell>
  );
}
