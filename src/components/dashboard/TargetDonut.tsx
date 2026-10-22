import React from "react";
import { Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatINR } from "@/lib/format";

interface TargetDonutProps {
  collected: number;
  target: number;
}

export function TargetDonut({ collected, target }: TargetDonutProps) {
  const percentage = target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0;
  const remaining = Math.max(0, target - collected);

  // SVG Donut geometry
  const size = 150;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-[#1F6BFF]" />
        <h3 className="font-bold text-[#0B1B3F] text-base">Today&apos;s collection target</h3>
      </div>

      {/* Donut and metrics row */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-around gap-6 py-2 my-auto">
        {/* SVG Donut */}
        <div className="relative w-[150px] h-[150px] shrink-0 flex items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90"
            aria-label={`Collection target progress: ${percentage}%`}
          >
            {/* Background Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#1F6BFF"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-[#0B1B3F] tracking-tight">{percentage}%</span>
          </div>
        </div>

        {/* Right Info */}
        <div className="flex flex-col justify-center text-center sm:text-left">
          <div className="flex items-baseline justify-center sm:justify-start gap-1.5 flex-wrap">
            <span className="text-2xl sm:text-[28px] font-bold text-[#0B1B3F] tracking-tight">
              {formatINR(collected)}
            </span>
            <span className="text-base font-medium text-[#64748B]">/ {formatINR(target)}</span>
          </div>

          <div className="mt-3">
            <span className="text-xs font-medium text-[#64748B] block">Remaining</span>
            <span className="text-xl sm:text-2xl font-bold text-[#E5252A] tracking-tight block mt-0.5">
              {formatINR(remaining)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
