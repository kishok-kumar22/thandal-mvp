import { redirect } from "next/navigation";

export default function LoanDefaultsSettingsRedirect() {
  redirect("/admin/settings");
}
