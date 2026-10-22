"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PendingHandoversTable } from "./PendingHandoversTable";
import { ReviewHandoverCard } from "./ReviewHandoverCard";
import type { Handover } from "@/data/mockHandovers";

interface PendingHandoversClientProps {
  initialHandovers: Handover[];
  initialSelectedId?: string;
}

export function PendingHandoversClient({
  initialHandovers,
  initialSelectedId,
}: PendingHandoversClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [handovers, setHandovers] = useState<Handover[]>(initialHandovers);

  // Sync state if initialHandovers change
  useEffect(() => {
    setHandovers(initialHandovers);
  }, [initialHandovers]);

  // Selected handover ID from URL or initial or default to first
  const urlHandoverId = searchParams.get("handover");
  const activeId =
    urlHandoverId || initialSelectedId || (handovers.length > 0 ? handovers[0].id : null);

  const selectedHandover =
    handovers.find((h) => h.id === activeId) || (handovers.length > 0 ? handovers[0] : null);

  const reviewPanelRef = useRef<HTMLDivElement>(null);

  const handleSelect = (handover: Handover) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("handover", handover.id);
    router.replace(`${pathname}?${params.toString()}`);

    // On mobile / tablet (<1024px), scroll review panel into view
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setTimeout(() => {
        reviewPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        const actualInput = document.getElementById("actual-received-input");
        actualInput?.focus();
      }, 100);
    }
  };

  const handleDecisionSuccess = (
    handoverId: string,
    decision: "accept" | "reject",
    actualAmount: number
  ) => {
    // Remove decided handover from pending list
    const updated = handovers.filter((h) => h.id !== handoverId);
    setHandovers(updated);

    // Auto-select next pending handover
    if (updated.length > 0) {
      const nextId = updated[0].id;
      const params = new URLSearchParams(searchParams.toString());
      params.set("handover", nextId);
      router.replace(`${pathname}?${params.toString()}`);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("handover");
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-6 items-start">
      {/* Left Card: Pending handovers table */}
      <div>
        <PendingHandoversTable
          handovers={handovers}
          selectedId={selectedHandover?.id || null}
          onSelect={handleSelect}
        />
      </div>

      {/* Right Card: Review handover panel */}
      <div ref={reviewPanelRef}>
        <ReviewHandoverCard
          handover={selectedHandover}
          onDecisionSuccess={handleDecisionSuccess}
        />
      </div>
    </div>
  );
}
