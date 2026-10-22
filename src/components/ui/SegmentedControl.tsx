"use client";

import React, { useRef, type KeyboardEvent } from "react";

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string = string> {
  options: (SegmentOption<T> | T)[];
  value: T;
  onChange: (value: T) => void;
  name?: string;
  className?: string;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  name = "segmented-control",
  className = "",
}: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedOptions: SegmentOption<T>[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex = currentIndex;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % normalizedOptions.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + normalizedOptions.length) % normalizedOptions.length;
    }

    if (nextIndex !== currentIndex) {
      const targetOption = normalizedOptions[nextIndex];
      onChange(targetOption.value);
      // focus next button
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>("button");
      buttons?.[nextIndex]?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label={name}
      className={`grid grid-flow-col auto-cols-fr p-1 bg-[#EEF2F7] rounded-xl gap-1 border border-[#E2E8F0] ${className}`}
    >
      {normalizedOptions.map((opt, index) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`h-9 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center justify-center select-none cursor-pointer ${
              isSelected
                ? "bg-[#1F6BFF] text-white shadow-sm"
                : "text-[#64748B] hover:text-[#0B1B3F] hover:bg-white/60"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
