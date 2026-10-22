import React from "react";
import { FileText, Lock, Bell, HelpCircle, LogOut } from "lucide-react";
import { ListLinkRow } from "@/components/ui/ListLinkRow";
import { signOut } from "@/app/login/actions";

export function ProfileLinks() {
  return (
    <div className="space-y-6">
      {/* CARD 3: Link List */}
      <div className="bg-white rounded-2xl border border-[#E6ECF5] shadow-xs overflow-hidden divide-y divide-[#EEF2F6]">
        <ListLinkRow
          icon={FileText}
          label="Request profile correction"
          href="/customer/profile/correction"
        />
        <ListLinkRow
          icon={Lock}
          label="Change password"
          href="/customer/profile/password"
        />
        <ListLinkRow
          icon={Bell}
          label="Notification preferences"
          href="/customer/profile/notifications"
        />
        <ListLinkRow
          icon={HelpCircle}
          label="Help & support"
          href="/customer/support"
        />
      </div>

      {/* Full-width Outline Blue Sign Out Button */}
      <form action={signOut} className="w-full">
        <button
          type="submit"
          className="w-full h-14 rounded-xl border border-[#1F6BFF] text-[#1F6BFF] hover:bg-[#EFF6FF] active:bg-[#DBEAFE] font-semibold text-base transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1F6BFF] focus:ring-offset-2"
        >
          <LogOut className="w-5 h-5 stroke-[2] shrink-0" aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </form>
    </div>
  );
}
