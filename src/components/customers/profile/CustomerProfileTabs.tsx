"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CustomerProfileTabsProps {
  customerId: string;
}

export function CustomerProfileTabs({ customerId }: CustomerProfileTabsProps) {
  const pathname = usePathname();

  const tabs = [
    {
      label: "Overview",
      href: `/admin/customers/${customerId}`,
      exact: true,
    },
    {
      label: "Loans",
      href: `/admin/customers/${customerId}/loans`,
      exact: false,
    },
    {
      label: "Payments",
      href: `/admin/customers/${customerId}/payments`,
      exact: false,
    },
    {
      label: "Documents",
      href: `/admin/customers/${customerId}/documents`,
      exact: false,
    },
  ];

  return (
    <div className="border-b border-[#E6ECF5] mt-4 mb-6">
      <nav className="flex items-center gap-8 -mb-px overflow-x-auto" aria-label="Customer Profile Navigation">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.label}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`py-3 text-sm font-semibold whitespace-nowrap transition-colors relative cursor-pointer ${
                isActive
                  ? "text-[#1F6BFF]"
                  : "text-[#64748B] hover:text-[#0B1B3F]"
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F6BFF] rounded-t-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
