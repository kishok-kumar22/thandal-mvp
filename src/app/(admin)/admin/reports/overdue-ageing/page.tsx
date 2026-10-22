import React from "react";
import { getOverdueAgeingReport } from "@/lib/reports";
import { OverdueAgeingView } from "@/components/reports/OverdueAgeingView";

interface OverdueAgeingPageProps {
  searchParams?: Promise<{
    from?: string;
    to?: string;
    branch?: string;
    agent?: string;
  }>;
}

export default async function OverdueAgeingPage(props: OverdueAgeingPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};

  const from = searchParams.from || "2026-10-21";
  const to = searchParams.to || "2026-10-22";
  const branch = searchParams.branch || "all";
  const agent = searchParams.agent || "all";

  const { buckets, totals } = getOverdueAgeingReport(to);

  return (
    <OverdueAgeingView
      buckets={buckets}
      totals={totals}
      from={from}
      to={to}
      branch={branch !== "all" ? branch : "All"}
      agent={agent !== "all" ? agent : "All"}
    />
  );
}
