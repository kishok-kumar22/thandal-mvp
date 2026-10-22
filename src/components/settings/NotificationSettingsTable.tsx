"use client";

import React, { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { PageFooterBar } from "@/components/ui/PageFooterBar";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { useToast } from "@/components/ui/Toast";
import { useUnsavedChangesGuard } from "@/lib/useUnsavedChangesGuard";
import { updateSettings } from "@/app/(admin)/admin/settings/actions";
import type { NotificationSettings, NotificationKind } from "@/data/mockSettings";

interface NotificationSettingsTableProps {
  initialNotifications: NotificationSettings;
  version: number;
}

interface EventRowDef {
  kind: NotificationKind;
  name: string;
  recipient: string;
}

const EVENT_ROWS: EventRowDef[] = [
  { kind: "payment_recorded", name: "Payment recorded", recipient: "Customer" },
  { kind: "instalment_upcoming", name: "Upcoming instalment reminder", recipient: "Customer" },
  { kind: "instalment_overdue", name: "Overdue reminder", recipient: "Customer" },
  { kind: "handover_submitted", name: "Handover submitted", recipient: "Admins" },
  { kind: "handover_decided", name: "Handover decision", recipient: "Agent" },
  { kind: "waiver_requested", name: "Waiver requested", recipient: "Admins" },
  { kind: "waiver_decided", name: "Waiver decision", recipient: "Requester" },
  { kind: "support_request_received", name: "Support request received", recipient: "Admins" },
  { kind: "support_request_updated", name: "Support request updated", recipient: "Customer" },
];

export function NotificationSettingsTable({
  initialNotifications,
  version: initialVersion,
}: NotificationSettingsTableProps) {
  const { showToast } = useToast();

  const [settings, setSettings] = useState<NotificationSettings>(initialNotifications);
  const [version, setVersion] = useState(initialVersion);
  const [isPending, startTransition] = useTransition();

  const isDirty = JSON.stringify(settings) !== JSON.stringify(initialNotifications);
  const { guardModal } = useUnsavedChangesGuard(isDirty);

  const handleReset = () => {
    setSettings(initialNotifications);
  };

  const handleToggle = (kind: NotificationKind, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      events: {
        ...prev.events,
        [kind]: { inApp: checked },
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await updateSettings({
        section: "notifications",
        values: settings,
        version,
      });

      if (!res.success) {
        showToast(res.error || "Failed to update notification settings.", "error");
        if (res.settings) {
          setSettings(res.settings.notifications);
          setVersion(res.settings.versions.notifications);
        }
        return;
      }

      showToast("Notification settings saved successfully.", "success");
      if (res.settings) {
        setVersion(res.settings.versions.notifications);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {guardModal}

      {/* Card 1: Lead Days Configuration */}
      <div className="bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B3F]">
            Upcoming instalment reminder schedule
          </h2>
          <p className="text-sm text-[#64748B] mt-0.5">
            Configure how early customer notifications appear before an instalment due date.
          </p>
        </div>

        <div className="max-w-sm space-y-1.5 pt-2">
          <label
            htmlFor="reminder-lead-days"
            className="block text-sm font-semibold text-[#0B1B3F]"
          >
            Send upcoming instalment reminders
          </label>
          <select
            id="reminder-lead-days"
            value={settings.reminderLeadDays}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                reminderLeadDays: parseInt(e.target.value, 10) as 1 | 2 | 3,
              }))
            }
            className="w-full h-12 px-4 text-sm rounded-lg border border-[#D9E1EC] bg-white text-[#0B1B3F] font-medium focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] cursor-pointer"
          >
            <option value={1}>1 day before</option>
            <option value={2}>2 days before</option>
            <option value={3}>3 days before</option>
          </select>
        </div>
      </div>

      {/* Card 2: Notification Events Table */}
      <div className="bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl sm:text-[28px] font-bold text-[#0B1B3F] tracking-tight">
            Notification events
          </h2>
          <p className="text-sm text-[#64748B] mt-1">
            Control which automated notifications and alerts are generated for each system event.
          </p>
        </div>

        {/* Desktop Table View (>=768px) */}
        <div className="hidden md:block border border-[#E6ECF5] rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm" aria-label="Notification events matrix">
            <thead className="bg-[#F8FAFC] border-b border-[#E6ECF5] text-xs font-semibold text-[#64748B]">
              <tr>
                <th scope="col" className="py-3.5 px-4">
                  Event
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Who is notified
                </th>
                <th scope="col" className="py-3.5 px-4 text-center">
                  In-app
                </th>
                <th scope="col" className="py-3.5 px-4 text-center">
                  SMS
                </th>
                <th scope="col" className="py-3.5 px-4 text-center">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF5]">
              {EVENT_ROWS.map((row) => {
                const isInAppChecked = settings.events[row.kind]?.inApp ?? true;

                return (
                  <tr key={row.kind} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#0B1B3F]">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#475569] font-medium">
                      {row.recipient}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center">
                        <Toggle
                          id={`toggle-${row.kind}`}
                          checked={isInAppChecked}
                          onChange={(checked) => handleToggle(row.kind, checked)}
                          aria-label={`${row.name}, in-app`}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {/* SMS Channel: Delivery provider integration point (Gupshup / Twilio) */}
                      <div className="flex flex-col items-center">
                        <Toggle checked={false} disabled onChange={() => {}} />
                        <span className="text-[10px] text-[#94A3B8] mt-1">Not connected</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {/* Email Channel: Transactional email provider integration point (SendGrid / Postmark) */}
                      <div className="flex flex-col items-center">
                        <Toggle checked={false} disabled onChange={() => {}} />
                        <span className="text-[10px] text-[#94A3B8] mt-1">Not connected</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards (<768px) */}
        <div className="md:hidden space-y-4">
          {EVENT_ROWS.map((row) => {
            const isInAppChecked = settings.events[row.kind]?.inApp ?? true;

            return (
              <div
                key={row.kind}
                className="p-4 rounded-xl border border-[#E6ECF5] bg-slate-50 space-y-3"
              >
                <div>
                  <h3 className="text-base font-bold text-[#0B1B3F]">{row.name}</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">Recipient: {row.recipient}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                  <span className="text-xs font-semibold text-[#0B1B3F]">In-app notification</span>
                  <Toggle
                    id={`mobile-toggle-${row.kind}`}
                    checked={isInAppChecked}
                    onChange={(checked) => handleToggle(row.kind, checked)}
                    aria-label={`${row.name}, in-app`}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-[#94A3B8]">SMS</span>
                  <span className="text-[11px] text-[#94A3B8]">Not connected</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-[#94A3B8]">Email</span>
                  <span className="text-[11px] text-[#94A3B8]">Not connected</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <InfoPanel>
        In-app notifications appear instantly in the recipient bell menu and customer support center. SMS and Email gateways can be connected in production.
      </InfoPanel>

      {/* Footer bar */}
      <PageFooterBar
        left={
          isDirty ? (
            <span className="text-amber-600 font-semibold text-xs flex items-center gap-1.5">
              Unsaved changes
            </span>
          ) : null
        }
        right={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={!isDirty || isPending}
              className="h-11 px-6 rounded-lg text-sm font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!isDirty || isPending}
              className="h-11 px-6 rounded-lg text-sm font-semibold flex items-center gap-2 cursor-pointer"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save changes</span>
            </Button>
          </>
        }
      />
    </form>
  );
}
