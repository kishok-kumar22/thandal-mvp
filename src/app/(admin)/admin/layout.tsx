import React from "react";
import { PortalShell } from "@/components/layout/PortalShell";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("admin", "/admin/overview");

  return (
    <PortalShell role="admin" user={user}>
      {children}
    </PortalShell>
  );
}
