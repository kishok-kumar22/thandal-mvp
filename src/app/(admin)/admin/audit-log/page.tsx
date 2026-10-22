import { redirect } from "next/navigation";

export default function AdminAuditLogRedirect() {
  redirect("/admin/settings/audit-log");
}
