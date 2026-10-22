import React from "react";
import { getCurrentUser } from "@/lib/session";
import { can } from "@/lib/permissions";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { PageTabs } from "@/components/ui/PageTabs";

export const metadata = {
  title: "Settings - THANDAL",
  description: "Configure your business, loan defaults, collection calendar and more.",
};

export const instant = false;

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

  // NOTE: The mockup shows no tab row; we keep the tabs anyway so Roles, Notifications and Audit log stay reachable.
  const tabs = [
    { label: "General", href: "/admin/settings" },
    { label: "Collection days & holidays", href: "/admin/settings/holidays" },
    { label: "Roles", href: "/admin/settings/roles" },
    { label: "Notifications", href: "/admin/settings/notifications" },
    { label: "Audit log", href: "/admin/settings/audit-log" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 md:pb-12">
      {/* Tabs with hairline vertical dividers */}
      <div>
        <PageTabs tabs={tabs} variant="settings" />
      </div>

      {/* Tab Content (each page renders its own SettingsHeader with H1) */}
      <div>{children}</div>
    </div>
  );
}
