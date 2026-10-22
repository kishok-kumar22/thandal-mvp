"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BarChart3,
  PieChart,
  Layers,
  Users,
  Percent,
  FileCheck,
  type LucideIcon,
} from "lucide-react";

interface ReportNavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

const REPORT_NAV_ITEMS: ReportNavItem[] = [
  {
    id: "collection-summary",
    label: "Collection summary",
    href: "/admin/reports/collection-summary",
    icon: BarChart3,
  },
  {
    id: "loan-portfolio",
    label: "Loan portfolio",
    href: "/admin/reports/loan-portfolio",
    icon: PieChart,
  },
  {
    id: "overdue-ageing",
    label: "Overdue ageing",
    href: "/admin/reports/overdue-ageing",
    icon: Layers,
  },
  {
    id: "agent-performance",
    label: "Agent performance",
    href: "/admin/reports/agent-performance",
    icon: Users,
  },
  {
    id: "interest-penalties",
    label: "Interest & penalties",
    href: "/admin/reports/interest-penalties",
    icon: Percent,
  },
  {
    id: "cash-reconciliation",
    label: "Cash reconciliation",
    href: "/admin/reports/cash-reconciliation",
    icon: FileCheck,
  },
];

export function ReportNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const queryString = query ? `?${query}` : "";

  return (
    <div>
      {/* Desktop Vertical Nav (≥1024px) */}
      <nav
        aria-label="Report Sub Navigation"
        className="hidden lg:block bg-white rounded-xl border border-[#E6ECF5] p-2 shadow-sm space-y-1"
      >
        {REPORT_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={`${item.href}${queryString}`}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#EAF1FE] border-l-[3px] border-[#1F6BFF] text-[#1F6BFF] font-bold"
                  : "text-[#475569] hover:bg-slate-50 hover:text-[#0B1B3F]"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-[#1F6BFF]" : "text-[#64748B]"
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile & Tablet Horizontal Scrollable Pills (<1024px) */}
      <nav
        aria-label="Report Sub Navigation Mobile"
        className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none"
      >
        {REPORT_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={`${item.href}${queryString}`}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? "bg-[#1F6BFF] text-white shadow-sm"
                  : "bg-white text-[#475569] border border-[#E6ECF5] hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
