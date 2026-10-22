import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/session";
import { getUserPreferences } from "@/lib/notifications";
import { getSettings } from "@/lib/settings";
import { NotificationPrefsForm } from "@/components/customer/NotificationPrefsForm";

export const metadata = {
  title: "Notification Preferences | THANDAL",
  description: "Choose which updates you see in the app.",
};

export default async function CustomerNotificationPrefsPage() {
  const user = await requireRole("customer", "/customer/profile/notifications");
  const prefs = getUserPreferences(user.id);
  const settings = getSettings();

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 md:pb-12">
      {/* Header with Arrow-Left Back Button */}
      <div className="flex items-start gap-4">
        <Link
          href="/customer/profile"
          aria-label="Back to profile"
          className="p-2 -ml-2 rounded-xl text-[#0B1B3F] hover:bg-slate-200/60 transition-colors shrink-0 mt-1 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3F] tracking-tight">
            Notification preferences
          </h1>
          <p className="text-sm font-medium text-[#64748B] mt-1">
            Choose which updates you see in the app.
          </p>
        </div>
      </div>

      <NotificationPrefsForm
        initialPrefs={prefs}
        orgSettings={settings.notifications}
      />
    </div>
  );
}
