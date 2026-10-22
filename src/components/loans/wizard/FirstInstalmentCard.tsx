import React from "react";
import { Toggle } from "@/components/ui/Toggle";
import { formatINR } from "@/lib/format";

interface FirstInstalmentCardProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  instalmentAmount: number;
}

export function FirstInstalmentCard({
  checked,
  onChange,
  instalmentAmount,
}: FirstInstalmentCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-xs">
      <h2 className="text-base font-bold text-[#0B1B3F] mb-3">
        First instalment at disbursement
      </h2>

      <div className="space-y-2">
        <Toggle
          id="collect-first-instalment-toggle"
          checked={checked}
          onChange={onChange}
          label="Collect first instalment at disbursement"
        />

        <p className="text-xs text-[#64748B] pl-14">
          {checked
            ? `${formatINR(instalmentAmount)} will be withheld from the cash released.`
            : "No instalment will be deducted at disbursement; full cash released."}
        </p>
      </div>
    </div>
  );
}
