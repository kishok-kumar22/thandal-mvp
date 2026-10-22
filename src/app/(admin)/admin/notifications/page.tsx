import React from "react";
import { requireRole } from "@/lib/session";
import { getNotifications } from "@/lib/notifications";
import { NotificationsList } from "@/components/notifications/NotificationsList";

export const metadata = {
  title: "Notifications | THANDAL Admin",
  description: "View administrative notifications for handovers, waivers, and support requests.",
};

export default async function AdminNotificationsPage() {
  const user = await requireRole("admin", "/admin/notifications");
  const notifications = getNotifications(user);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0B1B3F] tracking-tight">
          Notifications
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Handover submissions, waiver requests, and incoming support queries.
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
