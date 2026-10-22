"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { NotificationCard } from "./NotificationCard";
import { markRead, markAllRead } from "@/lib/notifications";
import type { AppNotification } from "@/data/mockNotifications";
import type { SessionUser } from "@/config/auth";
import { Pagination } from "@/components/ui/Pagination";

interface NotificationsListProps {
  initialNotifications: AppNotification[];
  user: SessionUser;
  pageSize?: number;
  showMarkAll?: boolean;
  viewAllHref?: string;
  maxDisplay?: number;
}

export function NotificationsList({
  initialNotifications,
  user,
  pageSize = 20,
  showMarkAll = true,
  viewAllHref,
  maxDisplay,
}: NotificationsListProps) {
  const [items, setItems] = useState<AppNotification[]>(initialNotifications);
  const [currentPage, setCurrentPage] = useState(1);

  const unreadCount = items.filter((n) => !n.readAt).length;

  const handleOpen = (id: string) => {
    markRead(user, id);
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    );
  };

  const handleMarkAllRead = () => {
    markAllRead(user);
    setItems((prev) =>
      prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
    );
  };

  // Slice if maxDisplay provided (e.g. 5 on support page)
  const displayedItems = maxDisplay ? items.slice(0, maxDisplay) : items;

  // Pagination if not using maxDisplay
  const totalPages = Math.ceil(displayedItems.length / pageSize);
  const pagedItems = maxDisplay
    ? displayedItems
    : displayedItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-[#E6ECF5] text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1F6BFF] mb-4">
          <Bell className="w-8 h-8" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-[#0B1B3F]">You&apos;re all caught up</h3>
        <p className="text-sm text-[#64748B] mt-1 max-w-sm">
          New payments, instalments and reminders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header controls: Mark all as read */}
      {showMarkAll && unreadCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#64748B]">
            {unreadCount} unread
          </span>
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1F6BFF] hover:text-[#1549B8] transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-[#E8F0FE]"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        </div>
      )}

      {/* Cards vertical stack */}
      <div className="space-y-3.5">
        {pagedItems.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onOpen={handleOpen}
          />
        ))}
      </div>

      {/* View all link if items truncated */}
      {viewAllHref && items.length > (maxDisplay || 5) && (
        <div className="pt-2 text-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center text-sm font-semibold text-[#1F6BFF] hover:underline"
          >
            View all notifications ({items.length})
          </Link>
        </div>
      )}

      {/* Pagination controls for dedicated notification pages */}
      {!maxDisplay && totalPages > 1 && (
        <div className="pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
