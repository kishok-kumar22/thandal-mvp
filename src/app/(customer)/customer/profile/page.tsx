import React from "react";
import { requireRole } from "@/lib/session";
import { getMyProfile } from "@/lib/customerPortal";
import { ProfileCard } from "@/components/customer/ProfileCard";
import { AgentCard } from "@/components/customer/AgentCard";
import { ProfileLinks } from "@/components/customer/ProfileLinks";

export const metadata = {
  title: "Profile | THANDAL",
  description: "View and manage your account details",
};

export default async function CustomerProfilePage() {
  const user = await requireRole("customer", "/customer/profile");
  const profile = await getMyProfile(user);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 md:pb-12">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3F] tracking-tight">
          Profile
        </h1>
        <p className="text-sm sm:text-base font-medium text-[#64748B] mt-1">
          View and manage your account details
        </p>
      </div>

      {/* Main Grid: mobile-first single column, lg:grid-cols-2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Profile Card + Agent Card */}
        <div className="space-y-6">
          <ProfileCard profile={profile} />
          <AgentCard agentFirstName={profile.agentFirstName} />
        </div>

        {/* Right Column: Link List (Card 3) + Sign out button */}
        <div>
          <ProfileLinks />
        </div>
      </div>
    </div>
  );
}
