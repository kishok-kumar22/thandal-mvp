"use client";

import React, { useState } from "react";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { SupportRequestForm } from "./SupportRequestForm";
import { MyRequestsList } from "./MyRequestsList";
import type { AppNotification } from "@/data/mockNotifications";
import type { SupportRequest } from "@/data/mockSupport";
import type { LoanItem } from "@/data/mockLoans";
import type { SessionUser } from "@/config/auth";

interface CustomerSupportClientProps {
  initialNotifications: AppNotification[];
  initialRequests: SupportRequest[];
  customerLoans: LoanItem[];
  user: SessionUser;
}

export function CustomerSupportClient({
  initialNotifications,
  initialRequests,
  customerLoans,
  user,
}: CustomerSupportClientProps) {
  const [requests, setRequests] = useState<SupportRequest[]>(initialRequests);

  const handleRequestSubmitted = (newReq: SupportRequest) => {
    setRequests((prev) => [newReq, ...prev]);
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl sm:text-[36px] font-bold text-[#0B1B3F] tracking-tight">
          Notifications & support
        </h1>
      </div>

      {/* Main Grid: Stacked on mobile (<1024px), 2 columns on desktop (>=1024px) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Notifications Section (Directly under H1, no extra heading) */}
        <div className="space-y-4">
          <NotificationsList
            initialNotifications={initialNotifications}
            user={user}
            maxDisplay={5}
            viewAllHref="/customer/notifications"
          />
        </div>

        {/* Right Column: Contact Support Form & Your Requests */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-[36px] font-bold text-[#0B1B3F] tracking-tight mb-4">
              Contact support
            </h2>

            <SupportRequestForm
              customerLoans={customerLoans}
              onRequestSubmitted={handleRequestSubmitted}
            />
          </div>

          <MyRequestsList requests={requests} />
        </div>
      </div>
    </div>
  );
}
