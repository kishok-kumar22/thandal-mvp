import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPermissionMatrix } from "@/lib/permissions";
import { RolePermissionsTable } from "@/components/settings/RolePermissionsTable";
import { AuditFilters } from "@/components/audit/AuditFilters";
import { AuditTable } from "@/components/audit/AuditTable";
import { mockAuditEntriesList } from "@/data/mockAudit";
import { filterAuditEntries, getDistinctActors } from "@/lib/audit";
import { SettingsHeader } from "@/components/settings/SettingsHeader";

interface RolesPageProps {
  searchParams?: Promise<{
    user?: string;
    action?: string;
    range?: string;
    from?: string;
    to?: string;
  }>;
}

export const instant = false;

export default async function SettingsRolesPage(props: RolesPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const currentMatrix = getPermissionMatrix();

  const distinctUsers = getDistinctActors(mockAuditEntriesList);
  const filtered = filterAuditEntries(mockAuditEntriesList, searchParams);
  const previewEntries = filtered.slice(0, 5);

  // Preserve filter params on "View full audit log" link
  const queryParams = new URLSearchParams();
  if (searchParams.user) queryParams.set("user", searchParams.user);
  if (searchParams.action) queryParams.set("action", searchParams.action);
  if (searchParams.range) queryParams.set("range", searchParams.range);
  if (searchParams.from) queryParams.set("from", searchParams.from);
  if (searchParams.to) queryParams.set("to", searchParams.to);
  const fullAuditHref = `/admin/settings/audit-log${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  return (
    <div className="space-y-6">
      <SettingsHeader
        title="Settings"
        subtitle="Manage role permissions and review administrative audit events."
      />
      {/* Card 1: Role Permissions */}
      <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B1B3F]">Role permissions</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Access control for key actions in THANDAL.
          </p>
        </div>

        <RolePermissionsTable initialMatrix={currentMatrix} />
      </div>

      {/* Card 2: Audit History Preview */}
      <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B1B3F]">Audit history</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Read-only log of important actions in the system.
          </p>
        </div>

        <AuditFilters distinctUsers={distinctUsers} />

        <div className="pt-2">
          <AuditTable entries={previewEntries} />
        </div>

        {/* View Full Audit Log Footer */}
        <div className="pt-3 border-t border-[#E6ECF5] flex justify-end">
          <Link
            href={fullAuditHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6BFF] hover:text-[#1757D6] transition-colors group cursor-pointer"
          >
            <span>View full audit log</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
