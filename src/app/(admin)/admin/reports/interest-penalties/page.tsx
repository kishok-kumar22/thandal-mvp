import React from "react";
import { getInterestPenaltiesReport } from "@/lib/reports";
import { InterestPenaltiesView } from "@/components/reports/InterestPenaltiesView";

interface InterestPenaltiesPageProps {
  searchParams?: Promise<{
    from?: string;
    to?: string;
    branch?: string;
    agent?: string;
  }>;
}

export default async function InterestPenaltiesPage(props: InterestPenaltiesPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};

  const from = searchParams.from || "2026-10-21";
  const to = searchParams.to || "2026-10-22";
  const branch = searchParams.branch || "all";
  const agent = searchParams.agent || "all";

  const data = getInterestPenaltiesReport({
    from,
    to,
    branchId: branch !== "all" ? branch : undefined,
    agentId: agent !== "all" ? agent : undefined,
  });

  return (
    <InterestPenaltiesView
      data={data}
      from={from}
      to={to}
      branch={branch !== "all" ? branch : "All"}
      agent={agent !== "all" ? agent : "All"}
    />
  );
}
