"use client";

import React, { useState } from "react";
import { Coins, ClipboardCheck, Wallet } from "lucide-react";
import { formatINR } from "@/lib/format";
import { SubmitHandoverForm } from "./SubmitHandoverForm";
import { MyHandoversTable } from "./MyHandoversTable";
import type { Handover } from "@/data/mockHandovers";

interface AgentCashHandoverClientProps {
  agentId: string;
  cashCollectedToday: number;
  handedOverToday: number;
  initialAvailableCash: number;
  initialHandovers: Handover[];
}

export function AgentCashHandoverClient({
  agentId,
  cashCollectedToday,
  handedOverToday,
  initialAvailableCash,
  initialHandovers,
}: AgentCashHandoverClientProps) {
  const [handovers, setHandovers] = useState<Handover[]>(initialHandovers);
  const [availableCash, setAvailableCash] = useState<number>(initialAvailableCash);

  const handleHandoverCreated = (newHandover: Handover) => {
    setHandovers([newHandover, ...handovers]);
    // Deduct submitted amount from currently available cash
    setAvailableCash((prev) => Math.max(0, prev - newHandover.reportedAmount));
  };

  const statCards = [
    {
      label: "Cash collected (today)",
      value: formatINR(cashCollectedToday),
      icon: Coins,
      tileBg: "bg-[#E8F0FE]",
      iconColor: "text-[#1F6BFF]",
    },
    {
      label: "Handed over (accepted)",
      value: formatINR(handedOverToday),
      icon: ClipboardCheck,
      tileBg: "bg-[#E8F0FE]",
      iconColor: "text-[#1F6BFF]",
    },
    {
      label: "Cash in hand",
      value: formatINR(availableCash),
      icon: Wallet,
      tileBg: "bg-[#FFF1D6]",
      iconColor: "text-[#B45309]",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0B1B3F] tracking-tight">
          Cash handover
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Deposit physical cash collected from routes and track reconciliation status.
        </p>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-xs flex items-center gap-4.5"
            >
              <div
                className={`w-14 h-14 rounded-full ${stat.tileBg} ${stat.iconColor} flex items-center justify-center shrink-0`}
                aria-hidden="true"
              >
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-[#64748B] truncate">
                  {stat.label}
                </span>
                <span className="text-2xl sm:text-[28px] font-extrabold text-[#0B1B3F] tracking-tight tabular-nums mt-0.5 truncate">
                  {stat.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Form on Left/Top, Table on Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-6 items-start">
        <SubmitHandoverForm
          agentId={agentId}
          availableCash={availableCash}
          onHandoverCreated={handleHandoverCreated}
        />

        <MyHandoversTable handovers={handovers} />
      </div>
    </div>
  );
}
