import React from "react";
import { requireRole } from "@/lib/session";
import { getNotifications } from "@/lib/notifications";
import { NotificationsList } from "@/components/notifications/NotificationsList";

export const metadata = {
  title: "Notifications | THANDAL",
  description: "View all personal notifications and repayment reminders.",
};

export default async function CustomerNotificationsPage() {
  const user = await requireRole("customer", "/customer/notifications");
  const notifications = getNotifications(user);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0B1B3F] tracking-tight">
          Notifications
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          All personal payment alerts and instalment reminders.
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
