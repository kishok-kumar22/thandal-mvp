"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { NavItem } from "@/config/navigation";

interface SidebarItemProps {
  item: NavItem;
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function SidebarItem({ item, collapsed = false, onNavigate }: SidebarItemProps) {
  const pathname = usePathname();
  const Icon = item.icon;

  const hasChildren = Boolean(item.children && item.children.length > 0);

  // Check if this item is exactly active or matches subroutes
  const isDirectActive =
    pathname === item.href ||
    (item.href === "/admin/customers" && pathname.startsWith("/admin/customers")) ||
    (item.href === "/admin/loans" && pathname.startsWith("/admin/loans")) ||
    (item.href === "/admin/agents" && pathname.startsWith("/admin/agents")) ||
    (item.href === "/admin/cashbook" && pathname.startsWith("/admin/cashbook")) ||
    (item.href === "/admin/collections" &&
      (pathname.startsWith("/admin/collections") || pathname.startsWith("/admin/receipts"))) ||
    (item.href === "/admin/penalties" && pathname.startsWith("/admin/penalties")) ||
    (item.href === "/admin/repayment-schedules" && pathname.startsWith("/admin/repayment-schedules")) ||
    (item.href === "/agent/customers" &&
      (pathname.startsWith("/agent/customers") || pathname.startsWith("/agent/collect") || pathname.startsWith("/agent/receipts"))) ||
    (item.href === "/admin/settings" && pathname.startsWith("/admin/settings")) ||
    (item.href === "/admin/reports" && pathname.startsWith("/admin/reports")) ||
    ((item.href === "/agent/cash-handover" || item.href === "/agent/handover") &&
      (pathname.startsWith("/agent/cash-handover") || pathname.startsWith("/agent/handover")));

  // Check if any child is active
  const isChildActive = Boolean(
    hasChildren &&
      (item.children?.some(
        (child) =>
          pathname === child.href ||
          (child.href === "/admin/customers" && pathname.startsWith("/admin/customers"))
      ) ||
        (item.href === "/admin/customers" && pathname.startsWith("/admin/customers")))
  );

  // Expand if any child is active, or user expanded
  const [isOpen, setIsOpen] = useState<boolean>(isChildActive || isDirectActive);

  // If collapsed rail, don't show children accordion inline
  if (collapsed) {
    const isAnyActive = isDirectActive || isChildActive;
    return (
      <div className="relative group my-0.5">
        <Link
          href={item.href}
          onClick={onNavigate}
          aria-current={isAnyActive ? "page" : undefined}
          title={item.label}
          className={`w-11 h-11 mx-auto flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
            isAnyActive
              ? "bg-[#1F6BFF] text-white shadow-sm"
              : "text-[#C7D2E8] hover:bg-[#13264F] hover:text-white"
          }`}
        >
          <Icon className="w-5 h-5 shrink-0" />
        </Link>
        {/* Floating tooltip for rail */}
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 hidden group-hover:flex items-center px-2.5 py-1 text-xs font-medium text-white bg-[#0B1B3F] border border-[#13264F] rounded-md shadow-lg whitespace-nowrap pointer-events-none">
          {item.label}
        </div>
      </div>
    );
  }

  // Not collapsed: full sidebar item
  if (hasChildren) {
    return (
      <div className="my-0.5">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            isDirectActive && !isChildActive
              ? "bg-[#1F6BFF] text-white"
              : "text-[#C7D2E8] hover:bg-[#13264F] hover:text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-4.5 h-4.5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-[#8C9BB7]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#8C9BB7]" />
          )}
        </button>

        {/* Sub-items accordion with vertical guide line and dot */}
        {isOpen && (
          <div className="relative ml-5 pl-3 border-l border-[#1B2F5B] mt-1 space-y-1">
            {item.children?.map((child) => {
              const isSubActive = pathname === child.href;
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onNavigate}
                  aria-current={isSubActive ? "page" : undefined}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isSubActive
                      ? "bg-[#1F6BFF] text-white shadow-sm"
                      : "text-[#C7D2E8] hover:bg-[#13264F] hover:text-white"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isSubActive ? "bg-white" : "bg-[#8C9BB7]"
                    }`}
                  />
                  <span className="truncate">{child.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Standard non-expandable item
  return (
    <div className="my-0.5">
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={isDirectActive ? "page" : undefined}
        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          isDirectActive
            ? "bg-[#1F6BFF] text-white shadow-sm"
            : "text-[#C7D2E8] hover:bg-[#13264F] hover:text-white"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon className="w-4.5 h-4.5 shrink-0" />
          <span className="truncate">{item.label}</span>
        </div>
        {item.opensSubroute && (
          <ChevronRight className="w-4 h-4 text-[#8C9BB7] shrink-0" />
        )}
      </Link>
    </div>
  );
}
