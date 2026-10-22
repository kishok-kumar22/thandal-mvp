"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { useUnsavedChangesGuard } from "@/lib/useUnsavedChangesGuard";
import { updateMyNotificationPrefs } from "@/app/(customer)/customer/profile/actions";
import type { CustomerEventKind, UserPreferences } from "@/lib/notifications";
import type { NotificationSettings } from "@/data/mockSettings";

interface NotificationPrefsFormProps {
  initialPrefs: UserPreferences;
  orgSettings: NotificationSettings;
}

interface EventItem {
  kind: CustomerEventKind;
  label: string;
  description: string;
}

const CUSTOMER_EVENT_ITEMS: EventItem[] = [
  {
    kind: "payment_recorded",
    label: "Payment recorded",
    description: "Receive immediate confirmation whenever a payment is collected and recorded.",
  },
  {
    kind: "instalment_upcoming",
    label: "Upcoming instalment reminder",
    description: "Get notified ahead of your scheduled due date to prepare your instalment.",
  },
  {
    kind: "instalment_overdue",
    label: "Overdue reminder",
    description: "Receive alert notices if an instalment passes its due date without payment.",
  },
  {
    kind: "support_request_updated",
    label: "Support request updates",
    description: "Get notifications when an administrator replies to or resolves your request.",
  },
];

export function NotificationPrefsForm({
  initialPrefs,
  orgSettings,
}: NotificationPrefsFormProps) {
  const router = useRouter();
  const [prefs, setPrefs] = useState<Partial<Record<CustomerEventKind, boolean>>>(
    initialPrefs.notifications
  );
  const [version, setVersion] = useState(initialPrefs.version);
  const [isPending, startTransition] = useTransition();

  const isDirty = JSON.stringify(prefs) !== JSON.stringify(initialPrefs.notifications);
  const { guardModal } = useUnsavedChangesGuard(isDirty);

  const handleReset = () => {
    setPrefs(initialPrefs.notifications);
  };

  const handleToggle = (kind: CustomerEventKind, checked: boolean) => {
    setPrefs((prev) => ({
      ...prev,
      [kind]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDirty) return;

    startTransition(async () => {
      const res = await updateMyNotificationPrefs({
        prefs,
        version,
      });

      if (!res.success) {
        showToast(res.error || "Failed to update notification preferences", "error");
        if (res.version) setVersion(res.version);
        return;
      }

      if (res.version) setVersion(res.version);
      showToast("Preferences saved", "success");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {guardModal}

      <div className="bg-white rounded-2xl border border-[#E6ECF5] shadow-xs overflow-hidden divide-y divide-[#EEF2F6]">
        {CUSTOMER_EVENT_ITEMS.map((item) => {
          const isOrgEnabled = orgSettings.events[item.kind]?.inApp ?? true;
          const isUserChecked = isOrgEnabled ? (prefs[item.kind] ?? true) : false;

          return (
            <div key={item.kind} className="p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#0B1B3F]">
                  {item.label}
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                  {item.description}
                </p>
              </div>

              {/* Channels Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* In-app Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div>
                    <span className="block text-xs font-semibold text-[#0B1B3F]">In-app</span>
                    {!isOrgEnabled && (
                      <span className="block text-[11px] font-medium text-[#E5252A]">
                        Turned off by THANDAL
                      </span>
                    )}
                  </div>
                  <Toggle
                    id={`pref-toggle-${item.kind}`}
                    checked={isUserChecked}
                    disabled={!isOrgEnabled || isPending}
                    onChange={(checked) => handleToggle(item.kind, checked)}
                    aria-label={`${item.label}, in-app`}
                  />
                </div>

                {/* SMS Channel (Not connected) */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] opacity-60">
                  <div>
                    <span className="block text-xs font-semibold text-[#64748B]">SMS</span>
                    <span className="block text-[11px] text-[#94A3B8]">Not connected</span>
                  </div>
                  <Toggle checked={false} disabled={true} onChange={() => {}} />
                </div>

                {/* Email Channel (Not connected) */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] opacity-60">
                  <div>
                    <span className="block text-xs font-semibold text-[#64748B]">Email</span>
                    <span className="block text-[11px] text-[#94A3B8]">Not connected</span>
                  </div>
                  <Toggle checked={false} disabled={true} onChange={() => {}} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={!isDirty || isPending}
          onClick={handleReset}
          className="h-12 px-6 rounded-xl font-semibold cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!isDirty || isPending}
          className="h-12 px-8 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Save preferences</span>
        </Button>
      </div>
    </form>
  );
}
