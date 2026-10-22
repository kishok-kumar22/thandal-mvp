import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/session";
import { getMyProfile, getMyLoans } from "@/lib/customerPortal";
import { getPublicBusinessInfo } from "@/lib/settings";
import { ContactAgentForm } from "@/components/customer/ContactAgentForm";

export const metadata = {
  title: "Contact Agent | THANDAL",
  description: "Request a visit or call back from your assigned collection agent.",
};

export default async function CustomerContactAgentPage() {
  const user = await requireRole("customer", "/customer/contact-agent");
  const profile = await getMyProfile(user);
  const loans = await getMyLoans(user);
  const businessInfo = getPublicBusinessInfo();

  const formattedLoans = loans.map((l) => ({
    id: l.id,
    label: `${l.id} (${l.status})`,
  }));

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 md:pb-12">
      {/* Header with Arrow-Left Back Button */}
      <div className="flex items-start gap-4">
        <Link
          href="/customer/profile"
          aria-label="Back to profile"
          className="p-2 -ml-2 rounded-xl text-[#0B1B3F] hover:bg-slate-200/60 transition-colors shrink-0 mt-1 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3F] tracking-tight">
            Contact agent
          </h1>
          <p className="text-sm font-medium text-[#64748B] mt-1">
            Request a call back from your assigned collection agent.
          </p>
        </div>
      </div>

      <ContactAgentForm
        agentFirstName={profile.agentFirstName}
        area={profile.area}
        loans={formattedLoans}
        officePhone={businessInfo.phone}
      />
    </div>
  );
}
