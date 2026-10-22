import { redirect } from "next/navigation";

export default function CollectionCalendarRedirect() {
  redirect("/admin/settings/holidays");
}
