import { redirect } from "next/navigation";

export default function CreateLoanRedirect() {
  redirect("/admin/loans/new");
}
