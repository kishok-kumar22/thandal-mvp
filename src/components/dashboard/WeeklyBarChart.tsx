import React from "react";
import { BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { DayCollection } from "@/data/mock";

interface WeeklyBarChartProps {
  data: DayCollection[];
  maxScale?: number;
}

export function WeeklyBarChart({ data, maxScale = 50000 }: WeeklyBarChartProps) {
  // Chart height in pixels for calculation
  const chartHeight = 180;

  return (
    <Card className="p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-[#1F6BFF]" />
        <h3 className="font-bold text-[#0B1B3F] text-base">Collections this week</h3>
      </div>

      {/* Chart container */}
      <div className="relative pt-6 pb-2">
        {/* Y Axis Grid lines and labels */}
        <div className="relative w-full h-[180px]">
          {/* Top Line: 50k */}
          <div className="absolute top-0 left-0 right-0 flex items-center">
            <span className="w-10 text-xs font-medium text-[#64748B] shrink-0">₹50k</span>
            <div className="flex-1 h-px bg-[#E6ECF5] border-t border-[#E6ECF5]" />
          </div>

          {/* Middle Line: 25k */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex items-center">
            <span className="w-10 text-xs font-medium text-[#64748B] shrink-0">₹25k</span>
            <div className="flex-1 h-px bg-[#E6ECF5] border-t border-[#E6ECF5]" />
          </div>

          {/* Bottom Line: 0 */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center">
            <span className="w-10 text-xs font-medium text-[#64748B] shrink-0">₹0</span>
            <div className="flex-1 h-px bg-[#E6ECF5] border-t border-[#CBD5E1]" />
          </div>

          {/* Bars container */}
          <div className="absolute inset-0 left-12 flex items-end justify-around px-2 sm:px-6">
            {data.map((item) => {
              const heightPercent = Math.min(100, Math.round((item.amount / maxScale) * 100));
              const heightPx = Math.round((heightPercent / 100) * (chartHeight - 20));

              return (
                <div key={item.day} className="flex flex-col items-center group">
                  {/* Amount label above bar */}
                  <span className="text-[12px] font-semibold text-[#0B1B3F] mb-1.5 transition-transform group-hover:-translate-y-0.5">
                    {item.displayAmount}
                  </span>

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPx}px` }}
                    className="w-11 sm:w-14 bg-[#1F6BFF] rounded-t-md hover:bg-[#1757D6] transition-all duration-300"
                    title={`${item.day}: ₹${item.amount.toLocaleString("en-IN")}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* X Axis Day Labels */}
        <div className="flex justify-around pl-12 pr-2 sm:pr-6 mt-3">
          {data.map((item) => (
            <span key={item.day} className="w-11 sm:w-14 text-center text-xs font-medium text-[#64748B]">
              {item.day}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
