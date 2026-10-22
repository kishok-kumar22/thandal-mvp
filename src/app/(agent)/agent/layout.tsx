import React from "react";
import { PortalShell } from "@/components/layout/PortalShell";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("agent", "/agent/my-day");

  return (
    <PortalShell role="agent" user={user}>
      {children}
    </PortalShell>
  );
}
