import { redirect } from "next/navigation";

interface ReportsRedirectProps {
  searchParams?: Promise<{
    type?: string;
    date?: string;
    from?: string;
    to?: string;
    branch?: string;
    agent?: string;
  }>;
}

export default async function AdminReportsRedirectPage(props: ReportsRedirectProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};

  const nextParams = new URLSearchParams();

  // Map type=collections&date=D to from=D&to=D
  if (searchParams.date) {
    nextParams.set("from", searchParams.date);
    nextParams.set("to", searchParams.date);
  } else {
    nextParams.set("from", searchParams.from || "2026-10-21");
    nextParams.set("to", searchParams.to || "2026-10-22");
  }

  if (searchParams.branch) nextParams.set("branch", searchParams.branch);
  if (searchParams.agent) nextParams.set("agent", searchParams.agent);

  redirect(`/admin/reports/collection-summary?${nextParams.toString()}`);
}
