"use client";

import React from "react";
import Link from "next/link";
import { FileText, Calendar, AlertCircle, ChevronRight, Bell } from "lucide-react";
import type { AppNotification } from "@/data/mockNotifications";

interface NotificationCardProps {
  notification: AppNotification;
  onOpen?: (id: string) => void;
}

export function NotificationCard({ notification, onOpen }: NotificationCardProps) {
  const isUnread = !notification.readAt;

  // Format date display: e.g. "2026-10-22" -> "22 Oct 2026"
  const formatDateDisplay = (isoDate: string) => {
    if (!isoDate) return "";
    const parts = isoDate.split("-");
    if (parts.length !== 3) return isoDate;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const mIdx = parseInt(parts[1], 10) - 1;
    return `${parseInt(parts[2], 10)} ${months[mIdx]} ${parts[0]}`;
  };

  const formattedDate = formatDateDisplay(notification.occursOn);

  // Variant styling based on severity
  const isWarning = notification.severity === "warning";
  const isDanger = notification.severity === "danger";

  let cardClasses = "bg-white border-[#E6ECF5] hover:border-[#1F6BFF]/40";
  let tileClasses = "bg-[#E8F0FE] text-[#1F6BFF]";
  let IconComponent = FileText;
  let severityPrefix = "";

  if (isWarning) {
    cardClasses = "bg-[#FFF5E3] border-[#F5D9A8] hover:border-[#F0C988]";
    tileClasses = "bg-[#FDE7C2] text-[#B45309]";
    IconComponent = Calendar;
    severityPrefix = "Reminder:";
  } else if (isDanger) {
    cardClasses = "bg-[#FEF2F2] border-[#FECACA] hover:border-[#FCA5A5]";
    tileClasses = "bg-[#FEE2E2] text-[#DC2626]";
    IconComponent = AlertCircle;
    severityPrefix = "Overdue:";
  }

  const handleClick = () => {
    if (onOpen) {
      onOpen(notification.id);
    }
  };

  const href = notification.href || "#";

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`group relative flex items-center justify-between min-h-[96px] p-4 sm:p-5 rounded-2xl border transition-all shadow-sm hover:shadow-md cursor-pointer ${cardClasses}`}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* 72px round icon tile */}
        <div
          className={`relative w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full flex items-center justify-center shrink-0 shadow-inner ${tileClasses}`}
        >
          <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true" />

          {/* Unread dot */}
          {isUnread && (
            <span
              className="absolute top-1 right-1 w-3 h-3 bg-[#1F6BFF] rounded-full ring-2 ring-white"
              title="Unread notification"
            >
              <span className="sr-only">Unread</span>
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {severityPrefix && (
              <span className="sr-only">{severityPrefix}</span>
            )}
            <h3 className="text-lg sm:text-[21px] font-bold text-[#0B1B3F] tracking-tight truncate">
              {notification.title}
            </h3>
          </div>

          {notification.subtitle && (
            <p className="text-sm sm:text-base text-[#64748B] font-normal truncate mt-0.5">
              {notification.subtitle}
            </p>
          )}

          {formattedDate && (
            <p className="text-xs sm:text-sm text-[#94A3B8] font-medium mt-1">
              {formattedDate}
            </p>
          )}
        </div>
      </div>

      {/* Right chevron */}
      <div className="pl-3 shrink-0">
        <ChevronRight
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#94A3B8] group-hover:text-[#0B1B3F] transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
