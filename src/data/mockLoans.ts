import type { Frequency, LoanStatus, PenaltyPolicy } from "@/lib/loan";
import { buildDueDates } from "@/lib/calendar";
import { INITIAL_SETTINGS } from "./mockSettings";

export interface LoanItem {
  id: string; // e.g. "LN-1052"
  customerId: string; // e.g. "C-001"
  customerName: string; // e.g. "R.Kumar"
  principal: number; // 5000
  interest: number; // 250
  remaining: number; // 5145
  frequency: Frequency; // "daily" | "weekly" | "monthly"
  status: LoanStatus; // "active" | "pending" | "overdue" | "completed" | "closed"
  agent: string; // "Selvam"
  term: number; // 50
  instalment: number; // 105
  disbursedOn: string; // "21 Oct 2026"
  firstDueDate: string; // "21 Oct 2026"
  collectFirstAtDisbursement?: boolean;
  penaltyPolicy?: PenaltyPolicy;
  scheduleDates?: string[];
}

export const mockLoansList: LoanItem[] = [
  {
    id: "LN-1052",
    customerId: "C-001",
    customerName: "R. Kumar",
    principal: 5000,
    interest: 250,
    remaining: 5145,
    frequency: "daily",
    status: "active",
    agent: "Selvam",
    term: 50,
    instalment: 105,
    disbursedOn: "21 Oct 2026",
    firstDueDate: "21 Oct 2026",
    penaltyPolicy: "standard",
    scheduleDates: buildDueDates({
      firstDue: "2026-10-21",
      frequency: "daily",
      term: 50,
      calendar: INITIAL_SETTINGS.calendar,
    }),
  },
  {
    id: "LN-1053",
    customerId: "C-002",
    customerName: "S. Priya",
    principal: 10000,
    interest: 500,
    remaining: 8400,
    frequency: "weekly",
    status: "active",
    agent: "Karthik",
    term: 20,
    instalment: 525,
    disbursedOn: "15 Oct 2026",
    firstDueDate: "15 Oct 2026",
    penaltyPolicy: "standard",
    scheduleDates: buildDueDates({
      firstDue: "2026-10-15",
      frequency: "weekly",
      term: 20,
      calendar: INITIAL_SETTINGS.calendar,
    }),
  },
  {
    id: "LN-1054",
    customerId: "C-003",
    customerName: "M. Arjun",
    principal: 6000,
    interest: 300,
    remaining: 4200,
    frequency: "monthly",
    status: "overdue",
    agent: "Selvam",
    term: 6,
    instalment: 1050,
    disbursedOn: "01 Sep 2026",
    firstDueDate: "01 Sep 2026",
    penaltyPolicy: "standard",
    scheduleDates: buildDueDates({
      firstDue: "2026-09-01",
      frequency: "monthly",
      term: 6,
      calendar: INITIAL_SETTINGS.calendar,
    }),
  },
];

export function getMockLoans(): LoanItem[] {
  return [...mockLoansList];
}

export function getLoanById(id: string): LoanItem | undefined {
  const norm = id.trim().toUpperCase();
  return mockLoansList.find((l) => l.id.toUpperCase() === norm);
}
