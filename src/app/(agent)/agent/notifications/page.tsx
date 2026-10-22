import React from "react";
import { requireRole } from "@/lib/session";
import { getNotifications } from "@/lib/notifications";
import { NotificationsList } from "@/components/notifications/NotificationsList";

export const metadata = {
  title: "Notifications | THANDAL Agent",
  description: "View agent collection notifications and handover decisions.",
};

export default async function AgentNotificationsPage() {
  const user = await requireRole("agent", "/agent/notifications");
  const notifications = getNotifications(user);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0B1B3F] tracking-tight">
          Notifications
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Recent collection updates, handover decisions, and approvals.
        </p>
      </div>

      <NotificationsList
        initialNotifications={notifications}
        user={user}
        pageSize={20}
      />
    </div>
  );
}
