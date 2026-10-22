"use client";

import React from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import type { Role } from "@/config/navigation";

interface NotificationBellProps {
  role: Role;
  unreadCount?: number;
  isNavy?: boolean;
}

export function NotificationBell({ role, unreadCount = 0, isNavy = false }: NotificationBellProps) {
  const href =
    role === "customer"
      ? "/customer/notifications"
      : role === "agent"
      ? "/agent/notifications"
      : "/admin/notifications";

  const ariaLabel =
    unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications";

  const badgeText = unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`relative p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
        isNavy
          ? "text-[#C5D2E8] hover:text-white hover:bg-white/10"
          : "text-[#64748B] hover:text-[#0B1B3F] hover:bg-slate-100"
      }`}
    >
      <Bell className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />

      {unreadCount > 0 && (
        <>
          {/* Mobile indicator: red dot (<768px) */}
          <span
            className="md:hidden absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#E5252A] rounded-full ring-2 ring-white"
            aria-hidden="true"
          />

          {/* Tablet/Desktop badge: count pill (>=768px) */}
          <span
            className="hidden md:inline-flex absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#E5252A] text-white text-[10px] font-bold items-center justify-center rounded-full ring-2 ring-white"
            aria-hidden="true"
          >
            {badgeText}
          </span>
        </>
      )}
    </Link>
  );
}
