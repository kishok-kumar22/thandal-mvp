"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileNavConfig } from "@/config/mobileNav";
import type { Role } from "@/config/navigation";

interface MobileBottomNavProps {
  role?: Role;
  onOpenMore: () => void;
}

export function MobileBottomNav({ role = "admin", onOpenMore }: MobileBottomNavProps) {
  const pathname = usePathname();
  const items = mobileNavConfig[role] || mobileNavConfig.admin;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E6ECF5] h-16 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] select-none shadow-[0_-2px_10px_rgba(11,27,63,0.04)]"
    >
      {items.map((item) => {
        const Icon = item.icon;

        if (item.isAction) {
          return (
            <button
              key={item.id}
              type="button"
              onClick={onOpenMore}
              aria-label="Open full menu"
              className="flex flex-col items-center justify-center w-16 py-1 text-[#64748B] hover:text-[#0B1B3F] transition-colors cursor-pointer"
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] font-medium tracking-tight">{item.label}</span>
              <div className="w-8 h-1 bg-transparent rounded-full mt-0.5" aria-hidden="true" />
            </button>
          );
        }

        const isActive =
          pathname === item.href ||
          (item.href !== "/admin/overview" &&
            item.href !== "/agent/my-day" &&
            item.href &&
            pathname?.startsWith(item.href));

        return (
          <Link
            key={item.id}
            href={item.href || "#"}
            aria-current={isActive ? "page" : undefined}
            aria-label={item.label}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-all relative ${
              isActive ? "text-[#1F6BFF]" : "text-[#64748B] hover:text-[#0B1B3F]"
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span
              className={`text-[11px] tracking-tight ${
                isActive ? "font-semibold text-[#1F6BFF]" : "font-medium"
              }`}
            >
              {item.label}
            </span>

            {/* Blue underline indicator for active item */}
            <div
              className={`w-8 h-1 rounded-full mt-0.5 transition-all ${
                isActive ? "bg-[#1F6BFF]" : "bg-transparent"
              }`}
              aria-hidden="true"
            />
          </Link>
        );
      })}
    </nav>
  );
}
