"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface StepConfig {
  number: number;
  label: string;
  href: string;
}

const STEPS: StepConfig[] = [
  { number: 1, label: "Loan terms", href: "/admin/loans/new" },
  { number: 2, label: "Review schedule", href: "/admin/loans/new/schedule" },
  { number: 3, label: "Disbursement", href: "/admin/loans/new/disburse" },
];

export function WizardHeader() {
  const pathname = usePathname();

  let activeStep = 1;
  if (pathname.includes("/schedule")) {
    activeStep = 2;
  } else if (pathname.includes("/disburse")) {
    activeStep = 3;
  }

  const currentStepConfig = STEPS.find((s) => s.number === activeStep) || STEPS[0];

  return (
    <div className="mb-8 space-y-6">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-[40px] font-bold text-[#0B1B3F] tracking-tight leading-tight">
        Create loan
      </h1>

      {/* Stepper container */}
      <div>
        <ol
          aria-label="Progress"
          className="flex items-center justify-between sm:justify-start sm:gap-6 w-full max-w-2xl"
        >
          {STEPS.map((step, idx) => {
            const isCompleted = step.number < activeStep;
            const isCurrent = step.number === activeStep;
            const isUpcoming = step.number > activeStep;

            return (
              <React.Fragment key={step.number}>
                <li
                  className="flex items-center gap-3 shrink-0"
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Link
                      href={step.href}
                      className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6BFF] rounded-full"
                    >
                      <div className="w-11 h-11 rounded-full bg-[#1F6BFF] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 group-hover:bg-[#1A5CD6] transition-colors">
                        {step.number}
                      </div>
                      <span className="hidden sm:inline text-sm font-semibold text-[#0B1B3F] group-hover:text-[#1F6BFF] transition-colors">
                        {step.label}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                          isCurrent
                            ? "bg-[#1F6BFF] text-white shadow-sm"
                            : "bg-[#E8EDF5] text-[#64748B]"
                        }`}
                      >
                        {step.number}
                      </div>
                      <span
                        className={`hidden sm:inline text-sm font-semibold ${
                          isCurrent ? "text-[#1F6BFF]" : "text-[#64748B]"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  )}
                </li>

                {/* Connector line between steps */}
                {idx < STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="flex-1 sm:w-16 border-t-2 border-dotted border-[#CBD5E1] mx-2"
                  />
                )}
              </React.Fragment>
            );
          })}
        </ol>

        {/* Mobile current step indicator text */}
        <div className="sm:hidden mt-3 text-xs font-semibold text-[#1F6BFF]">
          Step {currentStepConfig.number} of {STEPS.length}: {currentStepConfig.label}
        </div>
      </div>
    </div>
  );
}
