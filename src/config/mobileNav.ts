import type { LucideIcon } from "lucide-react";
import {
  Home,
  Users,
  FileText,
  CreditCard,
  MoreHorizontal,
  Calendar,
  Headset,
  User,
} from "lucide-react";
import type { Role } from "./navigation";

export interface MobileNavItem {
  id: string;
  label: string;
  href?: string;
  icon: LucideIcon;
  isAction?: boolean; // e.g. "More" opens drawer
}

export const mobileNavConfig: Record<Role, MobileNavItem[]> = {
  admin: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/admin/overview",
      icon: Home,
    },
    {
      id: "customers",
      label: "Customers",
      href: "/admin/customers",
      icon: Users,
    },
    {
      id: "loans",
      label: "Loans",
      href: "/admin/loans",
      icon: FileText,
    },
    {
      id: "payments",
      label: "Payments",
      href: "/admin/collections",
      icon: CreditCard,
    },
    {
      id: "more",
      label: "More",
      icon: MoreHorizontal,
      isAction: true,
    },
  ],
  agent: [
    {
      id: "today",
      label: "Today",
      href: "/agent/my-day",
      icon: Calendar,
    },
    {
      id: "customers",
      label: "Customers",
      href: "/agent/customers",
      icon: Users,
    },
    {
      id: "history",
      label: "History",
      href: "/agent/history",
      icon: FileText,
    },
    {
      id: "more",
      label: "More",
      icon: MoreHorizontal,
      isAction: true,
    },
  ],
  customer: [
    {
      id: "home",
      label: "Home",
      href: "/customer/home",
      icon: Home,
    },
    {
      id: "schedule",
      label: "Schedule",
      href: "/customer/schedule",
      icon: Calendar,
    },
    {
      id: "receipts",
      label: "Receipts",
      href: "/customer/receipts",
      icon: FileText,
    },
    {
      id: "support",
      label: "Support",
      href: "/customer/support",
      icon: Headset,
    },
    {
      id: "profile",
      label: "Profile",
      href: "/customer/profile",
      icon: User,
    },
  ],
};

export const adminMobileNavItems = mobileNavConfig.admin;
