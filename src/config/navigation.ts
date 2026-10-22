import type { LucideIcon } from "lucide-react";
import {
  Home,
  Users,
  FileText,
  Coins,
  Clock,
  ShieldCheck,
  Wallet,
  BarChart3,
  Settings,
  Calendar,
  Receipt,
  Banknote,
  Bell,
  HelpCircle,
  User,
  Folder,
  Phone,
} from "lucide-react";

export type Role = "admin" | "agent" | "customer";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: NavItem[];
  opensSubroute?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface RoleUserFooter {
  initials: string;
  name: string;
  roleCaption: string;
}

export interface RoleNavigationConfig {
  portalTitle: string;
  sections: NavSection[];
  footerUser: RoleUserFooter;
}

export const navigationConfig: Record<Role, RoleNavigationConfig> = {
  admin: {
    portalTitle: "Admin Portal",
    sections: [
      {
        title: "WORKSPACE",
        items: [
          {
            label: "Overview",
            href: "/admin/overview",
            icon: Home,
          },
          {
            label: "Customers",
            href: "/admin/customers",
            icon: Users,
            children: [
              { label: "All customers", href: "/admin/customers", icon: Users },
              { label: "Create customer", href: "/admin/customers/create", icon: Users },
              { label: "Proof documents", href: "/admin/customers/proofs", icon: Users },
            ],
          },
          {
            label: "Loans",
            href: "/admin/loans",
            icon: FileText,
          },
          {
            label: "Repayment Schedules",
            href: "/admin/repayment-schedules",
            icon: Calendar,
          },
        ],
      },
      {
        title: "COLLECTIONS",
        items: [
          {
            label: "Collections",
            href: "/admin/collections",
            icon: Coins,
          },
          {
            label: "Overdue payments",
            href: "/admin/collections/overdue",
            icon: Clock,
          },
          {
            label: "Agents & Routes",
            href: "/admin/agents",
            icon: Users,
            opensSubroute: true,
          },
          {
            label: "Penalties",
            href: "/admin/penalties",
            icon: ShieldCheck,
          },
          {
            label: "Cashbook & handovers",
            href: "/admin/cashbook",
            icon: Wallet,
          },
        ],
      },
      {
        title: "ADMINISTRATION",
        items: [
          {
            label: "Reports",
            href: "/admin/reports",
            icon: BarChart3,
          },
          {
            label: "Settings",
            href: "/admin/settings",
            icon: Settings,
          },
          {
            label: "Audit log",
            href: "/admin/audit-log",
            icon: FileText,
          },
        ],
      },
    ],
    footerUser: {
      initials: "AU",
      name: "Admin user",
      roleCaption: "Administrator",
    },
  },
  agent: {
    portalTitle: "Collection Agent",
    sections: [
      {
        title: "MY WORK",
        items: [
          {
            label: "My day",
            href: "/agent/my-day",
            icon: Home,
          },
          {
            label: "Assigned customers",
            href: "/agent/customers",
            icon: Users,
          },
          {
            label: "Due collections",
            href: "/agent/due",
            icon: Calendar,
          },
          {
            label: "Overdue follow-ups",
            href: "/agent/overdue",
            icon: Clock,
          },
        ],
      },
      {
        title: "RECORDS",
        items: [
          {
            label: "Payment history",
            href: "/agent/payments",
            icon: FileText,
          },
          {
            label: "Receipts",
            href: "/agent/receipts",
            icon: Receipt,
          },
          {
            label: "Cash handover",
            href: "/agent/cash-handover",
            icon: Banknote,
          },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          {
            label: "Notifications",
            href: "/agent/notifications",
            icon: Bell,
          },
          {
            label: "Help & support",
            href: "/agent/support",
            icon: HelpCircle,
          },
          {
            label: "My profile",
            href: "/agent/profile",
            icon: User,
          },
        ],
      },
    ],
    footerUser: {
      initials: "S",
      name: "Selvam",
      roleCaption: "Collection Agent",
    },
  },
  customer: {
    portalTitle: "Customer Portal",
    sections: [
      {
        title: "",
        items: [
          {
            label: "Home",
            href: "/customer/home",
            icon: Home,
          },
          {
            label: "My loans",
            href: "/customer/loans",
            icon: FileText,
          },
          {
            label: "Repayment schedule",
            href: "/customer/schedule",
            icon: Calendar,
          },
          {
            label: "Payment history",
            href: "/customer/payments",
            icon: Clock,
          },
          {
            label: "Receipts",
            href: "/customer/receipts",
            icon: Receipt,
          },
          {
            label: "Support",
            href: "/customer/support",
            icon: HelpCircle,
          },
          {
            label: "Profile",
            href: "/customer/profile",
            icon: User,
          },
        ],
      },
    ],
    footerUser: {
      initials: "RK",
      name: "R. Kumar",
      roleCaption: "Customer",
    },
  },
};
