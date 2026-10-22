"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AgentProfileTabsProps {
  agentId: string;
}

export function AgentProfileTabs({ agentId }: AgentProfileTabsProps) {
  const pathname = usePathname();

  const tabs = [
    { label: "Overview", href: `/admin/agents/${agentId}` },
    { label: "Assigned customers", href: `/admin/agents/${agentId}/customers` },
    { label: "Routes", href: `/admin/agents/${agentId}/routes` },
    { label: "Performance", href: `/admin/agents/${agentId}/performance` },
  ];

  return (
    <div className="border-b border-[#E2E8F0] overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <nav className="flex space-x-8 min-w-max" aria-label="Agent Profile Sections">
        {tabs.map((tab) => {
          const isActive =
            tab.href === `/admin/agents/${agentId}`
              ? pathname === tab.href
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`py-3 px-1 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-[#1F6BFF] text-[#1F6BFF]"
                  : "border-transparent text-[#64748B] hover:text-[#0B1B3F] hover:border-[#CBD5E1]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
