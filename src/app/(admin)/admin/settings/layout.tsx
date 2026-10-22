import React from "react";
import { getCurrentUser } from "@/lib/session";
import { can } from "@/lib/permissions";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { PageTabs } from "@/components/ui/PageTabs";

export const metadata = {
  title: "Settings - THANDAL",
  description: "Configure your business, loan defaults, collection calendar and more.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
  const currentUser = await getCurrentUser();

  // Admin access control check: can(user, "manage_settings")
  if (!can(currentUser, "manage_settings")) {
    return (
      <AccessDenied
        message="Administration Access Only"
        description="Settings and system access control are restricted to administrators."
        backHref="/admin/overview"
        backLabel="Return to Overview"
      />
    );
  }

  const tabs = [
    { label: "Business", href: "/admin/settings/business" },
    { label: "Loan defaults", href: "/admin/settings/loan-defaults" },
    { label: "Collection calendar", href: "/admin/settings/collection-calendar" },
    { label: "Roles", href: "/admin/settings/roles" },
    { label: "Notifications", href: "/admin/settings/notifications" },
    { label: "Audit log", href: "/admin/settings/audit-log" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 md:pb-12">
      {/* Settings Header */}
      <div>
        <h1 className="text-3xl sm:text-[40px] font-bold text-[#0B1B3F] tracking-tight">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-1.5 font-normal">
          Configure your business, loan defaults, collection calendar and more.
        </p>
      </div>

      {/* Tabs with hairline vertical dividers */}
      <div>
        <PageTabs tabs={tabs} variant="settings" />
      </div>

      {/* Tab Content */}
      <div>{children}</div>
    </div>
  );
}
